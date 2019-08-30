/// <reference path="lib.wx.std.d.ts" />
interface String {
    /** @description parse the url string to formated object  */
    readonly parsed: () => {
        readonly query: string;
        readonly host: string;
        readonly schema: string;
        readonly [key: string]: string;
    };
    /**
     * @description fix the length of number
     * @example '1'.fixlen(2) -> '01' '12331'.fixlen(3)->'331'
     * @param len must be positive nonzero number otherwise use @default 2
     */
    readonly fixlen: (len?: number) => string;
}
interface Date {
    /** @example 59:45 */
    readonly mmss: string;
    /** @example 08:00*/
    readonly hhmm: string;
    /** @example 23:59:45*/
    readonly hhmmss: string;
    /**
     * @description format the Date to string
     * @param fmt @example 'yyyy-MM-dd hh:mm:ss'
     */
    readonly format: (fmt: string) => string;
}
interface Number {
    /**
     * @example trun 1.3411111 to 1.35 when precision=2
     * @param precision the permision must be nonnegative number otherwise use @default 0
     */
    readonly ceil: (precision?: number) => number;
    /**
     * @example trun 1.34567 to 1.34 when precision=2
     * @param precision the permision must be nonnegative number otherwise use @default 0
     */
    readonly floor: (precision?: number) => number;
    /**
     * @example trun 1.34567 to 1.35 when precision=2
     * @param precision the permision must be nonnegative number otherwise use @default 0
     */
    readonly round: (precision?: number) => number;
    /**
     * @description insert comma symbol to the integer part
     * @example 23123.1234.comma -> '23,123.1234'
     */
    readonly comma: () => string;
    /**
     * @description fix the length of number
     * @example 1.fixlen(2) -> '01' 1987.fixlen(3) -> '987'
     * @param len must be positive nonzero number otherwise use @default 2
     */
    readonly fixlen: (len?: number) => string;
    /**
     * @description get index symbol of int number @example 23 -> 23rd @returns 'rd'
     */
    readonly symidx: 'st' | 'nd' | 'rd' | 'th';
}
interface Array<T> {
    /** @description get the last element from the stack */
    readonly last: T | undefined;
    /** @description get the first element from the stack*/
    readonly first: T | undefined;
    /** @description get an random index of array return -1 when empty */
    readonly ranidx: number;
    /** @description get an random item from arrary,if empty return undefined */
    readonly random: T | undefined;
    /**
     * @description insert item at index
     * @param item the item to be insert
     * @param index the index of new item
     * @notice the max value of index is the length of befor ary
     */
    readonly insert: (item: T, index: number) => void;
    /**
     * @description append other sequence of T
     * @param ary the sequence which will be append
     * @returns the length of self affter append.
     */
    readonly append: (ary: T[]) => number;
    /**
     * @description delete an object from array
     * @returns the index that been deleted. if not found retrun -1
     * @param item the object need to be delete
     */
    readonly delete: (item: T) => number;
    /**
     * @description delete on at index
     * @returns the object that been deleted if out of bounds retrun undefined
     * @param index the index need to be delete
     */
    readonly remove: (index: number) => T | undefined;
    /**
     * @description judge array contains the item or not.
     * @param item the target item.
     */
    readonly contains: (item: T) => boolean;
}

/** @description extentions wx app and widget decorate */
declare namespace wx {
    abstract class App {
        /**
         * @description 生命周期回调—监听小程序初始化
         * 小程序初始化完成时触发，全局只触发一次。
         */
        protected onLaunch?(info: ILaunchOptions): void;
        /**
         * @description 生命周期回调—监听小程序隐藏
         * 小程序从前台进入后前台
         */
        protected onShow?(info: ILaunchOptions): void;
        /**
         * @description 生命周期回调—监听小程序隐藏
         * 小程序从前台进入后台时
         */
        protected onHide?(): void;
        /**
         * @description 错误监听函数
         * 小程序发生脚本错误，或者 api
         */
        protected onError?(error?: string): void;
        /** 页面不存在监听函数
         *
         * 小程序要打开的页面不存在时触发，会带上页面信息回调该函数
         * **注意：**
         * 1. 如果开发者没有添加 `onPageNotFound` 监听，当跳转页面不存在时，将推入微信客户端原生的页面不存在提示页面。
         * 2. 如果 `onPageNotFound` 回调中又重定向到另一个不存在的页面，将推入微信客户端原生的页面不存在提示页面，并且不再回调 `onPageNotFound`。
         *
         * 最低基础库： 1.9.90
         */
        protected onPageNotFound?(opts?: IPageNotFound): void;
    }
    /**
     * @default {}
     * @param global 在app里面注入的参数为全局参数，将被注入到所有的页面里面
     * @notice 如果某个页面含有和app一样的注入参数，则已页面的参数将覆盖全局参数
     */
    function app(global?: IAnyObject): (target: new () => App) => void;

