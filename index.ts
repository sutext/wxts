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
export interface IAppConstructor {
    new(): IApp
}
let globalData: InitalData
/**
 * @description global data 会被注入到每个页面中去，如果页面提供了相同的变量 将会覆盖 global 里面的值
 */
export function app(global?: InitalData) {
    if (globalData) {
        return
    }
    globalData = global || {}
    return function (target: IAppConstructor) {
        App(trim(new target()))
    }
}
export class IPage<D={}>{
    [other: string]: any
    public readonly options: any
    public readonly route: string
    public readonly data: D & InitalData
    public setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    public selectComponent: (selector: string) => Widget
    public selectAllComponents: () => Widget[]
    public triggerEvent: (name: string, detail?: any) => void
    public createSelectorQuery: () => wts.SelectorQuery
    public getRelationNodes: () => wts.NodesRef
    public createIntersectionObserver: (options: wts.IntersectionOptions) => wts.IntersectionObserver
}
export interface IPageConstructor {
    new(): IPage
}
export function page(inital?: InitalData) {
    return function (target: IPageConstructor) {
        const param = new target()
        const global = globalData ? { ...globalData } : {}
        Object.assign(global, inital, param.data)
        Object.assign(param, { data: global })
        Page(trim(param))
    }
}
export class Widget<D=any>{
    [other: string]: any
    public readonly options: any
    public readonly data: D & InitalData
    public setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    public selectComponent: (selector: string) => Widget
    public selectAllComponents: () => Widget[]
    public triggerEvent: (name: string, detail?: any) => void
    public createSelectorQuery: () => wts.SelectorQuery;
}
export interface WidgetConstructor {
    new(): Widget
}
const keys = ['properties', 'data', 'behaviors', 'created', 'attached', 'ready', 'moved', 'detached', 'relations', 'externalClasses']
export function widget(inital?: InitalData) {
    return function (target: WidgetConstructor) {
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
        const global = globalData ? { ...globalData } : {}
        Object.assign(global, inital, result.data)
        Object.assign(result, { data: global })
        Component(result)
    }
}

