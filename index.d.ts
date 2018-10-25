export declare class IApp {
    [other: string]: any;
}
export interface IAppConstructor {
    new (): IApp;
}
export declare function app(): (target: IAppConstructor) => void;
interface IntersectionMargins {
    left: number;
    right: number;
    top: number;
    bottom: number;
}
interface IntersectionCallback {
    (intersectionRatio: number, intersectionRect: ClientRect, boundingClientRect: ClientRect, relativeRect: ClientRect, time: number): void;
}
interface IntersectionObserver {
    relativeTo: (selector: string, margins?: Partial<IntersectionMargins>) => IntersectionObserver;
    relativeToViewport: (margins?: Partial<IntersectionMargins>) => IntersectionObserver;
    observe: (selector: string, callback?: IntersectionCallback) => void;
    disconnect: () => void;
}
export declare class IPage<D = any> {
    [other: string]: any;
    readonly options: any;
    readonly route: string;
    data: D;
    setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    selectComponent: (selector: string) => Widget;
    selectAllComponents: () => Widget[];
    triggerEvent: (name: string, detail?: any) => void;
    createSelectorQuery: () => WTS.SelectorQuery;
    getRelationNodes: () => WTS.NodesRef;
    createIntersectionObserver: (thresholds?: number[], initialRatio?: number, observeAll?: boolean) => IntersectionObserver;
}
export interface IPageConstructor {
    new (): IPage;
}
export declare function page(): (target: IPageConstructor) => void;
export declare class Widget<D = any> {
    [other: string]: any;
    readonly options: any;
    data: D;
    setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    selectComponent: (selector: string) => Widget;
    selectAllComponents: () => Widget[];
    triggerEvent: (name: string, detail?: any) => void;
}
export interface WidgetConstructor {
    new (): Widget;
}
export declare function widget(): (target: WidgetConstructor) => void;
export {};
