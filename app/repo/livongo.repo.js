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
var LivongoReadings_1 = require("../common/user/LivongoReadings");
var LivongoAuth_1 = require("../common/user/LivongoAuth");
var moment = require('moment/moment');
var LivongoRepository = (function () {
    function LivongoRepository(http) {
        this.http = http;
        this.baseUrl = "mighty-eyrie-65709.herokuapp.com/";
        this.tokenUrl = "livongo/authorize";
        this.readingsUrl = "livongo/readings";
    }
    LivongoRepository.prototype.authorize = function (username, password) {
        var url = this.baseUrl + this.tokenUrl;
        var body = { username: username, password: password };
        return this.http.post(url, body)
            .toPromise()
            .then(function (response) {
            var auth = response.json();
            var authTokens = new LivongoAuth_1.LivongoAuth(auth.access_token, auth.refresh_token);
            return authTokens;
        });
    };
    LivongoRepository.prototype.getReadings = function (start, end) {
        var url = this.baseUrl + this.readingsUrl;
        var queryParams = "?start=" + start + "&end=" + end;
        return this.http.get(url + queryParams)
            .toPromise()
            .then(function (response) {
            var bgs = response.json().bgs;
            var bgReadings = bgs.map(function (jsonEntry) {
                var timeStamp = moment(jsonEntry.timestamp).format("YYYY-MM-DD T HH:MM:SS").toString();
                return new LivongoReadings_1.BgReading(timeStamp, jsonEntry.value);
            });
            return new LivongoReadings_1.BgReadings(bgReadings);
        });
    };
    LivongoRepository = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], LivongoRepository);
    return LivongoRepository;
}());
exports.LivongoRepository = LivongoRepository;
//# sourceMappingURL=livongo.repo.js.map