"use strict";
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
function app() {
    return function (target) {
        if (getApp()) {
            throw new Error('不能注册多个app');
        }
        App(trim(new target()));
    };
}
exports.app = app;
var IPage = /** @class */ (function () {
    function IPage() {
    }
    return IPage;
}());
exports.IPage = IPage;
function page() {
    return function (target) {
        var param = new target();
        param.data.test = "hello";
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
function widget() {
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
        Component(result);
    };
}
exports.widget = widget;
