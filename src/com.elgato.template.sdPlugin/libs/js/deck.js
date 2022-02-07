/**
 * @class StreamDeck
 * StreamDeck object containing all required code to establish
 * communication with SD-Software and the Property Inspector
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
		StreamDeck.actionInfo =
			actionString !== 'undefined' ? JsonUtils.parse(actionString) : actionString;
		StreamDeck.language = StreamDeck.appInfo?.application?.language ?? null;

		if (StreamDeck.websocket) {
			StreamDeck.websocket.close();
			StreamDeck.websocket = null;
		}
		StreamDeck.websocket = new WebSocket('ws://127.0.0.1:' + StreamDeck.port);

		StreamDeck.websocket.onopen = () => {
			const json = {
				event: StreamDeck.messageType,
				uuid: StreamDeck.uuid,
			};

			StreamDeck.websocket.send(JSON.stringify(json));

			StreamDeck.emit('connected', {
				connection: StreamDeck.websocket,
				port: StreamDeck.port,
				uuid: StreamDeck.uuid,
				actionInfo: StreamDeck.actionInfo,
				appInfo: StreamDeck.appInfo,
				messageType: StreamDeck.messageType,
			});
		};

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
						console.log(
							'%c%s',
							'color: white; background: red; font-size: 12px;',
							'[STREAMDECK] websocket.onmessage +++++++++  PROBLEM ++++++++'
						);
						console.warn('UNREGISTERED MESSAGETYPE:', StreamDeck.messageType);
				}
			}

			if (m && m !== '') StreamDeck.events.emit(m, jsonObj);
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
					event: 'logMessage',
					payload: {
						message: message,
					},
				};
				StreamDeck.websocket.send(JSON.stringify(json));
			}
		} catch (e) {
			console.log('Websocket not defined');
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
		const manifest = await JsonUtils.read(`${pathPrefix}${lang}.json`);
		StreamDeck.localization =
			manifest && manifest.hasOwnProperty('Localization') ? manifest['Localization'] : {};
		StreamDeck.events.emit('localizationLoaded', {
			language: StreamDeck.language,
		});
	}

	/**
	 * Send JSON payload to StreamDeck
	 * @param context
	 * @param fn
	 * @param payload
	 */
	static send(context, fn, payload) {
		const pl = Object.assign({}, { event: fn, context: context }, payload);
		StreamDeck.websocket && StreamDeck.websocket.send(JSON.stringify(pl));
	}

	/**
	 * Request the actions's persistent data. StreamDeck does not return the data, but trigger the actions's didReceiveSettings event
	 * @param context
	 */
	static getSettings(context) {
		StreamDeck.send(context ?? StreamDeck.uuid, 'getSettings', {});
	}

	/**
	 * Save the actions's persistent data.
	 * @param payload
	 * @param context
	 */
	static setSettings(payload, context) {
		StreamDeck.send(context ?? StreamDeck.uuid, 'setSettings', {
			action: StreamDeck?.actionInfo?.action,
			payload: payload || {},
			targetContext: StreamDeck?.actionInfo?.context,
		});
	}

	/**
	 * Request the plugin's persistent data. StreamDeck does not return the data, but trigger the plugin/property inspectors didReceiveGlobalSettings event
	 */
	static getGlobalSettings() {
		StreamDeck.send(StreamDeck.uuid, 'getGlobalSettings', {});
	}

	/**
	 * Save the plugin's persistent data
	 * @param payload
	 */
	static setGlobalSettings(payload) {
		StreamDeck.send(StreamDeck.uuid, 'setGlobalSettings', {
			payload: payload,
		});
	}

	/**
	 * Opens a URL in the default web browser
	 * @param urlToOpen
	 */
	static openUrl(urlToOpen) {
		StreamDeck.send(StreamDeck.uuid, 'openUrl', {
			payload: {
				url: urlToOpen,
			},
		});
	}

	/**
	 * Send payload from the property inspector to the plugin
	 * @param payload
	 * @param context
	 */
	static sendToPlugin(payload, context) {
		StreamDeck.send(
			context ?? StreamDeck.uuid,
			'sendToPlugin',
			{
				action: StreamDeck?.actionInfo?.action,
				payload: payload || {},
				targetContext: StreamDeck?.actionInfo?.context,
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
				state: 1 - Number(payload === 0),
			},
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
				target: target || Destination.HARDWARE_AND_SOFTWARE,
			},
		});
	}

	/**
	 * Send payload to property inspector
	 * @param context
	 * @param payload
	 */
	static sendToPropertyInspector(context, payload) {
		StreamDeck.send(context, 'sendToPropertyInspector', {
			action: StreamDeck.actionInfo.action,
			payload: payload,
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
				target: target || Destination.HARDWARE_AND_SOFTWARE,
			},
		});
	}

	/**
	 * Registers a callback function for when Stream Deck is connected
	 * @param {*} fn
	 */
	static registerConnected(fn) {
		StreamDeck.on('connected', (jsn) => fn(jsn));
	}

	static registerSendToPropertyInspector(fn) {
		StreamDeck.on('sendToPropertyInspector', (jsn) => fn(jsn));
	}

	static registerPIDataChanged(fn) {
		StreamDeck.on('piDataChanged', (jsn) => fn(jsn));
	}

	static registerLocalizationLoaded(fn) {
		StreamDeck.on('localizationLoaded', (jsn) => fn(jsn));
	}
}

/**
 * connectElgatoStreamDeckSocket
 * This is the first function StreamDeck Software calls, when
 * establishing the connection to the plugin or the Property Inspector
 * @param {string} port - The socket's port to communicate with StreamDeck software.
 * @param {string} uuid - A unique identifier, which StreamDeck uses to communicate with the plugin
 * @param {string} messageType - Identifies, if the event is meant for the property inspector or the plugin.
 * @param {string} appInfoString - Information about the host (StreamDeck) application
 * @param {string} actionInfo - Context is an internal identifier used to communicate to the host application.
 */
function connectElgatoStreamDeckSocket(port, uuid, messageType, appInfoString, actionInfo) {
	StreamDeck.connect(arguments);
}
