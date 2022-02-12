/**
 * @class Action
 * A Stream Deck plugin action, where you can register callback functions for different events
 */
class Action {
    UUID;
    on = EventHandler.on;

    constructor(UUID) {
        this.UUID = UUID;
    }

    /**
     * Registers a callback function for the didReceiveSettings event, which fires when calling getSettings
     * @param {*} fn
     */
    onDidReceiveSettings(fn) {
        this.on(`${this.UUID}.didReceiveSettings`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the didReceiveGlobalSettings event, which fires when calling getGlobalSettings
     * @param {*} fn
     */
    onDidReceiveGlobalSettings(fn) {
        this.on(`didReceiveGlobalSettings`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the keyDown event, which fires when pressing a key down
     * @param {*} fn
     */
    onKeyDown(fn) {
        this.on(`${this.UUID}.keyDown`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the keyUp event, which fires when releasing a key
     * @param {*} fn
     */
    onKeyUp(fn) {
        this.on(`${this.UUID}.keyUp`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the willAppear event, which fires when an action appears on they key
     * @param {*} fn
     */
    onWillAppear(fn) {
        this.on(`${this.UUID}.willAppear`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the titleParametersDidChange event, which fires when a user changes the key title
     * @param {*} fn
     */
    onTitleParametersDidChange(fn) {
        this.on(`${this.UUID}.titleParametersDidChange`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the deviceDidConnect event, which fires when a device is plugged in
     * @param {*} fn
     */
    onDeviceDidConnect(fn) {
        this.on(`${this.UUID}.deviceDidConnect`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the deviceDidDisconnect event, which fires fires when a device is unplugged
     * @param {*} fn
     */
    onDeviceDidDisconnect(fn) {
        this.on(`${this.UUID}.deviceDidDisconnect`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the applicationDidLaunch event, which fires fires when the application starts
     * @param {*} fn
     */
    onApplicationDidLaunch(fn) {
        this.on(`${this.UUID}.applicationDidLaunch`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the applicationDidTerminate event, which fires fires when the application exits
     * @param {*} fn
     */
    onApplicationDidTerminate(fn) {
        this.on(`${this.UUID}.applicationDidTerminate`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the systemDidWakeUp event, which fires fires when the computer wakes
     * @param {*} fn
     */
    onSystemDidWakeUp(fn) {
        this.on(`${this.UUID}.systemDidWakeUp`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the propertyInspectorDidAppear event, which fires fires when the property inspector is displayed
     * @param {*} fn
     */
    onPropertyInspectorDidAppear(fn) {
        this.on(`${this.UUID}.propertyInspectorDidAppear`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the propertyInspectorDidDisappear event, which fires fires when the property inspector is closed
     * @param {*} fn
     */
    onPropertyInspectorDidDisappear(fn) {
        this.on(`${this.UUID}.propertyInspectorDidDisappear`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the sendToPlugin event, which fires fires when the property inspector uses the sendToPlugin api
     * @param {*} fn
     */
    onSendToPlugin(fn) {
        this.on(`${this.UUID}.sendToPlugin`, (jsn) => fn(jsn));
        return this;
    }

    /**
     * Registers a callback function for the sendToPropertyInspector event, which fires fires when the plugin uses the sendToPropertyInspector api
     * @param {*} fn
     */
    onSendToPropertyInspector(fn) {
        this.on(`${this.UUID}.sendToPropertyInspector`, (jsn) => fn(jsn));
        return this;
    }
}
