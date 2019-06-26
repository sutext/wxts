function trim(origin: any) {
    const result: any = {}
    for (const key in origin) {
        if (key !== 'constructor') {
            result[key] = origin[key]
        }
    }
    return result
}
let globalData: wx.IAnyObject
export class IApp implements wx.IApp {
    [other: string]: any
}
/**
 * @default {}
 * @param global 在app里面注入的参数为全局参数，将被注入到所有的页面里面
 * @notice 如果某个页面含有和app一样的注入参数，则已页面的参数将覆盖全局参数
 */
export function app(global?: wx.IAnyObject) {
    if (globalData) {
        throw new Error('you can only register one app!!!!')
    }
    globalData = global || {}
    return function (target: new () => IApp) {
        App(trim(new target()))
    }
}
export class IPage<D = any> implements wx.IPage {
    [other: string]: any
    public readonly data: D & wx.IAnyObject
    public readonly route: string
    public readonly options: wx.IAnyObject
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
    public readonly setData: <K extends keyof D>(data: D | Pick<D, K>, callback?: () => void) => void;
    public readonly selectComponent: (selector: string) => any
    public readonly selectAllComponents: () => any[]
    public readonly createSelectorQuery: () => wx.SelectorQuery
    public readonly getRelationNodes: () => wx.NodesRef
    public readonly createIntersectionObserver: (options?: wx.IntersectionOptions) => wx.IntersectionObserver
}
/**
 * @default undefined
 * @param inital 向该页面注入初始化参数，所有参数将被用于初始化页面的data字段
 * @notice 在页面中注入的参数将覆盖在app里面注入的全局参数
 */
