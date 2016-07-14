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
var FitbitAuth_1 = require("../common/user/FitbitAuth");
var FitbitIntradayData_1 = require("../common/user/FitbitIntradayData");
var FitbitRepository = (function () {
    function FitbitRepository(http) {
        this.http = http;
        this.baseUrl = "mighty-eyrie-65709.herokuapp.com/";
        this.tokenUrl = "fitbit/authorize";
        this.intraDayDataUrl = "fitbit/intradayData";
    }
    FitbitRepository.prototype.authorize = function (username, password) {
        var url = this.baseUrl + this.tokenUrl;
        var body = { username: username, password: password };
        return this.http.post(url, body)
            .toPromise()
            .then(function (response) {
            var auth = response.json();
            var authTokens = new FitbitAuth_1.FitbitAuth(auth.access_token, auth.refresh_token);
            return authTokens;
        });
    };
    FitbitRepository.prototype.getIntradayData = function (type, date) {
        var url = this.baseUrl + this.intraDayDataUrl;
        var queryParams = "?type=" + type + "&date=" + date;
        return this.http.get(url + queryParams)
            .toPromise()
            .then(function (response) {
            var json = response.json();
            var intradayData = json.map(function (data) {
                return new FitbitIntradayData_1.FitbitIntraDayData(type, date + "T" + data.time, data.value);
            });
            return new FitbitIntradayData_1.FitbitIntraDayDataSet(intradayData);
        });
    };
    FitbitRepository = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], FitbitRepository);
    return FitbitRepository;
}());
exports.FitbitRepository = FitbitRepository;
//# sourceMappingURL=fitbit.repo.js.map