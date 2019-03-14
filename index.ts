function trim(obj: any): any {
    const result: any = {}
    for (const key in obj) {
        if (key !== 'constructor') {
            result[key] = obj[key]
        }
    }
    return result
}
interface InitalData {
    [key: string]: any
}

export class IApp {
    [other: string]: any
}
let globalData: InitalData
/**
 * @default {}
 * @description global data will be inject to every Ipage.
 * @description if local Ipage provide the same variable it will overwrite
 */
export function app(global?: InitalData) {
    if (globalData) {
        throw new Error('you can only register one app!!!!')
    }
    globalData = global || {}
    return function (target: new () => IApp) {
        App(trim(new target()))
    }
}
export class IPage<D=any> implements wx.IPage {
    [other: string]: any
    public readonly options: any
    public readonly route: string
    public readonly data: D & InitalData
    /**
     * @description `setData` 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 `this.data` 的值（同步）。
     * @notice 直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致
     * @notice 仅支持设置可 JSON 化的数据。
     * @notice 单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。
     * @notice 请不要把 data 中任何一项的 value 设为 `undefined` ，否则这一项将不被设置并可能遗留一些潜在问题。
     * @description 这次要改变的数据
     * @param data 以 `key: value` 的形式表示，将 `this.data` 中的 `key` 对应的值改变成 `value`。
     * @param data 其中 `key` 可以以数据路径的形式给出，支持改变数组中的某一项或对象的某个属性，如 `array[2].message`，`a.b.c.d`，并且不需要在 this.data 中预先定义。
     * @param callback setData引起的界面更新渲染完毕后的回调函数，最低基础库： `1.5.0` 
     */
    public readonly setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    public readonly triggerEvent: (name: string, detail?: any) => void
    public readonly selectComponent: (selector: string) => any
    public readonly selectAllComponents: () => any[]
    public readonly createSelectorQuery: () => wx.SelectorQuery
    public readonly getRelationNodes: () => wx.NodesRef
    public readonly createIntersectionObserver: (options?: wx.IntersectionOptions) => wx.IntersectionObserver
}
/**
 * @default undefined
 * @description inject inital data to the Ipage'data field.
 * @description it will overwrite global data if possible
 */
export function page(inital?: InitalData) {
    return function (target: new () => IPage) {
        const param = new target()
        const global = {}
        Object.assign(global, globalData, inital, param.data)
        Object.assign(param, { data: global })
        Page(trim(param))
    }
}
export class Widget<D=any> implements wx.IComponent {
    [other: string]: any
    public readonly data: D & InitalData
    /**
     * @description `setData` 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 `this.data` 的值（同步）。
     * @notice 直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致
     * @notice 仅支持设置可 JSON 化的数据。
     * @notice 单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。
     * @notice 请不要把 data 中任何一项的 value 设为 `undefined` ，否则这一项将不被设置并可能遗留一些潜在问题。
     * @description 这次要改变的数据
     * @param data 以 `key: value` 的形式表示，将 `this.data` 中的 `key` 对应的值改变成 `value`。
     * @param data 其中 `key` 可以以数据路径的形式给出，支持改变数组中的某一项或对象的某个属性，如 `array[2].message`，`a.b.c.d`，并且不需要在 this.data 中预先定义。
     * @param callback setData引起的界面更新渲染完毕后的回调函数，最低基础库： `1.5.0` 
     */
    public readonly setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    public readonly triggerEvent: (name: string, detail?: any) => void
    public readonly selectComponent: (selector: string) => any
    public readonly selectAllComponents: () => any[]
    public readonly createSelectorQuery: () => wx.SelectorQuery;
    public readonly getRelationNodes: () => wx.NodesRef
    public readonly createIntersectionObserver: (options?: wx.IntersectionOptions) => wx.IntersectionObserver
}
const keys = ['properties', 'data', 'behaviors', 'created', 'attached', 'ready', 'moved', 'detached', 'relations', 'externalClasses']
/**
 * @default undefined
 * @description inject inital data to the Commponent data field.
 */
