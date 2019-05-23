"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
function trim(origin) {
    var result = {};
    for (var key in origin) {
        if (key !== 'constructor') {
            result[key] = origin[key];
        }
    }
    return result;
}
var globalData;
var IApp = /** @class */ (function () {
    function IApp() {
    }
    return IApp;
}());
exports.IApp = IApp;
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
        var data = {};
        Object.assign(data, globalData, inital, param.data);
        Object.assign(param, { data: data });
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
        var data = {};
        Object.assign(data, inital, result.data);
        Object.assign(result, { data: data });
        Component(result);
    };
}
exports.widget = widget;
var Network = /** @class */ (function () {
    function Network() {
        var _this = this;
        this.anyreq = function (req) {
            return _this.anytask(req.path, req.data, req.options);
        };
        this.objreq = function (req) {
            if (typeof req.meta !== 'function')
                throw new Error('the meta of objreq must be a class value');
            return _this.objtask(req.meta, req.path, req.data, req.options);
        };
        this.aryreq = function (req) {
            if (typeof req.meta !== 'function')
                throw new Error('the meta of aryreq must be class value');
            return _this.arytask(req.meta, req.path, req.data, req.options);
        };
        this.upload = function (file, options) {
            wx.showNavigationBarLoading();
            var loading = options && options.loading;
            if (options && options.loading) {
                pop.wait(typeof loading === 'string' ? loading : undefined);
            }
            var handler;
            var promiss = new Promise(function (resolve, reject) {
                handler = wx.uploadFile({
                    name: file.name,
                    header: _this.headers,
                    url: _this.url(file.path),
                    filePath: file.file,
                    formData: file.data,
                    complete: function (res) {
                        wx.hideNavigationBarLoading();
                        pop.idle();
                        try {
                            res.data = JSON.parse(res.data);
                            var parser = options && options.parser || _this.resolve.bind(_this);
                            var value = parser(res);
                            resolve(value);
                        }
                        catch (error) {
                            reject(error);
                        }
                    },
                });
            });
            return new Network.UploadTask(promiss, handler);
        };
        this.anytask = function (path, data, options) {
            wx.showNavigationBarLoading();
            var loading = options && options.loading;
            if (options && options.loading) {
                pop.wait(typeof loading === 'string' ? loading : undefined);
            }
            var handler;
            var promiss = new Promise(function (resolve, reject) {
                handler = wx.request({
                    url: _this.url(path),
                    header: _this.headers,
                    data: data,
                    method: options && options.method || _this.method,
                    complete: function (result) {
                        wx.hideNavigationBarLoading();
                        if (options && options.loading)
                            pop.idle();
                        try {
                            var parser = options && options.parser || _this.resolve.bind(_this);
                            var value = parser(result);
                            if (options && options.timestamp && value && result.header && result.header.Date) {
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
            return new Network.DataTask(promiss, handler);
        };
        this.objtask = function (c, path, data, options) {
            wx.showNavigationBarLoading();
            var loading = options && options.loading;
            if (options && options.loading) {
                pop.wait(typeof loading === 'string' ? loading : undefined);
            }
            var handler;
            var promiss = new Promise(function (resolve, reject) {
                handler = wx.request({
                    url: _this.url(path),
                    header: _this.headers,
                    data: data,
                    method: options && options.method || _this.method,
                    complete: function (result) {
                        wx.hideNavigationBarLoading();
                        if (options && options.loading)
                            pop.idle();
                        try {
                            var parser = options && options.parser || _this.resolve.bind(_this);
                            var value = parser(result);
                            if (options && options.timestamp && value && result.header && result.header.Date) {
                                value.timestamp = new Date(result.header.Date).getTime();
                            }
                            resolve(new c(value));
                        }
                        catch (error) {
                            reject(error);
                        }
                    },
                });
            });
            return new Network.DataTask(promiss, handler);
        };
        this.arytask = function (c, path, data, options) {
            wx.showNavigationBarLoading();
            var loading = options && options.loading;
            if (options && options.loading) {
                pop.wait(typeof loading === 'string' ? loading : undefined);
            }
            var handler;
            var promiss = new Promise(function (resolve, reject) {
                handler = wx.request({
                    url: _this.url(path),
                    header: _this.headers,
                    data: data,
                    method: options && options.method || _this.method,
                    complete: function (result) {
                        wx.hideNavigationBarLoading();
                        if (options && options.loading)
                            pop.idle();
                        try {
                            var parser = options && options.parser || _this.resolve.bind(_this);
                            var value = parser(result);
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
            return new Network.DataTask(promiss, handler);
        };
        this.download = function (opts, options) {
            wx.showNavigationBarLoading();
            var loading = options && options.loading;
            if (options && options.loading) {
                pop.wait(typeof loading === 'string' ? loading : undefined);
            }
            var handler;
            var promiss = new Promise(function (resolve, reject) {
                handler = wx.downloadFile(__assign({}, opts, { complete: function (res) {
                        wx.hideNavigationBarLoading();
                        pop.idle();
                        if (typeof res.tempFilePath === 'string') {
                            resolve(res.tempFilePath);
                        }
                        else {
                            reject(res.errMsg || "download file from " + opts.url + " failed!");
                        }
                    } }));
            });
            return new Network.DownloadTask(promiss, handler);
        };
    }
    Object.defineProperty(Network.prototype, "headers", {
        /**
         * @override point you shoud overwrite this property and provide you custom headers
         * @example
         * **示例代码*
         * ``
         * protected get headers(): any {
         *     return {
         *         token:'yourtoken',
         *         account:'youraccount'
         *     }
         * }
         * ``
         */
        get: function () {
            return {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "method", {
        /**
         * @override point you shoud overwrite this property and provide you custom headers
         * @example
         * **示例代码*
         * ``
         * protected get method(): any {
         *     return 'POST'
         * }
         * ``
         */
        get: function () {
            return 'POST';
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
    return Network;
}());
exports.Network = Network;
(function (Network) {
    var DataTask = /** @class */ (function () {
        function DataTask(promiss, handler) {
            var _this = this;
            this[Symbol.toStringTag] = 'Promise';
            this.then = function (onfulfilled, onrejected) {
                return _this.promiss.then(onfulfilled, onrejected);
            };
            this.catch = function (onrejected) {
                return _this.promiss.catch(onrejected);
            };
            this.abort = function () {
                _this.handler.abort();
            };
            this.onHeaders = function (func) {
                _this.handler.onHeadersReceived(func);
            };
            this.promiss = promiss;
            this.handler = handler;
        }
        return DataTask;
    }());
    Network.DataTask = DataTask;
    var UploadTask = /** @class */ (function (_super) {
        __extends(UploadTask, _super);
        function UploadTask(promiss, handler) {
            var _this = _super.call(this, promiss, handler) || this;
            _this.onProgress = function (callback) {
                var handler = _this['handler'];
                handler.onProgressUpdate(function (res) { return callback({
                    value: res.progress,
                    count: res.totalBytesSent,
                    total: res.totalBytesExpectedToSend,
                }); });
            };
            return _this;
        }
        return UploadTask;
    }(DataTask));
    Network.UploadTask = UploadTask;
    var DownloadTask = /** @class */ (function (_super) {
        __extends(DownloadTask, _super);
        function DownloadTask(promiss, handler) {
            var _this = _super.call(this, promiss, handler) || this;
            _this.onProgress = function (callback) {
                var handler = _this['handler'];
                handler.onProgressUpdate(function (res) { return callback({
                    value: res.progress,
                    count: res.totalBytesWritten,
                    total: res.totalBytesExpectedToWrite,
                }); });
            };
            return _this;
        }
        return DownloadTask;
    }(DataTask));
    Network.DownloadTask = DownloadTask;
})(Network = exports.Network || (exports.Network = {}));
exports.Network = Network;
var Socket = /** @class */ (function () {
    function Socket(builder) {
        var _this = this;
        this._status = 'closed';
        this._retrying = false;
        this.retryable = false;
        this.open = function () {
            if (_this._status === 'opened' || _this._status === 'opening' || typeof _this.buildurl !== 'function')
                return;
            var url = _this.buildurl();
            _this.task = wx.connectSocket({ url: url });
            _this.task.onOpen(function (res) { return _this.onOpenCallback(res); });
            _this.task.onError(function (res) { return _this.onErrorCallback(res); });
            _this.task.onMessage(function (res) { return _this.onMessageCallback(res); });
            _this.task.onClose(function (res) { return _this.onCloseCallback(res); });
            _this._status = 'opening';
        };
        this.close = function (code, reason) {
            if (!_this.task || _this._status === 'closed' || _this._status === 'closing')
                return;
            _this._status = 'closing';
            _this.task.close({
                code: code, reason: reason, fail: function () {
                    _this.onCloseCallback({ code: code, reason: reason });
                }
            });
        };
        this.send = function (data) {
            _this.task && _this.task.send({ data: data });
        };
        this.buildurl = builder;
        this.retry = new Socket.Retry(this.onRetryCallback.bind(this), this.onRetryFailed.bind(this));
    }
    Socket.prototype.onRetryCallback = function () {
        this.open();
        this._retrying = true;
    };
    Socket.prototype.onRetryFailed = function (e) {
        this._retrying = false;
        if (typeof this.onclose === 'function') {
            this.onclose(e, 'retry');
        }
    };
    Socket.prototype.onOpenCallback = function (header) {
        this._status = 'opened';
        if (typeof this.onopen === 'function') {
            this.onopen(header, this._retrying);
        }
        this._retrying = false;
    };
    Socket.prototype.onCloseCallback = function (e) {
        this._status = 'closed';
        if (this.retryable && e.code < 3000) {
            this.retry.attempt(e);
        }
        else if (typeof this.onclose === 'function') {
            this._retrying = false;
            var reason = 'server';
            if (e.reason === 'ping' || e.reason === 'user') {
                reason = e.reason;
            }
            this.onclose(e, reason);
        }
    };
    Socket.prototype.onErrorCallback = function (res) {
        if (typeof this.onerror === 'function') {
            this.onerror(res);
        }
    };
    Socket.prototype.onMessageCallback = function (res) {
        if (typeof this.onmessage === 'function') {
            this.onmessage(res);
        }
    };
    Object.defineProperty(Socket.prototype, "status", {
        get: function () { return this._status; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Socket.prototype, "isRetrying", {
        get: function () { return this._retrying; },
        enumerable: true,
        configurable: true
    });
    return Socket;
}());
exports.Socket = Socket;
(function (Socket) {
    var Observers = /** @class */ (function () {
        function Observers() {
            this.open = [];
            this.error = [];
            this.close = [];
            this.message = [];
        }
        return Observers;
    }());
    Socket.Observers = Observers;
    /**
     * @description A retry machine for web socket
     * @description You can use it in any place where need retry machine
     */
    var Retry = /** @class */ (function () {
        function Retry(attempt, failed) {
            var _this = this;
            /**
             * @description base attempt delay time @default 100 milliscond
             * @description the real delay time use a exponential random algorithm
             */
            this.delay = 100;
            /**
             * @description the max retry times when retrying @default 8
             */
            this.times = 8;
            this.count = 0; //已经尝试次数
            /**
             * @description reset retry times counter
             */
            this.reset = function () {
                _this.count = 0;
            };
            /**
             * @description use this method to trigger onAttempt action or onFailed action
             */
            this.attempt = function (evt) {
                if (_this.count < _this.times) {
                    setTimeout(function () { return _this.onAttempt(evt); }, _this.random(_this.count++, _this.delay));
                }
                else {
                    _this.onFailed(evt);
                }
            };
            this.onAttempt = attempt;
            this.onFailed = failed;
        }
        Retry.prototype.random = function (attempt, delay) {
            return Math.floor((0.5 + Math.random() * 0.5) * Math.pow(2, attempt) * delay);
        };
        return Retry;
    }());
    Socket.Retry = Retry;
    var Ping = /** @class */ (function () {
        function Ping(socket, allow) {
            if (allow === void 0) { allow = true; }
            var _this = this;
            this.timer = null;
            this.timeout = null;
            /**
             * @description desc the time interval of ping @default 30s
             */
            this.interval = 30;
            this.send = function () {
                if (!_this.allow || _this.timeout)
                    return;
                if (_this.socket.status !== 'opened')
                    return;
                var data = "{\"type\":\"PING\"}";
                _this.socket.send(data);
                sys.log('发送 PING:', data);
                _this.timeout = setTimeout(function () {
                    sys.log('PING 超时');
                    _this.timeout = null;
                    _this.socket.close(1006, 'ping');
                }, 3 * 1000);
            };
            this.receive = function (msg) {
                sys.log("收到 PONG", msg);
                if (!_this.allow || !_this.timeout)
                    return;
                clearTimeout(_this.timeout);
                _this.timeout = null;
            };
            this.start = function () {
                if (!_this.allow || _this.timer)
                    return;
                _this.timer = setInterval(_this.send.bind(_this), _this.interval * 1000);
            };
            this.stop = function () {
                if (!_this.allow || !_this.timer)
                    return;
                clearInterval(_this.timer);
                _this.timer = null;
            };
            this.allow = allow;
            this.socket = socket;
        }
        return Ping;
    }());
    Socket.Ping = Ping;
    /**
     * @description socket client wrapped on Socket
     * @description you must inherit this class to implements your logic
     * @implements client PING heartbeat mechanis
     */
    var Client = /** @class */ (function () {
        function Client() {
            var _this = this;
            /**
             * @notice all the observers will not be trigger
             * @notice you must trigger it yourself at overwrite point
             */
            this.observers = new Observers();
            this.on = function (evt, target, callback) {
                var idx = _this.observers[evt].findIndex(function (ele) { return ele.target === target; });
                if (idx === -1) {
                    _this.observers[evt].push({ callback: callback, target: target });
                }
            };
            this.off = function (evt, target) {
                var idx = _this.observers[evt].findIndex(function (ele) { return ele.target === target; });
                if (idx !== -1) {
                    _this.observers[evt].splice(idx, 1);
                }
            };
            this.stop = function () {
                if (_this.socket.status === 'closed' ||
                    _this.socket.status === 'closing') {
                    return;
                }
                _this.socket.retryable = false;
                _this.socket.close(1000, 'user');
                _this.ping.stop();
            };
            this.start = function () {
                if (!_this.isLogin ||
                    _this.socket.isRetrying ||
                    _this.socket.status === 'opened' ||
                    _this.socket.status === 'opening') {
                    return;
                }
                _this.socket.retry.reset();
                _this.socket.retryable = true;
                _this.socket.open();
                _this.ping.start();
            };
            this.socket = new Socket(function () { return _this.buildurl(); });
            this.ping = new Ping(this.socket, this.allowPing);
            this.socket.onopen = function (evt, isRetry) {
                sys.log('Socket Client Opend:evt=', evt);
                _this.onOpened(evt, isRetry);
            };
            this.socket.onerror = function (evt) {
                sys.warn('Socket Client Error:evt=', evt);
                _this.onError(evt);
            };
            this.socket.onmessage = function (evt) {
                sys.log('Socket Client received message:evt=', evt);
                if (typeof evt.data !== "string")
                    return;
                var msg = JSON.parse(evt.data);
                if (msg.type == "PONG") {
                    _this.ping.receive(msg);
                }
                else {
                    _this.onMessage(msg);
                }
            };
            this.socket.onclose = function (evt, reason) {
                sys.log('Socket Client closed:evt=', evt);
                _this.ping.stop();
                _this.onClosed(evt, reason);
            };
        }
        Object.defineProperty(Client.prototype, "isLogin", {
            /**
             * @description Tell me your login status @default false
             * @description If false the start method will not work
             */
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Client.prototype, "allowPing", {
            /** @description overwrite point set allow ping or not */
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        /** @description overwrite this method to provide url for web socket */
        Client.prototype.buildurl = function () { return ''; };
        /** call when some error occur @override point */
        Client.prototype.onError = function (res) { };
        /** call when socket opend . @override point */
        Client.prototype.onOpened = function (header, isRetry) { };
        /** call when socket closed . @override point */
        Client.prototype.onClosed = function (evt, reason) { };
        /** call when get some message @override point */
        Client.prototype.onMessage = function (msg) { };
        Object.defineProperty(Client.prototype, "status", {
            get: function () {
                return this.socket.status;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Client.prototype, "isConnected", {
            get: function () {
                return this.socket.status === 'opened';
            },
            enumerable: true,
            configurable: true
        });
        return Client;
    }());
    Socket.Client = Client;
})(Socket = exports.Socket || (exports.Socket = {}));
exports.Socket = Socket;
/**
 * @description a group of util methods
 */
var sys;
(function (sys) {
    sys.debug = true;
    /**
     * @description print info message when debug allow
     */
    sys.log = function () {
        if (sys.debug) {
            console.info.apply(console, arguments);
        }
    };
    /**
     * @description print wining message when debug allow
     */
    sys.warn = function () {
        if (sys.debug) {
            console.warn.apply(console, arguments);
        }
    };
    /**
     * @description call func safely
     * @usually  use for call callback function
     * @param func target function
     * @param args the @param func 's args
     * @notice thirArg of @param func is undefined
     */
    sys.call = function (func) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (typeof func === 'function') {
            func.apply(undefined, args);
        }
    };
    /**
     * @description check an value is an available string
     * @usually  use for form field verify
     * @notice only @param value is number or not empty string can pass
     * @param value witch to be verify
     */
    sys.okstr = function (value) {
        var type = typeof value;
        switch (type) {
            case 'string': return value.length !== 0;
            case 'number': return true;
            default: return false;
        }
    };
    /**
     * @description check an value is an available integer
     * @usually  use for form field verify
     * @notice only @param value is integer like can pass
     * @param value witch to be verify
     */
    sys.okint = function (value) {
        var type = typeof value;
        switch (type) {
            case 'string': return /^\d+$/.test(value);
            case 'number': return Number.isInteger(value);
            default: return false;
        }
    };
    /**
     * @description check an value is an available number
     * @usually  use for form field verify
     * @notice only @param value is number like can pass
     * @param value witch to be verify
     */
    sys.oknum = function (value) {
        var type = typeof value;
        switch (type) {
            case 'string': return /^\d+(\.\d+)?$/.test(value);
            case 'number': return true;
            default: return false;
        }
    };
})(sys = exports.sys || (exports.sys = {}));
var pop;
(function (pop) {
    /**
     * @description show wating mask
     * @param title the loading title @default '加载中'
     */
    pop.wait = function (title) {
        wx.showLoading({ title: title || '加载中', mask: true });
    };
    /**
     * @description hide the waiting mask .
     */
    pop.idle = function () {
        wx.hideLoading();
    };
    /**
     * @description to alert some err
     * @param err the err to be display
     */
    pop.error = function (err) {
        wx.showModal({ title: "提示", content: err.message || "服务异常", showCancel: false });
    };
    /**
     * @description alert user some message
     * @param content the message to be show
     * @param confirm  the confirm callback
     */
    pop.alert = function (content, confirm) {
        wx.showModal({ title: "提示", content: content, showCancel: false, success: confirm });
    };
    /**
     * @description the dialog that need user make a decision
     * @param content the message to be show
     * @param confirm  the confirm callback
     * @param cancel the cancel callback
     */
    pop.dialog = function (content, confirm, cancel) {
        wx.showModal({
            title: "提示", content: content, showCancel: true, success: function (res) {
                if (res.confirm) {
                    sys.call(confirm);
                }
                else if (res.cancel) {
                    sys.call(cancel);
                }
            }
        });
    };
    /**
     * @description remind some successful msg to user. It will be auto dimiss affter 1s
     * @param ok the ok message
     * @param dismiss the callback of affter auto dismiss
     */
    pop.remind = function (ok, dismiss) {
        wx.showToast({ title: ok, icon: "success", duration: 1000, mask: true });
        setTimeout(function () { return sys.call(dismiss); }, 1000);
    };
})(pop = exports.pop || (exports.pop = {}));
var orm;
(function (orm) {
    var FIELD_KEY = '__orm_field';
    var CLASS_KEY = '__orm_class';
    var INDEX_KEY = '__orm_index';
    var stored = {};
    function awake(cls, json) {
        if (!json)
            return undefined;
        var obj = new cls();
        Object.assign(obj, json);
        var fields = cls[FIELD_KEY];
        if (fields) {
            var _loop_2 = function (field_1) {
                var subjson = obj[field_1];
                if (!subjson)
                    return "continue";
                if (Array.isArray(subjson)) {
                    obj[field_1] = subjson.map(function (json) {
                        return awake(fields[field_1], json);
                    });
                }
                else {
                    obj[field_1] = awake(fields[field_1], subjson);
                }
            };
            for (var field_1 in fields) {
                _loop_2(field_1);
            }
        }
        return obj;
    }
    function getClskey(cls) {
        var clskey = cls && cls[CLASS_KEY];
        if (!clskey) {
            throw new Error("The Class:" + cls.name + " did't  mark with decorate @store(clsname,primary)");
        }
        return clskey;
    }
    function getIdxkey(cls) {
        var idxkey = cls && cls[INDEX_KEY];
        if (!idxkey) {
            throw new Error("The privkey:" + idxkey + " of " + cls.name + " is invalid!");
        }
        return idxkey;
    }
    function getObjkey(clskey, id) {
        if (!clskey || !id)
            return null;
        return clskey + "." + id;
    }
    /**
     * @description  A class decorate use to store class.
     * @param clsname the class name of your storage class
     * @param primary the primary key name of your storage class
     * @throws class already exist error.
     */
    orm.store = function (clskey, idxkey) {
        if (!sys.okstr(clskey)) {
            throw new Error("The clskey:" + clskey + " invalid!");
        }
        if (!sys.okstr(idxkey)) {
            throw new Error("The privkey:" + idxkey + " invalid!");
        }
        if (stored[clskey]) {
            throw new Error("The clskey:" + clskey + " already exist!!You can't mark different class with same name!!");
        }
        stored[clskey] = true;
        return function (target) {
            target[CLASS_KEY] = clskey;
            target[INDEX_KEY] = idxkey;
        };
    };
    /**
     * @description  A property decorate to mark a field  also a store class.
     * @param cls the class of field.
     */
    orm.field = function (cls) {
        return function (target, field) {
            var fields = target.constructor[FIELD_KEY] || (target.constructor[FIELD_KEY] = {});
            fields[field] = cls;
        };
    };
    /**
     * @description save an storage able class.
     * @param model the model class must be mark with @store(...)
     * @throws did't mark error
     */
    orm.save = function (model) {
        if (!model)
            return;
        var clskey = getClskey(model.constructor);
        var idxkey = getIdxkey(model.constructor);
        var objkey = getObjkey(clskey, model[idxkey]);
        var keys = wx.getStorageSync(clskey) || {};
        keys[objkey] = '';
        wx.setStorageSync(clskey, keys);
        wx.setStorageSync(objkey, model);
    };
    /**
     * @description find an storaged object whith id.
     * @param cls the storage class witch must be mark with @store(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    orm.find = function (cls, id) {
        var clskey = getClskey(cls);
        var objkey = getObjkey(clskey, id);
        return awake(cls, wx.getStorageSync(objkey));
    };
    /**
     * @description find all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    orm.all = function (cls) {
        var clskey = getClskey(cls);
        var keys = wx.getStorageSync(clskey);
        if (!keys)
            return [];
        var result = [];
        for (var key in keys) {
            var obj = awake(cls, wx.getStorageSync(key));
            if (obj) {
                result.push(obj);
            }
        }
        return result;
    };
    /**
     * @description get the count of all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    orm.count = function (cls) {
        var clskey = getClskey(cls);
        var keys = wx.getStorageSync(clskey);
        return keys ? Object.keys(keys).length : 0;
    };
    /**
     * @description remove all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    orm.clear = function (cls) {
        var clskey = getClskey(cls);
        var keys = wx.getStorageSync(clskey);
        if (keys) {
            for (var key in keys) {
                wx.removeStorageSync(key);
            }
            wx.removeStorageSync(clskey);
        }
    };
    /**
     * @description remove an special storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    orm.remove = function (cls, id) {
        var clskey = getClskey(cls);
        var objkey = getObjkey(clskey, id);
        wx.removeStorageSync(objkey);
    };
})(orm = exports.orm || (exports.orm = {}));
