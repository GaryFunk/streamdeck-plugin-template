class StreamDeckAction {
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

    registerDidReceiveSettings(fn) {
        this.on(`${this.UUID}.didReceiveSettings`, jsn => fn(jsn));
    }

    registerDidReceiveGlobalSettings(fn) {
        this.on(`${this.UUID}.willAppear`, jsn => fn(jsn));
    }

    registerKeyDown(fn) {
        this.on(`${this.UUID}.keyDown`, jsn => fn(jsn));
    }

    registerKeyUp(fn) {
        this.on(`${this.UUID}.keyUp`, jsn => fn(jsn));
    }

    registerWillAppear(fn) {
        this.on(`${this.UUID}.willAppear`, jsn => fn(jsn));
    }

    registerTitleParametersDidChange(fn) {
        this.on(`${this.UUID}.titleParametersDidChange`, jsn => fn(jsn));
    }

    registerDeviceDidConnect(fn) {
        this.on(`${this.UUID}.deviceDidConnect`, jsn => fn(jsn));
    }

    registerDeviceDidDisconnect(fn) {
        this.on(`${this.UUID}.deviceDidDisconnect`, jsn => fn(jsn));
    }

    registerApplicationDidLaunch(fn) {
        this.on(`${this.UUID}.applicationDidLaunch`, jsn => fn(jsn));
    }

    registerApplicationDidTerminate(fn) {
        this.on(`${this.UUID}.applicationDidTerminate`, jsn => fn(jsn));
    }

    registerSystemDidWakeUp(fn) {
        this.on(`${this.UUID}.systemDidWakeUp`, jsn => fn(jsn));
    }

    registerPropertyInspectorDidAppear(fn) {
        this.on(`${this.UUID}.propertyInspectorDidAppear`, jsn => fn(jsn));
    }

    registerPropertyInspectorDidDisappear(fn) {
        this.on(`${this.UUID}.propertyInspectorDidDisappear`, jsn => fn(jsn));
    }

    registerSendToPlugin(fn) {
        this.on(`${this.UUID}.sendToPlugin`, jsn => fn(jsn));
    }

    registerSendToPropertyInspector(fn) {
        this.on(`${this.UUID}.sendToPropertyInspector`, jsn => fn(jsn));
    }
}

window.Action = StreamDeckAction;
