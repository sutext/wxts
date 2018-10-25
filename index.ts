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
    /**
     * @description global data 会被注入到每个页面中去，如果页面提供了相同的变量 将会覆盖 global 里面的值
     */
    global?: InitalData
    [other: string]: any
}
export interface IAppConstructor {
    new(): IApp
}
let globalData: InitalData
export function app() {
    return function (target: IAppConstructor) {
        if (getApp()) {
            throw new Error('不能注册多个app')
        }
        const param = new target()
        globalData = param.global
        App(trim(param))
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
                Object.assign(data, inital)
            } else {
                Object.assign(result, { data: inital })
            }
        }
        Component(result)
    }
}