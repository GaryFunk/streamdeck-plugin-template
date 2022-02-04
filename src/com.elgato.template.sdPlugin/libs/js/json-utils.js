class JsonUtilities {
    static async read(path) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.onerror = reject;
            req.overrideMimeType('application/json');
            req.open('GET', path, true);
            req.onreadystatechange = (response) => {
                if (req.readyState === 4) {
                    const jsonString = response?.target?.response;
                    if (jsonString) {
                        resolve(this.parse(response?.target?.response))
                    } else {
                        reject();
                    }
                }
            }

            req.send();
        });
    }

    static parse(jsonString) {
        if (typeof jsonString === 'object') return jsonString;
        try {
            const o = JSON.parse(jsonString);

            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns null, and typeof null === "object",
            // so we must check for that, too. Thankfully, null is falsey, so this suffices:
            if (o && typeof o === 'object') {
                return o;
            }
        } catch (e) {
        }

        return false;
    };
}

var JsonUtils = JsonUtilities;