export interface ImageFile {
    path: string
    name: string
    file: string
}
export class Network {
    /**
     * @default POST
     * @description provide request methd
     */
    protected get method(): wts.HttpMethod {
        return 'POST'
    }
    /**
     * @default {}
     * @description provide custom http headers 
     */
    protected get header(): any {
        return {}
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
    protected resolve(resp: wts.HttpResponse): any {
        throw new Error('Network.resolve must be implement')
    }
    public upload(file: ImageFile, loading?: boolean): Promise<string> {
        wx.showNavigationBarLoading()
        if (loading) pop.waiting()
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                name: file.name,
                header: this.header,
                url: this.url(file.path),
                filePath: file.file,
                complete: res => {
                    wx.hideNavigationBarLoading()
                    if (loading) pop.idling()
                    try {
                        res.data = JSON.parse(res.data)
                        const value = this.resolve(res)
                        resolve(value.key)
                    } catch (error) {
                        reject(error)
                    }
                }
            })
        })
    }
    public anytask(path: string, data?: any, loading?: boolean): Promise<any> {
        wx.showNavigationBarLoading()
        if (loading) pop.waiting()
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.url(path),
                header: this.header,
                data: data,
                method: this.method,
                complete: result => {
                    wx.hideNavigationBarLoading()
                    if (loading) pop.idling()
                    try {
                        const value = this.resolve(result)
                        if (value && result.header && result.header.Date) {
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
    public objtask<T>(c: new (json: any) => T, path: string, data?: any, loading?: boolean): Promise<T> {
        wx.showNavigationBarLoading()
        if (loading) pop.waiting()
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.url(path),
                header: this.header,
                data: data,
                method: this.method,
                complete: result => {
                    wx.hideNavigationBarLoading()
                    if (loading) pop.idling()
                    try {
                        const value = this.resolve(result)
                        if (value && result.header && result.header.Date) {
                            value.timestamp = new Date(result.header.Date).getTime()
                        }
                        resolve(new c(value))
                    } catch (error) {
                        reject(error)
                    }
                }
            })
        });
    }
    public arytask<T>(c: new (json: any) => T, path: string, data?: any, loading?: boolean): Promise<T[]> {
        wx.showNavigationBarLoading()
        if (loading) pop.waiting()
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.url(path),
                header: this.header,
                data: data,
                method: this.method,
                complete: result => {
                    wx.hideNavigationBarLoading()
                    if (loading) pop.idling()
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
class Popver {
    public alert(content: string, confirm?: () => void) {
        wx.showModal({ title: "提示", content: content, showCancel: false, success: confirm })
    }
    public dialog(content: string, confirm?: () => void, cancel?: () => void) {
        wx.showModal({
            title: "提示", content: content, showCancel: true, success: res => {
                if (res.confirm && confirm) {
                    confirm()
                } else if (res.cancel && cancel) {
                    cancel()
                }
            }
        })
    }
    public remind(ok: string, dismiss?: () => void) {
        wx.showToast({ title: ok, icon: "success", duration: 1000, mask: true })
        setTimeout(() => {
            if (dismiss) {
                dismiss()
            }
        }, 1000);
    }
    public error(err: Error) {
        let msg = err.message
        if (!msg) {
            msg = "服务异常"
        }
        wx.showModal({ title: "提示", content: msg, showCancel: false })
    }
    public waiting(title?: string) {
        wx.showLoading({ title: title || '加载中', mask: true })
    }
    public idling() {
        wx.hideLoading()
    }
}
export const pop = new Popver()
export interface Listener {
    onMessage(json: any, isOffline: boolean);
}
export class Socket {
    private _isConnected: boolean = false;
    private _isConnecting: boolean = false;
    private listeners: Set<Listener>;
    private timer: number = null;
    private pingTimeout: number = null;
    private task: wts.SocketTask
    private attemptTimes: number;
    private addObserve = () => {
        if (!this.task) {
            return
        }
        this.task.onOpen(res => {
            this.log('WebSocket连接已打开！', res);
            this._isConnecting = false;
            this._isConnected = true;
            this.didConnected()
        })
        this.task.onError(res => {
            this.log('WebSocket连接打开失败，请检查！', res);
            this._isConnected = false;
            this._isConnecting = false;
            this.didError(new Error(res.errMsg))
        })
        this.task.onMessage(res => {
            if (typeof res.data === "string") {
                try {
                    this.handle(JSON.parse(res.data), false)
                } catch (error) {
                    this.log(error)
                }
            }
            this.log('收到服务器内容：', res);
        })
        this.task.onClose(res => {
            this.log('WebSocket 已关闭！', res);
            if (this.isAuthClose(res)) {
                this.stop()
                this.didLogout(res)
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
            this.disConnected()
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
        this.task = wx.connectSocket({ url: this.url });
        this.addObserve()
        this.attemptTimes += 1;
    }
    private log(msg: any, other?: any) {
        if (this.isDebug) {
            console.log(msg, other || '')
        }
    }
    private handle = (msg: any, isOffline: boolean) => {
        if (msg.type == "PONG") {
            if (this.pingTimeout) {
                clearTimeout(this.pingTimeout)
                this.pingTimeout = null
            }
            this.log("收到pong消息：", msg);
            return
        }
        this.listeners.forEach(ele => {
            ele.onMessage(msg, isOffline);
        });
    }
    constructor() {
        this.listeners = new Set<Listener>()
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
    protected get url(): string {
        throw new Error('you must provide url like wss://xxx.com ')
    }
    /**
     * you mast tell me you login status
     * @default false
     */
    protected get isLogin(): boolean {
        return false
    }
    /**
     * print debug info or not
     */
    protected get isDebug(): boolean {
        return true
    }
    /** 
     * @default impl is return res.code === 4001 || res.code === 4002,4001,4002 is the default auth fail code 
     * @description if true socket will no more attemp adn didLogout will be call!
     */
    protected isAuthClose(res: wts.SocketCloser): boolean {
        return res.code === 4001 || res.code === 4002
    }
    /** the staus observe . It will be call when socket never attemped */
    protected didConnected() {

    }
    /** call when socket opend */
    protected disConnected() {

    }
    /**
     * @see isAuthClose
     * @param res logout res 
     */
    protected didLogout(res: wts.SocketCloser) {

    }
    /** call when some error opend */
    protected didError(error: Error) {

    }
    public get isConnected(): boolean {
        return this._isConnected
    }
    public get isConnecting(): boolean {
        return this._isConnecting
    }
    public start = () => {
        if (this.timer) {
            return;
        }
        this.timer = setInterval(() => {
            this.timerFunc();
        }, 1000 * this.heartbeatInterval);
        this.attemptTimes = 0
        this.timerFunc();
    }
    public stop = () => {
        if (!this.timer) {
            return;
        }
        clearInterval(this.timer)
        this.timer = null
        this.close()
    }
    public addListener = (listener: Listener) => {
        this.listeners.add(listener)
    }
    public removeListener = (listener: Listener) => {
        this.listeners.delete(listener);
    }
}
export interface StorageAble {
    id: string | number
    isEmpty: boolean
    className: string
}
class Storage {
    save<T extends StorageAble>(model: T): void {
        if (!model || model.isEmpty) return;
        const key = model.className + "." + model.id
        const keys: any = wx.getStorageSync(model.className) || {}
        keys.key = ''
        wx.setStorageSync(model.className, keys)
        wx.setStorageSync(key, model)
    }
    find<T extends StorageAble>(c: new (json?: any) => T, id: string | number): T | undefined {
        const classkey = new c().className
        if (!(id && classkey)) return null;
        const obj = wx.getStorageSync(classkey + "." + id)
        return obj ? new c(obj) : null
    }
    all<T extends StorageAble>(c: new (json?: any) => T): T[] {
        const classkey = new c().className
        if (!classkey) return []
        const keys = wx.getStorageSync(classkey)
        const result: T[] = []
        for (const key in keys) {
            let obj = wx.getStorageSync(key)
            if (obj) {
                result.push(new c(obj))
            }
        }
        return result;
    }
}
export const storage = new Storage()
