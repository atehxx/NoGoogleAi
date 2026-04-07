chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
        // If origin is Google Maps then do not change the url
        if (isGoogleMapsRobust(info)) return;

        let url_s = info.url;
        let url = new URL(url_s);
        let udm = url.searchParams.get("udm");
        let tbm = url.searchParams.get("tbm");
        //only trigger when we are doing a regular search, so no image video news, etc search
        // normal search has no udm and no tbm set
        if ((udm == "" || udm == null) && (tbm == "" || tbm == null)) {
            // Check Tab URL before replacing
            if (info.tabId != null && info.tabId >= 0) {
                chrome.tabs.get(info.tabId, function(tab) {
                    if (chrome.runtime.lastError || !tab || !tab.url) return;
                    // Do nothing if on Google Maps
                    if (tab.url.includes("google.com/maps")) return;

                    url.searchParams.set("udm", "14");
                    update_tab(url.href, info.tabId);
                });
            } else {
                url.searchParams.set("udm", "14");
                update_tab(url.href, info.tabId);
            }
        }
    },
    // filters
    {
        urls: [
            "http://www.google.com/search*",
            "http://www.google.co.jp/search*",
            "http://www.google.co.uk/search*",
            "http://www.google.es/search*",
            "http://www.google.ca/search*",
            "http://www.google.de/search*",
            "http://www.google.it/search*",
            "http://www.google.fr/search*",
            "http://www.google.com.au/search*",
            "http://www.google.com.tw/search*",
            "http://www.google.nl/search*",
            "http://www.google.com.br/search*",
            "http://www.google.com.tr/search*",
            "http://www.google.be/search*",
            "http://www.google.com.gr/search*",
            "http://www.google.co.in/search*",
            "http://www.google.com.mx/search*",
            "http://www.google.dk/search*",
            "http://www.google.com.ar/search*",
            "http://www.google.ch/search*",
            "http://www.google.cl/search*",
            "http://www.google.at/search*",
            "http://www.google.co.kr/search*",
            "http://www.google.ie/search*",
            "http://www.google.com.co/search*",
            "http://www.google.pl/search*",
            "http://www.google.pt/search*",
            "http://www.google.com.pk/search*",
            "https://www.google.com/search*",
            "https://www.google.co.jp/search*",
            "https://www.google.co.uk/search*",
            "https://www.google.es/search*",
            "https://www.google.ca/search*",
            "https://www.google.de/search*",
            "https://www.google.it/search*",
            "https://www.google.fr/search*",
            "https://www.google.com.au/search*",
            "https://www.google.com.tw/search*",
            "https://www.google.nl/search*",
            "https://www.google.com.br/search*",
            "https://www.google.com.tr/search*",
            "https://www.google.be/search*",
            "https://www.google.com.gr/search*",
            "https://www.google.co.in/search*",
            "https://www.google.com.mx/search*",
            "https://www.google.dk/search*",
            "https://www.google.com.ar/search*",
            "https://www.google.ch/search*",
            "https://www.google.cl/search*",
            "https://www.google.at/search*",
            "https://www.google.co.kr/search*",
            "https://www.google.ie/search*",
            "https://www.google.com.co/search*",
            "https://www.google.pl/search*",
            "https://www.google.pt/search*",
            "https://www.google.com.pk/search*"
        ]
    },
    // extraInfoSpec
    ["blocking"]);

function update_tab(url, tab_id) {
    browser.runtime.getPlatformInfo().then((info) => {
        let updateProperties = { url };
        if (tab_id != null) {
            browser.tabs.update(tab_id, updateProperties);
        } else {
            browser.tabs.update(updateProperties);
        }
    });
}

function isGoogleMapsLite(info) {
    const urls = [info.originUrl, info.documentUrl].filter(Boolean);
    return urls.some(u => u.includes("google.com/maps"));
}

function isGoogleMapsRobust(info) {
    const urls = [info.originUrl, info.documentUrl].filter(Boolean);
    return urls.some(u => {
        try {
            const parsed = new URL(u);
            const host = parsed.hostname;
            const path = parsed.pathname;
            return (
                // www.google.*/maps/*
                (/^(www\.)?google\..+$/.test(host) && path.startsWith("/maps")) ||
                // maps.google.*
                /^maps\.google\..+$/.test(host)
            );
        } catch {
            return false;
        }
    });
}
