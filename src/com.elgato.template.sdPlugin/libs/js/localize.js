StreamDeck.on('localizationLoaded', () => {
    const elements = document.querySelectorAll('[data-localize]');

    elements.forEach(element => {
        element.textContent = StreamDeck.localization[element.textContent] ?? element.textContent;
    })
});
