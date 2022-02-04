class Action {
	UUID;
	events;
	on;
	emit;

	constructor(UUID, events) {
		this.UUID = UUID;
		this.events = events;
		this.on = events.on;
		this.emit = events.emit;
	}

	/**
	 * Registers a callback function for the didReceiveSettings event, which fires when calling getSettings
	 * @param {*} fn
	 */
	registerDidReceiveSettings(fn) {
		this.on(`${this.UUID}.didReceiveSettings`, (jsn) => fn(jsn));
	}

	/**
	 * Registers a callback function for the didReceiveGlobalSettings event, which fires when calling getGlobalSettings
	 * @param {*} fn
	 */
	registerDidReceiveGlobalSettings(fn) {
		this.on(`${this.UUID}.willAppear`, (jsn) => fn(jsn));
	}

	/**
	 * Registers a callback function for the keyDown event, which fires when pressing a key down
	 * @param {*} fn
	 */
	registerKeyDown(fn) {
		this.on(`${this.UUID}.keyDown`, (jsn) => fn(jsn));
	}

	/**
	 * Registers a callback function for the keyUp event, which fires when releasing a key
	 * @param {*} fn
	 */
	registerKeyUp(fn) {
		this.on(`${this.UUID}.keyUp`, (jsn) => fn(jsn));
	}

	/**
	 * Registers a callback function for the willAppear event, which fires when an action appears on they key
	 * @param {*} fn
	 */
	registerWillAppear(fn) {
		this.on(`${this.UUID}.willAppear`, (jsn) => fn(jsn));
	}

	/**
	 * Registers a callback function for the titleParametersDidChange event, which fires when a user changes the key title
	 * @param {*} fn
	 */
	registerTitleParametersDidChange(fn) {
		this.on(`${this.UUID}.titleParametersDidChange`, (jsn) => fn(jsn));
	}

	/**
	 * Registers a callback function for the deviceDidConnect event, which fires when a device is plugged in
	 * @param {*} fn
	 */
	registerDeviceDidConnect(fn) {
		this.on(`${this.UUID}.deviceDidConnect`, (jsn) => fn(jsn));
	}

	/**
	 * Registers a callback function for the deviceDidDisconnect event, which fires fires when a device is unplugged
	 * @param {*} fn
	 */
	registerDeviceDidDisconnect(fn) {
		this.on(`${this.UUID}.deviceDidDisconnect`, (jsn) => fn(jsn));
	}

	/**
	 * Registers a callback function for the applicationDidLaunch event, which fires fires when the application starts
	 * @param {*} fn
	 */
	registerApplicationDidLaunch(fn) {
		this.on(`${this.UUID}.applicationDidLaunch`, (jsn) => fn(jsn));
	}

	/**
	 * Registers a callback function for the applicationDidTerminate event, which fires fires when the application exits
	 * @param {*} fn
	 */
	registerApplicationDidTerminate(fn) {
		this.on(`${this.UUID}.applicationDidTerminate`, (jsn) => fn(jsn));
	}

	/**
	 * Registers a callback function for the systemDidWakeUp event, which fires fires when the computer wakes
	 * @param {*} fn
	 */
	registerSystemDidWakeUp(fn) {
		this.on(`${this.UUID}.systemDidWakeUp`, (jsn) => fn(jsn));
	}

	/**
	 * Registers a callback function for the propertyInspectorDidAppear event, which fires fires when the property inspector is displayed
	 * @param {*} fn
	 */
	registerPropertyInspectorDidAppear(fn) {
		this.on(`${this.UUID}.propertyInspectorDidAppear`, (jsn) => fn(jsn));
	}


	/**
	 * Registers a callback function for the propertyInspectorDidDisappear event, which fires fires when the property inspector is closed
	 * @param {*} fn
	 */
	registerPropertyInspectorDidDisappear(fn) {
		this.on(`${this.UUID}.propertyInspectorDidDisappear`, (jsn) => fn(jsn));
	}

	/**
	 * Registers a callback function for the sendToPlugin event, which fires fires when the property inspector uses the sendToPlugin api
	 * @param {*} fn
	 */
	registerSendToPlugin(fn) {
		this.on(`${this.UUID}.sendToPlugin`, (jsn) => fn(jsn));
	}

	/**
	 * Registers a callback function for the sendToPropertyInspector event, which fires fires when the plugin uses the sendToPropertyInspector api
	 * @param {*} fn
	 */
	registerSendToPropertyInspector(fn) {
		this.on(`${this.UUID}.sendToPropertyInspector`, (jsn) => fn(jsn));
	}
}