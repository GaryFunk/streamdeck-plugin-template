/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/deck.js" />

/**
 * The first event fired when Stream Deck starts
 */
StreamDeck.registerConnected(({actionInfo, appInfo, connection, messageType, port, uuid}) => {
    const templateAction = new Action('com.elgato.template.action', StreamDeck.events);
	const templateAction2 = new Action('com.elgato.template.action2', StreamDeck.events);


    templateAction.registerKeyUp((jsn) => {
        const {action, context, device, event, payload} = jsn;

        StreamDeck.openUrl(context,'https://developer.elgato.com/documentation/stream-deck/sdk/overview/');
        StreamDeck.showOk(context);

        console.log('Your code goes here!');
    });  

	templateAction.registerSendToPlugin((jsn)=>{
		console.log('sendToPlugin');
		console.log(jsn)
	});

templateAction.registerDidReceiveSettings((jsn)=>{
	console.log('receive settings');
})

	templateAction2.registerSendToPlugin((jsn)=>{
		console.log('action 2');
	})

	templateAction.registerDidReceiveSettings((jsn)=>{
		console.log('receive settings 222222');
	})
})
