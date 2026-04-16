#!/usr/bin/env node
// Parity check: payment catalog must match across android/ios/browser + plugin.xml.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

function extractAndroidPkgs() {
    const src = read('src/android/InstalledApps.java');
    const block = src.match(/PAYMENT_APPS\s*=\s*new\s+String\[\]\[\]\s*\{([\s\S]*?)\};/)[1];
    return [...block.matchAll(/\{\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"/g)]
        .map(m => ({ name: m[1], pkg: m[2], scheme: m[3] }));
}

function extractIosPkgs() {
    const src = read('src/ios/InstalledApps.m');
    const block = src.match(/paymentAppCatalog[\s\S]*?return\s*@\[([\s\S]*?)\];/)[1];
    return [...block.matchAll(/@"name":\s*@"([^"]+)"[\s\S]*?@"iosScheme":\s*@"([^"]+)"[\s\S]*?@"androidPackage":\s*@"([^"]+)"/g)]
        .map(m => ({ name: m[1], scheme: m[2], pkg: m[3] }));
}

function extractBrowserPkgs() {
    const src = read('src/browser/InstalledAppsProxy.js');
    const block = src.match(/PAYMENT_APPS\s*=\s*\[([\s\S]*?)\];/)[1];
    return [...block.matchAll(/appName:\s*"([^"]+)"[\s\S]*?packageName:\s*"([^"]+)"[\s\S]*?urlScheme:\s*"([^"]+)"/g)]
        .map(m => ({ name: m[1], pkg: m[2], scheme: m[3] }));
}

function extractPluginXmlQueries() {
    const src = read('plugin.xml');
    const queries = [...src.matchAll(/<package\s+android:name="([^"]+)"/g)].map(m => m[1]);
    const schemes = [...src.matchAll(/<string>([^<]+)<\/string>/g)].map(m => m[1]);
    return { queries, schemes };
}

const a = extractAndroidPkgs();
const i = extractIosPkgs();
const b = extractBrowserPkgs();
const xml = extractPluginXmlQueries();

let fail = 0;
function eq(label, x, y) {
    const ok = JSON.stringify(x) === JSON.stringify(y);
    console.log((ok ? 'OK  ' : 'FAIL') + ' ' + label);
    if (!ok) { console.log('  L:', x); console.log('  R:', y); fail++; }
}

eq('android pkgs == ios pkgs', a.map(x => x.pkg).sort(), i.map(x => x.pkg).sort());
eq('android schemes == ios schemes', a.map(x => x.scheme).sort(), i.map(x => x.scheme).sort());
eq('android names == ios names', a.map(x => x.name).sort(), i.map(x => x.name).sort());
eq('browser schemes subset of native', true, b.every(x => a.some(y => y.scheme === x.scheme)));
eq('plugin.xml <queries> covers all android pkgs', true, a.every(x => xml.queries.includes(x.pkg)));
eq('plugin.xml LSApplicationQueriesSchemes covers all ios schemes', true, i.every(x => xml.schemes.includes(x.scheme)));

console.log('\nandroid:', a.length, 'ios:', i.length, 'browser:', b.length, 'xml.queries:', xml.queries.length, 'xml.schemes:', xml.schemes.length);
process.exit(fail ? 1 : 0);
