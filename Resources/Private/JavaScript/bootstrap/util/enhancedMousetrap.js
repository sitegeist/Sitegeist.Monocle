//
// This creates a version of mousetrap with the global-bind plugin injected
// See: https://github.com/ccampbell/mousetrap/blob/master/plugins/global-bind/mousetrap-global-bind.js
//
import mousetrap from 'mousetrap';

const _globalCallbacks = {};
const _originalStopCallback = mousetrap.prototype.stopCallback;

mousetrap.prototype.stopCallback = function (e, element, combo, sequence) {
    if (this.paused) {
        return true;
    }

    if (_globalCallbacks[combo] || _globalCallbacks[sequence]) {
        return false;
    }

    return _originalStopCallback.call(this, e, element, combo);
};

mousetrap.prototype.bindGlobal = function (keys, callback, action) {
    this.bind(keys, callback, action);

    if (Array.isArray(keys)) {
        for (let i = 0; i < keys.length; i++) {
            _globalCallbacks[keys[i]] = true;
        }
        return;
    }

    _globalCallbacks[keys] = true;
};

mousetrap.init();

export default mousetrap;
