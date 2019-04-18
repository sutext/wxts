export declare class IApp implements wx.IApp {
    [other: string]: any;
}
/**
 * @default {}
 * @description global data will be inject to every Ipage.
 * @description if local Ipage provide the same variable it will overwrite
 */
export declare function app(global?: wx.IAnyObject): (target: new () => IApp) => void;
export declare class IPage<D = any> implements wx.IPage {
    [other: string]: any;
    readonly data: D & wx.IAnyObject;
    readonly route: string;
    readonly options: any;
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
    readonly setData: <K extends keyof D>(data: D | Pick<D, K>, callback?: () => void) => void;
    readonly triggerEvent: (name: string, detail?: any) => void;
    readonly selectComponent: (selector: string) => any;
    readonly selectAllComponents: () => any[];
    readonly createSelectorQuery: () => wx.SelectorQuery;
    readonly getRelationNodes: () => wx.NodesRef;
    readonly createIntersectionObserver: (options?: wx.IntersectionOptions) => wx.IntersectionObserver;
}
/**
 * @default undefined
 * @description inject inital data to the Ipage'data field.
 * @description it will overwrite global data if possible
 */
export declare function page(inital?: wx.IAnyObject): (target: new () => IPage<any>) => void;
export declare class Widget<D = any> implements wx.IComponent {
    [other: string]: any;
    readonly data: D & wx.IAnyObject;
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
    readonly setData: <K extends keyof D>(data: D | Pick<D, K>, callback?: () => void) => void;
    readonly triggerEvent: (name: string, detail?: any) => void;
    readonly selectComponent: (selector: string) => any;
    readonly selectAllComponents: () => any[];
    readonly createSelectorQuery: () => wx.SelectorQuery;
    readonly getRelationNodes: () => wx.NodesRef;
    readonly createIntersectionObserver: (options?: wx.IntersectionOptions) => wx.IntersectionObserver;
}
/**
 * @default undefined
 * @description inject inital data to the Commponent data field.
 */
export declare function widget(inital?: wx.IAnyObject): (target: new () => Widget<any>) => void;
/**
 * @description the meta constructor of netowrk and storage
 */
