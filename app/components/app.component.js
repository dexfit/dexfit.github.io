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
/// <reference path="../../node_modules/underscore/underscore.browser.d.ts" />
var core_1 = require('@angular/core');
var livongo_service_1 = require("../services/livongo.service");
var livongo_repo_1 = require("../repo/livongo.repo");
var angular2_highcharts_1 = require('angular2-highcharts');
var moment = require('moment/moment');
var moment_1 = require('moment/moment');
var fitbit_service_1 = require("../services/fitbit.service");
var fitbit_repo_1 = require("../repo/fitbit.repo");
var _ = require("underscore");
var dateSync_service_1 = require("../services/dateSync.service");
var dexcom_service_1 = require("../services/dexcom.service");
var dexcom_repo_1 = require("../repo/dexcom.repo");
var AppComponent = (function () {
    function AppComponent(dexcomService, livongoService, fitbitService, dateSyncService) {
        var _this = this;
        this.dexcomService = dexcomService;
        this.livongoService = livongoService;
        this.fitbitService = fitbitService;
        this.dateSyncService = dateSyncService;
        this.startDate = '2016-07-12';
        this.currDate = this.startDate;
        this.dateSyncService.date.subscribe(function (date) {
            while (_this.chart.series.length > 0)
                _this.chart.series[0].remove(true);
            _this.currDate = date;
            _this.setData(date);
        });
        this.options = {
            chart: {
                type: 'scatter',
                zoomType: 'x'
            },
            title: { text: '' },
            dateTimeLabelFormats: {
                month: '%e. %b',
                year: '%b'
            },
            series: [],
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                }
            },
            yAxis: [{
                    labels: {
                        format: '{value} Steps',
                        style: {
                            color: angular2_highcharts_1.Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Steps',
                        style: {
                            color: angular2_highcharts_1.Highcharts.getOptions().colors[1]
                        }
                    }
                }, {
                    title: {
                        text: 'Blood Glucose',
                        style: {
                            color: angular2_highcharts_1.Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} mg/dl',
                        style: {
                            color: angular2_highcharts_1.Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }],
        };
    }
    AppComponent.prototype.saveInstance = function (chartInstance) {
        this.chart = chartInstance;
    };
    AppComponent.prototype.onResize = function (event) {
        var th = document.getElementById('buttons').offsetHeight;
        var bh = document.getElementById('title').offsetHeight;
        this.chart.setSize(window.innerWidth, (window.innerHeight - th - bh) / 2, true);
    };
    AppComponent.prototype.previousDay = function () {
        this.removeSeries();
        var previousDay = moment_1.utc(this.currDate + 'T00:00:00').subtract(1, 'day').format('YYYY-MM-DD');
        this.currDate = previousDay;
        this.setData(previousDay);
    };
    AppComponent.prototype.nextDay = function () {
        this.removeSeries();
        var nextDate = moment_1.utc(this.currDate + 'T00:00:00').add(1, 'day').format('YYYY-MM-DD');
        this.currDate = nextDate;
        this.setData(nextDate);
    };
    AppComponent.prototype.setData = function (date) {
        var _this = this;
        var dexcomPromise = this.dexcomService.getReadings(date, moment_1.utc(date + 'T00:00:00').add(1, 'day').format('YYYY-MM-DD')).then(function (readings) {
            console.log(readings);
            var readingsForGraph = readings.readings.map(function (reading) {
                console.log(reading);
                return [moment_1.utc(reading.time).toDate().getTime(), reading.magnitude];
            });
            console.log("newReadings");
            console.log(readingsForGraph);
            var options = {
                yAxis: 1,
                type: 'line',
                tooltip: {
                    pointFormat: '{point.x: %b %e %H:%M}: {point.y:.2f} mg/dl',
                    valueSuffix: ' mg/dl'
                },
                name: 'Livongo Glucose Readings',
                data: readingsForGraph,
                allowPointSelect: true,
                color: '#0DCC00'
            };
            _this.livongoOptions = options;
        });
        var fitbitPromise = this.fitbitService.getIntradayData('steps', date).then(function (readings) {
            var x = _.groupBy(readings.set, function (data) {
                return moment(data.timestamp).hour();
            });
            var dateObj = new Date(date);
            var dateObjWithSum = _.map(x, function (arr, key) {
                var sum = _.reduce(arr, function (memo, data) { return memo + data["value"]; }, 0);
                dateObj.setUTCHours(+key);
                return [dateObj.getTime(), sum];
            });
            var options = {
                name: 'Fitbit Steps',
                type: 'column',
                yAxis: 0,
                data: dateObjWithSum,
                tooltip: {
                    valueSuffix: ' steps'
                },
                color: '#247BFF',
                pointWidth: 30
            };
            _this.fitbitOptions = options;
        });
        var fitbitHeartPromise = this.fitbitService.getIntradayData('heart', date).then(function (readings) {
            var dateObjWithHeartRate = _.map(readings.set, function (value, key) {
                var x = value;
                var dateStr = x.timestamp;
                return [moment_1.utc(dateStr).toDate().getTime(), x.value];
            });
            var options = {
                name: 'Fitbit HeartRate Data',
                type: 'line',
                yAxis: 1,
                data: dateObjWithHeartRate,
                tooltip: {
                    valueSuffix: ' bpm'
                },
                color: '#F90000'
            };
            _this.fitbitHeartOptions = options;
        });
        Promise.all([fitbitPromise, fitbitHeartPromise, dexcomPromise]).then(function (values) {
            _this.chart.addSeries(_this.fitbitOptions, true, true);
            _this.chart.addSeries(_this.fitbitHeartOptions, true, true);
            _this.chart.addSeries(_this.livongoOptions, true, true);
            _this.onResize(null);
            _this.chart.redraw(true);
            document.getElementsByClassName("highcharts-container")[0].classList.add('animated', 'flipInY');
        });
    };
    AppComponent.prototype.removeSeries = function () {
        while (this.chart.series.length > 0)
            this.chart.series[0].remove(true);
    };
    AppComponent.prototype.ngOnInit = function () {
        this.livongoService.authorize();
        this.setData(this.startDate);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app/html/app.component.html',
            providers: [
                livongo_service_1.LivongoService,
                livongo_repo_1.LivongoRepository,
                fitbit_service_1.FitbitService,
                fitbit_repo_1.FitbitRepository,
                dexcom_service_1.DexcomService,
                dexcom_repo_1.DexcomRepository
            ],
            styles: ["\n      chart {\n        position:relative;\n        width: 100%;\n        height: 100%;\n      }\n    "],
            directives: [angular2_highcharts_1.CHART_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [dexcom_service_1.DexcomService, livongo_service_1.LivongoService, fitbit_service_1.FitbitService, dateSync_service_1.DateSyncService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map