export function page(inital?: wx.IAnyObject) {
    return function (target: new () => IPage) {
        const param = new target()
        const data = {}
        Object.assign(data, globalData, inital, param.data)
        Object.assign(param, { data })
        Page(trim(param))
    }
}
export class Widget<D = any> implements wx.IComponent {
    [other: string]: any
    public readonly data: D & wx.IAnyObject
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
    public readonly setData: <K extends keyof D>(data: D | Pick<D, K>, callback?: () => void) => void;
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
 * @param inital 向该组件注入初始化参数，所有参数将被用于初始化组件的data字段
 */
export function widget(inital?: wx.IAnyObject) {
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
        const data = {}
        Object.assign(data, inital, result.data)
        Object.assign(result, { data })
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
    protected get headers(): any {
        return {}
    }
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
    public readonly anyreq = <T = any>(req: Network.Request<T>) => {
        return this.anytask<T>(req.path, req.data, req.options)
    }
    public readonly objreq = <T>(req: Network.Request<T>) => {
        if (typeof req.meta !== 'function') throw new Error('the meta of objreq must be a class value')
        return this.objtask(req.meta as IMetaClass<T>, req.path, req.data, req.options)
    }
    public readonly aryreq = <T>(req: Network.Request<T>) => {
        if (typeof req.meta !== 'function') throw new Error('the meta of aryreq must be class value')
        return this.arytask(req.meta as IMetaClass<T>, req.path, req.data, req.options)
    }
    public readonly upload = (file: Network.Upload, options?: Network.Options) => {
        wx.showNavigationBarLoading()
        const loading = options && options.loading
        if (options && options.loading) {
            pop.wait(typeof loading === 'string' ? loading : undefined)
        }
        let handler: wx.UploadTask
        const promiss = new Promise<any>((resolve, reject) => {
            handler = wx.uploadFile({
                name: file.name,
                header: this.headers,
                url: this.url(file.path),
                filePath: file.file,
                formData: file.data,
                complete: res => {
                    wx.hideNavigationBarLoading()
                    pop.idle()
                    try {
                        res.data = JSON.parse(res.data)
                        const parser = options && options.parser || this.resolve.bind(this)
                        const value = parser(res)
                        resolve(value)
                    } catch (error) {
                        reject(error)
                    }
                },
            })
        });
        return new Network.UploadTask(promiss, handler)
    }
    public readonly anytask = <T = any>(path: string, data?: any, options?: Network.Options) => {
        wx.showNavigationBarLoading()
        const loading = options && options.loading
        if (options && options.loading) {
            pop.wait(typeof loading === 'string' ? loading : undefined)
        }
        let handler: wx.RequestTask
        const promiss = new Promise<T>((resolve, reject) => {
            handler = wx.request({
                url: this.url(path),
                header: this.headers,
                data: data,
                method: options && options.method || this.method,
                complete: result => {
                    wx.hideNavigationBarLoading()
                    if (options && options.loading) pop.idle()
                    try {
                        const parser = options && options.parser || this.resolve.bind(this)
                        const value = parser(result)
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
        return new Network.DataTask(promiss, handler)
    }
    public readonly objtask = <T>(c: IMetaClass<T>, path: string, data?: any, options?: Network.Options) => {
        wx.showNavigationBarLoading()
        const loading = options && options.loading
        if (options && options.loading) {
            pop.wait(typeof loading === 'string' ? loading : undefined)
        }
        let handler: wx.RequestTask
        const promiss = new Promise<T>((resolve, reject) => {
            handler = wx.request({
                url: this.url(path),
                header: this.headers,
                data: data,
                method: options && options.method || this.method,
                complete: result => {
                    wx.hideNavigationBarLoading()
                    if (options && options.loading) pop.idle()
                    try {
                        const parser = options && options.parser || this.resolve.bind(this)
                        const value = parser(result)
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
        return new Network.DataTask(promiss, handler)
    }
    public readonly arytask = <T>(c: IMetaClass<T>, path: string, data?: any, options?: Network.Options) => {
        wx.showNavigationBarLoading()
        const loading = options && options.loading
        if (options && options.loading) {
            pop.wait(typeof loading === 'string' ? loading : undefined)
        }
        let handler: wx.RequestTask
        const promiss = new Promise<T[]>((resolve, reject) => {
            handler = wx.request({
                url: this.url(path),
                header: this.headers,
                data: data,
                method: options && options.method || this.method,
                complete: result => {
                    wx.hideNavigationBarLoading()
                    if (options && options.loading) pop.idle()
                    try {
                        const parser = options && options.parser || this.resolve.bind(this)
                        const value = parser(result)
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
        return new Network.DataTask(promiss, handler)
    }
    public readonly download = (opts: Network.Download, options?: Network.Options) => {
        wx.showNavigationBarLoading()
        const loading = options && options.loading
        if (options && options.loading) {
            pop.wait(typeof loading === 'string' ? loading : undefined)
        }
        let handler: wx.DownloadTask
        const promiss = new Promise<string>((resolve, reject) => {
            handler = wx.downloadFile({
                ...opts,
                complete: res => {
                    wx.hideNavigationBarLoading()
                    pop.idle()
                    if (typeof res.tempFilePath === 'string') {
                        resolve(res.tempFilePath)
                    } else {
                        reject(res.errMsg || `download file from ${opts.url} failed!`)
                    }
                }
            })
        });
        return new Network.DownloadTask(promiss, handler)
    }
}
export namespace Network {
    export type Method = 'POST' | 'GET'
    /**
     * @description the addtion network params
     * @param parser use for replace the default resolve method of Network
     * @param loading show loading modal or not or custome loading message. @default false 
     * @param loading if true the default message is '加载中' . You can provide your custom message.
     * @param method  the http method to overwrite global http method config
     * @param method the method will be ignore when upload file.
     * @param timestamp if true .the timestamp in http header will be return to result @default false
     */
    export interface Options {
        readonly parser?: (resp: wx.HttpResponse) => any
        readonly method?: Method
        readonly loading?: boolean | string
        readonly timestamp?: boolean
    }
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
        readonly data?: any
    }
    /**
     * @description the upload file struct
     * @param url the resource url
     * @param type the file type
     * @param file the file local path  @example the result of wx.chooseImage
     */
    export interface Download {
        readonly url: string
        readonly type?: 'image' | 'audio' | 'video'
        readonly header?: any
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
    /**
     * @description the progress desc
     * @param value the progress value between 0 and 1
     * @param count the complete count
     * @param total the total count
     */
    export interface IProgress {
        readonly value: number
        readonly count: number
        readonly total: number
    }
    export class DataTask<T> implements Promise<T>{
        private readonly promiss: Promise<T>
        private readonly handler: wx.RequestTask
        public readonly [Symbol.toStringTag]: 'Promise' = 'Promise'
        constructor(promiss: Promise<T>, handler: wx.RequestTask) {
            this.promiss = promiss
            this.handler = handler
        }
        public readonly then = <TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2> => {
            return this.promiss.then(onfulfilled, onrejected)
        }
        public readonly catch = <TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> => {
            return this.promiss.catch(onrejected)
        }
        public readonly abort = () => {
            this.handler.abort()
        }
        public readonly onHeaders = (func: (headers: any) => void) => {
            this.handler.onHeadersReceived(func)
        }
    }
    export class UploadTask extends DataTask<any>{
        constructor(promiss: Promise<any>, handler: wx.UploadTask) {
            super(promiss, handler)
        }
        public readonly onProgress = (callback: (progress: IProgress) => void) => {
            const handler = this['handler'] as wx.UploadTask
            handler.onProgressUpdate(res => callback({
                value: res.progress,
                count: res.totalBytesSent,
                total: res.totalBytesExpectedToSend,
            }))
        }
    }
    export class DownloadTask extends DataTask<string>{
        constructor(promiss: Promise<string>, handler: wx.DownloadTask) {
            super(promiss, handler)
        }
        public readonly onProgress = (callback: (progress: IProgress) => void) => {
            const handler = this['handler'] as wx.DownloadTask
            handler.onProgressUpdate(res => callback({
                value: res.progress,
                count: res.totalBytesWritten,
                total: res.totalBytesExpectedToWrite,
            }))
        }
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
    public onclose: (evt: wx.SocketClose, reason: Socket.Reason) => void
    public onerror: (evt: wx.SocketError) => void
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
        if (typeof this.onclose === 'function') {
            this.onclose(e, 'retry')
        }
    }
    private onOpenCallback(header: any) {
        this._status = 'opened'
        if (typeof this.onopen === 'function') {
            this.onopen(header, this._retrying)
        }
        this._retrying = false
    }
    private onCloseCallback(e: wx.SocketClose) {
        this._status = 'closed'
        if (this.retryable && e.code < 3000) {
            this.retry.attempt(e);
        } else if (typeof this.onclose === 'function') {
            this._retrying = false
            let reason: Socket.Reason = 'server'
            if (e.reason === 'ping' || e.reason === 'user') {
                reason = e.reason
            }
            this.onclose(e, reason)
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
    export type Reason = 'user' | 'ping' | 'retry' | 'server'
    export type Status = 'closed' | 'closing' | 'opened' | 'opening'
    export type Events = keyof Observers
    export class Observers {
        readonly open: IObserver[] = []
        readonly error: IObserver[] = []
        readonly close: IObserver[] = []
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
         * @description the max retry times when retrying @default 8
         */
        public times: number = 8
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
            sys.log('发送 PING:', data);
            this.timeout = setTimeout(() => {
                sys.log('PING 超时');
                this.timeout = null;
                this.socket.close(1006, 'ping')
            }, 3 * 1000);
        }
        public readonly receive = (msg: any) => {
            sys.log("收到 PONG", msg);
            if (!this.allow || !this.timeout) return
            clearTimeout(this.timeout)
            this.timeout = null
        }
        public readonly start = () => {
            if (!this.allow || this.timer) return;
            this.timer = setInterval(this.send.bind(this), this.interval * 1000);
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
                sys.log('Socket Client Opend:evt=', evt);
                this.onOpened(evt, isRetry)
            }
            this.socket.onerror = evt => {
                sys.warn('Socket Client Error:evt=', evt);
                this.onError(evt)
            }
            this.socket.onmessage = evt => {
                sys.log('Socket Client received message:evt=', evt);
                if (typeof evt.data !== "string") return
                const msg = JSON.parse(evt.data)
                if (msg.type == "PONG") {
                    this.ping.receive(msg)
                } else {
                    this.onMessage(msg)
                }
            }
            this.socket.onclose = (evt, reason) => {
                sys.log('Socket Client closed:evt=', evt);
                this.ping.stop()
                this.onClosed(evt, reason)
            }
        }
        /**
         * @description Tell me your login status @default false
         * @description If false the start method will not work
         */
        protected get isLogin(): boolean {
            return false
        }
        /** @description overwrite point set allow ping or not */
        protected get allowPing(): boolean {
            return true
        }
        /** @overwrite this method to provide url for web socket */
        protected abstract buildurl(): string
        /** call when get some message @override point */
        protected abstract onMessage(msg: any): void
        /** call when some error occur @override point */
        protected onError(res: wx.SocketError) { }
        /** call when socket opend . @override point */
        protected onOpened(header: any, isRetry: boolean) { }
        /** call when socket closed @param reason the close reason @override point*/
        protected onClosed(evt: wx.SocketClose, reason: Reason) { }
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
            this.socket.close(1000, 'user')
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
/**
 * @description a group of util methods
 */
export namespace sys {
    export let debug: boolean = true
    /**
     * @description print info message when debug allow
     */
    export const log: (msg: any, ...args: any[]) => void = function () {
        if (sys.debug) {
            console.info.apply(console, arguments)
        }
    }
    /**
     * @description print wining message when debug allow
     */
    export const warn: (msg: any, ...args: any[]) => void = function () {
        if (sys.debug) {
            console.warn.apply(console, arguments)
        }
    }
    /**
     * @description call func safely 
     * @usually  use for call callback function
     * @param func target function
     * @param args the @param func 's args
     * @notice thirArg of @param func is undefined
     */
    export const call = function (func: Function, ...args: any[]) {
        if (typeof func === 'function') {
            func.apply(undefined, args)
        }
    }
    /**
     * @description check an value is an available string
     * @usually  use for form field verify
     * @notice only @param value is number or not empty string can pass
     * @param value witch to be verify
     */
    export const okstr = (value: any) => {
        const type = typeof value
        switch (type) {
            case 'string': return value.length !== 0
            case 'number': return true
            default: return false
        }
    }
    /**
     * @description check an value is an available integer
     * @usually  use for form field verify
     * @notice only @param value is integer like can pass
     * @param value witch to be verify
     */
    export const okint = (value: any) => {
        const type = typeof value
        switch (type) {
            case 'string': return /^\d+$/.test(value)
            case 'number': return Number.isInteger(value)
            default: return false
        }
    }
    /**
     * @description check an value is an available number
     * @usually  use for form field verify
     * @notice only @param value is number like can pass
     * @param value witch to be verify
     */
    export const oknum = (value: any) => {
        const type = typeof value
        switch (type) {
            case 'string': return /^\d+(\.\d+)?$/.test(value)
            case 'number': return true
            default: return false
        }
    }
    /**
     * @description judge the device‘s screen ratio is greater than 16/9
     * @example if true the device is likely to be iphoneX or other full screen mobile phone
     */
    export const isslim = (function () {
        const info = wx.getSystemInfoSync()
        return info.windowHeight / info.windowWidth > 1.78
    })();
}
export namespace pop {
    /**
     * @description show wating mask
     * @param title the loading title @default '加载中'
     */
    export const wait = (title?: string) => {
        wx.showLoading({ title: title || '加载中', mask: true })
    }
    /**
     * @description hide the waiting mask . 
     */
    export const idle = () => {
        wx.hideLoading()
    }
    /**
     * @description to alert some err 
     * @param err the err to be display
     */
    export const error = (err: Error) => {
        wx.showModal({ title: "提示", content: err.message || "服务异常", showCancel: false })
    }
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
                if (res.confirm) {
                    sys.call(confirm)
                } else if (res.cancel) {
                    sys.call(cancel)
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
        setTimeout(() => sys.call(dismiss), 1000);
    }
}
export namespace orm {
    const FIELD_KEY = '__orm_field'
    const CLASS_KEY = '__orm_class'
    const INDEX_KEY = '__orm_index'
    const stored: any = {}
    function awake<T>(cls: IMetaClass<T>, json: any) {
        if (!json) return undefined
        const obj = new cls()
        Object.assign(obj, json)
        const fields = cls[FIELD_KEY]
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
    function getClskey(cls: Function): string {
        const clskey = cls && cls[CLASS_KEY]
        if (!clskey) {
            throw new Error(`The Class:${cls.name} did\'t  mark with decorate @store(clsname,primary)`)
        }
        return clskey
    }
    function getIdxkey(cls: Function): string {
        const idxkey = cls && cls[INDEX_KEY]
        if (!idxkey) {
            throw new Error(`The privkey:${idxkey} of ${cls.name} is invalid!`)
        }
        return idxkey
    }
    function getObjkey(clskey: string, id: string | number) {
        if (!clskey || !id) return null
        return `${clskey}.${id}`
    }
    function getItem(key: string) {
        return wx.getStorageSync(key)
    }
    function setItem(key: string, data: any) {
        wx.setStorageSync(key, data);
    }
    function removeItem(key: string) {
        wx.removeStorageSync(key)
    }
    /**
     * @description  A class decorate use to store class.
     * @param clsname the class name of your storage class
     * @param primary the primary key name of your storage class
     * @throws class already exist error.
     */
    export const store = (clskey: string, idxkey: string) => {
        if (!sys.okstr(clskey)) {
            throw new Error(`The clskey:${clskey} invalid!`)
        }
        if (!sys.okstr(idxkey)) {
            throw new Error(`The privkey:${idxkey} invalid!`)
        }
        if (stored[clskey]) {
            throw new Error(`The clskey:${clskey} already exist!!You can't mark different class with same name!!`)
        }
        stored[clskey] = true
        return <T>(target: IMetaClass<T>) => {
            target[CLASS_KEY] = clskey
            target[INDEX_KEY] = idxkey
        }
    }
    /**
     * @description  A property decorate to mark a field  also a store class.
     * @param cls the class of field.
     */
    export const field = <T>(cls: IMetaClass<T>) => {
        return (target: Object, field: string) => {
            const fields = target.constructor[FIELD_KEY] || (target.constructor[FIELD_KEY] = {})
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
        const clskey = getClskey(model.constructor)
        const idxkey = getIdxkey(model.constructor)
        const objkey = getObjkey(clskey, model[idxkey])
        const keys: any = getItem(clskey) || {}
        keys[objkey] = ''
        setItem(clskey, keys)
        setItem(objkey, model)
    }
    /**
     * @description find an storaged object whith id.
     * @param cls the storage class witch must be mark with @store(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    export const find = <T>(cls: IMetaClass<T>, id: string | number): T | undefined => {
        const clskey = getClskey(cls)
        const objkey = getObjkey(clskey, id)
        return awake(cls, getItem(objkey))
    }
    /**
     * @description find all storaged object's primary key of cls.
     * @param cls the storage class witch must be mark with @storage(...)
     * @throws did't mark error
     */
    export const ids = <T>(cls: IMetaClass<T>): string[] => {
        const clskey = getClskey(cls)
        const keys = getItem(clskey)
        return keys ? Object.keys(keys) : []
    }
    /**
     * @description find all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    export const all = <T>(cls: IMetaClass<T>): T[] => {
        const clskey = getClskey(cls)
        const keys = getItem(clskey)
        if (!keys) return []
        const result: T[] = []
        for (const key in keys) {
            const obj = awake(cls, getItem(key))
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
        return ids(cls).length
    }
    /**
     * @description remove all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    export const clear = <T>(cls: IMetaClass<T>): void => {
        const clskey = getClskey(cls)
        const keys = getItem(clskey)
        if (keys) {
            for (const key in keys) {
                removeItem(key)
            }
            removeItem(clskey)
        }
    }
    /**
     * @description remove an special storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    export const remove = <T>(cls: IMetaClass<T>, id: string | number) => {
        const clskey = getClskey(cls)
        const objkey = getObjkey(clskey, id)
        const keys = getItem(clskey)
        if (keys && keys[objkey]) {
            delete keys[objkey]
            removeItem(objkey)
            setItem(clskey, keys)
        }
    }
}