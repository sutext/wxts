# 纯 typescript 风格的小程序开发基础库
# IPage 和 Widget 内 不能实用箭头函数 否则 this 将无法指向正确的对象
# src/app.ts
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
    socket.stop()
  }
}
```
# src/widgets/hello/index.ts
```ts
import { widget, Widget} from 'wxts'
@widget({title:'hello widget'})
export default class Index extends Widget implements wts.IComponent{
    sayWorld(){
        this.setData({title:"hello world!!!"})
    }
}
```
# src/widgets/hello/index.wxml
```xml
<view>{{title}</view>
```
# src/pages/index/index.ts
```ts
import { page, IPage} from 'wxts'
import Hello from '../../widgets/hello/index'
const items = [{title:"系统版本",key:"model"},{title:"屏幕宽度",key:"screenWidth"},{title:"屏幕高度",key:"screenHeight"}]
@page({items})
export default class Index extends IPage implements wts.IPage{
    private hello:Hello
    onLoad(){
        this.hello = this.selectComponent('#hello')
    }
    sayWorld(){
        this.hello.sayWorld()
    }
}
```
# src/pages/index/index.wxml
```xml
<view style="display:flex;flex-direction: column;">
    <hello id="hello"/>
    <view wx:for="{{items}">{{item.title}}:{{env[itme.key]}}</view>
    <button bind:tap="sayWorld">say world</button>
</view>
```
# src/pages/index/index.json
```json
{
    "usingComponents": {
        "hello": "/widget/hello/index"
    }
}
```

