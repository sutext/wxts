"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function trim(obj) {
    var result = {};
    for (var key in obj) {
        if (key !== 'constructor') {
            result[key] = obj[key];
        }
    }
    return result;
}
var IApp = /** @class */ (function () {
    function IApp() {
    }
    return IApp;
}());
exports.IApp = IApp;
var globalData;
function app() {
    return function (target) {
        if (getApp()) {
            throw new Error('不能注册多个app');
        }
        var param = new target();
        globalData = param.global;
        App(trim(param));
    };
}
exports.app = app;
var IPage = /** @class */ (function () {
    function IPage() {
    }
    return IPage;
}());
exports.IPage = IPage;
function page(inital) {
    return function (target) {
        var param = new target();
        var global = globalData ? __assign({}, globalData) : {};
        Object.assign(global, inital, param.data);
        Object.assign(param, { data: global });
        Page(trim(param));
    };
}
exports.page = page;
var Widget = /** @class */ (function () {
    function Widget() {
    }
    return Widget;
}());
exports.Widget = Widget;
var keys = ['properties', 'data', 'behaviors', 'created', 'attached', 'ready', 'moved', 'detached', 'relations', 'externalClasses'];
function widget(inital) {
    return function (target) {
        var param = new target();
        var result = { methods: {} };
        var _loop_1 = function (key) {
            if (key === 'constructor') {
                return "continue";
            }
            if (keys.findIndex(function (e) { return key === e; }) !== -1) {
                result[key] = param[key];
            }
            else {
                result.methods[key] = param[key];
            }
        };
        for (var key in param) {
            _loop_1(key);
        }
        if (inital) {
            var data = result.data;
            if (data) {
                Object.assign(data, inital);
            }
            else {
                Object.assign(result, { data: inital });
            }
        }
        Component(result);
    };
}
exports.widget = widget;
