# 纯 typescript 风格的小程序开发基础库

## notice
IPage和Widget内 不能使用箭头函数 否则 this 将无法指向正确的对象
Must add experimentalDecorators = true to tsconfig.json compilerOptions

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
const env = wx.getSystemInfoSync()
@app({ env })
export default class Application extends IApp implements wts.IApp {
  onLaunch() {
  }
  onShow() {
  }
  onHide() {
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

