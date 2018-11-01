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
/**
 * @default {}
 * @description global data will be inject to every Ipage.
 * @description if local Ipage provide the same variable it will overwrite
 */
function app(global) {
    if (globalData) {
        throw new Error('you can only register one app!!!!');
    }
    globalData = global || {};
    return function (target) {
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
/**
 * @default undefined
 * @description inject inital data to the Ipage'data field.
 * @description it will overwrite global data if possible
 */
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
/**
 * @default undefined
 * @description inject inital data to the Commponent data field.
 */
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
                Object.assign(inital, data);
            }
            else {
                Object.assign(result, { data: inital });
            }
        }
        var global = globalData ? __assign({}, globalData) : {};
        Object.assign(global, inital, result.data);
        Object.assign(result, { data: global });
        Component(result);
    };
}
exports.widget = widget;
var Network = /** @class */ (function () {
    function Network() {
    }
    Object.defineProperty(Network.prototype, "method", {
        /**
         * @default POST
         * @description provide request methd
         */
        get: function () {
            return 'POST';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "header", {
        /**
         * @default {}
         * @description provide custom http headers
         */
        get: function () {
            return {};
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @description resove relative uri to full url
     * @param path the relative uri
     */
    Network.prototype.url = function (path) {
        throw new Error('Network.url(path:string) must be implement');
    };
    /**
     * @description you must provid an resover and return you business object
     * @param resp the http response object
     */
    Network.prototype.resolve = function (resp) {
        throw new Error('Network.resolve must be implement');
    };
    Network.prototype.upload = function (file, loading) {
        var _this = this;
        wx.showNavigationBarLoading();
        if (loading)
            exports.pop.waiting();
        return new Promise(function (resolve, reject) {
            wx.uploadFile({
                name: file.name,
                header: _this.header,
                url: _this.url(file.path),
                filePath: file.file,
                complete: function (res) {
                    wx.hideNavigationBarLoading();
                    if (loading)
                        exports.pop.idling();
                    try {
                        res.data = JSON.parse(res.data);
                        var value = _this.resolve(res);
                        resolve(value.key);
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            });
        });
    };
    Network.prototype.anytask = function (path, data, loading) {
        var _this = this;
        wx.showNavigationBarLoading();
        if (loading)
            exports.pop.waiting();
        return new Promise(function (resolve, reject) {
            wx.request({
                url: _this.url(path),
                header: _this.header,
                data: data,
                method: _this.method,
                complete: function (result) {
                    wx.hideNavigationBarLoading();
                    if (loading)
                        exports.pop.idling();
                    try {
                        var value = _this.resolve(result);
                        if (value && result.header && result.header.Date) {
                            value.timestamp = new Date(result.header.Date).getTime();
                        }
                        resolve(value);
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            });
        });
    };
    Network.prototype.objtask = function (c, path, data, loading) {
        var _this = this;
        wx.showNavigationBarLoading();
        if (loading)
            exports.pop.waiting();
        return new Promise(function (resolve, reject) {
            wx.request({
                url: _this.url(path),
                header: _this.header,
                data: data,
                method: _this.method,
                complete: function (result) {
                    wx.hideNavigationBarLoading();
                    if (loading)
                        exports.pop.idling();
                    try {
                        var value = _this.resolve(result);
                        if (value && result.header && result.header.Date) {
                            value.timestamp = new Date(result.header.Date).getTime();
                        }
                        resolve(new c(value));
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            });
        });
    };
    Network.prototype.arytask = function (c, path, data, loading) {
        var _this = this;
        wx.showNavigationBarLoading();
        if (loading)
            exports.pop.waiting();
        return new Promise(function (resolve, reject) {
            wx.request({
                url: _this.url(path),
                header: _this.header,
                data: data,
                method: _this.method,
                complete: function (result) {
                    wx.hideNavigationBarLoading();
                    if (loading)
                        exports.pop.idling();
                    try {
                        var value = _this.resolve(result);
                        if (value && value.length > 0) {
                            resolve(value.map(function (e) { return new c(e); }));
                        }
                        else {
                            resolve([]);
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            });
        });
    };
    return Network;
}());
exports.Network = Network;
var Popver = /** @class */ (function () {
    function Popver() {
    }
    Popver.prototype.alert = function (content, confirm) {
        wx.showModal({ title: "提示", content: content, showCancel: false, success: confirm });
    };
    Popver.prototype.dialog = function (content, confirm, cancel) {
        wx.showModal({
            title: "提示", content: content, showCancel: true, success: function (res) {
                if (res.confirm && confirm) {
                    confirm();
                }
                else if (res.cancel && cancel) {
                    cancel();
                }
            }
        });
    };
    Popver.prototype.remind = function (ok, dismiss) {
        wx.showToast({ title: ok, icon: "success", duration: 1000, mask: true });
        setTimeout(function () {
            if (dismiss) {
                dismiss();
            }
        }, 1000);
    };
    Popver.prototype.error = function (err) {
        var msg = err.message;
        if (!msg) {
            msg = "服务异常";
        }
        wx.showModal({ title: "提示", content: msg, showCancel: false });
    };
    Popver.prototype.waiting = function (title) {
        wx.showLoading({ title: title || '加载中', mask: true });
    };
    Popver.prototype.idling = function () {
        wx.hideLoading();
    };
    return Popver;
}());
exports.pop = new Popver();
var Socket = /** @class */ (function () {
    function Socket() {
        var _this = this;
        this._isConnected = false;
        this._isConnecting = false;
        this.timer = null;
        this.pingTimeout = null;
        this.addObserve = function () {
            if (!_this.task) {
                return;
            }
            _this.task.onOpen(function (res) {
                _this.log('WebSocket连接已打开！', res);
                _this._isConnecting = false;
                _this._isConnected = true;
                _this.didConnected();
            });
            _this.task.onError(function (res) {
                _this.log('WebSocket连接打开失败，请检查！', res);
                _this._isConnected = false;
                _this._isConnecting = false;
                _this.didError(new Error(res.errMsg));
            });
            _this.task.onMessage(function (res) {
                if (typeof res.data === "string") {
                    try {
                        _this.handle(JSON.parse(res.data), false);
                    }
                    catch (error) {
                        _this.log(error);
                    }
                }
                _this.log('收到WebSocket消息：', res);
            });
            _this.task.onClose(function (res) {
                _this.log('WebSocket 已关闭！', res);
                if (_this.isAuthClose(res)) {
                    _this.stop();
                    _this.didLogout(res);
                    return;
                }
                _this.affterClose();
            });
        };
        this.affterClose = function () {
            _this._isConnected = false;
            _this._isConnecting = false;
            _this.task = null;
            setTimeout(function () {
                _this.attempt();
            }, 1000);
        };
        this.close = function () {
            if (!_this.task) {
                return;
            }
            _this.task.close({
                fail: function (res) {
                    _this.affterClose();
                }
            });
        };
        this.attempt = function () {
            if (_this.attemptTimes > _this.maxAttemptTimes) {
                exports.pop.alert('网络连接失败，请重试', function () { return _this.reattemp(); });
                _this.disConnected();
                return;
            }
            _this.connect();
        };
        this.reattemp = function () {
            _this.attemptTimes = 0;
            _this.attempt();
        };
        this.timerFunc = function () {
            if (!_this._isConnected) {
                _this.attempt();
                return;
            }
            if (_this.pingTimeout) {
                return;
            }
            var data = "{\"type\":\"PING\"}";
            _this.task.send({ data: data });
            _this.pingTimeout = setTimeout(function () {
                _this.log("ping 超时");
                _this.pingTimeout = null;
                _this.close();
            }, 3 * 1000);
        };
        this.connect = function () {
            if (!_this.isLogin) {
                return;
            }
            if (!_this.timer) {
                return;
            }
            if (_this._isConnected) {
                return;
            }
            if (_this._isConnecting) {
                return;
            }
            _this._isConnecting = true;
            _this.task = wx.connectSocket({ url: _this.url });
            _this.addObserve();
            _this.attemptTimes += 1;
        };
        this.handle = function (msg, isOffline) {
            if (msg.type == "PONG") {
                if (_this.pingTimeout) {
                    clearTimeout(_this.pingTimeout);
                    _this.pingTimeout = null;
                }
                _this.log("收到pong消息：", msg);
                return;
            }
            _this.listeners.forEach(function (ele) {
                ele.onMessage(msg, isOffline);
            });
        };
        /**
         * @default 10
         * @description the max attempt times
         */
        this.maxAttemptTimes = 10;
        /**
         * @default 30
         * @description the heartbeat interal
         */
        this.heartbeatInterval = 30;
        this.start = function () {
            if (_this.timer) {
                return;
            }
            _this.timer = setInterval(function () {
                _this.timerFunc();
            }, 1000 * _this.heartbeatInterval);
            _this.attemptTimes = 0;
            _this.timerFunc();
        };
        this.stop = function () {
            if (!_this.timer) {
                return;
            }
            clearInterval(_this.timer);
            _this.timer = null;
            _this.close();
        };
        this.addListener = function (listener) {
            _this.listeners.add(listener);
        };
        this.removeListener = function (listener) {
            _this.listeners.delete(listener);
        };
        this.listeners = new Set();
    }
    Socket.prototype.log = function (msg, other) {
        if (this.isDebug) {
            console.log(msg, other || '');
        }
    };
    Object.defineProperty(Socket.prototype, "url", {
        /**
         * subclass must impl this method to resolve url
         * you must provide connect url
         */
        get: function () {
            throw new Error('you must provide url like wss://xxx.com ');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Socket.prototype, "isLogin", {
        /**
         * you mast tell me you login status
         * @default false
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Socket.prototype, "isDebug", {
        /**
         * print debug info or not
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @default impl is return res.code === 4001 || res.code === 4002,4001,4002 is the default auth fail code
     * @description If get true socket will not attempt again. At this time didLogout will be call!
     */
    Socket.prototype.isAuthClose = function (res) {
        return res.code === 4001 || res.code === 4002;
    };
    /** the staus observe . It will be call when socket never attemped */
    Socket.prototype.didConnected = function () {
    };
    /** call when socket opend */
    Socket.prototype.disConnected = function () {
    };
    /**
     * @see isAuthClose
     * @param res logout res
     */
    Socket.prototype.didLogout = function (res) {
    };
    /** call when some error opend */
    Socket.prototype.didError = function (error) {
    };
    Object.defineProperty(Socket.prototype, "isConnected", {
        get: function () {
            return this._isConnected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Socket.prototype, "isConnecting", {
        get: function () {
            return this._isConnecting;
        },
        enumerable: true,
        configurable: true
    });
    return Socket;
}());
exports.Socket = Socket;
var Storage = /** @class */ (function () {
    function Storage() {
    }
    Storage.prototype.save = function (model) {
        if (!model || model.isEmpty)
            return;
        var key = model.className + "." + model.id;
        var keys = wx.getStorageSync(model.className) || {};
        keys.key = '';
        wx.setStorageSync(model.className, keys);
        wx.setStorageSync(key, model);
    };
    Storage.prototype.find = function (c, id) {
        var classkey = new c().className;
        if (!(id && classkey))
            return null;
        var obj = wx.getStorageSync(classkey + "." + id);
        return obj ? new c(obj) : null;
    };
    Storage.prototype.all = function (c) {
        var classkey = new c().className;
        if (!classkey)
            return [];
        var keys = wx.getStorageSync(classkey);
        var result = [];
        for (var key in keys) {
            var obj = wx.getStorageSync(key);
            if (obj) {
                result.push(new c(obj));
            }
        }
        return result;
    };
    return Storage;
}());
exports.storage = new Storage();
