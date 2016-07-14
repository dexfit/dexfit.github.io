"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var DexcomAuth_1 = require("../common/user/DexcomAuth");
var DexcomReadings_1 = require("../common/user/DexcomReadings");
var DexcomRepository = (function () {
    function DexcomRepository(http) {
        this.http = http;
        this.baseUrl = "https://mighty-eyrie-65709.herokuapp.com/";
        this.tokenUrl = "dexcom/authorize";
        this.readingsUrl = "dexcom/getReadings";
        this.kdcReadingsUrl = "dexcom/kdc";
    }
    DexcomRepository.prototype.authorize = function () {
        var url = this.baseUrl + this.tokenUrl;
        console.log(url);
        return this.http.get(url)
            .toPromise()
            .then(function (response) {
            console.log(response);
            var json = response.json();
            var dexAuth = new DexcomAuth_1.DexcomAuth(json.accessToken);
            return dexAuth;
        });
    };
    DexcomRepository.prototype.getReadings = function (start, end) {
        var url = this.baseUrl + this.readingsUrl;
        var queryParams = "?start=" + start + "&end=" + end;
        console.log(url + queryParams);
        return this.http.get(url + queryParams)
            .toPromise()
            .then(function (response) {
            console.log(response);
            var json = response.json();
            console.log("dexcom repo");
            console.log(response);
            console.log(json);
            var readings = json.map(function (data) {
                return new DexcomReadings_1.DexcomBgReading(data.time, data.magnitude);
            });
            return new DexcomReadings_1.DexcomBgReadings(readings);
        });
    };
    DexcomRepository.prototype.getKdcReadings = function (start, end) {
        var url = this.baseUrl + this.kdcReadingsUrl;
        var queryParams = "?start=" + start + "&end=" + end;
        return this.http.get(url + queryParams)
            .toPromise()
            .then(function (response) {
            var json = response.json();
            return new DexcomReadings_1.DexcomKdcReadings(json);
        });
    };
    DexcomRepository = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], DexcomRepository);
    return DexcomRepository;
}());
exports.DexcomRepository = DexcomRepository;
//# sourceMappingURL=dexcom.repo.js.map