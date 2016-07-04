"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
const livongo_service_1 = require("./services/livongo.service");
const livongo_repo_1 = require("./repo/livongo.repo");
let AppComponent = class AppComponent {
    constructor(livongoService) {
        this.livongoService = livongoService;
    }
    ngOnInit() {
        this.livongoService.authorize();
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: '<h1>My First Angular 2 App</h1>',
        providers: [
            livongo_service_1.LivongoService,
            livongo_repo_1.LivongoRepository
        ]
    }), 
    __metadata('design:paramtypes', [livongo_service_1.LivongoService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map