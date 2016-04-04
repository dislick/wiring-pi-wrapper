var Pin = (function () {
    function Pin(pinNumber) {
    }
    Pin.prototype.read = function () {
        return true;
    };
    Pin.prototype.write = function (status) {
    };
    Pin.prototype.addEventListener = function (event, handler) {
    };
    Pin.prototype.removeEventListener = function (event) {
    };
    return Pin;
})();
(function (PinModes) {
    PinModes[PinModes["input"] = 0] = "input";
    PinModes[PinModes["output"] = 1] = "output";
})(exports.PinModes || (exports.PinModes = {}));
var PinModes = exports.PinModes;
var WiringPiWrapper = (function () {
    function WiringPiWrapper() {
    }
    WiringPiWrapper.setup = function (mode) {
    };
    WiringPiWrapper.setupPin = function (pin, mode) {
        return new Pin(pin);
    };
    return WiringPiWrapper;
})();
exports.WiringPiWrapper = WiringPiWrapper;
//# sourceMappingURL=wiring-pi-wrapper.js.map