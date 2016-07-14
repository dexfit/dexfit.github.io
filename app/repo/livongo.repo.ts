import { Injectable, OnInit } from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {BgReadings, BgReading} from "../common/user/LivongoReadings";
import {LivongoAuth} from "../common/user/LivongoAuth";
import * as moment from 'moment/moment';

@Injectable()
export class LivongoRepository {
  constructor(private http: Http) { }

  baseUrl     = "https://mighty-eyrie-65709.herokuapp.com/"
  tokenUrl    = "livongo/authorize"
  readingsUrl = "livongo/readings"

  public authorize(username, password): Promise<LivongoAuth> {

    let url  = this.baseUrl + this.tokenUrl
    let body = {username: username, password: password }

    return this.http.post(url, body)
      .toPromise()
      .then(response => {
        let auth = response.json()
        let authTokens = new LivongoAuth(auth.access_token, auth.refresh_token)
        return authTokens
      })
  }

  getReadings(start, end): Promise<BgReadings> {

    let url = this.baseUrl + this.readingsUrl
    let queryParams = "?start=" + start + "&end=" + end
    return this.http.get(url + queryParams)
      .toPromise()
      .then(response => {
        let bgs: any[] = response.json().bgs
        let bgReadings = bgs.map(jsonEntry => {
          let timeStamp = moment(jsonEntry.timestamp).format("YYYY-MM-DD T HH:MM:SS").toString()
          return new BgReading( timeStamp, jsonEntry.value)
        })
        return new BgReadings(bgReadings)
      })
  }
}
