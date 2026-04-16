#!/usr/bin/env node
// Headless smoke test for the browser proxy. Stubs cordova/exec/proxy.
const path = require('path');
const Module = require('module');

const proxyStore = {};
const stub = { add: function (name, impl) { proxyStore[name] = impl; } };

const origResolve = Module._resolveFilename;
Module._resolveFilename = function (req, parent, ...rest) {
    if (req === 'cordova/exec/proxy') return req;
    return origResolve.call(this, req, parent, ...rest);
};
require.cache['cordova/exec/proxy'] = { id: 'cordova/exec/proxy', filename: 'cordova/exec/proxy', exports: stub, loaded: true };

require(path.resolve(__dirname, '..', 'src/browser/InstalledAppsProxy.js'));

let fail = 0;
function assert(label, cond) {
    console.log((cond ? 'OK  ' : 'FAIL') + ' ' + label);
    if (!cond) fail++;
}

assert('proxy registered as InstalledApps', !!proxyStore.InstalledApps);
const p = proxyStore.InstalledApps;
assert('exposes getInstalledApps', typeof p.getInstalledApps === 'function');
assert('exposes getPaymentApps', typeof p.getPaymentApps === 'function');
assert('exposes getAppInfo', typeof p.getAppInfo === 'function');

let pending = 3;
function done() { if (--pending === 0) process.exit(fail ? 1 : 0); }

p.getInstalledApps(function (apps) {
    assert('getInstalledApps returns array', Array.isArray(apps));
    assert('getInstalledApps shape ok', apps.every(a => a.appName && a.urlScheme && a.icon));
    done();
}, function () { assert('getInstalledApps no error', false); done(); });

p.getPaymentApps(function (apps) {
    assert('getPaymentApps returns array', Array.isArray(apps));
    assert('getPaymentApps has 11 entries', apps.length === 11);
    done();
}, function () { assert('getPaymentApps no error', false); done(); });

p.getAppInfo(function (info) {
    assert('getAppInfo by scheme finds PhonePe', info.appName === 'PhonePe');
    done();
}, function () { assert('getAppInfo no error', false); done(); }, ['phonepe']);

setTimeout(function () { if (pending) { console.log('FAIL timeout, pending=' + pending); process.exit(1); } }, 3000);
