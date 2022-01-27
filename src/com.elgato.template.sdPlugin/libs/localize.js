var $localizedStrings = $localizedStrings || {};





/* eslint no-extend-native: ["error", { "exceptions": ["String"] }] */
String.prototype.lox = function () {
    var a = String(this);
    try {
        a = $localizedStrings[a] || a;
    } catch (b) {
    }
    return a;
};

const loadLocalization = async (lang, pathPrefix, cb) => {
    const manifest = await JsonUtils.read(`${pathPrefix}${lang}.json`)
    $localizedStrings = manifest && manifest.hasOwnProperty('Localization') ? manifest['Localization'] : {};
    if (cb && typeof cb === 'function') cb();
}
