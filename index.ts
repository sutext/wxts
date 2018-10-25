function trim(obj: any): any {
    const result: any = {}
    for (const key in obj) {
        if (key !== 'constructor') {
            result[key] = obj[key]
        }
    }
    return result
}
export class IApp {
    [other: string]: any
}
export interface IAppConstructor {
    new(): IApp
}
export function app() {
    return function (target: IAppConstructor) {
        if (getApp()) {
            throw new Error('不能注册多个app')
        }
        App(trim(new target()))
    }
}
interface IntersectionMargins {
    left: number
    right: number
    top: number
    bottom: number
}
interface IntersectionCallback {
    (intersectionRatio: number, intersectionRect: ClientRect, boundingClientRect: ClientRect, relativeRect: ClientRect, time: number): void
}
interface IntersectionObserver {
    relativeTo: (selector: string, margins?: Partial<IntersectionMargins>, ) => IntersectionObserver
    relativeToViewport: (margins?: Partial<IntersectionMargins>, ) => IntersectionObserver
    observe: (selector: string, callback?: IntersectionCallback) => void
    disconnect: () => void
}
export class IPage<D=any>{
    [other: string]: any
    public readonly options: any
    public readonly route: string
    public data: D
    public setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    public selectComponent: (selector: string) => Widget
    public selectAllComponents: () => Widget[]
    public triggerEvent: (name: string, detail?: any) => void
    public createSelectorQuery: () => WTS.SelectorQuery
    public getRelationNodes: () => WTS.NodesRef
    public createIntersectionObserver: (thresholds?: number[], initialRatio?: number, observeAll?: boolean) => IntersectionObserver
}
export interface IPageConstructor {
    new(): IPage
}
export function page() {
    return function (target: IPageConstructor) {
        const param = new target()
        param.data.test = "hello"
        Page(trim(param))
    }
}
export class Widget<D=any>{
    [other: string]: any
    public readonly options: any
    public data: D
    public setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    public selectComponent: (selector: string) => Widget
    public selectAllComponents: () => Widget[]
    public triggerEvent: (name: string, detail?: any) => void
}
export interface WidgetConstructor {
    new(): Widget
}
const keys = ['properties', 'data', 'behaviors', 'created', 'attached', 'ready', 'moved', 'detached', 'relations', 'externalClasses']
export function widget() {
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
        Component(result)
    }
}