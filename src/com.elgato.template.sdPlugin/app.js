/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/deck.js" />

/**
 * The first event fired when Stream Deck starts
 */
StreamDeck.registerConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
	//TODOZ: remove action 2 here and manifest
	const templateAction = new Action('com.elgato.template.action', StreamDeck.events);
	const templateAction2 = new Action('com.elgato.template.action2', StreamDeck.events);

	templateAction.registerKeyUp((jsn) => {
		const { action, context, device, event, payload } = jsn;

		StreamDeck.setSettings(null, context);

		StreamDeck.openUrl('https://developer.elgato.com/documentation/stream-deck/sdk/overview/');

		console.log('Your code goes here!');

		StreamDeck.showOk(context);
	});

	templateAction2.registerKeyUp((jsn) => {
		const { action, context, device, event, payload } = jsn;

		StreamDeck.setSettings({ hey: 'hey' }, context);

		console.log('Your code goes here!');

		StreamDeck.showOk(context);
	});

	templateAction.registerDidReceiveSettings(() => {
		console.log('heyheyhey');
	});

	templateAction2.registerDidReceiveSettings(() => {
		console.log('heyheyhey2222');
	});
});
