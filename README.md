
# Stream Deck Plugin Template

A template for building [Stream Deck](https://developer.elgato.com/documentation/stream-deck/) plugins in Javascript. `Stream Deck Plugin Template` requires Stream Deck 5.0 or later.

## Quick Start Guide

You can check out the documentation [here](https://developer.elgato.com/documentation/stream-deck/).

### Clone the repo

```git clone https://github.com/elgatosf/streamdeck-plugin-template```

### Replace Name

`com.elgato.template` with `my.domain.plugin`

### Start Coding

You can get started in app.js!

```javascript
streamDeck.onConnected(({actionInfo, appInfo, connection, messageType, port, uuid}) => {
    const myAction = new Action('my.domain.plugin.action');

    myAction.onKeyUp(({action, context, device, event, payload}) => {
        console.log('Your code goes here!');
    });
});
```
