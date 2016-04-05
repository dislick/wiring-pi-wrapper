# wiring-pi-wrapper

TypeScript wrapper around [wiring-pi](https://github.com/eugeneware/wiring-pi).

## Usage

`npm install wiring-pi-wrapper --save`

```javascript
var wpw = require('wiring-pi-wrapper').WiringPiWrapper;
var pinModes = require('wiring-pi-wrapper').PinModes;
var ChangeWorker = require('wiring-pi-wrapper').ChangeWorker;

// setup the pin layout
wpw.setup('wpi');

// write example
var pin = wpw.setupPin(3, pinModes.output);
pin.write(true);

// read example
var pin = wpw.setupPin(2, pinModes.input);
var status = pin.read(); // returns a boolean

// event listener example
var pin = wpw.setupPin(2, pinModes.input);
ChangeWorker.interval = 50; // sets the worker interval
pin.addEventListener('change', (status) => {
  console.log(status);
});
```

## API

### wpw

#### `wpw.setup(mode: string)`

Maps directly to the `wiring-pi``setup()` function. Mode must be one of the following values:

- `wpi`: sets up pin numbering with `wiringPiSetup()`
- `gpio`: sets up pin numbering with `wiringPiSetupGpio()`
- `sys`: sets up pin numbering with `wiringPiSetupSys()`
- `phys`: sets up pin numbering with `wiringPiSetupPhys()`

More information [can be found here](https://github.com/eugeneware/wiring-pi/blob/master/DOCUMENTATION.md#setupmode).

#### `wpw.setupPin(pin: number, mode: wpw.PinModes)`

Creates a new `Pin` object and executes the [`pinMode()`](https://github.com/eugeneware/wiring-pi/blob/master/DOCUMENTATION.md#pinmodepin-mode) function.

### Pin

#### `constructor`

The `Pin` class cannot be instantiated using the `new` keyword. Use `wpw.setupPin()`.

#### `pin.read()`

Synchronously returns the status of the pin as a boolean. Maps to [`digitalRead()`](https://github.com/eugeneware/wiring-pi/blob/master/DOCUMENTATION.md#digitalreadpin).

#### `pin.write(status: boolean)`

Synchronously writes a status to the pin. Maps to [`digitalWrite()`](https://github.com/eugeneware/wiring-pi/blob/master/DOCUMENTATION.md#digitalwritepin-state).

#### `pin.addEventListener(event: string, handler: function)`

Binds one of the following events to the pin:

- `change`: Fires when the status of the pin changes. The `handler` function receives the status as a paramter.

#### `pin.removeEventListener(event: string, handler?: function)`

Unbinds an event listener. If no `handler` function gets passed it removes all registered event listeners of that event.

### ChangeWorker

#### `ChangeWorker.interval`

Allows the user to change the dirty checking interval of the pins.
