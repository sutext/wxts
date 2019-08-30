# WXTS 纯typescript风格的小程序开发基础库

## 说明

* 用wxts开发小程序可以达到完整的语法提示效果和流畅简洁的小程序开发体验。有兴趣同学可联系作者supertext@icloud.com
* 小程序基础库API庞大目前只根据官方文档提供了大部分常用api的d.ts 声明
* 受typescript编译器对this指针的处理机制以及小程序脚本运行机制的影响，App,Page和Widget组件的成员函数不能使用箭头成员函数 否则this将无法指向正确的组件对象 其余函数不受影响。
* tsconfig.json 的 compilerOptions 中需添加experimentalDecorators = true  以打开装饰器特性
* 除了对小程序基础的ts声明的完善以外，还对网络请求，本地存储，Socket等常用功能提供了纯typescript的封装，简单易用，

## 安装

For the latest stable version:

```bash
npm install -g wxts-cli
```

## 扩展包

* [wxts-cli](https://www.npmjs.com/package/wxts-cli)    `wxts专用编译脚手架，用于支持npm包Promise等特性 需全局安装`
* [wxts-ui](https://www.npmjs.com/package/wxts-ui) `丰富的typescript风格的原生小程序的UI扩展库`
  
## 开始使用

```bash
wxts new myapp
cd myapp
npm start
```

然后用微信开发者工具打开工程目录下的build目录 就可以预览模版项目了

## 示例代码

For src/app.ts :

```ts
import 'wxts'
import {socket} from './socket'
const env = wx.getSystemInfoSync()
@wx.app({ env })
export default class App extends wx.App implements wx.IApp {
    onLaunch() {
        socket.on('message',this,this.onMessage)
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
@wx.widget({title:'hello widget'})
export default class Index extends wx.Widget implements wx.IComponent{
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
import Hello from '../../widgets/hello/index'
const items = [{ title: "系统版本", key: "model" }, { title: "屏幕宽度", key: "screenWidth" }, { title: "屏幕高度", key: "screenHeight" }]
@wx.page({ items })
export default class Index extends wx.Page implements wx.IPage {
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

## Netowrk

for netowrk.ts

```ts
class Network extends wx.Network {
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

## Socket

for socket.ts

```ts
class Client extends wx.Socket.Client {
    buildurl(): string {
        return "wss://example.com/socket/ws/customer?token=" + 'yourtoken'
    }
    get isLogin() {
        return true
    }
    onClosed(evt: wx.SocketClose, reason: Socket.Reason) {
        if (evt.code === 4001) {
            pop.alert('您已在别处登录，请重新登录', () => {
                //TODO: logout logic
            })
        }
    }
    onMessage(msg: any) {
        this.observers.message.forEach(ele => ele.callback.call(ele.target, msg))
    }
}
export const socket = new Client();
```

## storage

the storage apis is an simple orm implements by wx.storage.
for model.ts
```ts
const {store,field} = wx.orm;
@store('Asset', 'account')
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
@store('User', 'account')
export class User {
    public readonly account: string
    public readonly nickname: string
    public readonly avatar: string
    public readonly phone: string
    public readonly area: string
    @field(Asset)
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
        wx.orm.save(user)
    })
    .catch(e=>{
        console.log(e)
    })
const user = wx.orm.find(User,'32132')
console.log(user)
const count = wx.orm.count(User)
console.log(count)
const users = wx.orm.all(User)
console.log(users)
```
