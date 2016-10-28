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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const core_1 = require("../core");
const Test_1 = require("../models/Test");
let HelloController = class HelloController {
    _function() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                resolve('whateva');
            });
        });
    }
    index(name, email, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var test = new Test_1.Test({ name, email });
            //test.save();
            //var test = await Test.findOne({name, email});
            test.setPassword('test');
            return {
                url: ctx.url,
                response: test
            };
        });
    }
    fff(la, ctx) {
        console.log('handling', la);
        ctx.body = la;
    }
};
__decorate([
    core_1.Route({
        type: "POST",
        url: "/test"
    }), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object]), 
    __metadata('design:returntype', void 0)
], HelloController.prototype, "fff", null);
HelloController = __decorate([
    core_1.Controller({
        url: "/hello",
        before: [],
        after: []
    }), 
    __metadata('design:paramtypes', [])
], HelloController);
exports.HelloController = HelloController;
