/// <reference path="../../../libs/js/deck.js" />
/// <reference path="../../../libs/js/form-utils.js" />

StreamDeck.registerConnected((jsn) => {
	const form = document.querySelector("#property-inspector");
	const settings = jsn?.actionInfo?.payload?.settings;

	FormUtils.setValue(settings, form);

	form.addEventListener(
		"input",
		FormUtils.debounce(200, () => {
			const value = FormUtils.getValue(form);
			StreamDeck.sendToPlugin(value);
			StreamDeck.setSettings(value);
		})
	);
});

document.querySelector("#open-external").addEventListener("click", () => {
	window.open("../../../external.html");
});
