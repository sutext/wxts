interface InitalData {
    [key: string]: any;
}
export declare class IApp {
    /**
     * @description global data 会被注入到每个页面中去，如果页面提供了相同的变量 将会覆盖 global 里面的值
     */
    global?: InitalData;
    [other: string]: any;
}
export interface IAppConstructor {
    new (): IApp;
}
export declare function app(): (target: IAppConstructor) => void;
export declare class IPage<D = {}> {
    [other: string]: any;
    readonly options: any;
    readonly route: string;
    readonly data: D & InitalData;
    setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    selectComponent: (selector: string) => Widget;
    selectAllComponents: () => Widget[];
    triggerEvent: (name: string, detail?: any) => void;
    createSelectorQuery: () => wts.SelectorQuery;
    getRelationNodes: () => wts.NodesRef;
    createIntersectionObserver: (options: wts.IntersectionOptions) => wts.IntersectionObserver;
}
export interface IPageConstructor {
    new (): IPage;
}
export declare function page(inital?: InitalData): (target: IPageConstructor) => void;
export declare class Widget<D = any> {
    [other: string]: any;
    readonly options: any;
    readonly data: D & InitalData;
    setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    selectComponent: (selector: string) => Widget;
    selectAllComponents: () => Widget[];
    triggerEvent: (name: string, detail?: any) => void;
    createSelectorQuery: () => wts.SelectorQuery;
}
export interface WidgetConstructor {
    new (): Widget;
}
export declare function widget(inital?: InitalData): (target: WidgetConstructor) => void;
export {};
