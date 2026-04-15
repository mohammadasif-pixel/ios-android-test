// Keep this list in sync with LSApplicationQueriesSchemes in ../config.xml.
// Anything not declared there will always come back as installed:false.
var SCHEMES = [
    { scheme: 'fb',             label: 'Facebook' },
    { scheme: 'fb-messenger',   label: 'Messenger' },
    { scheme: 'whatsapp',       label: 'WhatsApp' },
    { scheme: 'instagram',      label: 'Instagram' },
    { scheme: 'twitter',        label: 'Twitter / X' },
    { scheme: 'tg',             label: 'Telegram' },
    { scheme: 'snapchat',       label: 'Snapchat' },
    { scheme: 'tiktok',         label: 'TikTok' },
    { scheme: 'youtube',        label: 'YouTube' },
    { scheme: 'spotify',        label: 'Spotify' },
    { scheme: 'googlegmail',    label: 'Gmail' },
    { scheme: 'comgooglemaps',  label: 'Google Maps' },
    { scheme: 'zoomus',         label: 'Zoom' },
    { scheme: 'slack',          label: 'Slack' },
    { scheme: 'microsoft-edge', label: 'Edge' }
];

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    var status = document.getElementById('status');
    var btn = document.getElementById('check-btn');

    status.textContent = 'Ready. Tap the button to probe.';
    btn.disabled = false;

    btn.addEventListener('click', function () {
        btn.disabled = true;
        status.textContent = 'Probing...';

        var schemes = SCHEMES.map(function (s) { return s.scheme; });

        window.Applist.getInstalledApps(schemes, function (results) {
            render(results);
            status.textContent = 'Probed ' + results.length + ' schemes.';
            btn.disabled = false;
        }, function (err) {
            status.textContent = 'Error: ' + err;
            btn.disabled = false;
        });
    });
}

function labelFor(scheme) {
    for (var i = 0; i < SCHEMES.length; i++) {
        if (SCHEMES[i].scheme === scheme) return SCHEMES[i].label;
    }
    return scheme;
}

function render(results) {
    var ul = document.getElementById('results');
    ul.innerHTML = '';

    results
        .slice()
        .sort(function (a, b) {
            if (a.installed !== b.installed) return a.installed ? -1 : 1;
            return labelFor(a.scheme).localeCompare(labelFor(b.scheme));
        })
        .forEach(function (r) {
            var li = document.createElement('li');

            var name = document.createElement('span');
            name.textContent = labelFor(r.scheme);
            var sch = document.createElement('span');
            sch.className = 'scheme';
            sch.textContent = r.scheme + '://';
            name.appendChild(sch);

            var badge = document.createElement('span');
            badge.className = 'badge ' + (r.installed ? 'yes' : 'no');
            badge.textContent = r.installed ? 'Installed' : 'Not found';

            li.appendChild(name);
            li.appendChild(badge);
            ul.appendChild(li);
        });
}
