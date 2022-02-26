/// <reference path="../../../libs/js/stream-deck.js" />
/// <reference path="../../../libs/js/form-utils.js" />

StreamDeck.onConnected((jsn) => {
	StreamDeck.loadLocalization('../../../');

	const form = document.querySelector('#property-inspector');
	const { actionInfo, appInfo, connection, messageType, port, uuid } = jsn;
	const { payload, context } = actionInfo;
	const { settings } = payload;

	FormUtils.setFormValue(settings, form);

	form.addEventListener(
		'input',
		FormUtils.debounce(150, () => {
			const value = FormUtils.getFormValue(form);
			StreamDeck.sendToPlugin(value, context);
			StreamDeck.setSettings(value);
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
