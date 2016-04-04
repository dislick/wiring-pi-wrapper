"use strict";
var wpi = require('wiring-pi');
var Pin = (function () {
    function Pin(pinNumber, mode) {
        this.pinNumber = pinNumber;
        this.mode = mode;
        this.eventListeners = [];
    }
    Pin.prototype.read = function () {
        return !!wpi.digitalRead(this.pinNumber);
    };
    Pin.prototype.write = function (status) {
        wpi.digitalWrite(this.pinNumber, +status);
    };
    Pin.prototype.addEventListener = function (event, handler) {
        this.eventListeners.push({ event: event, handler: handler });
        switch (event) {
            case 'change':
                this.bindChangeListener(handler);
                break;
            default:
                this.removeEventListener(event, handler);
                break;
        }
    };
    Pin.prototype.removeEventListener = function (event, handler) {
        this.eventListeners = this.eventListeners.filter(function (listener) {
            return listener.event === event && listener.handler === listener;
        });
    };
    Pin.prototype.bindChangeListener = function (handler) {
        var _this = this;
        var previousOutput;
        var check = function () {
            if (!_this.eventListeners.some(function (listener) { return listener.handler === handler; })) {
                return;
            }
            var output = _this.read();
            if (output !== previousOutput) {
                previousOutput = null;
                handler(output);
            }
            previousOutput = output;
            setTimeout(check, 0);
        };
        check();
    };
    return Pin;
}());
exports.Pin = Pin;
(function (PinModes) {
    PinModes[PinModes["input"] = 0] = "input";
    PinModes[PinModes["output"] = 1] = "output";
})(exports.PinModes || (exports.PinModes = {}));
var PinModes = exports.PinModes;
var WiringPiWrapper = (function () {
    function WiringPiWrapper() {
    }
    WiringPiWrapper.setup = function (mode) {
        wpi.setup(mode);
    };
    WiringPiWrapper.setupPin = function (pin, mode) {
        wpi.pinMode(pin, WiringPiWrapper.pinModeMap[mode]);
        return new Pin(pin, mode);
    };
    WiringPiWrapper.pinModeMap = {
        0: wpi.INPUT,
        1: wpi.OUTPUT
    };
    return WiringPiWrapper;
}());
exports.WiringPiWrapper = WiringPiWrapper;
//# sourceMappingURL=wiring-pi-wrapper.js.map