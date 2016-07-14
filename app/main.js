"use strict";
///<reference path="../typings/index.d.ts"/>
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var http_1 = require('@angular/http');
var main_component_1 = require("./components/main.component");
var dateSync_service_1 = require("./services/dateSync.service");
platform_browser_dynamic_1.bootstrap(main_component_1.MainComponent, [dateSync_service_1.DateSyncService,
    http_1.HTTP_PROVIDERS
]);
//# sourceMappingURL=main.js.map