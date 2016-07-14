/// <reference path="../../node_modules/underscore/underscore.browser.d.ts" />
import { Component, OnInit } from '@angular/core';
import {LivongoService} from "../services/livongo.service";
import {LivongoRepository} from "../repo/livongo.repo";
import { CHART_DIRECTIVES, Highcharts } from 'angular2-highcharts';
import {BgReadings} from "../common/user/LivongoReadings";
import * as moment from 'moment/moment';
import {utc} from 'moment/moment';

import {FitbitService} from "../services/fitbit.service";
import {FitbitRepository} from "../repo/fitbit.repo";
import {FitbitIntraDayDataSet, FitbitIntraDayData} from "../common/user/FitbitIntradayData";
import _ = require("underscore");
import {DexcomKdcComponent} from "./app.dexcomKdc";
import {DateSyncService} from "../services/dateSync.service";
import {DexcomService} from "../services/dexcom.service";
import {DexcomRepository} from "../repo/dexcom.repo";
import {DexcomBgReadings} from "../common/user/DexcomReadings";

@Component({
  selector: 'my-app',
  templateUrl: 'app/html/app.component.html',
  providers: [
    LivongoService,
    LivongoRepository,
    FitbitService,
    FitbitRepository,
    DexcomService,
    DexcomRepository
  ],
  styles: [`
      chart {
        position:relative;
        width: 100%;
        height: 100%;
      }
    `],
  directives: [CHART_DIRECTIVES]


})
export class AppComponent {
  constructor(private dexcomService: DexcomService, private livongoService: LivongoService, private fitbitService: FitbitService, private dateSyncService: DateSyncService) {
    this.dateSyncService.date.subscribe(date => {
      while(this.chart.series.length > 0)
        this.chart.series[0].remove(true);
        this.currDate = date
        this.setData(date)
    })

    this.options = {
      chart: {
        type: 'scatter',
        zoomType: 'x'
      },
      title : { text : '' },
      dateTimeLabelFormats: { // don't display the dummy year
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
      yAxis: [{ // Primary yAxis
        labels: {
          format: '{value} Steps',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        title: {
          text: 'Steps',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        }
      }, { // Secondary yAxis
        title: {
          text: 'Blood Glucose',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        labels: {
          format: '{value} mg/dl',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        opposite: true
      }],
    };
  }
  chart : HighchartsChartObject;
  options: Object;
  livongoOptions: Object;
  fitbitOptions: Object;
  fitbitHeartOptions: Object;
  saveInstance(chartInstance) {
      this.chart = chartInstance;
  }
  startDate: string = '2016-07-12'
  currDate:  string = this.startDate

  onResize(event) {
    var th = document.getElementById('buttons').offsetHeight
    var bh = document.getElementById('title').offsetHeight
    this.chart.setSize(window.innerWidth, (window.innerHeight - th - bh)/2, true)
  }

  previousDay(){
    this.removeSeries()
    let previousDay = utc(this.currDate + 'T00:00:00').subtract(1, 'day').format('YYYY-MM-DD')
    this.currDate = previousDay
    this.setData(previousDay)
  }

  nextDay(){
    this.removeSeries()
    let nextDate = utc(this.currDate + 'T00:00:00').add(1, 'day').format('YYYY-MM-DD')
    this.currDate = nextDate
    this.setData(nextDate)
  }

  setData(date) {
    let dexcomPromise = this.dexcomService.getReadings(date, utc(date+'T00:00:00').add(1, 'day').format('YYYY-MM-DD')).then( (readings: DexcomBgReadings) => {
      console.log(readings)
      let readingsForGraph = readings.readings.map(reading => {
        console.log(reading)
        return [utc(reading.time).toDate().getTime(), reading.magnitude]
      })

      console.log("newReadings")
      console.log(readingsForGraph)
      let options = {
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
      }
      this.livongoOptions = options
    })

    let fitbitPromise = this.fitbitService.getIntradayData('steps', date).then( (readings: FitbitIntraDayDataSet) => {
      let x = _.groupBy(readings.set, function(data){
        return moment(data.timestamp).hour()
      });

      let dateObj = new Date(date)
      let dateObjWithSum = _.map(x, function(arr, key){
        let sum = _.reduce(arr, function(memo, data){ return memo + data["value"] }, 0);

        dateObj.setUTCHours(+key)
        return [dateObj.getTime(), sum]
      })

      let options = {
        name: 'Fitbit Steps',
        type: 'column',
        yAxis: 0,
        data: dateObjWithSum,
        tooltip: {
          valueSuffix: ' steps'
        },
        color: '#247BFF',
        pointWidth: 30
      }
      this.fitbitOptions = options
    })

    let fitbitHeartPromise = this.fitbitService.getIntradayData('heart', date).then( (readings: FitbitIntraDayDataSet) => {

      let dateObjWithHeartRate = _.map(readings.set, function(value, key){
        let x: FitbitIntraDayData = value
        let dateStr = x.timestamp
        return [utc(dateStr).toDate().getTime(), x.value]
      })

      let options = {
        name: 'Fitbit HeartRate Data',
        type: 'line',
        yAxis: 1,
        data: dateObjWithHeartRate,
        tooltip: {
          valueSuffix: ' bpm'
        },
        color: '#F90000'
      }
      this.fitbitHeartOptions = options
    })

    Promise.all([fitbitPromise, fitbitHeartPromise, dexcomPromise]).then(values => {
      this.chart.addSeries(this.fitbitOptions,      true, true)
      this.chart.addSeries(this.fitbitHeartOptions, true, true)
      this.chart.addSeries(this.livongoOptions,     true, true)
      this.onResize(null)
      this.chart.redraw(true)
      document.getElementsByClassName("highcharts-container")[0].classList.add('animated', 'flipInY')
    });
  }

  removeSeries() {
    while(this.chart.series.length > 0)
      this.chart.series[0].remove(true);
  }

  ngOnInit() {
    this.livongoService.authorize()

    this.setData(this.startDate)

  }
}
