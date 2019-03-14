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
        var global = {};
        Object.assign(global, globalData, inital, param.data);
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
        var global = {};
        Object.assign(global, globalData, inital, result.data);
        Object.assign(result, { data: global });
        Component(result);
    };
}
exports.widget = widget;
var Network = /** @class */ (function () {
    function Network() {
        var _this = this;
        this.upload = function (file, options) {
            wx.showNavigationBarLoading();
            if (options && options.loading)
                pop.waiting(typeof options.loading === 'string' ? options.loading : undefined);
            return new Promise(function (resolve, reject) {
                wx.uploadFile({
                    name: file.name,
                    header: _this.headers,
                    url: _this.url(file.path),
                    filePath: file.file,
                    complete: function (res) {
                        wx.hideNavigationBarLoading();
                        if (options && options.loading)
                            pop.idling();
                        try {
                            res.data = JSON.parse(res.data);
                            var value = _this.resolve(res);
                            resolve(value);
                        }
                        catch (error) {
                            reject(error);
                        }
                    },
                });
            });
        };
        this.anyreq = function (req) {
            return _this.anytask(req.path, req.data, req.options);
        };
        this.objreq = function (req) {
            if (typeof req.meta !== 'function')
                throw new Error('the req of objreq must be Function');
            return _this.objtask(req.meta, req.path, req.data, req.options);
        };
        this.aryreq = function (req) {
            if (typeof req.meta !== 'function')
                throw new Error('the req of aryreq must be Function');
            return _this.arytask(req.meta, req.path, req.data, req.options);
        };
        this.anytask = function (path, data, options) {
            wx.showNavigationBarLoading();
            if (options && options.loading)
                pop.waiting(typeof options.loading === 'string' ? options.loading : undefined);
            return new Promise(function (resolve, reject) {
                wx.request({
                    url: _this.url(path),
                    header: _this.headers,
                    data: data,
                    method: options && options.method ? options.method : _this.method,
                    complete: function (result) {
                        wx.hideNavigationBarLoading();
                        if (options && options.loading)
                            pop.idling();
                        try {
                            var value = _this.resolve(result);
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
        };
        this.objtask = function (c, path, data, options) {
            wx.showNavigationBarLoading();
            if (options && options.loading)
                pop.waiting(typeof options.loading === 'string' ? options.loading : undefined);
            return new Promise(function (resolve, reject) {
                wx.request({
                    url: _this.url(path),
                    header: _this.headers,
                    data: data,
                    method: options && options.method ? options.method : _this.method,
                    complete: function (result) {
                        wx.hideNavigationBarLoading();
                        if (options && options.loading)
                            pop.idling();
                        try {
                            var value = _this.resolve(result);
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
        };
        this.arytask = function (c, path, data, options) {
            wx.showNavigationBarLoading();
            if (options && options.loading)
                pop.waiting(typeof options.loading === 'string' ? options.loading : undefined);
            return new Promise(function (resolve, reject) {
                wx.request({
                    url: _this.url(path),
                    header: _this.headers,
                    data: data,
                    method: options && options.method ? options.method : _this.method,
                    complete: function (result) {
                        wx.hideNavigationBarLoading();
                        if (options && options.loading)
                            pop.idling();
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
    }
    Object.defineProperty(Network.prototype, "headers", {
        get: function () {
            return {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "method", {
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
        if (typeof this.onfailed === 'function') {
            this.onfailed(e);
        }
    };
    Socket.prototype.onOpenCallback = function (header) {
        this._status = 'opened';
        if (typeof this.onopen === 'function') {
            this.onopen(header, this._retrying);
        }
        this._retrying = false;
    };
    Socket.prototype.onCloseCallback = function (res) {
        this._status = 'closed';
        if (this.retryable && res.code < 3000) {
            this.retry.attempt(res);
        }
        else if (typeof this.onclose === 'function') {
            this._retrying = false;
            this.onclose(res);
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
            this.failed = [];
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
                console.log('发送 PONG:', data);
                _this.timeout = setTimeout(function () {
                    console.log('PING 超时');
                    _this.timeout = null;
                    _this.socket.close(1006);
                }, 3 * 1000);
            };
            this.receive = function (msg) {
                console.log("收到 PONG", msg);
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
                _this.socket.close(1000);
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
                console.log('Socket Client 连接已打开！', evt);
                _this.onOpened(evt, isRetry);
            };
            this.socket.onerror = function (evt) {
                console.log('Socket Client 连接打开失败，请检查！', evt);
                _this.onError(evt);
            };
            this.socket.onmessage = function (evt) {
                console.log('Socket Client 收到消息：', evt);
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
            this.socket.onclose = function (evt) {
                console.log('Socket Client  已关闭！', evt);
                _this.ping.stop();
                _this.onClosed(evt);
            };
            this.socket.onfailed = function (etv) {
                console.log('Socket Client 重连超时！');
                _this.ping.stop();
                _this.onFailed(etv);
            };
        }
        Object.defineProperty(Client.prototype, "isDebug", {
            /**
             * @override print debug info or not @default true
             */
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
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
            /**
             * @description overwrite point set allow ping or not
             */
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @override point
         * @description overwrite this method to provide url for web socket
         */
        Client.prototype.buildurl = function () { return ''; };
        /** call when some error occur @override point */
        Client.prototype.onError = function (res) { };
        /** call when socket closed . @override point */
        Client.prototype.onOpened = function (res, isRetry) { };
        /**
         * @override point
         * @description call when socket closed
         * @notice onFailed and onClosed only trigger one
         */
        Client.prototype.onClosed = function (res) { };
        /**
         * @override point
         * @description call when socket retry failed
         * @notice onFailed and onClosed only trigger one
         */
        Client.prototype.onFailed = function (res) { };
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
var SocketClient = /** @class */ (function () {
    function SocketClient() {
        var _this = this;
        this._isConnected = false;
        this._isConnecting = false;
        this.observers = new Socket.Observers();
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
                _this.onOpened(res);
            });
            _this.task.onError(function (res) {
                _this.log('WebSocket连接打开失败，请检查！', res);
                _this._isConnected = false;
                _this._isConnecting = false;
                _this.onError(res);
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
                if (_this.isAuthFail(res)) {
                    _this.stop();
                    _this.onAuthFail();
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
                pop.alert('网络连接失败，请重试', function () { return _this.reattemp(); });
                _this.onFailed();
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
            _this.task = wx.connectSocket({ url: _this._url });
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
            _this.onMessage(msg, isOffline);
            _this.observers.message.forEach(function (ele) { return ele.callback.call(ele.target); });
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
        /**
         * @description start the socket monitor.
         * try to connect the socket server.
         * the heartbeat mechanism will be work
         */
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
        /**
         * @description stop the socket monitor.
         * stop heartbeat mechanism
         */
        this.stop = function () {
            if (!_this.timer) {
                return;
            }
            clearInterval(_this.timer);
            _this.timer = null;
            _this.close();
        };
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
    }
    SocketClient.prototype.log = function (msg, other) {
        if (this.isDebug) {
            console.log(msg, other || '');
        }
    };
    /**
     * subclass must impl this method to resolve url
     * you must provide connect url
     */
    SocketClient.prototype.setURL = function (url) {
        this._url = url;
    };
    Object.defineProperty(SocketClient.prototype, "isLogin", {
        /**
         * @default false
         * @description you mast tell me the login status
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SocketClient.prototype, "isDebug", {
        /**
         * @default true
         * @description print debug info or not
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
    SocketClient.prototype.isAuthFail = function (res) {
        return res.code === 4001 || res.code === 4002;
    };
    /** call when some error occur */
    SocketClient.prototype.onError = function (res) {
    };
    /** call when socket closed .  */
    SocketClient.prototype.onOpened = function (res) {
    };
    /** call when socket closed */
    SocketClient.prototype.onClosed = function (res) {
    };
    /** call when socket retry failed */
    SocketClient.prototype.onFailed = function () {
    };
    /** call when get some message */
    SocketClient.prototype.onMessage = function (msg, isOffline) {
    };
    /** call when isAuthFail is true when close */
    SocketClient.prototype.onAuthFail = function () {
    };
    Object.defineProperty(SocketClient.prototype, "isConnected", {
        get: function () {
            return this._isConnected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SocketClient.prototype, "isConnecting", {
        get: function () {
            return this._isConnecting;
        },
        enumerable: true,
        configurable: true
    });
    return SocketClient;
}());
exports.SocketClient = SocketClient;
var pop;
(function (pop) {
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
                if (res.confirm && typeof confirm === 'function') {
                    confirm();
                }
                else if (res.cancel && typeof cancel === 'function') {
                    cancel();
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
        setTimeout(function () {
            if (typeof dismiss === 'function') {
                dismiss();
            }
        }, 1000);
    };
    /**
     * @description to alert some err
     * @param err the err to be display
     */
    pop.error = function (err) {
        wx.showModal({ title: "提示", content: err.message || "服务异常", showCancel: false });
    };
    /**
     * @description show wating mask
     * @param title the loading title @default '加载中'
     */
    pop.waiting = function (title) {
        wx.showLoading({ title: title || '加载中', mask: true });
    };
    /**
     * @description hide the waiting mask .
     */
    pop.idling = function () {
        wx.hideLoading();
    };
})(pop = exports.pop || (exports.pop = {}));
var orm;
(function (orm) {
    var stored = {};
    function awake(cls, json) {
        if (!json)
            return undefined;
        var obj = new cls();
        Object.assign(obj, json);
        var fields = cls['sg_fields'];
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
    /**
     * @description  A class decorate use to store class.
     * @param clsname the class name of your storage class
     * @param primary the primary key name of your storage class
     * @throws class already exist error.
     */
    orm.store = function (clsname, primary) {
        if (stored[clsname]) {
            throw new Error("The clsname:" + clsname + " already exist!!You can't mark different class with same name!!");
        }
        stored[clsname] = true;
        return function (target) {
            target['sg_clsname'] = clsname;
            target['sg_primary'] = primary;
        };
    };
    /**
     * @description  A property decorate to mark a field  also a store class.
     * @param cls the class of field.
     */
    orm.field = function (cls) {
        return function (target, field) {
            var fields = target.constructor['sg_fields'] || (target.constructor['sg_fields'] = {});
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
        var classkey = model.constructor['sg_clsname'];
        var primary = model.constructor['sg_primary'];
        if (!classkey || !primary) {
            throw new Error("The Class:" + model.constructor.name + " did't  mark with decorate @store(clsname,primary)");
        }
        var id = model[primary];
        if (id === undefined || id === null)
            return;
        var key = classkey + "." + id;
        var keys = wx.getStorageSync(classkey) || {};
        keys[key] = '';
        wx.setStorageSync(classkey, keys);
        wx.setStorageSync(key, model);
    };
    /**
     * @description find an storaged object whith id.
     * @param cls the storage class witch must be mark with @store(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    orm.find = function (cls, id) {
        var classkey = cls['sg_clsname'];
        if (!classkey) {
            throw new Error("The Class:" + cls.name + " did't  mark with decorate @store(clsname,primary)");
        }
        if (!id)
            return;
        var json = wx.getStorageSync(classkey + "." + id);
        return awake(cls, json);
    };
    /**
     * @description find all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    orm.all = function (cls) {
        var classkey = cls['sg_clsname'];
        if (!classkey) {
            throw new Error("The Class:" + cls.name + " did't  mark with decorate @store(clsname,primary)");
        }
        var keys = wx.getStorageSync(classkey);
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
        var classkey = cls['sg_clsname'];
        if (!classkey) {
            throw new Error("The Class:" + cls.name + " did't  mark with decorate @store(clsname,primary)");
        }
        var keys = wx.getStorageSync(classkey);
        return keys ? Object.keys(keys).length : 0;
    };
    /**
     * @description remove all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    orm.clear = function (cls) {
        var classkey = cls['sg_clsname'];
        if (!classkey) {
            throw new Error("The Class:" + cls.name + " did't  mark with decorate @store(clsname,primary)");
        }
        var keys = wx.getStorageSync(classkey);
        if (keys) {
            for (var key in keys) {
                wx.removeStorageSync(key);
            }
            wx.removeStorageSync(classkey);
        }
    };
    /**
     * @description remove an special storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    orm.remove = function (cls, id) {
        var classkey = cls['sg_clsname'];
        if (!classkey) {
            throw new Error("The Class:" + cls.name + " did't  mark with decorate @store(clsname,primary)");
        }
        if (!id)
            return;
        wx.removeStorageSync(classkey + "." + id);
    };
})(orm = exports.orm || (exports.orm = {}));
