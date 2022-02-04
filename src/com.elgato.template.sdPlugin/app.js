/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/deck.js" />


/**
 * The first event fired when Stream Deck starts
 */
StreamDeck.registerConnected(({actionInfo, appInfo, connection, messageType, port, uuid}) => {
    const templateAction = new Action('com.elgato.template.actions', StreamDeck.events);

    templateAction.registerKeyUp((jsn) => {
        const {action, context, device, event, payload} = jsn;

        StreamDeck.openUrl(context,'https://developer.elgato.com/documentation/stream-deck/sdk/overview/');
        StreamDeck.showOk(context);

        console.log('Your code goes here!');
    });    
})
