'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var ns = wx || exports;
var __extends = (function() {
    var extendStatics = function(d, b) {
        extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
                function(d, b) {
                    d.__proto__ = b;
                }) ||
            function(d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return extendStatics(d, b);
    };
    return function(d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
})();

(function() {
    'use strict';
    Number.prototype.fixlen = function(len) {
        if (typeof len !== 'number' || len < 1) {
            len = 2;
        }
        return (Array(len).join('0') + this).slice(-len);
    };
    Number.prototype.round = function(len) {
        if (typeof len !== 'number' || len < 0) {
            len = 0;
        }
        var pow = Math.pow(10, len);
        return Math.round(this * pow) / pow;
    };
    Number.prototype.floor = function(len) {
        if (typeof len !== 'number' || len < 0) {
            len = 0;
        }
        var pow = Math.pow(10, len);
        return Math.floor(this * pow) / pow;
    };
    Number.prototype.ceil = function(len) {
        if (typeof len !== 'number' || len < 0) {
            len = 0;
        }
        var pow = Math.pow(10, len);
        return Math.ceil(this * pow) / pow;
    };
    Number.prototype.comma = function() {
        var str = this.toString();
        var strary = str.split('.');
        var head = strary[0];
        var result = '';
        if (head.length <= 3) {
            result = head || '0';
        } else {
            while (head.length > 3) {
                result = ',' + head.slice(-3) + result;
                head = head.slice(0, head.length - 3);
            }
            result = head + result;
        }
        if (strary.length > 1) {
            result = result + '.' + (strary[1] || '0');
        }
        return result;
    };
    Object.defineProperty(Number.prototype, 'symidx', {
        get: function() {
            if (this > 3 && this <= 20) {
                return 'th';
            }
            switch (this % 10) {
                case 1:
                    return 'st';
                case 2:
                    return 'nd';
                case 3:
                    return 'rd';
                default:
                    return 'th';
            }
        },
        enumerable: true,
        configurable: true
    });
    String.prototype.fixlen = function(len) {
        if (typeof len !== 'number' || len < 1) {
            len = 2;
        }
        return (Array(len).join('0') + this).slice(-len);
    };
    String.prototype.parsed = function() {
        var result = {};
        if (this.length == 0) return result;
        var strs = this.split('?');
        var ary = strs[0].split('://');
        if (ary.length < 2) return result;
        result.schema = ary[0];
        var sary = ary[1].split('/');
        result.host = sary[0];
        if (sary.length > 1) result.query = sary[sary.length - 1];
        if (strs.length < 2) return result;
        var paramStrs = strs[1].split('&');
        for (var index = 0; index < paramStrs.length; index++) {
            var keys = paramStrs[index].split('=');
            if (keys.length < 2) continue;
            var key = keys[0];
            var value = keys[1];
            if (key) result[key] = value;
        }
        return result;
    };
    Object.defineProperty(Array.prototype, 'first', {
        get: function() {
            if (this.length > 0) {
                return this[0];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Array.prototype, 'last', {
        get: function() {
            if (this.length > 0) {
                return this[this.length - 1];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Array.prototype, 'ranidx', {
        get: function() {
            if (this.length === 0) return -1;
            return Math.floor(Math.random() * this.length);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Array.prototype, 'random', {
        get: function() {
            return this[this.ranidx];
        },
        enumerable: true,
        configurable: true
    });
    Array.prototype.insert = function(obj, index) {
        if (typeof index !== 'number') return;
        if (index < 0 || index > this.length) return;
        this.splice(index, 0, obj);
    };
    Array.prototype.append = function(ary) {
        return this.push.apply(this, ary);
    };
    Array.prototype.remove = function(index) {
        if (typeof index !== 'number') return undefined;
        if (index < 0 || index >= this.length) return undefined;
        return this.splice(index, 1)[0];
    };
    Array.prototype.delete = function(item) {
        if (this.length === 0) return -1;
        var idx = this.findIndex(function(ele) {
            return ele === item;
        });
        this.remove(idx);
        return idx;
    };
    Array.prototype.contains = function(item) {
        if (this.length === 0) return false;
        var idx = this.findIndex(function(ele) {
            return ele === item;
        });
        return idx >= 0;
    };
    Date.prototype.format = function(fmt) {
        var o = {
            'M+': this.getMonth() + 1, //月份
            'd+': this.getDate(), //日
            'h+': this.getHours(), //小时
            'm+': this.getMinutes(), //分
            's+': this.getSeconds() //秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        return fmt;
    };
    Object.defineProperty(Date.prototype, 'hhmmss', {
        get: function() {
            var h = this.getUTCHours();
            var m = this.getUTCMinutes();
            var s = this.getUTCSeconds();
            return h.fixlen(2) + ':' + m.fixlen(2) + ':' + s.fixlen(2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Date.prototype, 'hhmm', {
        get: function() {
            var h = this.getUTCHours();
            var m = this.getUTCMinutes();
            return h.fixlen(2) + ':' + m.fixlen(2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Date.prototype, 'mmss', {
        get: function() {
            var h = this.getUTCMinutes();
            var m = this.getUTCSeconds();
            return h.fixlen(2) + ':' + m.fixlen(2);
        },
        enumerable: true,
        configurable: true
    });
})();

(function(ns) {
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
    ns.app = function(global) {
        if (globalData) {
            throw new Error('you can only register one app!!!!');
        }
        globalData = global || {};
        return function(target) {
            App(trim(new target()));
        };
    };
    ns.App = function() {};
    ns.page = function(inital) {
        return function(target) {
            var param = new target();
            var data = {};
            Object.assign(data, globalData, inital, param.data);
            Object.assign(param, { data: data });
            Page(trim(param));
        };
    };
    ns.Page = function() {};
    ns.Widget = function() {};
    var keys = ['properties', 'data', 'behaviors', 'created', 'attached', 'ready', 'moved', 'detached', 'relations', 'externalClasses'];
    ns.widget = function(inital) {
        return function(target) {
            var param = new target();
            var result = { methods: {} };
            for (var key in param) {
                if (keys.contains(key)) {
                    result[key] = param[key];
                } else if (key !== 'constructor') {
                    result.methods[key] = param[key];
                }
            }
            var data = {};
            Object.assign(data, inital, result.data);
            Object.assign(result, { data: data });
            Component(result);
        };
    };
})(ns);

var sys;
var pop;

(function(ns) {
    var Network = (function() {
        function Network() {
            var _this = this;
            this.anyreq = function(req) {
                return _this.anytask(req.path, req.data, req.options);
            };
            this.objreq = function(req) {
                if (typeof req.meta !== 'function') throw new Error('the meta of objreq must be a class value');
                return _this.objtask(req.meta, req.path, req.data, req.options);
            };
            this.aryreq = function(req) {
                if (typeof req.meta !== 'function') throw new Error('the meta of aryreq must be class value');
                return _this.arytask(req.meta, req.path, req.data, req.options);
            };
            this.upload = function(file, options) {
                ns.showNavigationBarLoading();
                var loading = options && options.loading;
                if (options && options.loading) {
                    pop.wait(typeof loading === 'string' ? loading : undefined);
                }
                var handler;
                var promiss = new Promise(function(resolve, reject) {
                    handler = ns.uploadFile({
                        name: file.name,
                        header: _this.headers,
                        url: _this.url(file.path),
                        filePath: file.file,
                        formData: file.data,
                        complete: function(res) {
                            ns.hideNavigationBarLoading();
                            pop.idle();
                            try {
                                res.data = JSON.parse(res.data);
                                var parser = (options && options.parser) || _this.resolve.bind(_this);
                                var value = parser(res);
                                resolve(value);
                            } catch (error) {
                                reject(error);
                            }
                        }
                    });
                });
                return new Network.UploadTask(promiss, handler);
            };
            this.anytask = function(path, data, options) {
                ns.showNavigationBarLoading();
                var loading = options && options.loading;
                if (options && options.loading) {
                    pop.wait(typeof loading === 'string' ? loading : undefined);
                }
                var handler;
                var promiss = new Promise(function(resolve, reject) {
                    handler = ns.request({
                        url: _this.url(path),
                        header: _this.headers,
                        data: data,
                        method: (options && options.method) || _this.method,
                        complete: function(result) {
                            ns.hideNavigationBarLoading();
                            if (options && options.loading) pop.idle();
                            try {
                                var parser = (options && options.parser) || _this.resolve.bind(_this);
                                var value = parser(result);
                                if (options && options.timestamp && value && result.header && result.header.Date) {
                                    value.timestamp = new Date(result.header.Date).getTime();
                                }
                                resolve(value);
                            } catch (error) {
                                reject(error);
                            }
                        }
                    });
                });
                return new Network.DataTask(promiss, handler);
            };
            this.objtask = function(c, path, data, options) {
                ns.showNavigationBarLoading();
                var loading = options && options.loading;
                if (options && options.loading) {
                    pop.wait(typeof loading === 'string' ? loading : undefined);
                }
                var handler;
                var promiss = new Promise(function(resolve, reject) {
                    handler = ns.request({
                        url: _this.url(path),
                        header: _this.headers,
                        data: data,
                        method: (options && options.method) || _this.method,
                        complete: function(result) {
                            ns.hideNavigationBarLoading();
                            if (options && options.loading) pop.idle();
                            try {
                                var parser = (options && options.parser) || _this.resolve.bind(_this);
                                var value = parser(result);
                                if (options && options.timestamp && value && result.header && result.header.Date) {
                                    value.timestamp = new Date(result.header.Date).getTime();
                                }
                                resolve(new c(value));
                            } catch (error) {
                                reject(error);
                            }
                        }
                    });
                });
                return new Network.DataTask(promiss, handler);
            };
            this.arytask = function(c, path, data, options) {
                ns.showNavigationBarLoading();
                var loading = options && options.loading;
                if (options && options.loading) {
                    pop.wait(typeof loading === 'string' ? loading : undefined);
                }
                var handler;
                var promiss = new Promise(function(resolve, reject) {
                    handler = ns.request({
                        url: _this.url(path),
                        header: _this.headers,
                        data: data,
                        method: (options && options.method) || _this.method,
                        complete: function(result) {
                            ns.hideNavigationBarLoading();
                            if (options && options.loading) pop.idle();
                            try {
                                var parser = (options && options.parser) || _this.resolve.bind(_this);
                                var value = parser(result);
                                if (value && value.length > 0) {
                                    resolve(
                                        value.map(function(e) {
                                            return new c(e);
                                        })
                                    );
                                } else {
                                    resolve([]);
                                }
                            } catch (error) {
                                reject(error);
                            }
                        }
                    });
                });
                return new Network.DataTask(promiss, handler);
            };
            this.download = function(params, options) {
                ns.showNavigationBarLoading();
                var loading = options && options.loading;
                if (options && options.loading) {
                    pop.wait(typeof loading === 'string' ? loading : undefined);
                }
                var handler;
                var promiss = new Promise(function(resolve, reject) {
                    handler = ns.downloadFile(
                        Object.assign(params, {
                            complete: function(res) {
                                ns.hideNavigationBarLoading();
                                pop.idle();
                                if (typeof res.tempFilePath === 'string') {
                                    resolve(res.tempFilePath);
                                } else {
                                    reject(res.errMsg || 'download file from ' + params.url + ' failed!');
                                }
                            }
                        })
                    );
                });
                return new Network.DownloadTask(promiss, handler);
            };
            this.maptask = function(meta, path, data, options) {
                ns.showNavigationBarLoading();
                var loading = options && options.loading;
                if (options && options.loading) {
                    pop.wait(typeof loading === 'string' ? loading : undefined);
                }
                var handler;
                var promiss = new Promise(function(resolve, reject) {
                    handler = ns.request({
                        url: _this.url(path),
                        header: _this.headers,
                        data: data,
                        method: (options && options.method) || _this.method,
                        complete: function(result) {
                            ns.hideNavigationBarLoading();
                            if (options && options.loading) pop.idle();
                            try {
                                var parser = (options && options.parser) || _this.resolve.bind(_this);
                                var value = parser(result);
                                var mapkey = (options && options.mapkey) || 'id';
                                var map = {};
                                if (Array.isArray(value)) {
                                    value.forEach(function(ele) {
                                        var obj = new meta(ele);
                                        var keyvalue = obj[mapkey];
                                        if (keyvalue) {
                                            map[keyvalue] = obj;
                                        } else {
                                            sys.warn('the mapkey:', mapkey, 'not exist in object:', obj);
                                        }
                                    });
                                }
                                if (typeof value === 'object') {
                                    for (var key in value) {
                                        if (value.hasOwnProperty(key)) {
                                            var obj = new meta(value[key]);
                                            var keyvalue = obj[mapkey];
                                            if (keyvalue === key) {
                                                map[keyvalue] = obj;
                                            } else {
                                                sys.warn('the mapkey:', mapkey, 'not exist in object:', obj);
                                            }
                                        }
                                    }
                                }
                                resolve(map);
                            } catch (error) {
                                reject(error);
                            }
                        }
                    });
                });
                return new Network.DataTask(promiss, handler);
            };
        }
        Object.defineProperty(Network.prototype, 'headers', {
            get: function() {
                return {};
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Network.prototype, 'method', {
            get: function() {
                return 'POST';
            },
            enumerable: true,
            configurable: true
        });
        return Network;
    })();
    (function(Network) {
        var DataTask = /** @class */ (function() {
            function DataTask(promiss, handler) {
                var _this = this;
                this[Symbol.toStringTag] = 'Promise';
                this.then = function(onfulfilled, onrejected) {
                    return _this.promiss.then(onfulfilled, onrejected);
                };
                this.catch = function(onrejected) {
                    return _this.promiss.catch(onrejected);
                };
                this.abort = function() {
                    _this.handler.abort();
                };
                this.onHeaders = function(func) {
                    _this.handler.onHeadersReceived(func);
                };
                this.promiss = promiss;
                this.handler = handler;
            }
            return DataTask;
        })();
        Network.DataTask = DataTask;
        var UploadTask = /** @class */ (function(_super) {
            __extends(UploadTask, _super);
            function UploadTask(promiss, handler) {
                var _this = _super.call(this, promiss, handler) || this;
                _this.onProgress = function(callback) {
                    var handler = _this['handler'];
                    handler.onProgressUpdate(function(res) {
                        return callback({
                            value: res.progress,
                            count: res.totalBytesSent,
                            total: res.totalBytesExpectedToSend
                        });
                    });
                };
                return _this;
            }
            return UploadTask;
        })(DataTask);
        Network.UploadTask = UploadTask;
        var DownloadTask = /** @class */ (function(_super) {
            __extends(DownloadTask, _super);
            function DownloadTask(promiss, handler) {
                var _this = _super.call(this, promiss, handler) || this;
                _this.onProgress = function(callback) {
                    var handler = _this['handler'];
                    handler.onProgressUpdate(function(res) {
                        return callback({
                            value: res.progress,
                            count: res.totalBytesWritten,
                            total: res.totalBytesExpectedToWrite
                        });
                    });
                };
                return _this;
            }
            return DownloadTask;
        })(DataTask);
        Network.DownloadTask = DownloadTask;
    })(Network);
    ns.Network = Network;

    var Socket = (function() {
        function Socket(builder) {
            var _this = this;
            this._status = 'closed';
            this._retrying = false;
            this.retryable = false;
            this.open = function() {
                if (_this._status === 'opened' || _this._status === 'opening' || typeof _this.buildurl !== 'function') return;
                var url = _this.buildurl();
                _this.task = ns.connectSocket({ url: url });
                _this.task.onOpen(function(res) {
                    return _this.onOpenCallback(res);
                });
                _this.task.onError(function(res) {
                    return _this.onErrorCallback(res);
                });
                _this.task.onMessage(function(res) {
                    return _this.onMessageCallback(res);
                });
                _this.task.onClose(function(res) {
                    return _this.onCloseCallback(res);
                });
                _this._status = 'opening';
            };
            this.close = function(code, reason) {
                if (!_this.task || _this._status === 'closed' || _this._status === 'closing') return;
                _this._status = 'closing';
                _this.task.close({
                    code: code,
                    reason: reason,
                    fail: function() {
                        _this.onCloseCallback({ code: code, reason: reason });
                    }
                });
            };
            this.send = function(data) {
                _this.task && _this.task.send({ data: data });
            };
            this.buildurl = builder;
            this.retry = new Socket.Retry(this.onRetryCallback.bind(this), this.onRetryFailed.bind(this));
        }
        Socket.prototype.onRetryCallback = function() {
            this.open();
            this._retrying = true;
        };
        Socket.prototype.onRetryFailed = function(e) {
            this._retrying = false;
            if (typeof this.onclose === 'function') {
                this.onclose(e, 'retry');
            }
        };
        Socket.prototype.onOpenCallback = function(header) {
            this._status = 'opened';
            if (typeof this.onopen === 'function') {
                this.onopen(header, this._retrying);
            }
            this._retrying = false;
        };
        Socket.prototype.onCloseCallback = function(e) {
            this._status = 'closed';
            if (this.retryable && e.code < 3000) {
                this.retry.attempt(e);
            } else if (typeof this.onclose === 'function') {
                this._retrying = false;
                var reason = 'server';
                if (e.reason === 'ping' || e.reason === 'user') {
                    reason = e.reason;
                }
                this.onclose(e, reason);
            }
        };
        Socket.prototype.onErrorCallback = function(res) {
            if (typeof this.onerror === 'function') {
                this.onerror(res);
            }
        };
        Socket.prototype.onMessageCallback = function(res) {
            if (typeof this.onmessage === 'function') {
                this.onmessage(res);
            }
        };
        Object.defineProperty(Socket.prototype, 'status', {
            get: function() {
                return this._status;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Socket.prototype, 'isRetrying', {
            get: function() {
                return this._retrying;
            },
            enumerable: true,
            configurable: true
        });
        return Socket;
    })();
    (function(Socket) {
        var Observers = (function() {
            function Observers() {
                this.open = [];
                this.error = [];
                this.close = [];
                this.message = [];
            }
            return Observers;
        })();
        Socket.Observers = Observers;
        var Retry = (function() {
            function Retry(attempt, failed) {
                var _this = this;
                this.delay = 100;
                this.chance = 8;
                this.count = 0;
                this.allow = true;
                this.reset = function() {
                    _this.count = 0;
                };
                this.attempt = function(evt) {
                    if (this.allow && _this.count < _this.chance) {
                        setTimeout(function() {
                            return _this.onAttempt(evt);
                        }, _this.random(_this.count++, _this.delay));
                    } else {
                        _this.onFailed(evt);
                    }
                };
                this.onAttempt = attempt;
                this.onFailed = failed;
            }
            Retry.prototype.random = function(attempt, delay) {
                return Math.floor((0.5 + Math.random() * 0.5) * Math.pow(2, attempt) * delay);
            };
            return Retry;
        })();
        Socket.Retry = Retry;
        var Ping = (function() {
            function Ping(socket) {
                var _this = this;
                this.allow = true;
                this.timer = null;
                this.timeout = null;
                this.interval = 30;
                this.socket = socket;
                this.send = function() {
                    if (_this.timeout) return;
                    if (_this.socket.status !== 'opened') return;
                    var data = '{"type":"PING"}';
                    _this.socket.send(data);
                    sys.log('Send PING:', data);
                    _this.timeout = setTimeout(function() {
                        sys.log('PING timeout');
                        _this.timeout = null;
                        _this.socket.close(1006, 'ping');
                    }, 3 * 1000);
                };
                this.receive = function(msg) {
                    sys.log('Received PONG', msg);
                    if (!_this.timeout) return;
                    clearTimeout(_this.timeout);
                    _this.timeout = null;
                };
                this.start = function() {
                    if (!_this.allow || _this.timer) return;
                    _this.timer = setInterval(_this.send.bind(_this), _this.interval * 1000);
                };
                this.stop = function() {
                    if (!_this.timer) return;
                    clearInterval(_this.timer);
                    _this.timer = null;
                };
            }
            return Ping;
        })();
        Socket.Ping = Ping;
        var Client = /** @class */ (function() {
            function Client() {
                var _this = this;
                this.observers = new Observers();
                this.on = function(evt, target, callback) {
                    var idx = _this.observers[evt].findIndex(function(ele) {
                        return ele.target === target;
                    });
                    if (idx === -1) {
                        _this.observers[evt].push({ callback: callback, target: target });
                    }
                };
                this.off = function(evt, target) {
                    var idx = _this.observers[evt].findIndex(function(ele) {
                        return ele.target === target;
                    });
                    if (idx !== -1) {
                        _this.observers[evt].splice(idx, 1);
                    }
                };
                this.stop = function() {
                    if (_this.socket.status === 'closed' || _this.socket.status === 'closing') {
                        return;
                    }
                    _this.socket.retryable = false;
                    _this.socket.close(1000, 'user');
                    _this.ping.stop();
                };
                this.start = function() {
                    if (!_this.isLogin || _this.socket.isRetrying || _this.socket.status === 'opened' || _this.socket.status === 'opening') {
                        return;
                    }
                    _this.socket.retry.reset();
                    _this.socket.retryable = true;
                    _this.socket.open();
                    _this.ping.start();
                };
                this.socket = new Socket(function() {
                    return _this.buildurl();
                });
                this.ping = new Ping(this.socket);
                this.socket.onopen = function(evt, isRetry) {
                    sys.log('Socket Client Opend:evt=', evt);
                    _this.onOpened(evt, isRetry);
                };
                this.socket.onerror = function(evt) {
                    sys.warn('Socket Client Error:evt=', evt);
                    _this.onError(evt);
                };
                this.socket.onmessage = function(evt) {
                    sys.log('Socket Client received message:evt=', evt);
                    if (typeof evt.data !== 'string') return;
                    var msg = JSON.parse(evt.data);
                    if (msg.type == 'PONG') {
                        _this.ping.receive(msg);
                    } else {
                        _this.onMessage(msg);
                    }
                };
                this.socket.onclose = function(evt, reason) {
                    sys.log('Socket Client closed:evt=', evt);
                    _this.ping.stop();
                    _this.onClosed(evt, reason);
                };
            }
            Object.defineProperty(Client.prototype, 'isLogin', {
                get: function() {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Client.prototype.onError = function(res) {};
            Client.prototype.onOpened = function(header, isRetry) {};
            Client.prototype.onClosed = function(evt, reason) {};
            Object.defineProperty(Client.prototype, 'status', {
                get: function() {
                    return this.socket.status;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Client.prototype, 'isConnected', {
                get: function() {
                    return this.socket.status === 'opened';
                },
                enumerable: true,
                configurable: true
            });
            return Client;
        })();
        Socket.Client = Client;
    })(Socket);
    ns.Socket = Socket;
})(ns);

(function(sys) {
    sys.debug = true;
    sys.log = function() {
        if (sys.debug) {
            console.info.apply(console, arguments);
        }
    };
    sys.warn = function() {
        if (sys.debug) {
            console.warn.apply(console, arguments);
        }
    };
    sys.call = function(func) {
        if (typeof func === 'function') {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            func.apply(undefined, args);
        }
    };
    sys.okstr = function(value) {
        var type = typeof value;
        switch (type) {
            case 'string':
                return value.length !== 0;
            case 'number':
                return true;
            default:
                return false;
        }
    };
    sys.okint = function(value) {
        var type = typeof value;
        switch (type) {
            case 'string':
                return /^\d+$/.test(value);
            case 'number':
                return Number.isInteger(value);
            default:
                return false;
        }
    };
    sys.oknum = function(value) {
        var type = typeof value;
        switch (type) {
            case 'string':
                return /^\d+(\.\d+)?$/.test(value);
            case 'number':
                return true;
            default:
                return false;
        }
    };
    Object.defineProperty(sys, 'isslim', {
        get: function() {
            var info = ns.getSystemInfoSync();
            return info.windowHeight / info.windowWidth > 1.78;
        },
        enumerable: true,
        configurable: true
    });
})((sys = ns.sys || (ns.sys = {})));

(function(pop) {
    pop.wait = function(title) {
        ns.showLoading({ title: title || '加载中', mask: true });
    };
    pop.idle = function() {
        ns.hideLoading();
    };
    pop.error = function(err) {
        ns.showModal({ title: '提示', content: err.message || '服务异常', showCancel: false });
    };
    pop.alert = function(content, confirm) {
        ns.showModal({ title: '提示', content: content, showCancel: false, success: confirm });
    };
    pop.dialog = function(content, confirm, cancel) {
        ns.showModal({
            title: '提示',
            content: content,
            showCancel: true,
            success: function(res) {
                if (res.confirm) {
                    sys.call(confirm);
                } else if (res.cancel) {
                    sys.call(cancel);
                }
            }
        });
    };
    pop.remind = function(ok, dismiss) {
        ns.showToast({ title: ok, icon: 'success', duration: 1000, mask: true });
        setTimeout(function() {
            return sys.call(dismiss);
        }, 1000);
    };
})((pop = ns.pop || (ns.pop = {})));

(function(orm) {
    var FIELD_KEY = '__orm_field';
    var CLASS_KEY = '__orm_class';
    var INDEX_KEY = '__orm_index';
    var stored = {};
    function awake(cls, json) {
        if (!json) return undefined;
        var obj = new cls();
        Object.assign(obj, json);
        var fields = cls[FIELD_KEY];
        if (fields) {
            for (var key in fields) {
                var subjson = obj[key];
                var subcls = fields[key];
                if (subjson && subcls) {
                    if (Array.isArray(subjson)) {
                        obj[key] = subjson.map(function(json) {
                            return awake(subcls, json);
                        });
                    } else {
                        obj[key] = awake(subcls, subjson);
                    }
                }
            }
        }
        return obj;
    }
    function getClskey(cls) {
        var clskey = cls && cls[CLASS_KEY];
        if (!clskey) {
            throw new Error('The Class:' + cls.name + " did't  mark with decorate @store(clsname,primary)");
        }
        return clskey;
    }
    function getIdxkey(cls) {
        var idxkey = cls && cls[INDEX_KEY];
        if (!idxkey) {
            throw new Error('The privkey:' + idxkey + ' of ' + cls.name + ' is invalid!');
        }
        return idxkey;
    }
    function getObjkey(clskey, id) {
        if (!clskey || !id) throw new Error('Cannot create objkey for id:' + id + 'of class:' + clskey);
        return clskey + '.' + id;
    }
    function getItem(key) {
        return ns.getStorageSync(key);
    }
    function setItem(key, data) {
        ns.setStorageSync(key, data);
    }
    function removeItem(key) {
        ns.removeStorageSync(key);
    }
    orm.store = function(clskey, idxkey) {
        if (!sys.okstr(clskey)) {
            throw new Error('The clskey:' + clskey + ' invalid!');
        }
        if (!sys.okstr(idxkey)) {
            throw new Error('The privkey:' + idxkey + ' invalid!');
        }
        if (stored[clskey]) {
            throw new Error('The clskey:' + clskey + " already exist!!You can't mark different class with same name!!");
        }
        stored[clskey] = true;
        return function(target) {
            target[CLASS_KEY] = clskey;
            target[INDEX_KEY] = idxkey;
        };
    };
    orm.field = function(cls) {
        return function(target, field) {
            var fields = target.constructor[FIELD_KEY] || (target.constructor[FIELD_KEY] = {});
            fields[field] = cls;
        };
    };
    orm.save = function(model) {
        if (!model) return;
        var clskey = getClskey(model.constructor);
        var idxkey = getIdxkey(model.constructor);
        var objkey = getObjkey(clskey, model[idxkey]);
        var keys = getItem(clskey) || {};
        keys[objkey] = '';
        setItem(clskey, keys);
        setItem(objkey, model);
    };
    orm.find = function(cls, id) {
        var clskey = getClskey(cls);
        var objkey = getObjkey(clskey, id);
        return awake(cls, getItem(objkey));
    };
    orm.ids = function(cls) {
        var clskey = getClskey(cls);
        var keys = getItem(clskey);
        return keys ? Object.keys(keys) : [];
    };
    orm.all = function(cls) {
        var clskey = getClskey(cls);
        var keys = getItem(clskey);
        if (!keys) return [];
        var result = [];
        for (var key in keys) {
            var obj = awake(cls, getItem(key));
            if (obj) {
                result.push(obj);
            }
        }
        return result;
    };
    orm.count = function(cls) {
        return orm.ids(cls).length;
    };
    orm.clear = function(cls) {
        var clskey = getClskey(cls);
        var keys = getItem(clskey);
        if (keys) {
            for (var key in keys) {
                removeItem(key);
            }
            removeItem(clskey);
        }
    };
    orm.remove = function(cls, id) {
        var clskey = getClskey(cls);
        var objkey = getObjkey(clskey, id);
        var keys = getItem(clskey);
        if (keys && keys[objkey]) {
            delete keys[objkey];
            removeItem(objkey);
            setItem(clskey, keys);
        }
    };
})(ns.orm || (ns.orm = {}));