export function widget(inital?: InitalData) {
    return function (target: new () => Widget) {
        const param = new target()
        const result: any = { methods: {} }
        for (const key in param) {
            if (key === 'constructor') {
                continue
            }
            if (keys.findIndex(e => key === e) !== -1) {
                result[key] = param[key]
            } else {
                result.methods[key] = param[key]
            }
        }
        if (inital) {
            const data = result.data
            if (data) {
                Object.assign(inital, data)
            } else {
                Object.assign(result, { data: inital })
            }
        }
        const global = {}
        Object.assign(global, globalData, inital, result.data)
        Object.assign(result, { data: global })
        Component(result)
    }
}
/**
 * @description the meta constructor of netowrk and storage
 */
export interface IMetaClass<T> {
    new(json?: any): T
}
export interface IObserver {
    readonly target: any
    readonly callback: Function
}
export class Network {
    protected get headers(): any {
        return {}
    }
    protected get method(): Network.Method {
        return 'POST'
    }
    /**
     * @description resove relative uri to full url
     * @param path the relative uri
     */
    protected url(path: string): string {
        throw new Error('Network.url(path:string) must be implement')
    }
    /**
     * @description you must provid an resover and return you business object
     * @param resp the http response object
     */
    protected resolve(resp: wx.HttpResponse): any {
        throw new Error('Network.resolve must be implement')
    }
    public readonly upload = (file: Network.Upload, options?: Network.Options): Promise<any> => {
        wx.showNavigationBarLoading()
        if (options && options.loading) pop.waiting(typeof options.loading === 'string' ? options.loading : undefined)
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                name: file.name,
                header: this.headers,
                url: this.url(file.path),
                filePath: file.file,
                complete: res => {
                    wx.hideNavigationBarLoading()
                    if (options && options.loading) pop.idling()
                    try {
                        res.data = JSON.parse(res.data)
                        const value = this.resolve(res)
                        resolve(value)
                    } catch (error) {
                        reject(error)
                    }
                },
            })
        })
    }
    public readonly anyreq = <T>(req: Network.Request<T>) => {
        return this.anytask<T>(req.path, req.data, req.options)
    }
    public readonly objreq = <T>(req: Network.Request<T>) => {
        if (typeof req.meta !== 'function') throw new Error('the req of objreq must be Function')
        return this.objtask(req.meta as IMetaClass<T>, req.path, req.data, req.options)
    }
    public readonly aryreq = <T>(req: Network.Request<T>) => {
        if (typeof req.meta !== 'function') throw new Error('the req of aryreq must be Function')
        return this.arytask(req.meta as IMetaClass<T>, req.path, req.data, req.options)
    }
    public readonly anytask = <T = any>(path: string, data?: any, options?: Network.Options): Promise<T> => {
        wx.showNavigationBarLoading()
        if (options && options.loading) pop.waiting(typeof options.loading === 'string' ? options.loading : undefined)
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.url(path),
                header: this.headers,
                data: data,
                method: options && options.method ? options.method : this.method,
                complete: result => {
                    wx.hideNavigationBarLoading()
                    if (options && options.loading) pop.idling()
                    try {
                        const value = this.resolve(result)
                        if (options && options.timestamp && value && result.header && result.header.Date) {
                            value.timestamp = new Date(result.header.Date).getTime()
                        }
                        resolve(value)
                    } catch (error) {
                        reject(error)
                    }
                }
            })
        });
    }
    public readonly objtask = <T>(c: IMetaClass<T>, path: string, data?: any, options?: Network.Options): Promise<T> => {
        wx.showNavigationBarLoading()
        if (options && options.loading) pop.waiting(typeof options.loading === 'string' ? options.loading : undefined)
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.url(path),
                header: this.headers,
                data: data,
                method: options && options.method ? options.method : this.method,
                complete: result => {
                    wx.hideNavigationBarLoading()
                    if (options && options.loading) pop.idling()
                    try {
                        const value = this.resolve(result)
                        if (options && options.timestamp && value && result.header && result.header.Date) {
                            value.timestamp = new Date(result.header.Date).getTime()
                        }
                        resolve(new c(value))
                    } catch (error) {
                        reject(error)
                    }
                },
            })
        });
    }
    public readonly arytask = <T>(c: IMetaClass<T>, path: string, data?: any, options?: Network.Options): Promise<T[]> => {
        wx.showNavigationBarLoading()
        if (options && options.loading) pop.waiting(typeof options.loading === 'string' ? options.loading : undefined)
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.url(path),
                header: this.headers,
                data: data,
                method: options && options.method ? options.method : this.method,
                complete: result => {
                    wx.hideNavigationBarLoading()
                    if (options && options.loading) pop.idling()
                    try {
                        const value = this.resolve(result)
                        if (value && value.length > 0) {
                            resolve(value.map((e: any) => new c(e)))
                        } else {
                            resolve([]);
                        }
                    } catch (error) {
                        reject(error)
                    }
                }
            })
        });
    }
}
export namespace Network {
    export type Method = 'POST' | 'GET'
    /**
     * @description the upload file struct
     * @param path the relative request path
     * @param name the filename
     * @param file the file local path  @example the result of wx.chooseImage
     */
    export interface Upload {
        readonly path: string
        readonly name: string
        readonly file: string
    }
    /**
     * @description the addtion network params
     * @param loading show loading modal or not or custome loading message. @default false 
     * if true the default message is '加载中' . You can provide your custom message.
     * @param method  the http method to overwrite global http method config
     * the method will be ignore when upload file.
     * @param timestamp if true .the timestamp in http header will be return to result @default false
     */
    export interface Options {
        readonly loading?: boolean | string
        readonly method?: Method
        readonly timestamp?: boolean
    }
    /**
     * @description the network request interface use to packge request params
     * @param path the request relattive path
     * @param meta the respone data type descrpiton @notice it must be IMetaClass<T> in objreq() and aryreq()
     * @param data the request data
     * @param options the request options @see Options
     */
    export interface Request<T = any> {
        readonly path: string
        readonly meta: IMetaClass<T> | T
        readonly data?: any
        readonly options?: Options
    }
}
export class Socket {
    private task: wx.SocketTask
    private _status: Socket.Status = 'closed'
    private _retrying: boolean = false
    private readonly buildurl: () => string
    public retryable: boolean = false
    public readonly retry: Socket.Retry
    public onopen: (header: any, isRetry: boolean) => void
    public onclose: (evt: wx.SocketClose) => void
    public onerror: (evt: wx.SocketError) => void
    public onfailed: (evt: wx.SocketClose) => void
    public onmessage: (evt: wx.SocketMessage) => void
    constructor(builder: () => string) {
        this.buildurl = builder
        this.retry = new Socket.Retry(this.onRetryCallback.bind(this), this.onRetryFailed.bind(this))
    }
    private onRetryCallback() {
        this.open()
        this._retrying = true
    }
    private onRetryFailed(e: wx.SocketClose) {
        this._retrying = false
        if (typeof this.onfailed === 'function') {
            this.onfailed(e)
        }
    }
    private onOpenCallback(header: any) {
        this._status = 'opened'
        if (typeof this.onopen === 'function') {
            this.onopen(header, this._retrying)
        }
        this._retrying = false
    }
    private onCloseCallback(res: wx.SocketClose) {
        this._status = 'closed'
        if (this.retryable && res.code < 3000) {
            this.retry.attempt(res);
        } else if (typeof this.onclose === 'function') {
            this._retrying = false
            this.onclose(res)
        }
    }
    private onErrorCallback(res: wx.SocketError) {
        if (typeof this.onerror === 'function') {
            this.onerror(res)
        }
    }
    private onMessageCallback(res: wx.SocketMessage) {
        if (typeof this.onmessage === 'function') {
            this.onmessage(res)
        }
    }
    public readonly open = () => {
        if (this._status === 'opened' || this._status === 'opening' || typeof this.buildurl !== 'function') return
        const url = this.buildurl()
        this.task = wx.connectSocket({ url })
        this.task.onOpen(res => this.onOpenCallback(res))
        this.task.onError(res => this.onErrorCallback(res))
        this.task.onMessage(res => this.onMessageCallback(res))
        this.task.onClose(res => this.onCloseCallback(res))
        this._status = 'opening'
    }
    public readonly close = (code?: number, reason?: string) => {
        if (!this.task || this._status === 'closed' || this._status === 'closing') return
        this._status = 'closing'
        this.task.close({
            code, reason, fail: () => {
                this.onCloseCallback({ code, reason })
            }
        });
    }
    public readonly send = (data: string | ArrayBuffer) => {
        this.task && this.task.send({ data });
    }
    public get status() { return this._status }
    public get isRetrying() { return this._retrying }
}
export namespace Socket {
    export type Status = 'closed' | 'closing' | 'opened' | 'opening'
    export type Events = keyof Observers
    export class Observers {
        readonly open: IObserver[] = []
        readonly error: IObserver[] = []
        readonly close: IObserver[] = []
        readonly failed: IObserver[] = []
        readonly message: IObserver[] = []
    }
    /**
     * @description A retry machine for web socket
     * @description You can use it in any place where need retry machine
     */
    export class Retry {
        /**
         * @description base attempt delay time @default 100 milliscond
         * @description the real delay time use a exponential random algorithm
         */
        public delay: number = 100
        /**
         * @description the max retry times when retrying @default 5
         */
        public times: number = 5
        private count: number = 0//已经尝试次数
        private readonly onAttempt: (evt: wx.SocketClose) => void
        private readonly onFailed: (evt: wx.SocketClose) => void
        constructor(attempt: (evt: wx.SocketClose) => void, failed: (evt: wx.SocketClose) => void) {
            this.onAttempt = attempt
            this.onFailed = failed
        }
        private random(attempt: number, delay: number) {
            return Math.floor((0.5 + Math.random() * 0.5) * Math.pow(2, attempt) * delay);
        }
        /**
         * @description reset retry times counter
         */
        public readonly reset = () => {
            this.count = 0
        }
        /**
         * @description use this method to trigger onAttempt action or onFailed action
         */
        public readonly attempt = (evt: wx.SocketClose) => {
            if (this.count < this.times) {
                setTimeout(() => this.onAttempt(evt), this.random(this.count++, this.delay));
            } else {
                this.onFailed(evt)
            }
        }
    }
    export class Ping {
        private socket: Socket
        private timer: number = null
        private timeout: number = null
        private readonly allow: boolean
        /**
         * @description desc the time interval of ping @default 30s
         */
        public interval: number = 30
        constructor(socket: Socket, allow: boolean = true) {
            this.allow = allow
            this.socket = socket
        }
        private readonly send = () => {
            if (!this.allow || this.timeout) return
            if (this.socket.status !== 'opened') return
            const data = "{\"type\":\"PING\"}"
            this.socket.send(data)
            console.log('发送 PONG:', data);
            this.timeout = setTimeout(() => {
                console.log('PING 超时');
                this.timeout = null;
                this.socket.close(1006)
            }, 3 * 1000);
        }
        public readonly receive = (msg: any) => {
            console.log("收到 PONG", msg);
            if (!this.allow || !this.timeout) return
            clearTimeout(this.timeout)
            this.timeout = null
        }
        public readonly start = () => {
            if (!this.allow || this.timer) return;
            this.timer = setInterval(this.send.bind(this), this.interval * 30);
        }
        public readonly stop = () => {
            if (!this.allow || !this.timer) return;
            clearInterval(this.timer)
            this.timer = null
        }
    }
    /**
     * @description socket client wrapped on Socket
     * @description you must inherit this class to implements your logic
     * @implements client PING heartbeat mechanis
     */
    export abstract class Client {
        /**
         * @description the ping mechanis
         * @ping  use socket.send("{\"type\":\"PING\"}")
         * @pong  receive message = "{\"type\":\"PONG\"}"
         */
        protected readonly ping: Ping
        protected readonly socket: Socket
        /**
         * @notice all the observers will not be trigger 
         * @notice you must trigger it yourself at overwrite point
         */
        protected readonly observers: Observers = new Observers()
        constructor() {
            this.socket = new Socket(() => this.buildurl())
            this.ping = new Ping(this.socket, this.allowPing)
            this.socket.onopen = (evt, isRetry) => {
                console.log('Socket Client 连接已打开！', evt);
                this.onOpened(evt, isRetry)
            }
            this.socket.onerror = evt => {
                console.log('Socket Client 连接打开失败，请检查！', evt);
                this.onError(evt)
            }
            this.socket.onmessage = evt => {
                console.log('Socket Client 收到消息：', evt);
                if (typeof evt.data !== "string") return
                const msg = JSON.parse(evt.data)
                if (msg.type == "PONG") {
                    this.ping.receive(msg)
                } else {
                    this.onMessage(msg)
                }
            }
            this.socket.onclose = evt => {
                console.log('Socket Client  已关闭！', evt);
                this.ping.stop()
                this.onClosed(evt)
            }
            this.socket.onfailed = (etv) => {
                console.log('Socket Client 重连超时！')
                this.ping.stop()
                this.onFailed(etv)
            }
        }
        /**
         * @override print debug info or not @default true
         */
        protected get isDebug(): boolean {
            return true
        }
        /**
         * @description Tell me your login status @default false
         * @description If false the start method will not work
         */
        protected get isLogin(): boolean {
            return false
        }
        /**
         * @description overwrite point set allow ping or not 
         */
        protected get allowPing(): boolean {
            return true
        }
        /**
         * @override point
         * @description overwrite this method to provide url for web socket
         */
        protected buildurl(): string { return '' }
        /** call when some error occur @override point */
        protected onError(res: wx.SocketError) { }
        /** call when socket closed . @override point */
        protected onOpened(res: any, isRetry: boolean) { }
        /** 
         * @override point
         * @description call when socket closed  
         * @notice onFailed and onClosed only trigger one
         */
        protected onClosed(res: wx.SocketClose) { }
        /** 
         * @override point
         * @description call when socket retry failed  
         * @notice onFailed and onClosed only trigger one
         */
        protected onFailed(res: wx.SocketClose) { }
        /** call when get some message @override point */
        protected onMessage(msg: any) { }
        public get status() {
            return this.socket.status
        }
        public get isConnected(): boolean {
            return this.socket.status === 'opened'
        }
        public readonly on = (evt: Events, target: any, callback: Function) => {
            const idx = this.observers[evt].findIndex(ele => ele.target === target)
            if (idx === -1) {
                this.observers[evt].push({ callback, target })
            }
        }
        public readonly off = (evt: Events, target: any) => {
            const idx = this.observers[evt].findIndex(ele => ele.target === target)
            if (idx !== -1) {
                this.observers[evt].splice(idx, 1)
            }
        }
        public readonly stop = () => {
            if (this.socket.status === 'closed' ||
                this.socket.status === 'closing') {
                return
            }
            this.socket.retryable = false
            this.socket.close(1000)
            this.ping.stop()
        }
        public readonly start = () => {
            if (!this.isLogin ||
                this.socket.isRetrying ||
                this.socket.status === 'opened' ||
                this.socket.status === 'opening') {
                return
            }
            this.socket.retry.reset()
            this.socket.retryable = true
            this.socket.open()
            this.ping.start()
        }
    }
}

