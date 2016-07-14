import { Injectable,Inject, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {DexcomRepository} from "../repo/dexcom.repo";


@Injectable()
export class DexcomService {
  constructor(private http: Http, @Inject(DexcomRepository) private dexcomRepository: DexcomRepository) { }


  authorize() {
    return this.dexcomRepository.authorize().then(
      auth => {
        return auth
      });
  }

  getReadings(start, end) {
    return this.dexcomRepository.getReadings(start, end).then(
      readings  => {
        return readings
      });
  }

  getKdcReadings(start, end) {
    return this.dexcomRepository.getKdcReadings(start, end).then(
      readings  => {
        return readings
      });
  }

}
