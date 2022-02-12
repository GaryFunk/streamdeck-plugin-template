/// <reference path="../../../libs/js/deck.js" />
/// <reference path="../../../libs/js/form-utils.js" />

const streamDeck = new StreamDeck();

streamDeck.registerConnected((jsn) => {

	streamDeck.loadLocalization('../../../');

	const form = document.querySelector('#property-inspector');
	const { actionInfo, appInfo, connection, messageType, port, uuid } = jsn;
	const { payload, context } = actionInfo;
	const { settings } = payload;

	FormUtils.setValue(settings, form);

	form.addEventListener(
		'input',
		FormUtils.debounce(150, () => {
			const value = FormUtils.getValue(form);
			streamDeck.sendToPlugin(value, context);
			streamDeck.setSettings(value);
		})
	);
});

/**
 * Provide window level functions to use in the external window
 * (this can be removed if the external window is not used)
 */
window.sendToInspector = (data) => {
	console.log(data);
};

document.querySelector('#open-external').addEventListener('click', () => {
	window.open('../../../external.html');
});