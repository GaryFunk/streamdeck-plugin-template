/**
 * The first event fired when Stream Deck starts
 */
StreamDeck.registerConnected(({actionInfo, appInfo, connection, messageType, port, uuid}) => {
    const templateAction = new Action('com.elgato.template.actions', StreamDeck.events);

    templateAction.registerKeyUp((jsn) => {
        const {action, context, device, event, payload} = jsn;

        console.log('Your code goes here!');
    });
})
