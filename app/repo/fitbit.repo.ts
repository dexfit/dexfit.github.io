import { Injectable, OnInit } from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment/moment';
import {FitbitAuth} from "../common/user/FitbitAuth";
import {FitbitIntraDayData, FitbitIntraDayDataSet} from "../common/user/FitbitIntradayData";

@Injectable()
export class FitbitRepository {
  constructor(private http: Http) { }

  baseUrl     = "mighty-eyrie-65709.herokuapp.com/"
  tokenUrl    = "fitbit/authorize"
  intraDayDataUrl = "fitbit/intradayData"

  public authorize(username, password): Promise<FitbitAuth> {

    let url  = this.baseUrl + this.tokenUrl
    let body = {username: username, password: password }

    return this.http.post(url, body)
      .toPromise()
      .then(response => {
        let auth = response.json()
        let authTokens = new FitbitAuth(auth.access_token, auth.refresh_token)
        return authTokens
      })
  }

  getIntradayData(type, date): Promise<FitbitIntraDayDataSet> {

    let url = this.baseUrl + this.intraDayDataUrl
    let queryParams = "?type=" + type + "&date=" + date
    return this.http.get(url + queryParams)
      .toPromise()
      .then(response => {
        let json: any[] = response.json()
        let intradayData = json.map(data => {
          return new FitbitIntraDayData(type, date + "T" + data.time, data.value)
        })
        return new FitbitIntraDayDataSet(intradayData)
      })
  }
}