export class SocketClient {
    private _url: string
    private _isConnected: boolean = false;
    private _isConnecting: boolean = false;
    private observers: Socket.Observers = new Socket.Observers()
    private timer: number = null;
    private pingTimeout: number = null;
    private task: wx.SocketTask
    private attemptTimes: number;
    private addObserve = () => {
        if (!this.task) {
            return
        }
        this.task.onOpen(res => {
            this.log('WebSocket连接已打开！', res);
            this._isConnecting = false;
            this._isConnected = true;
            this.onOpened(res)
        })
        this.task.onError(res => {
            this.log('WebSocket连接打开失败，请检查！', res);
            this._isConnected = false;
            this._isConnecting = false;
            this.onError(res)
        })
        this.task.onMessage(res => {
            if (typeof res.data === "string") {
                try {
                    this.handle(JSON.parse(res.data), false)
                } catch (error) {
                    this.log(error)
                }
            }
            this.log('收到WebSocket消息：', res);
        })
        this.task.onClose(res => {
            this.log('WebSocket 已关闭！', res);
            if (this.isAuthFail(res)) {
                this.stop()
                this.onAuthFail()
                return
            }
            this.affterClose()
        })
    }
    private affterClose = () => {
        this._isConnected = false;
        this._isConnecting = false;
        this.task = null
        setTimeout(() => {
            this.attempt();
        }, 1000);
    }
    private close = () => {
        if (!this.task) {
            return
        }
        this.task.close({
            fail: res => {
                this.affterClose()
            }
        })
    }
    private attempt = () => {
        if (this.attemptTimes > this.maxAttemptTimes) {
            pop.alert('网络连接失败，请重试', () => this.reattemp())
            this.onFailed()
            return
        }
        this.connect()
    }
    private reattemp = () => {
        this.attemptTimes = 0
        this.attempt()
    }
    private timerFunc = () => {
        if (!this._isConnected) {
            this.attempt();
            return
        }
        if (this.pingTimeout) {
            return
        }
        let data: any = "{\"type\":\"PING\"}"
        this.task.send({ data })
        this.pingTimeout = setTimeout(() => {
            this.log("ping 超时");
            this.pingTimeout = null;
            this.close()
        }, 3 * 1000);
    }
    private connect = () => {
        if (!this.isLogin) {
            return
        }
        if (!this.timer) {
            return;
        }
        if (this._isConnected) {
            return
        }
        if (this._isConnecting) {
            return
        }
        this._isConnecting = true;
        this.task = wx.connectSocket({ url: this._url });
        this.addObserve()
        this.attemptTimes += 1;
    }
    private log(msg: any, other?: any) {
        if (this.isDebug) {
            console.log(msg, other || '')
        }
    }
    protected handle = (msg: any, isOffline: boolean) => {
        if (msg.type == "PONG") {
            if (this.pingTimeout) {
                clearTimeout(this.pingTimeout)
                this.pingTimeout = null
            }
            this.log("收到pong消息：", msg);
            return
        }
        this.onMessage(msg, isOffline)
        this.observers.message.forEach(ele => ele.callback.call(ele.target))
    }
    /**
     * @default 10
     * @description the max attempt times
     */
    protected maxAttemptTimes: number = 10
    /**
     * @default 30
     * @description the heartbeat interal
     */
    protected heartbeatInterval: number = 30
    /**
     * subclass must impl this method to resolve url
     * you must provide connect url 
     */
    protected setURL(url: string) {
        this._url = url
    }
    /**
     * @default false
     * @description you mast tell me the login status
     */
    protected get isLogin(): boolean {
        return false
    }
    /**
     * @default true
     * @description print debug info or not
     */
    protected get isDebug(): boolean {
        return true
    }
    /** 
     * @default impl is return res.code === 4001 || res.code === 4002,4001,4002 is the default auth fail code 
     * @description If get true socket will not attempt again. At this time didLogout will be call!
     */
    protected isAuthFail(res: wx.SocketClose): boolean {
        return res.code === 4001 || res.code === 4002
    }
    /** call when some error occur */
    protected onError(res: wx.SocketError) {

    }
    /** call when socket closed .  */
    protected onOpened(res: any) {

    }
    /** call when socket closed */
    protected onClosed(res: wx.SocketClose) {

    }
    /** call when socket retry failed */
    protected onFailed() {

    }
    /** call when get some message */
    protected onMessage(msg: any, isOffline: boolean) {

    }
    /** call when isAuthFail is true when close */
    protected onAuthFail() {

    }
    public get isConnected(): boolean {
        return this._isConnected
    }
    public get isConnecting(): boolean {
        return this._isConnecting
    }
    /**
     * @description start the socket monitor. 
     * try to connect the socket server.
     * the heartbeat mechanism will be work
     */
    public readonly start = () => {
        if (this.timer) {
            return;
        }
        this.timer = setInterval(() => {
            this.timerFunc();
        }, 1000 * this.heartbeatInterval);
        this.attemptTimes = 0
        this.timerFunc();
    }
    /**
     * @description stop the socket monitor. 
     * stop heartbeat mechanism
     */
    public readonly stop = () => {
        if (!this.timer) {
            return;
        }
        clearInterval(this.timer)
        this.timer = null
        this.close()
    }
    public readonly on = (evt: Socket.Events, target: any, callback: Function) => {
        const idx = this.observers[evt].findIndex(ele => ele.target === target)
        if (idx === -1) {
            this.observers[evt].push({ callback, target })
        }
    }
    public readonly off = (evt: Socket.Events, target: any) => {
        const idx = this.observers[evt].findIndex(ele => ele.target === target)
        if (idx !== -1) {
            this.observers[evt].splice(idx, 1)
        }
    }
}
export namespace pop {
    /**
     * @description alert user some message
     * @param content the message to be show
     * @param confirm  the confirm callback
     */
    export const alert = (content: string, confirm?: () => void) => {
        wx.showModal({ title: "提示", content: content, showCancel: false, success: confirm })
    }
    /**
     * @description the dialog that need user make a decision
     * @param content the message to be show
     * @param confirm  the confirm callback
     * @param cancel the cancel callback
     */
    export const dialog = (content: string, confirm?: () => void, cancel?: () => void) => {
        wx.showModal({
            title: "提示", content: content, showCancel: true, success: res => {
                if (res.confirm && typeof confirm === 'function') {
                    confirm()
                } else if (res.cancel && typeof cancel === 'function') {
                    cancel()
                }
            }
        })
    }
    /**
     * @description remind some successful msg to user. It will be auto dimiss affter 1s
     * @param ok the ok message
     * @param dismiss the callback of affter auto dismiss
     */
    export const remind = (ok: string, dismiss?: () => void) => {
        wx.showToast({ title: ok, icon: "success", duration: 1000, mask: true })
        setTimeout(() => {
            if (typeof dismiss === 'function') {
                dismiss()
            }
        }, 1000);
    }
    /**
     * @description to alert some err 
     * @param err the err to be display
     */
    export const error = (err: Error) => {
        wx.showModal({ title: "提示", content: err.message || "服务异常", showCancel: false })
    }
    /**
     * @description show wating mask
     * @param title the loading title @default '加载中'
     */
    export const waiting = (title?: string) => {
        wx.showLoading({ title: title || '加载中', mask: true })
    }
    /**
     * @description hide the waiting mask . 
     */
    export const idling = () => {
        wx.hideLoading()
    }
}
export namespace orm {
    const stored: any = {}
    function awake<T>(cls: IMetaClass<T>, json: any) {
        if (!json) return undefined
        const obj = new cls()
        Object.assign(obj, json)
        const fields = cls['sg_fields']
        if (fields) {
            for (const field in fields) {
                const subjson = obj[field]
                if (!subjson) continue
                if (Array.isArray(subjson)) {
                    obj[field] = (subjson as any[]).map(json => {
                        return awake(fields[field], json)
                    })
                } else {
                    obj[field] = awake(fields[field], subjson)
                }
            }
        }
        return obj
    }
    /**
     * @description  A class decorate use to store class.
     * @param clsname the class name of your storage class
     * @param primary the primary key name of your storage class
     * @throws class already exist error.
     */
    export const store = (clsname: string, primary: string) => {
        if (stored[clsname]) {
            throw new Error(`The clsname:${clsname} already exist!!You can't mark different class with same name!!`)
        }
        stored[clsname] = true
        return <T>(target: IMetaClass<T>) => {
            target['sg_clsname'] = clsname
            target['sg_primary'] = primary
        }
    }
    /**
     * @description  A property decorate to mark a field  also a store class.
     * @param cls the class of field.
     */
    export const field = <T>(cls: IMetaClass<T>) => {
        return (target: Object, field: string) => {
            const fields = target.constructor['sg_fields'] || (target.constructor['sg_fields'] = {})
            fields[field] = cls
        }
    }
    /**
     * @description save an storage able class.
     * @param model the model class must be mark with @store(...)
     * @throws did't mark error
     */
    export const save = <T>(model: T) => {
        if (!model) return
        const classkey = model.constructor['sg_clsname']
        const primary = model.constructor['sg_primary']
        if (!classkey || !primary) {
            throw new Error(`The Class:${model.constructor.name} did\'t  mark with decorate @store(clsname,primary)`)
        }
        const id = model[primary]
        if (id === undefined || id === null) return
        const key = classkey + "." + id
        const keys: any = wx.getStorageSync(classkey) || {}
        keys[key] = ''
        wx.setStorageSync(classkey, keys)
        wx.setStorageSync(key, model)
    }
    /**
     * @description find an storaged object whith id.
     * @param cls the storage class witch must be mark with @store(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    export const find = <T>(cls: IMetaClass<T>, id: string | number): T | undefined => {
        const classkey = cls['sg_clsname']
        if (!classkey) {
            throw new Error(`The Class:${cls.name} did\'t  mark with decorate @store(clsname,primary)`)
        }
        if (!id) return
        const json = wx.getStorageSync(classkey + "." + id)
        return awake(cls, json)
    }
    /**
     * @description find all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    export const all = <T>(cls: IMetaClass<T>): T[] => {
        const classkey = cls['sg_clsname']
        if (!classkey) {
            throw new Error(`The Class:${cls.name} did\'t  mark with decorate @store(clsname,primary)`)
        }
        const keys = wx.getStorageSync(classkey)
        if (!keys) return []
        const result: T[] = []
        for (const key in keys) {
            const obj = awake(cls, wx.getStorageSync(key))
            if (obj) {
                result.push(obj)
            }
        }
        return result;
    }
    /**
     * @description get the count of all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    export const count = <T>(cls: IMetaClass<T>): number => {
        const classkey = cls['sg_clsname']
        if (!classkey) {
            throw new Error(`The Class:${cls.name} did\'t  mark with decorate @store(clsname,primary)`)
        }
        const keys = wx.getStorageSync(classkey)
        return keys ? Object.keys(keys).length : 0
    }
    /**
     * @description remove all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    export const clear = <T>(cls: IMetaClass<T>): void => {
        const classkey = cls['sg_clsname']
        if (!classkey) {
            throw new Error(`The Class:${cls.name} did\'t  mark with decorate @store(clsname,primary)`)
        }
        const keys = wx.getStorageSync(classkey)
        if (keys) {
            for (const key in keys) {
                wx.removeStorageSync(key)
            }
            wx.removeStorageSync(classkey)
        }
    }
    /**
     * @description remove an special storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    export const remove = <T>(cls: IMetaClass<T>, id: string | number) => {
        const classkey = cls['sg_clsname']
        if (!classkey) {
            throw new Error(`The Class:${cls.name} did\'t  mark with decorate @store(clsname,primary)`)
        }
        if (!id) return;
        wx.removeStorageSync(classkey + "." + id)
    }
}