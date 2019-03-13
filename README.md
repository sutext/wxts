# 纯 typescript 风格的小程序开发基础库

## notice
IPage和Widget内 不能使用箭头函数 否则 this 将无法指向正确的对象
tsconfig.json 的 compilerOptions 中需添加experimentalDecorators = true  

## Installing

For the latest stable version:

```bash
npm install -g wxts-cli
```
## start
```bash
wxts new myapp
cd myapp
npm start
```
Then open the wechat developer tools from build dir.

## example

For src/app.ts :
```ts
import { app, IApp} from 'wxts'
import {socket} from './socket'
const env = wx.getSystemInfoSync()
@app({ env })
export default class App extends IApp implements wts.IApp {
    onLaunch() {
        socket.addListener(this)
        socket.start()
     }
    onShow() {
    }
    onHide() {
    }
    onMessage(json: any, isOffline: boolean){
        console.log(json)
    }
}
```
For src/widgets/hello/index.ts :
```ts
import { widget, Widget} from 'wxts'
@widget({title:'hello widget'})
export default class Index extends Widget implements wts.IComponent{
    sayWorld(){
        this.setData({title:"hello world!!!"})
    }
}
```
For src/widgets/hello/index.wxml
```xml
<view>{{title}}</view>
```
For src/pages/index/index.ts : 
```ts
import { page, IPage } from 'wxts'
import Hello from '../../widgets/hello/index'
const items = [{ title: "系统版本", key: "model" }, { title: "屏幕宽度", key: "screenWidth" }, { title: "屏幕高度", key: "screenHeight" }]
@page({ items })
export default class Index extends IPage implements wts.IPage {
    private hello: Hello
    onLoad() {
        this.hello = this.selectComponent('#hello')
    }
    sayWorld() {
        this.hello.sayWorld()
    }
}
```
For src/pages/index/index.wxml :
```xml
<view class="content">
    <hello id="hello" />
    <view wx:for="{{items}}" wx:key="">{{item.title}}:{{env[item.key]}}</view>
    <button bind:tap="sayWorld">say world</button>
</view>
```
For src/pages/index/index.wxss ：
```css
.content{
    display:flex;
    flex-direction: column;
    align-items: center;
    line-height: 38px;
    padding: 0 15px;
}
```
For src/pages/index/index.json :
```json
{
    "usingComponents": {
        "hello": "/widget/hello/index"
    }
}
```

#Netowrk
for netowrk.ts
```ts
import * as wxts from "wxts";
class Network extends wxts.Network {
    protected  method:'POST'|'GET' = 'POST'//config http method
    protected get headers() { //config http headers
        const header: any = {}
        if (session.isLogin) {
            header.token = session.token
        }
        return header
    }
    protected url(path: string) {//config url
        return "http://www.yourdom.com/xx/" + path
    }
    protected resolve(json: any) {//resolve response data
        console.log(json);

        if (!json.code) {
            throw new Error('服务异常')
        }
        if (json.code === Code.ok) {
            return json.data || null
        }
        if (json.code === Code.authFailed) {
            service.logout()
        }
        throw new Error(json.message || '系统错误')
    }
}
export const net = new Network()

```
for user.ts
```ts
import { net } from './network';
net.objtask(User, 'user/info', {id:'userid'})
    .then(user => {
        console.log(user)
    })
    .catch(e=>{
        console.log(e)
    })
```
#Socket
for socket.ts
```ts
import * as wxts from "wxts";
class Socket extends wxts.Socket {
    protected maxAttemptTimes: number = 10 //config attemp times
    protected heartbeatInterval: number = 30//config heartbeat interval
    get url(): string {
        return "wss://" + env.host + "/socket/ws/customer?token=" + 'yourtoken'
    }
    get isDebug() {
        return env.isDebug
    }
    get isLogin() {
        return constant.isLogin
    }
    didLogout() {
        wxts.pop.alert('您已在别处登录，请重新登录', () => constant.logout())
    }
}
```

#storage
the storage apis is an simple orm implements by wx.storage.
for model.ts
```ts
import {orm} from "wxts";
@orm.store('Asset', 'account')
export class Asset{
    public readonly account: string
    public readonly balance:number
    constructor(json?: any) {
        if (!json) {
            return
        }
        this.balance = json.balance || 0
    }
}
@orm.store('User', 'account')
export class User {
    public readonly account: string
    public readonly nickname: string
    public readonly avatar: string
    public readonly phone: string
    public readonly area: string
    @orm.field(Asset)
    public readonly asset: Asset
    constructor(json?: any) {
        if (!json) {
            return
        }
        Object.assign(this, json)
        this.asset = new Asset(json.asset)
    }
}
```
for other.ts
```ts
net.objtask(User, 'user/info', {account:'account'})
    .then(user => {
        storage.save(user)
    })
    .catch(e=>{
        console.log(e)
    })
const user = storage.find(User,'32132')
console.log(user)
const count = storage.count(User)
console.log(count)
const users = storage.all(User)
console.log(users)
```