    abstract class Page<D = any> {
        readonly data: D & IAnyObject;
        readonly route: string;
        readonly options: IAnyObject;
        /** 生命周期回调—监听页面加载
         *
         * 页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
         */
        protected onLoad?(query?: { [queryKey: string]: string }): void;
        /** 生命周期回调—监听页面显示
         *
         * 页面显示/切入前台时触发。
         */
        protected onShow?(): void;
        /** 生命周期回调—监听页面初次渲染完成
         *
         * 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。
         *
         * 注意：对界面内容进行设置的 API 如`wx.setNavigationBarTitle`，请在`onReady`之后进行。
         */
        protected onReady?(): void;
        /** 生命周期回调—监听页面隐藏
         *
         * 页面隐藏/切入后台时触发。 如 `navigateTo` 或底部 `tab` 切换到其他页面，小程序切入后台等。
         */
        protected onHide?(): void;
        /** 生命周期回调—监听页面卸载
         *
         * 页面卸载时触发。如`redirectTo`或`navigateBack`到其他页面时。
         */
        protected onUnload?(): void;
        /** 当前是 tab 页时，点击 tab 时触发，最低基础库： `1.9.0` */
        protected onTabItemTap?(options?: ITabItemOption): void;
        /** 页面滚动触发事件的处理函数
         *
         * 监听用户滑动页面事件。
         */
        protected onPageScroll?(options?: IPageScrollOption): void;
        /** 页面上拉触底事件的处理函数
         *
         * 监听用户上拉触底事件。
         * - 可以在`app.json`的`window`选项中或页面配置中设置触发距离`onReachBottomDistance`。
         * - 在触发距离内滑动期间，本事件只会被触发一次。
         */
        protected onReachBottom?(): void;
        /** 监听用户下拉动作
         *
         * 监听用户下拉刷新事件。
         * - 需要在`app.json`的`window`选项中或页面配置中开启`enablePullDownRefresh`。
         * - 可以通过`wx.startPullDownRefresh`触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
         * - 当处理完数据刷新后，`wx.stopPullDownRefresh`可以停止当前页面的下拉刷新。
         */
        protected onPullDownRefresh?(): void;
        /**
         * 设置该页面的分享信息
         * 用户点击分享按钮的时候会调用
         * 此事件需要 return 一个 Object 用于自定以分享内容
         */
        protected onShareAppMessage?: (options?: IShareAppOption) => IShareAppData;
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
        readonly selectComponent: (selector: string) => any;
        readonly selectAllComponents: () => any[];
        readonly createSelectorQuery: () => SelectorQuery;
        readonly getRelationNodes: () => NodesRef;
        readonly createIntersectionObserver: (options?: IntersectionOptions) => IntersectionObserver;
    }
    /**
     * @default undefined
     * @param inital 向该页面注入初始化参数，所有参数将被用于初始化页面的data字段
     * @notice 在页面中注入的参数将覆盖在app里面注入的全局参数
     */
    function page(inital?: IAnyObject): (target: new () => Page<any>) => void;
    abstract class Widget<D = any> {
        readonly data: D & IAnyObject;
        /**组件配置参数 */
        protected options?: ComponentOptions;
        /**类似于mixins和traits的组件间代码复用机制 */
        protected behaviors?: any[];
        /**组件间关系定义 */
        protected relations?: any;
        /** 描述组件 传入参数 */
        protected properties?: ComponentProperties;
        /**组件接受的外部样式类 */
        protected externalClasses?: string[];
        /**组件生命周期函数 在组件实例进入页面节点树时执行 注意此时不能调用 setData */
        protected created?(): void;
        /**组件生命周期函数 在组件实例进入页面节点树时执行 */
        protected attached?(): void;
        /**组件生命周期函数 在组件布局完成后执行 此时可以获取节点信息 */
        protected ready?(): void;
        /**组件生命周期函数 在组件实例被移动到节点树另一个位置时执行 */
        protected moved?(): void;
        /**组件生命周期函数 在组件实例被从页面节点树移除时执行 */
        protected detached?(): void;
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
        /**
         * @description 判断模态弹窗是否显示
         * @warn 当组件继承自wxts-ui 中的 modal Behavior 时此方法可用否则undefined
         */
        readonly isShow: () => boolean;
        /**
         * @description 切换模态弹窗显示状态
         * @warn 当组件继承自wxts-ui 中的 modal Behavior 时此方法可用，否则undefined
         */
        readonly toggle: () => void;
        /**
         * @description 呈现模态弹窗
         * @warn 当组件继承自wxts-ui 中的 modal Behavior 时此方法可用，否则undefined
         */
        readonly present: () => void;
        /**
         * @description 隐藏模态弹窗
         * @warn 当组件继承自wxts-ui 中的 modal Behavior 时此方法可用，否则undefined
         */
        readonly dismiss: () => void;
        readonly triggerEvent: (name: string, detail?: any) => void;
        readonly selectComponent: (selector: string) => any;
        readonly selectAllComponents: () => any[];
        readonly createSelectorQuery: () => SelectorQuery;
        readonly getRelationNodes: () => NodesRef;
        readonly createIntersectionObserver: (options?: IntersectionOptions) => IntersectionObserver;
    }
    /**
     * @default undefined
     * @param inital 向该组件注入初始化参数，所有参数将被用于初始化组件的data字段
     */
    function widget(inital?: IAnyObject): (target: new () => Widget<any>) => void;
}
/** @description extentions wx Network and WebSoket */
declare namespace wx {
    interface IMetaClass<T> {
        new (json?: any): T;
    }
    interface IObserver {
        readonly target: any;
        readonly callback: Function;
    }
    /**
     * @description Network是一个抽象类，用户需继承此类以适配自己的业务逻辑
     * @description Network是对wx.request做的上层封装，
     * @description Network提供的是Promise风格的网络请求调用，可使用链式调用和await等特性
     * @description Netowrk提供了一套网络层到模型层转换的范式，用户调用task方法即可获得结构化的模型
     * @description Network生成的task被设计成句柄模式，可以abort或者监听请求进度等
     * @description datatask被创建后会立即自动执行发送请求，若请求达到最大并发数的时候将被挂起，等待其他请求结束后会自动执行。
     */
    abstract class Network {
        /**
         * @override point you shoud overwrite this property and provide you custom headers
         * @example
         * @default {}
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
         * @default 'POST'
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
         * @description 此方法用于构建完整的请求url
         * @notice 参数不必包含在URL内
         * @param path 具体api的相对路径
         * @example path='user/info.json' return 'https://api.yourdomain.com/'+path
         */
        protected abstract url(path: string): string;
        /**
         * @description 网络请求成功后会调用此方法对数据进行解析和校验
         * @notice 用户需要根据自己业务逻辑和数据接口协议提供此方法的实现
         * @notice 在此方法中抛出的异常将会被DataTask的catch捕获
         * @notice 此方法为全局解析方法，若具体的网络请求option中传入paser函数将覆盖此默认实现
         * @param resp 小程序request 相应的数据，该数据已解析为对象
         * @returns 在objtask objreq arytask aryreq 四个方法中 此处返回的数据将会被传入IMetaClass的构造函数中用于构造结构化的模型
         */
        protected abstract resolve(resp: HttpResponse): any;
        readonly anyreq: <T = any>(req: Network.Request<T>) => Network.DataTask<T>;
        readonly objreq: <T>(req: Network.Request<T>) => Network.DataTask<T>;
        readonly aryreq: <T>(req: Network.Request<T>) => Network.DataTask<T[]>;
        readonly upload: (file: Network.Upload, options?: Network.Options) => Network.UploadTask;
        readonly anytask: <T = any>(path: string, data?: any, options?: Network.Options) => Network.DataTask<T>;
        readonly objtask: <T>(c: IMetaClass<T>, path: string, data?: any, options?: Network.Options) => Network.DataTask<T>;
        readonly arytask: <T>(c: IMetaClass<T>, path: string, data?: any, options?: Network.Options) => Network.DataTask<T[]>;
        /**
         * @description create a map result http task.
         * @param meta the meta class of Data
         * @notice the cm.mapkey field must be exist in meta, otherwise 'id' used.
         * @param path the uri of http request
         * @param data the data of http request
         * @param opts the options of http request
         */
        readonly maptask: <T>(c: IMetaClass<T>, path: string, data?: any, options?: Network.Options) => Network.DataTask<Record<string, T>>;
        readonly download: (params: Network.Download, options?: Network.Options) => Network.DownloadTask;
    }
    namespace Network {
        type Method = 'POST' | 'GET';
        interface Options {
            /** use for replace the default resolve method of Network */
            readonly parser?: (resp: HttpResponse) => any;
            /** use for appoint key field in object when maptask ohterwise @default 'id' */
            readonly mapkey?: string;
            /** the http method to overwrite global http method config */
            readonly method?: Method;
            /** show loading modal or not or custome loading message. @default false。 if true use default message '加载中'  */
            readonly loading?: boolean | string;
            /** if true the timestamp in http header will be return to result @default false */
            readonly timestamp?: boolean;
        }
        interface Upload {
            /** the relative request path */
            readonly path: string;
            /** the filename */
            readonly name: string;
            /** the file local path  @example the result of wx.chooseImage */
            readonly file: string;
            /** request data */
            readonly data?: any;
        }
        interface Download {
            /** the resource url */
            readonly url: string;
            /** the file type */
            readonly type?: 'image' | 'audio' | 'video';
            /** the request header */
            readonly header?: any;
        }
        interface Request<T = any> {
            /** the request relattive path */
            readonly path: string;
            /** the respone data type descrpiton @notice it must be IMetaClass<T> in objreq() and aryreq() */
            readonly meta: IMetaClass<T> | T;
            /** the request data */
            readonly data?: any;
            /** the request options @see Options */
            readonly options?: Options;
        }
        interface IProgress {
            /** the progress value between 0 and 1 */
            readonly value: number;
            /** the complete count */
            readonly count: number;
            /** the total count */
            readonly total: number;
        }
        class DataTask<T> implements Promise<T> {
            readonly [Symbol.toStringTag]: 'Promise';
            constructor(promiss: Promise<T>, handler: RequestTask);
            readonly then: <TResult1 = T, TResult2 = never>(onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>) => Promise<TResult1 | TResult2>;
            readonly catch: <TResult = never>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>) => Promise<T | TResult>;
            readonly abort: () => void;
            readonly onHeaders: (func: (headers: any) => void) => void;
        }
        class UploadTask extends DataTask<any> {
            constructor(promiss: Promise<any>, handler: UploadTask);
            readonly onProgress: (callback: (progress: IProgress) => void) => void;
        }
        class DownloadTask extends DataTask<string> {
            constructor(promiss: Promise<string>, handler: DownloadTask);
            readonly onProgress: (callback: (progress: IProgress) => void) => void;
        }
    }
    /**
     * @description Socket 是对wx.SocketTask的上层封装
     * @description Socket 力图实现WebSocket的标准api接口
     * @description Socket 实现了Websoket的状态机
     * @description Socket 实现了短线重连机制，重连频率等设定由this.retry设置
     * @warn 不建议直接继承  Socket 类。
     */
    class Socket {
        constructor(builder: () => string);
        readonly open: () => void;
        readonly send: (data: string | ArrayBuffer) => void;
        readonly close: (code?: number, reason?: string) => void;
        readonly retry: Socket.Retry;
        readonly status: Socket.Status;
        readonly isRetrying: boolean;
        onopen: (header: any, isRetry: boolean) => void;
        onclose: (evt: SocketClose, reason: Socket.Reason) => void;
        onerror: (evt: SocketError) => void;
        onmessage: (evt: SocketMessage) => void;
    }
    namespace Socket {
        type Reason = 'user' | 'ping' | 'retry' | 'server';
        type Status = 'closed' | 'closing' | 'opened' | 'opening';
        type Events = keyof Observers;
        interface Observers {
            readonly open: IObserver[];
            readonly error: IObserver[];
            readonly close: IObserver[];
            readonly message: IObserver[];
        }
        interface Retry {
            /**
             * @description base attempt delay time @default 100 milliscond
             * @description the real delay time use a exponential random algorithm
             */
            delay: number;
            /** @description allow ping pong mechanism or not. @default true */
            allow: boolean;
            /** @description the max retry times when retrying @default 8 */
            chance: number;
        }
        interface Ping {
            /**
             * @description allow ping pong mechanism or not.
             * @default true
             * @warn It doesn't work affter socket has been started.
             */
            allow: boolean;
            /**
             * @description the time interval of ping
             * @default 30s
             * @notice It doesn't work affter socket has been started.
             */
            interval: number;
        }
        /**
         * @description socket client wrapped on Socket
         * @description you must inherit this class to implements your logic
         * @implements client PING heartbeat mechanis
         * @implements client reconnect  mechanis
         */
        abstract class Client {
            /**
             * @description the client ping mechanis
             * @ping use socket.send("{\"type\":\"PING\"}")
             * @pong receive message = "{\"type\":\"PONG\"}"
             * @note the server must send the specified @pong  when recived @ping otherwhis please close the ping
             */
            protected readonly ping: Ping;
            /** the realy websocket handler */
            protected readonly socket: Socket;
            /**
             * @notice all the observers will not be trigger
             * @notice you must trigger it yourself at overwrite point
             */
            protected readonly observers: Observers;
            /** Tell me your login status if not no retry */
            protected abstract readonly isLogin: boolean;
            /** @overwrite this method to provide url for web socket */
            protected abstract buildurl(): string;
            /** call when get some message @override point  @node the msg has been parsed using JSON.parse.*/
            protected abstract onMessage(msg: any): void;
            /** call when some error occur @override point */
            protected onError(res: SocketError): void;
            /** call when socket closed . @override point */
            protected onOpened(res: any, isRetry: boolean): void;
            /** @description call when socket closed @param reason the close reason */
            protected onClosed(res: SocketClose, reason: Reason): void;
            public readonly isConnected: boolean; /** the connection status */
            /**
             * @description add event listener
             * @warn By default all the envents will not be triggered unless triggerde by userself.
             */
            public readonly on: (evt: 'error' | 'message' | 'close' | 'open', target: any, callback: Function) => void;
            /** @description remove listener */
            public readonly off: (evt: 'error' | 'message' | 'close' | 'open', target: any) => void;
            /** @description disconnect and stop ping pong retry */
            public readonly stop: () => void;
            /** @description connect the server and start ping pong retry */
            public readonly start: () => void;
        }
    }
}
/** @description extentions wx util methods */
declare namespace wx {
    namespace sys {
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
        /**
         * @description judge the device‘s screen ratio is greater than 16/9
         * @example if true the device is likely to be iphoneX or other full screen mobile phone
         */
        const isslim: boolean;
    }
    namespace pop {
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
    namespace orm {
        /**
         * @description  A class decorate use to store class.
         * @param clsname the class name of your storage class
         * @param primary the primary key name of your storage class
         * @throws class already exist error.
         */
        const store: (clskey: string, idxkey: string) => <T>(target: IMetaClass<T>) => void;
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
         * @description find all storaged object's primary key of cls.
         * @param cls the storage class witch must be mark with @storage(...)
         * @throws did't mark error
         */
        const ids: <T>(cls: IMetaClass<T>) => string[];
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
}
