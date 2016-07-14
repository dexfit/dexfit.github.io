"use strict";
var DexcomBgReading = (function () {
    function DexcomBgReading(time, magnitude) {
        this.time = time;
        this.magnitude = magnitude;
    }
    return DexcomBgReading;
}());
exports.DexcomBgReading = DexcomBgReading;
var DexcomBgReadings = (function () {
    function DexcomBgReadings(readings) {
        this.readings = readings;
    }
    return DexcomBgReadings;
}());
exports.DexcomBgReadings = DexcomBgReadings;
var DexcomKdcReadings = (function () {
    function DexcomKdcReadings(values) {
        this.values = values;
    }
    return DexcomKdcReadings;
}());
exports.DexcomKdcReadings = DexcomKdcReadings;
//# sourceMappingURL=DexcomReadings.js.map