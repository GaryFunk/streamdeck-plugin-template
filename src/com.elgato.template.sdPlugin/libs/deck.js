/**
 * StreamDeck object containing all required code to establish
 * communication with SD-Software and the Property Inspector
 */
class Deck {
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
            StreamDeck.uuid = this.uuid;
            StreamDeck.actionInfo = this.actionInfo;
            StreamDeck.appInfo = this.appInfo;
            StreamDeck.messageType = this.messageType;
            StreamDeck.websocket = this.websocket;

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

    /**
     * Send JSON payload to StreamDeck
     * @param context
     * @param fn
     * @param payload
     */
    send(context, fn, payload) {
        const pl = Object.assign({}, {event: fn, context: context}, payload);
        this.websocket && this.websocket.send(JSON.stringify(pl));
    }

    /**
     * Request the action's persistent data. This does not return the data, but trigger the action's didReceiveSettings event
     * @type {*}
     */
    getSettings(context) {
        this.send(context, 'getSettings', {});
    }

    /**
     * Save the action's persistent data.
     * @param context
     * @param payload
     */
    setSettings(context, payload) {
        this.send(context, 'setSettings', {
            payload: payload
        });
    }

    /**
     * Request the plugin's persistent data. This does not return the data, but trigger the plugin/property inspectors didReceiveGlobalSettings event
     * @param context
     */
    getGlobalSettings(context) {
        this.send(context, 'getGlobalSettings', {});
    }

    /**
     * Save the plugin's persistent data
     * @param context
     * @param payload
     */
    setGlobalSettings(context, payload) {
        this.send(context, 'setGlobalSettings', {
            payload: payload
        });
    }

    /**
     * Opens a URL in the default web browser
     * @param context
     * @param urlToOpen
     */
    openUrl(context, urlToOpen) {
        this.send(context, 'openUrl', {
            payload: {
                url: urlToOpen
            }
        });
    }

    /**
     * Send payload from the property inspector to the plugin
     * @param piUUID
     * @param action
     * @param payload
     */
    sendToPlugin(piUUID, action, payload) {
        this.send(
            piUUID,
            'sendToPlugin',
            {
                action: action,
                payload: payload || {}
            },
            false
        );
    }

    /**
     * Display alert on action key
     * @param context
     */
    showAlert(context) {
        this.send(context, 'showAlert', {});
    }

    /**
     * Display ok on action key
     * @param context
     */
    showOk(context) {
        this.send(context, 'showOk', {});
    }

    /**
     * Set the state of the action
     * @param context
     * @param payload
     */
    setState(context, payload) {
        this.send(context, 'setState', {
            payload: {
                'state': 1 - Number(payload === 0)
            }
        });
    }

    /**
     * Set the title of the action's key
     * @param context
     * @param title
     * @param target
     */
    setTitle(context, title, target) {
        this.send(context, 'setTitle', {
            payload: {
                title: '' + title || '',
                target: target || DestinationEnum.HARDWARE_AND_SOFTWARE
            }
        });
    }

    /**
     * Send payload to property inspector
     * @param context
     * @param payload
     * @param action
     */
    sendToPropertyInspector(context, payload, action) {
        this.send(context, 'sendToPropertyInspector', {
            action: action,
            payload: payload
        });
    }

    /**
     * Set the action key image
     * @param context
     * @param img
     * @param target
     */
    setImage(context, img, target) {
        this.send(context, 'setImage', {
            payload: {
                image: img || '',
                target: target || DestinationEnum.HARDWARE_AND_SOFTWARE
            }
        });
    }
};

window.StreamDeck = new Deck();

