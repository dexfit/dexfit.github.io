/// <reference path="../../node_modules/underscore/underscore.browser.d.ts" />
import { Component, OnInit } from '@angular/core';
import {AppComponent} from "./app.component";
import {DexcomKdcComponent} from "./app.dexcomKdc";

@Component({
  selector: 'mainApp',
  directives: [AppComponent, DexcomKdcComponent],
  templateUrl: 'app/html/app.main.html',
  providers: [
  ],
  styles: [``]
})
export class MainComponent {
  constructor() {

  }
  onResize(event) {
  }


  ngOnInit() {

  }
}
