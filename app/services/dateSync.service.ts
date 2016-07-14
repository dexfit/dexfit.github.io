
import {EventEmitter} from "@angular/platform-browser-dynamic/src/facade/async";
export class DateSyncService {
  public date: EventEmitter<string> = new EventEmitter<string>();
}  