export interface IMetaClass<T> {
    new (json?: any): T;
}
export interface IObserver {
    readonly target: any;
    readonly callback: Function;
}
export declare class Network {
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
    protected readonly headers: any;
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
    protected readonly method: Network.Method;
    /**
     * @description resove relative uri to full url
     * @param path the relative uri
     */
    protected url(path: string): string;
    /**
     * @description you must provid an resover and return you business object
     * @param resp the http response object
     */
    protected resolve(resp: wx.HttpResponse): any;
    readonly anyreq: <T>(req: Network.Request<T>) => Network.DataTask<T>;
    readonly objreq: <T>(req: Network.Request<T>) => Network.DataTask<T>;
    readonly aryreq: <T>(req: Network.Request<T>) => Network.DataTask<T[]>;
    readonly upload: (file: Network.Upload, options?: Network.Options) => Network.UploadTask;
    readonly anytask: <T = any>(path: string, data?: any, options?: Network.Options) => Network.DataTask<T>;
    readonly objtask: <T>(c: IMetaClass<T>, path: string, data?: any, options?: Network.Options) => Network.DataTask<T>;
    readonly arytask: <T>(c: IMetaClass<T>, path: string, data?: any, options?: Network.Options) => Network.DataTask<T[]>;
    readonly download: (opts: Network.Download, options?: Network.Options) => Network.DownloadTask;
}
export declare namespace Network {
    type Method = 'POST' | 'GET';
    /**
     * @description the addtion network params
     * @param loading show loading modal or not or custome loading message. @default false
     * @param loading if true the default message is '加载中' . You can provide your custom message.
     * @param method  the http method to overwrite global http method config
     * @param method the method will be ignore when upload file.
     * @param resolver if provide resolver the default resolve method will be replace
     * @param timestamp if true .the timestamp in http header will be return to result @default false
     */
    interface Options {
        readonly parser?: (resp: wx.HttpResponse) => any;
        readonly method?: Method;
        readonly loading?: boolean | string;
        readonly timestamp?: boolean;
    }
    /**
     * @description the upload file struct
     * @param path the relative request path
     * @param name the filename
     * @param file the file local path  @example the result of wx.chooseImage
     */
    interface Upload {
        readonly path: string;
        readonly name: string;
        readonly file: string;
        readonly data?: any;
    }
    /**
     * @description the upload file struct
     * @param url the resource url
     * @param type the file type
     * @param file the file local path  @example the result of wx.chooseImage
     */
    interface Download {
        readonly url: string;
        readonly type?: 'image' | 'audio' | 'video';
        readonly header?: any;
    }
    /**
     * @description the network request interface use to packge request params
     * @param path the request relattive path
     * @param meta the respone data type descrpiton @notice it must be IMetaClass<T> in objreq() and aryreq()
     * @param data the request data
     * @param options the request options @see Options
     */
    interface Request<T = any> {
        readonly path: string;
        readonly meta: IMetaClass<T> | T;
        readonly data?: any;
        readonly options?: Options;
    }
    /**
     * @description the progress desc
     * @param value the progress value between 0 and 1
     * @param count the complete count
     * @param total the total count
     */
    interface Progress {
        readonly value: number;
        readonly count: number;
        readonly total: number;
    }
    class DataTask<T> implements PromiseLike<T> {
        private readonly promiss;
        private readonly handler;
        readonly [Symbol.toStringTag]: 'Promise';
        constructor(promiss: Promise<T>, handler: wx.RequestTask);
        readonly then: <TResult1 = T, TResult2 = never>(onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>) => Promise<TResult1 | TResult2>;
        readonly catch: <TResult = never>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>) => Promise<T | TResult>;
        readonly abort: () => void;
        readonly onHeaders: (func: (headers: any) => void) => void;
    }
    class UploadTask extends DataTask<any> {
        constructor(promiss: Promise<any>, handler: wx.UploadTask);
        readonly onProgress: (callback: (progress: Progress) => void) => void;
    }
    class DownloadTask extends DataTask<string> {
        constructor(promiss: Promise<string>, handler: wx.DownloadTask);
        readonly onProgress: (callback: (progress: Progress) => void) => void;
    }
}
export declare class Socket {
    private task;
    private _status;
    private _retrying;
    private readonly buildurl;
    retryable: boolean;
    readonly retry: Socket.Retry;
    onopen: (header: any, isRetry: boolean) => void;
    onclose: (evt: wx.SocketClose) => void;
    onerror: (evt: wx.SocketError) => void;
    onfailed: (evt: wx.SocketClose) => void;
    onmessage: (evt: wx.SocketMessage) => void;
    constructor(builder: () => string);
    private onRetryCallback;
    private onRetryFailed;
    private onOpenCallback;
    private onCloseCallback;
    private onErrorCallback;
    private onMessageCallback;
    readonly open: () => void;
    readonly close: (code?: number, reason?: string) => void;
    readonly send: (data: string | ArrayBuffer) => void;
    readonly status: Socket.Status;
    readonly isRetrying: boolean;
}
export declare namespace Socket {
    type Status = 'closed' | 'closing' | 'opened' | 'opening';
    type Events = keyof Observers;
    class Observers {
        readonly open: IObserver[];
        readonly error: IObserver[];
        readonly close: IObserver[];
        readonly message: IObserver[];
    }
    /**
     * @description A retry machine for web socket
     * @description You can use it in any place where need retry machine
     */
    class Retry {
        /**
         * @description base attempt delay time @default 100 milliscond
         * @description the real delay time use a exponential random algorithm
         */
        delay: number;
        /**
         * @description the max retry times when retrying @default 8
         */
        times: number;
        private count;
        private readonly onAttempt;
        private readonly onFailed;
        constructor(attempt: (evt: wx.SocketClose) => void, failed: (evt: wx.SocketClose) => void);
        private random;
        /**
         * @description reset retry times counter
         */
        readonly reset: () => void;
        /**
         * @description use this method to trigger onAttempt action or onFailed action
         */
        readonly attempt: (evt: wx.SocketClose) => void;
    }
    class Ping {
        private socket;
        private timer;
        private timeout;
        private readonly allow;
        /**
         * @description desc the time interval of ping @default 30s
         */
        interval: number;
        constructor(socket: Socket, allow?: boolean);
        private readonly send;
        readonly receive: (msg: any) => void;
        readonly start: () => void;
        readonly stop: () => void;
    }
    /**
     * @description socket client wrapped on Socket
     * @description you must inherit this class to implements your logic
     * @implements client PING heartbeat mechanis
     */
    abstract class Client {
        /**
         * @description the ping mechanis
         * @ping  use socket.send("{\"type\":\"PING\"}")
         * @pong  receive message = "{\"type\":\"PONG\"}"
         */
        protected readonly ping: Ping;
        protected readonly socket: Socket;
        /**
         * @notice all the observers will not be trigger
         * @notice you must trigger it yourself at overwrite point
         */
        protected readonly observers: Observers;
        constructor();
        /**
         * @description Tell me your login status @default false
         * @description If false the start method will not work
         */
        protected readonly isLogin: boolean;
        /**
         * @description overwrite point set allow ping or not
         */
        protected readonly allowPing: boolean;
        /**
         * @override point
         * @description overwrite this method to provide url for web socket
         */
        protected buildurl(): string;
        /** call when some error occur @override point */
        protected onError(res: wx.SocketError): void;
        /** call when socket closed . @override point */
        protected onOpened(res: any, isRetry: boolean): void;
        /**
         * @override point
         * @description call when socket closed
         * @notice onFailed and onClosed only trigger one
         */
        protected onClosed(res: wx.SocketClose): void;
        /**
         * @override point
         * @description call when socket retry failed
         * @notice onFailed and onClosed only trigger one
         */
        protected onFailed(res: wx.SocketClose): void;
        /** call when get some message @override point */
        protected onMessage(msg: any): void;
        readonly status: Status;
        readonly isConnected: boolean;
        readonly on: (evt: "open" | "error" | "close" | "message", target: any, callback: Function) => void;
        readonly off: (evt: "open" | "error" | "close" | "message", target: any) => void;
        readonly stop: () => void;
        readonly start: () => void;
    }
}
/**
 * @description a group of util methods
 */
