/**
 * StreamDeck object containing all required code to establish
 * communication with SD-Software and the Property Inspector
 */
class StreamDeck {
    port;
    uuid;
    messageType;
    appInfo;
    actionInfo;
    websocket;
    language;
    localization;

    events = EventHandler.eventEmitter();
    on = this.events.on;
    emit = this.events.emit;

    /**
     * Connect to Stream Deck
     * @param port
     * @param uuid
     * @param messageType
     * @param appInfoString
     * @param actionString
     */
    connect([port, uuid, messageType, appInfoString, actionString]) {
        this.port = port;
        this.uuid = uuid;
        this.messageType = messageType;
        this.appInfo = JsonUtils.parse(appInfoString);
        this.actionInfo = actionString !== 'undefined' ? JsonUtils.parse(actionString) : actionString;

        this.language = this.appInfo?.application?.language ?? false;

        if (this.language) {
            this.loadLocalization(this.language, this.messageType === 'registerPropertyInspector' ? '../' : './', () => {
                this.events.emit('localizationLoaded', {language: this.language});
            });
        }

        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        ;
        this.websocket = new WebSocket('ws://127.0.0.1:' + this.port);

        this.websocket.onopen = () => {
            const json = {
                event: this.messageType,
                uuid: this.uuid
            };

            this.websocket.send(JSON.stringify(json));
            $SD.uuid = this.uuid;
            $SD.actionInfo = this.actionInfo;
            $SD.appInfo = this.appInfo;
            $SD.messageType = this.messageType;
            $SD.websocket = this.websocket;

            this.emit('connected', {
                connection: this.websocket,
                port: this.port,
                uuid: this.uuid,
                actionInfo: this.actionInfo,
                appInfo: this.appInfo,
                messageType: this.messageType
            });
        }

        this.websocket.onerror = (evt) => {
            console.warn('WEBOCKET ERROR', evt, evt.data, SocketUtils.getErrorMessage(evt?.code));
        };

        this.websocket.onclose = (evt) => {
            console.warn(
                '[STREAMDECK]***** WEBOCKET CLOSED **** reason:',
                SocketUtils.getErrorMessage(evt?.code)
            );
        };

        this.websocket.onmessage = (evt) => {
            let m;
            const jsonObj = JsonUtils.parse(evt.data);

            if (!jsonObj.hasOwnProperty('action')) {
                m = jsonObj.event;
                // console.log('%c%s', 'color: white; background: red; font-size: 12px;', '[deck.js]onmessage:', m);
            } else {
                switch (this.messageType) {
                    case 'registerPlugin':
                        m = jsonObj['action'] + '.' + jsonObj['event'];
                        break;
                    case 'registerPropertyInspector':
                        m = 'sendToPropertyInspector';
                        break;
                    default:
                        console.log('%c%s', 'color: white; background: red; font-size: 12px;', '[STREAMDECK] websocket.onmessage +++++++++  PROBLEM ++++++++');
                        console.warn('UNREGISTERED MESSAGETYPE:', this.messageType);
                }
            }

            if (m && m !== '')
                this.events.emit(m, jsonObj);
        };
    }

    /**
     * Write to log file
     * @param message
     */
    log(message) {
        try {
            if (this.websocket) {
                const json = {
                    "event": "logMessage",
                    "payload": {
                        "message": message
                    }
                };
                this.websocket.send(JSON.stringify(json));
            }
        } catch (e) {
            console.log("Websocket not defined");
        }
    }

    /**
     * Fetches the specified language json file
     * @param lang
     * @param pathPrefix
     * @param cb
     * @returns {Promise<void>}
     */
    async loadLocalization(lang, pathPrefix, cb) {
        const manifest = await JsonUtils.read(`${pathPrefix}${lang}.json`)
        this.localization = manifest && manifest.hasOwnProperty('Localization') ? manifest['Localization'] : {};
        if (cb && typeof cb === 'function') cb();
    }
};

/** SDApi
 * This ist the main API to communicate between plugin, property inspector and
 * application host.
 * Internal functions:
 * - setContext: sets the context of the current plugin
 * - exec: prepare the correct JSON structure and send
 *
 * Methods exposed in the $SD.api alias
 * Messages send from the plugin
 * -----------------------------
 * - showAlert
 * - showOK
 * - setSettings
 * - setTitle
 * - setImage
 * - sendToPropertyInspector
 *
 * Messages send from Property Inspector
 * -------------------------------------
 * - sendToPlugin
 *
 * Messages received in the plugin
 * -------------------------------
 * willAppear
 * willDisappear
 * keyDown
 * keyUp
 */

const SDApi = {
    send: function (context, fn, payload) {
        /** Combine the passed JSON with the name of the event and it's context
         * If the payload contains 'event' or 'context' keys, it will overwrite existing 'event' or 'context'.
         * This function is non-mutating and thereby creates a new object containing
         * all keys of the original JSON objects.
         */
        const pl = Object.assign({}, {event: fn, context: context}, payload);
        $SD.websocket && $SD.websocket.send(JSON.stringify(pl));
    },

    registerPlugin: {

        /** Messages send from the plugin */
        showAlert: function (context) {
            SDApi.send(context, 'showAlert', {});
        },

        showOk: function (context) {
            SDApi.send(context, 'showOk', {});
        },

        setState: function (context, payload) {
            SDApi.send(context, 'setState', {
                payload: {
                    'state': 1 - Number(payload === 0)
                }
            });
        },

        setTitle: function (context, title, target) {
            SDApi.send(context, 'setTitle', {
                payload: {
                    title: '' + title || '',
                    target: target || DestinationEnum.HARDWARE_AND_SOFTWARE
                }
            });
        },

        setImage: function (context, img, target) {
            SDApi.send(context, 'setImage', {
                payload: {
                    image: img || '',
                    target: target || DestinationEnum.HARDWARE_AND_SOFTWARE
                }
            });
        },

        sendToPropertyInspector: function (context, payload, action) {
            SDApi.send(context, 'sendToPropertyInspector', {
                action: action,
                payload: payload
            });
        }
    },

    /** Messages send from Property Inspector */

    registerPropertyInspector: {

        sendToPlugin: function (piUUID, action, payload) {
            SDApi.send(
                piUUID,
                'sendToPlugin',
                {
                    action: action,
                    payload: payload || {}
                },
                false
            );
        }
    },

    /** COMMON */

    common: {

        getSettings: function (context) {
            SDApi.send(context, 'getSettings', {});
        },

        setSettings: function (context, payload) {
            SDApi.send(context, 'setSettings', {
                payload: payload
            });
        },

        getGlobalSettings: function (context) {
            SDApi.send(context, 'getGlobalSettings', {});
        },

        setGlobalSettings: function (context, payload) {
            SDApi.send(context, 'setGlobalSettings', {
                payload: payload
            });
        },

        logMessage: function () {
            /**
             * for logMessage we don't need a context, so we allow both
             * logMessage(unneededContext, 'message')
             * and
             * logMessage('message')
             */

            let payload = (arguments.length > 1) ? arguments[1] : arguments[0];

            SDApi.send(null, 'logMessage', {
                payload: {
                    message: payload
                }
            });
        },

        openUrl: function (context, urlToOpen) {
            SDApi.send(context, 'openUrl', {
                payload: {
                    url: urlToOpen
                }
            });
        },

        debugPrint: function (context, inString) {
            SDApi.send(context, 'debugPrint', {
                payload: [].slice.apply(arguments).join('.') || ''
            });
        },

    }
};

window.$SD = new StreamDeck();
window.$SD.api = SDApi;


