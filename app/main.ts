///<reference path="../typings/index.d.ts"/>
import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './components/app.component';
import { HTTP_PROVIDERS } from '@angular/http';
import {MainComponent} from "./components/main.component";
import {DateSyncService} from "./services/dateSync.service";

bootstrap(MainComponent, [DateSyncService,
  HTTP_PROVIDERS
]);

