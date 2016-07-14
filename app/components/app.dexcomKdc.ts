/// <reference path="../../node_modules/underscore/underscore.browser.d.ts" />

import {Component, OnInit, Input} from '@angular/core';
import {LivongoService} from "../services/livongo.service";
import {LivongoRepository} from "../repo/livongo.repo";
import { CHART_DIRECTIVES, Highcharts } from 'angular2-highcharts';
import {FitbitService} from "../services/fitbit.service";
import {FitbitRepository} from "../repo/fitbit.repo";
import {FitbitIntraDayDataSet, FitbitIntraDayData} from "../common/user/FitbitIntradayData";
import _ = require("underscore");
import {DexcomService} from "../services/dexcom.service";
import {DexcomRepository} from "../repo/dexcom.repo";
import {DexcomBgReadings, DexcomKdcReadings} from "../common/user/DexcomReadings";
import {isNumber} from "@angular/forms/src/facade/lang";
import * as moment from 'moment/moment';
import {utc} from 'moment/moment';
import {DateSyncService} from "../services/dateSync.service";


@Component({
  selector: 'dexcomKdc',
  directives: [CHART_DIRECTIVES],
  templateUrl: 'app/html/app.dexcomKdc.html',
  providers: [
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
    `]
})
export class DexcomKdcComponent {
  @Input()
  inputedDate: string;

  constructor(private fitbitService: FitbitService, private dexcomService: DexcomService,  private dateSyncService: DateSyncService) {
    this.dateSyncService.date.subscribe(date => {
      var today = utc(date)
      var tomorrow = today.add(1, 'd').toISOString()
      while(this.chart.series.length > 0)
        this.chart.series[0].remove(true);
      this.setData(date, tomorrow)
    })

    this.options = {
      chart: {
        type: 'line',
        zoomType: 'x'
      },
      title : { text : '' },
      dateTimeLabelFormats: { // don't display the dummy year
        month: '%e. %b',
        year: '%b'
      },
      series: [],
      xAxis: {

        title: {
          text: 'Glucose Reading'
        }
      },
      yAxis: [{ // Secondary yAxis
        title: {
          text: 'Minutes Spent at Blood Glucose Level',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        labels: {
          format: '{value} min',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        }
      }],
    };
  }
  chart : HighchartsChartObject;

  options: Object;
  dexcomOptions: Object;

  saveInstance(chartInstance) {
    this.chart = chartInstance;
  }

  startDate: String = utc().format('YYYY-MM-DD')
  currDate:  String = this.startDate

  onResize(event) {
    var th = document.getElementById('buttons').offsetHeight
    var bh = document.getElementById('title').offsetHeight
    this.chart.setSize(window.innerWidth, (window.innerHeight - th - bh)/2,true)
  }

  onKey(value) {
    console.log("WEEEEEEEEE")
    console.log(value)
    var dateReg = '/^\d{4}-\d{2}-\d{2}$/';

    var match = /^\d{4}-\d{2}-\d{2}$/.test(value)
    console.log(match)

    if(match == true){
      this.removeSeries()
      var today = utc(value)
      var tomorrow = today.add(1, 'd').toISOString()
      this.setData(value, tomorrow)
      this.currDate = value
      this.dateSyncService.date.emit(value)
    }
  }

  previousDay() {
    this.removeSeries()
    let previousDay = utc(this.currDate + 'T00:00:00').subtract(1, 'day').format('YYYY-MM-DD')
    this.setData(previousDay, this.currDate)
    this.currDate = previousDay
    this.dateSyncService.date.emit(this.currDate.toString())
  }

  nextDay() {
    this.removeSeries()
    let nextDateStart = utc(this.currDate + 'T00:00:00').add(1, 'day').format('YYYY-MM-DD')
    let nextDateEnd = utc(nextDateStart + 'T00:00:00').add(1, 'day').format('YYYY-MM-DD')
    this.setData(nextDateStart, nextDateEnd)
    this.currDate = nextDateStart
    this.dateSyncService.date.emit(this.currDate.toString())
  }

  setData(start, end) {
    let dexcomPromise = this.dexcomService.getKdcReadings(start, end).then( (readings: DexcomKdcReadings) => {
      let options = {
        name: 'Minutes Spent at Glucose Readings',
        type: 'line',
        yAxis: 0,
        data: readings.values,
        tooltip: {
          valueSuffix: ' minutes'
        },
        color: '#247BFF',
        pointWidth: 30
      }
      this.dexcomOptions = options
    })

    Promise.all([dexcomPromise]).then(values => {
      this.removeSeries()
      this.chart.addSeries(this.dexcomOptions, true, true)

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
    this.dexcomService.authorize().then(noOp => {
      this.setData('2016-06-01', '2016-06-29')
    })
  }


}
