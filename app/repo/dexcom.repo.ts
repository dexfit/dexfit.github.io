import { Injectable, OnInit } from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment/moment';
import {FitbitAuth} from "../common/user/FitbitAuth";
import {FitbitIntraDayData, FitbitIntraDayDataSet} from "../common/user/FitbitIntradayData";
import {DexcomAuth} from "../common/user/DexcomAuth";
import {DexcomBgReading, DexcomBgReadings, DexcomKdcReadings} from "../common/user/DexcomReadings";

@Injectable()
export class DexcomRepository {
  constructor(private http: Http) { }

  baseUrl        = "http://localhost:1337/"
  tokenUrl       = "dexcom/authorize"
  readingsUrl    = "dexcom/getReadings"
  kdcReadingsUrl = "dexcom/kdc"


  public authorize(): Promise<FitbitAuth> {

    let url  = this.baseUrl + this.tokenUrl

    return this.http.get(url)
      .toPromise()
      .then(response => {
          console.log(response)
        let json    = response.json()
        let dexAuth = new DexcomAuth(json.accessToken)
        return dexAuth
      })
  }

  getReadings(start, end): Promise<DexcomBgReadings> {

    let url = this.baseUrl + this.readingsUrl
    let queryParams = "?start=" + start + "&end=" + end

    return this.http.get(url + queryParams)
      .toPromise()
      .then(response => {
        let json: any[] = response.json()
        console.log("dexcom repo")
        console.log(json)
        let readings = json.map(data => {
          return new DexcomBgReading(data.time, data.magnitude)
        })
        return new DexcomBgReadings(readings)
      })
  }

  getKdcReadings(start, end): Promise<DexcomKdcReadings> {

    let url = this.baseUrl + this.kdcReadingsUrl
    let queryParams = "?start=" + start + "&end=" + end

    return this.http.get(url + queryParams)
      .toPromise()
      .then(response => {
        let json: any[] = response.json()
        return new DexcomKdcReadings(json)
      })
  }
}
