/// <reference path="../../../libs/js/deck.js" />
/// <reference path="../../../libs/js/form-utils.js" />

StreamDeck.registerConnected((jsn) => {
	const form = document.querySelector('#property-inspector');
	const settings = jsn?.actionInfo?.payload?.settings;

	FormUtils.setValue(settings, form);

	form.addEventListener(
		'input',
		FormUtils.debounce(200, () => {
			const value = FormUtils.getValue(form);
			StreamDeck.sendToPlugin(value);
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
