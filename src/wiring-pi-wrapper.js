"use strict";
var wpi = require('wiring-pi');
var ChangeWorker = (function () {
    function ChangeWorker() {
    }
    ChangeWorker.add = function (pin, handler) {
        var listeners = ChangeWorker.eventListeners.filter(function (eventListener) { return eventListener.pin === pin; });
        if (listeners.length <= 0) {
            ChangeWorker.eventListeners.push({
                pin: pin,
                handlers: [handler],
                previousOutput: pin.read()
            });
        }
        else {
            listeners[0].handlers.push(handler);
        }
        if (!ChangeWorker.isWorking) {
            ChangeWorker.start();
        }
    };
    ChangeWorker.remove = function (pin, handler) {
        var listeners = ChangeWorker.eventListeners.filter(function (eventListener) { return eventListener.pin === pin; });
        if (listeners.length > 0) {
            listeners[0].handlers = listeners[0].handlers.filter(function (h) { return h !== handler; });
            if (listeners[0].handlers.length === 0) {
                ChangeWorker.eventListeners.splice(ChangeWorker.eventListeners.indexOf(listeners[0]), 1);
            }
        }
        if (ChangeWorker.eventListeners.length === 0) {
            ChangeWorker.stop();
        }
    };
    ChangeWorker.work = function () {
        var run = function () {
            ChangeWorker.eventListeners.forEach(function (listener) {
                var output = listener.pin.read();
                if (output !== listener.previousOutput) {
                    listener.previousOutput = null;
                    listener.handlers.forEach(function (handler) { return handler(output); });
                }
                listener.previousOutput = output;
            });
            if (ChangeWorker.isWorking) {
                setTimeout(run, ChangeWorker.interval);
            }
        };
        run();
    };
    ChangeWorker.start = function () {
        ChangeWorker.isWorking = true;
        ChangeWorker.work();
    };
    ChangeWorker.stop = function () {
        ChangeWorker.isWorking = false;
    };
    ChangeWorker.eventListeners = [];
    ChangeWorker.isWorking = false;
    ChangeWorker.interval = 5;
    return ChangeWorker;
}());
exports.ChangeWorker = ChangeWorker;
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
                ChangeWorker.add(this, handler);
                break;
            default:
                this.removeEventListener(event, handler);
                break;
        }
    };
    Pin.prototype.removeEventListener = function (event, handler) {
        this.eventListeners = this.eventListeners.filter(function (listener) {
            return listener.event === event && (!handler || listener.handler === handler);
        });
        switch (event) {
            case 'change':
                ChangeWorker.remove(this, handler);
                break;
            default:
                break;
        }
    };
    return Pin;
}());
exports.Pin = Pin;
(function (PinLayout) {
    PinLayout[PinLayout["wpi"] = 0] = "wpi";
    PinLayout[PinLayout["gpio"] = 1] = "gpio";
    PinLayout[PinLayout["sys"] = 2] = "sys";
    PinLayout[PinLayout["phys"] = 3] = "phys";
})(exports.PinLayout || (exports.PinLayout = {}));
var PinLayout = exports.PinLayout;
(function (PinModes) {
    PinModes[PinModes["input"] = 0] = "input";
    PinModes[PinModes["output"] = 1] = "output";
})(exports.PinModes || (exports.PinModes = {}));
var PinModes = exports.PinModes;
var WiringPiWrapper = (function () {
    function WiringPiWrapper() {
    }
    WiringPiWrapper.setup = function (mode) {
        var pinLayout = WiringPiWrapper.pinLayoutMap[mode];
        if (pinLayout === void 0) {
            throw new Error('PinLayout not supported!');
        }
        wpi.setup(pinLayout);
    };
    WiringPiWrapper.setupPin = function (pin, mode) {
        var pinMode = WiringPiWrapper.pinModeMap[mode];
        if (pinMode === void 0) {
            throw new Error('PinMode not supported!');
        }
        wpi.pinMode(pin, pinMode);
        return new Pin(pin, mode);
    };
    WiringPiWrapper.pinLayoutMap = {
        0: 'wpi',
        1: 'gpio',
        2: 'sys',
        3: 'phys'
    };
    WiringPiWrapper.pinModeMap = {
        0: wpi.INPUT,
        1: wpi.OUTPUT
    };
    return WiringPiWrapper;
}());
exports.WiringPiWrapper = WiringPiWrapper;
//# sourceMappingURL=wiring-pi-wrapper.js.map