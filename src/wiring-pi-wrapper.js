/// <reference path="typings/tsd.d.ts" />
var wpi = require('wiring-pi');
var ChangeWorker = (function () {
    function ChangeWorker() {
    }
    /**
     * Adds a handler to the loop
     * @param  {Pin}      pin
     * @param  {function} handler
     */
    ChangeWorker.add = function (pin, handler) {
        var listeners = ChangeWorker.eventListeners.filter(function (eventListener) { return eventListener.pin === pin; });
        if (listeners.length <= 0) {
            ChangeWorker.eventListeners.push({
                pin: pin,
                handlers: [handler]
            });
        }
        else {
            listeners[0].handlers.push(handler);
        }
        if (!ChangeWorker.isWorking) {
            ChangeWorker.start();
        }
    };
    /**
     * Removes a handler from the loop
     * @param  {Pin}      pin
     * @param  {function} handler
     */
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
                    // reset the comparing variable
                    listener.previousOutput = null;
                    // notifying handlers
                    listener.handlers.forEach(function (handler) { return handler(output); });
                }
                listener.previousOutput = output;
            });
            // call run asynchronously
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
    ChangeWorker.interval = 5; // declares the interval for the worker
    return ChangeWorker;
})();
exports.ChangeWorker = ChangeWorker;
/**
 * Handles all read/write operations on a given GPIO Pin
 */
var Pin = (function () {
    function Pin(pinNumber, mode) {
        this.pinNumber = pinNumber;
        this.mode = mode;
        this.eventListeners = [];
    }
    /**
     * Reads from the pin
     * @return {boolean} status
     */
    Pin.prototype.read = function () {
        return !!wpi.digitalRead(this.pinNumber);
    };
    /**
     * Writes to the pin
     * @param {boolean} status
     */
    Pin.prototype.write = function (status) {
        wpi.digitalWrite(this.pinNumber, +status);
    };
    /**
     * Binds an event listener to the pin
     * @param {string}   event
     * @param {function} handler
     */
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
    /**
     * Removes a bound event listener
     * @param  {string}   event
     * @param  {function} handler
     */
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
})();
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
    /**
     * Initializes a Pin object
     * @param  {number}   pin
     * @param  {PinModes} mode
     * @return {Pin}
     */
    WiringPiWrapper.setupPin = function (pin, mode) {
        // set pinMode on the given pin
        wpi.pinMode(pin, WiringPiWrapper.pinModeMap[mode]);
        // instantiate a new Pin object
        return new Pin(pin, mode);
    };
    WiringPiWrapper.pinModeMap = {
        0: wpi.INPUT,
        1: wpi.OUTPUT
    };
    return WiringPiWrapper;
})();
exports.WiringPiWrapper = WiringPiWrapper;
