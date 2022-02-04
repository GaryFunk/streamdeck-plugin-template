/**
 * StreamDeck object containing all required code to establish
 * communication with SD-Software and the Property Inspector
 * 
 * StreamDeck name is x to keep it out of your intellisense. 
 * StreamDeck class could be given a proper name and changed to hold all static properties in the future...
 */
class StreamDeck {
    static port;
    static uuid;
    static messageType;
    static appInfo;
    static actionInfo;
    static websocket;
    static language;
    static localization;

    static events = new EventHandler().eventEmitter();
    static on = StreamDeck.events.on;
    static emit = StreamDeck.events.emit;

    /**
     * Connect to Stream Deck
     * @param port
     * @param uuid
     * @param messageType
     * @param appInfoString
     * @param actionString
     */
	 static connect([port, uuid, messageType, appInfoString, actionString]) {
        StreamDeck.port = port;
        StreamDeck.uuid = uuid;
        StreamDeck.messageType = messageType;
        StreamDeck.appInfo = JsonUtils.parse(appInfoString);
        StreamDeck.actionInfo = actionString !== 'undefined' ? JsonUtils.parse(actionString) : actionString;
        StreamDeck.language = StreamDeck.appInfo?.application?.language ?? null;

        if (StreamDeck.websocket) {
            StreamDeck.websocket.close();
            StreamDeck.websocket = null;
        }
        ;
        StreamDeck.websocket = new WebSocket('ws://127.0.0.1:' + StreamDeck.port);

        StreamDeck.websocket.onopen = () => {
            const json = {
                event: StreamDeck.messageType,
                uuid: StreamDeck.uuid
            };

            StreamDeck.websocket.send(JSON.stringify(json));
            StreamDeck.uuid = StreamDeck.uuid;
            StreamDeck.actionInfo = StreamDeck.actionInfo;
            StreamDeck.appInfo = StreamDeck.appInfo;
            StreamDeck.messageType = StreamDeck.messageType;
            StreamDeck.websocket = StreamDeck.websocket;

            StreamDeck.emit('connected', {
                connection: StreamDeck.websocket,
                port: StreamDeck.port,
                uuid: StreamDeck.uuid,
                actionInfo: StreamDeck.actionInfo,
                appInfo: StreamDeck.appInfo,
                messageType: StreamDeck.messageType
            });
        }

        StreamDeck.websocket.onerror = (evt) => {
            console.warn('WEBOCKET ERROR', evt, evt.data, SocketUtils.getErrorMessage(evt?.code));
        };

        StreamDeck.websocket.onclose = (evt) => {
            console.warn(
                '[STREAMDECK]***** WEBOCKET CLOSED **** reason:',
                SocketUtils.getErrorMessage(evt?.code)
            );
        };

        StreamDeck.websocket.onmessage = (evt) => {
            let m;
            const jsonObj = JsonUtils.parse(evt.data);

            if (!jsonObj.hasOwnProperty('action')) {
                m = jsonObj.event;
                // console.log('%c%s', 'color: white; background: red; font-size: 12px;', '[deck.js]onmessage:', m);
            } else {
                switch (StreamDeck.messageType) {
                    case 'registerPlugin':
                        m = jsonObj['action'] + '.' + jsonObj['event'];
                        break;
                    case 'registerPropertyInspector':
                        m = 'sendToPropertyInspector';
                        break;
                    default:
                        console.log('%c%s', 'color: white; background: red; font-size: 12px;', '[STREAMDECK] websocket.onmessage +++++++++  PROBLEM ++++++++');
                        console.warn('UNREGISTERED MESSAGETYPE:', StreamDeck.messageType);
                }
            }

            if (m && m !== '')
                StreamDeck.events.emit(m, jsonObj);
        };
    }

    /**
     * Write to log file
     * @param message
     */
	 static log(message) {
        try {
            if (StreamDeck.websocket) {
                const json = {
                    "event": "logMessage",
                    "payload": {
                        "message": message
                    }
                };
                StreamDeck.websocket.send(JSON.stringify(json));
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
	 static async loadLocalization(lang, pathPrefix) {
        const manifest = await JsonUtils.read(`${pathPrefix}${lang}.json`)
        StreamDeck.localization = manifest && manifest.hasOwnProperty('Localization') ? manifest['Localization'] : {};
        StreamDeck.events.emit('localizationLoaded', {language: StreamDeck.language});
    }

    /**
     * Send JSON payload to StreamDeck
     * @param context
     * @param fn
     * @param payload
     */
	 static send(context, fn, payload) {
        const pl = Object.assign({}, {event: fn, context: context}, payload);
        StreamDeck.websocket && StreamDeck.websocket.send(JSON.stringify(pl));
    }

    /**
     * Request the actions's persistent data. StreamDeck does not return the data, but trigger the actions's didReceiveSettings event
     * @type {*}
     */
	 static getSettings(context) {
        StreamDeck.send(context, 'getSettings', {});
    }

    /**
     * Save the actions's persistent data.
     * @param context
     * @param payload
     */
	 static setSettings(context, payload) {
        StreamDeck.send(context, 'setSettings', {
            payload: payload
        });
    }

    /**
     * Request the plugin's persistent data. StreamDeck does not return the data, but trigger the plugin/property inspectors didReceiveGlobalSettings event
     * @param context
     */
	 static getGlobalSettings(context) {
        StreamDeck.send(context, 'getGlobalSettings', {});
    }

    /**
     * Save the plugin's persistent data
     * @param context
     * @param payload
     */
	 static setGlobalSettings(context, payload) {
        StreamDeck.send(context, 'setGlobalSettings', {
            payload: payload
        });
    }

    /**
     * Opens a URL in the default web browser
     * @param context
     * @param urlToOpen
     */
	 static openUrl(context, urlToOpen) {
        StreamDeck.send(context, 'openUrl', {
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
	 static sendToPlugin(piUUID, action, payload) {
        StreamDeck.send(
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
     * Display alert triangle on actions key
     * @param context
     */
	 static showAlert(context) {
        StreamDeck.send(context, 'showAlert', {});
    }

    /**
     * Display ok check mark on actions key
     * @param context
     */
	 static showOk(context) {
        StreamDeck.send(context, 'showOk', {});
    }

    /**
     * Set the state of the actions
     * @param context
     * @param payload
     */
	 static setState(context, payload) {
        StreamDeck.send(context, 'setState', {
            payload: {
                'state': 1 - Number(payload === 0)
            }
        });
    }

    /**
     * Set the title of the actions's key
     * @param context
     * @param title
     * @param target
     */
	 static setTitle(context, title, target) {
        StreamDeck.send(context, 'setTitle', {
            payload: {
                title: '' + title || '',
                target: target || Destination.HARDWARE_AND_SOFTWARE
            }
        });
    }

    /**
     * Send payload to property inspector
     * @param context
     * @param payload
     * @param action
     */
	 static sendToPropertyInspector(context, payload, action) {
        StreamDeck.send(context, 'sendToPropertyInspector', {
            action: action,
            payload: payload
        });
    }

    /**
     * Set the actions key image
     * @param context
     * @param img
     * @param target
     */
	 static setImage(context, img, target) {
        StreamDeck.send(context, 'setImage', {
            payload: {
                image: img || '',
                target: target || Destination.HARDWARE_AND_SOFTWARE
            }
        });
    }

    /**
     * Registers a callback function for when Stream Deck is connected
     * @param {*} fn 
     */
	 static registerConnected(fn) {
        StreamDeck.on('connected', jsn => fn(jsn));
    }
};
