class EventHandler {
	static eventList = new Map();

	static on(name, fn) {
		if (!EventHandler.eventList.has(name)) {
			EventHandler.eventList.set(name, EventHandler.pubSub());
		}

		return EventHandler.eventList.get(name).sub(fn);
	}

	static has(name) {
		return EventHandler.eventList.has(name);
	}

	static emit(name, data) {
		return EventHandler.eventList.has(name) && EventHandler.eventList.get(name).pub(data);
	}

	static pubSub() {
		const subscribers = new Set();

		const sub = (fn) => {
			subscribers.add(fn);
			return () => {
				subscribers.delete(fn);
			};
		};

		const pub = (data) => subscribers.forEach((fn) => fn(data));
		return Object.freeze({ pub, sub });
	}
}