export declare namespace sys {
    let debug: boolean;
    /**
     * @description print info message when debug allow
     */
    const log: (msg: any, ...args: any[]) => void;
    /**
     * @description print wining message when debug allow
     */
    const warn: (msg: any, ...args: any[]) => void;
    /**
     * @description call func safely
     * @usually  use for call callback function
     * @param func target function
     * @param args the @param func 's args
     * @notice thirArg of @param func is undefined
     */
    const call: (func: Function, ...args: any[]) => void;
    /**
     * @description check an value is an available string
     * @usually  use for form field verify
     * @notice only @param value is number or not empty string can pass
     * @param value witch to be verify
     */
    const okstr: (value: any) => boolean;
    /**
     * @description check an value is an available integer
     * @usually  use for form field verify
     * @notice only @param value is integer like can pass
     * @param value witch to be verify
     */
    const okint: (value: any) => boolean;
    /**
     * @description check an value is an available number
     * @usually  use for form field verify
     * @notice only @param value is number like can pass
     * @param value witch to be verify
     */
    const oknum: (value: any) => boolean;
}
export declare namespace pop {
    /**
     * @description show wating mask
     * @param title the loading title @default '加载中'
     */
    const wait: (title?: string) => void;
    /**
     * @description hide the waiting mask .
     */
    const idle: () => void;
    /**
     * @description to alert some err
     * @param err the err to be display
     */
    const error: (err: Error) => void;
    /**
     * @description alert user some message
     * @param content the message to be show
     * @param confirm  the confirm callback
     */
    const alert: (content: string, confirm?: () => void) => void;
    /**
     * @description the dialog that need user make a decision
     * @param content the message to be show
     * @param confirm  the confirm callback
     * @param cancel the cancel callback
     */
    const dialog: (content: string, confirm?: () => void, cancel?: () => void) => void;
    /**
     * @description remind some successful msg to user. It will be auto dimiss affter 1s
     * @param ok the ok message
     * @param dismiss the callback of affter auto dismiss
     */
    const remind: (ok: string, dismiss?: () => void) => void;
}
export declare namespace orm {
    /**
     * @description  A class decorate use to store class.
     * @param clsname the class name of your storage class
     * @param primary the primary key name of your storage class
     * @throws class already exist error.
     */
    const store: (clsname: string, primary: string) => <T>(target: IMetaClass<T>) => void;
    /**
     * @description  A property decorate to mark a field  also a store class.
     * @param cls the class of field.
     */
    const field: <T>(cls: IMetaClass<T>) => (target: Object, field: string) => void;
    /**
     * @description save an storage able class.
     * @param model the model class must be mark with @store(...)
     * @throws did't mark error
     */
    const save: <T>(model: T) => void;
    /**
     * @description find an storaged object whith id.
     * @param cls the storage class witch must be mark with @store(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    const find: <T>(cls: IMetaClass<T>, id: string | number) => T;
    /**
     * @description find all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    const all: <T>(cls: IMetaClass<T>) => T[];
    /**
     * @description get the count of all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    const count: <T>(cls: IMetaClass<T>) => number;
    /**
     * @description remove all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    const clear: <T>(cls: IMetaClass<T>) => void;
    /**
     * @description remove an special storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    const remove: <T>(cls: IMetaClass<T>, id: string | number) => void;
}
