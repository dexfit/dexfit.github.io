/// <reference path="../../node_modules/underscore/underscore.browser.d.ts" />
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
var angular2_highcharts_1 = require('angular2-highcharts');
var fitbit_service_1 = require("../services/fitbit.service");
var fitbit_repo_1 = require("../repo/fitbit.repo");
var dexcom_service_1 = require("../services/dexcom.service");
var dexcom_repo_1 = require("../repo/dexcom.repo");
var moment_1 = require('moment/moment');
var dateSync_service_1 = require("../services/dateSync.service");
var DexcomKdcComponent = (function () {
    function DexcomKdcComponent(fitbitService, dexcomService, dateSyncService) {
        var _this = this;
        this.fitbitService = fitbitService;
        this.dexcomService = dexcomService;
        this.dateSyncService = dateSyncService;
        this.startDate = '2016-07-12';
        this.currDate = this.startDate;
        this.dateSyncService.date.subscribe(function (date) {
            var today = moment_1.utc(date);
            var tomorrow = today.add(1, 'd').toISOString();
            while (_this.chart.series.length > 0)
                _this.chart.series[0].remove(true);
            _this.setData(date, tomorrow);
        });
        this.options = {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: { text: '' },
            dateTimeLabelFormats: {
                month: '%e. %b',
                year: '%b'
            },
            series: [],
            xAxis: {
                title: {
                    text: 'Glucose Reading'
                }
            },
            yAxis: [{
                    title: {
                        text: 'Minutes Spent at Blood Glucose Level',
                        style: {
                            color: angular2_highcharts_1.Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} min',
                        style: {
                            color: angular2_highcharts_1.Highcharts.getOptions().colors[0]
                        }
                    }
                }],
        };
    }
    DexcomKdcComponent.prototype.saveInstance = function (chartInstance) {
        this.chart = chartInstance;
    };
    DexcomKdcComponent.prototype.onResize = function (event) {
        var th = document.getElementById('buttons').offsetHeight;
        var bh = document.getElementById('title').offsetHeight;
        this.chart.setSize(window.innerWidth, (window.innerHeight - th - bh) / 2, true);
    };
    DexcomKdcComponent.prototype.onKey = function (value) {
        console.log("WEEEEEEEEE");
        console.log(value);
        var dateReg = '/^\d{4}-\d{2}-\d{2}$/';
        var match = /^\d{4}-\d{2}-\d{2}$/.test(value);
        console.log(match);
        if (match == true) {
            this.removeSeries();
            var today = moment_1.utc(value);
            var tomorrow = today.add(1, 'd').toISOString();
            this.setData(value, tomorrow);
            this.currDate = value;
            this.dateSyncService.date.emit(value);
            document.getElementById("displayDate").innerHTML = this.currDate;
        }
    };
    DexcomKdcComponent.prototype.previousDay = function () {
        this.removeSeries();
        var previousDay = moment_1.utc(this.currDate + 'T00:00:00').subtract(1, 'day').format('YYYY-MM-DD');
        this.setData(previousDay, this.currDate);
        this.currDate = previousDay;
        this.dateSyncService.date.emit(this.currDate.toString());
    };
    DexcomKdcComponent.prototype.nextDay = function () {
        this.removeSeries();
        var nextDateStart = moment_1.utc(this.currDate + 'T00:00:00').add(1, 'day').format('YYYY-MM-DD');
        var nextDateEnd = moment_1.utc(nextDateStart + 'T00:00:00').add(1, 'day').format('YYYY-MM-DD');
        this.setData(nextDateStart, nextDateEnd);
        this.currDate = nextDateStart;
        this.dateSyncService.date.emit(this.currDate.toString());
    };
    DexcomKdcComponent.prototype.setData = function (start, end) {
        var _this = this;
        var dexcomPromise = this.dexcomService.getKdcReadings(start, end).then(function (readings) {
            var options = {
                name: 'Minutes Spent at Glucose Readings',
                type: 'line',
                yAxis: 0,
                data: readings.values,
                tooltip: {
                    valueSuffix: ' minutes'
                },
                color: '#247BFF',
                pointWidth: 30
            };
            _this.dexcomOptions = options;
        });
        Promise.all([dexcomPromise]).then(function (values) {
            _this.removeSeries();
            _this.chart.addSeries(_this.dexcomOptions, true, true);
            _this.onResize(null);
            _this.chart.redraw(true);
            document.getElementsByClassName("highcharts-container")[0].classList.add('animated', 'flipInY');
        });
    };
    DexcomKdcComponent.prototype.removeSeries = function () {
        while (this.chart.series.length > 0)
            this.chart.series[0].remove(true);
    };
    DexcomKdcComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dexcomService.authorize().then(function (noOp) {
            _this.setData('2016-06-01', '2016-06-29');
        });
    };
    DexcomKdcComponent = __decorate([
        core_1.Component({
            selector: 'dexcomKdc',
            directives: [angular2_highcharts_1.CHART_DIRECTIVES],
            templateUrl: 'app/html/app.dexcomKdc.html',
            providers: [
                fitbit_service_1.FitbitService,
                fitbit_repo_1.FitbitRepository,
                dexcom_service_1.DexcomService,
                dexcom_repo_1.DexcomRepository
            ],
            styles: ["\n      chart {\n        position:relative;\n        width: 100%;\n        height: 100%;\n      }\n    "]
        }), 
        __metadata('design:paramtypes', [fitbit_service_1.FitbitService, dexcom_service_1.DexcomService, dateSync_service_1.DateSyncService])
    ], DexcomKdcComponent);
    return DexcomKdcComponent;
}());
exports.DexcomKdcComponent = DexcomKdcComponent;
//# sourceMappingURL=app.dexcomKdc.js.map