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
export class IPage<D=any>{
    [other: string]: any
    public readonly options: any
    public readonly route: string
    public readonly data: D & InitalData
    public readonly setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    public readonly triggerEvent: (name: string, detail?: any) => void
    public readonly selectComponent: (selector: string) => any
    public readonly selectAllComponents: () => any[]
    public readonly createSelectorQuery: () => wts.SelectorQuery
    public readonly getRelationNodes: () => wts.NodesRef
    public readonly createIntersectionObserver: (options?: wts.IntersectionOptions) => wts.IntersectionObserver
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
export class Widget<D=any>{
    [other: string]: any
    public readonly data: D & InitalData
    public readonly setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    public readonly triggerEvent: (name: string, detail?: any) => void
    public readonly selectComponent: (selector: string) => any
    public readonly selectAllComponents: () => any[]
    public readonly createSelectorQuery: () => wts.SelectorQuery;
    public readonly getRelationNodes: () => wts.NodesRef
    public readonly createIntersectionObserver: (options?: wts.IntersectionOptions) => wts.IntersectionObserver
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

export interface UploadFile {
    readonly path: string
    readonly name: string
    readonly file: string
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
    public readonly upload = (file: UploadFile, loading?: boolean): Promise<string> => {
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
    public readonly anytask = (path: string, data?: any, loading?: boolean): Promise<any> => {
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
    public readonly objtask = <T>(c: new (json: any) => T, path: string, data?: any, loading?: boolean): Promise<T> => {
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
    public readonly arytask = <T>(c: new (json: any) => T, path: string, data?: any, loading?: boolean): Promise<T[]> => {
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
            this.log('收到WebSocket消息：', res);
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
    protected handle = (msg: any, isOffline: boolean) => {
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
    protected isAuthClose(res: wts.SocketCloser): boolean {
        return res.code === 4001 || res.code === 4002
    }
    /** the status observer . It will be call when socket never attemped */
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
    /**
     *@description add an listener
     */
    public readonly addListener = (listener: Listener) => {
        this.listeners.add(listener)
    }
    /**
     * @description remove the listener
     */
    public readonly removeListener = (listener: Listener) => {
        this.listeners.delete(listener);
    }
}
export namespace pop {
    export const alert = (content: string, confirm?: () => void) => {
        wx.showModal({ title: "提示", content: content, showCancel: false, success: confirm })
    }
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
    export const remind = (ok: string, dismiss?: () => void) => {
        wx.showToast({ title: ok, icon: "success", duration: 1000, mask: true })
        setTimeout(() => {
            if (typeof dismiss === 'function') {
                dismiss()
            }
        }, 1000);
    }
    export const error = (err: Error) => {
        wx.showModal({ title: "提示", content: err.message || "服务异常", showCancel: false })
    }
    export const waiting = (title?: string) => {
        wx.showLoading({ title: title || '加载中', mask: true })
    }
    export const idling = () => {
        wx.hideLoading()
    }
}
export namespace storage {
    function awake<T>(cls: IMetaClass<T>, json: any) {
        if (!json) {
            return undefined
        }
        const obj = new cls()
        Object.assign(obj, json)
        const fields: IChildField[] = cls['sg_fields']
        if (fields && fields.length > 0) {
            for (const field of fields) {
                const subjson = obj[field.name]
                if (!subjson) {
                    continue
                }
                if (Array.isArray(subjson)) {
                    obj[field.name] = (subjson as any[]).map(json => {
                        return awake(field.class, json)
                    })
                } else {
                    obj[field.name] = awake(field.class, subjson)
                }
            }
        }
        return obj
    }
    export interface IMetaClass<T> {
        new(json?: any): T
    }
    export interface IChildField {
        name: string
        class: IMetaClass<any>
    }
    /**
     * @description  A class decorate use to store class.
     * @param clsname the class name of your storage class
     * @param primary the primary key name of your storage class
     */
    export const store = (clsname: string, primary: string) => {
        return <T>(target: storage.IMetaClass<T>) => {
            target['sg_clsname'] = clsname
            target['sg_primary'] = primary
        }
    }
    /**
     * @description  A property decorate to mark a field  also a store class.
     * @param cls the class of field.
     */
    export const field = <T>(cls: storage.IMetaClass<T>) => {
        return (target: Object, field: string) => {
            const fields: storage.IChildField[] = (target.constructor['sg_fields'] = target.constructor['sg_fields'] || [])
            fields.push({ name: field, class: cls })
        }
    }
    /**
     * @description save an storage able class.
     * @param model the model class must be mark with @store(...)
     * @throws did't mark error
     */
    export const save = <T>(model: T) => {
        if (!model) {
            return
        }
        const classkey = model.constructor['sg_clsname']
        const primary = model.constructor['sg_primary']
        if (!classkey || !primary) {
            throw new Error(`The Class:${model.constructor.name} did\'t  mark with decorate @store(clsname,primary)`)
        }
        const id = model[primary]
        if (id === undefined || id === null) {
            return
        }
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
        if (!id) {
            return
        }
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
        if (!keys) {
            return [];
        }
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