


# 前端异常监控-性能监控



## 前言
```
首先，我们为什么要进行异常捕获和上报呢？
正所谓百密一疏，一个经过了大量测试及联调的项目在有些时候还是会有十分隐蔽的bug存在，这种复杂而又不可预见性的问题唯有通过完善的监控机制才能有效的减少其带来的损失，因此对于直面用户的前端而言，异常捕获与上报是至关重要的。
```

---

## 异常监控
1. [x] 语法错误
2. [x] 运行时异常
3. [x] 资源加载异常
    ```
        img
        script
        link
        audio
        video
        iframe
        ...外链资源的DOM元素
    ```
4. [x] 异步请求异常
    ```
        XMLHttpRequest
        fetch
    ```
5. [x] Promise异常
6. [ ] CSS中资源异常
    ```
        @font-face
        background-image
        ...暂时无法捕获

    ```





---









### 异常捕获方法
1. try catch
> ES提供基本的错误捕获语法

- 只能捕获同步代码的异常
- ~~回调~~
- setTimeout
- promise

> 使用try catch能够很好的捕获异常并对应进行相应处理，不至于让页面挂掉，但是其存在一些弊端，比如需要在捕获异常的代码上进行包裹，会导致页面臃肿不堪，不适用于整个项目的异常捕获。



2. window.onerror
> 相比try catch来说window.onerror提供了全局监听异常的功能，当JavaScript运行时错误（包括语法错误）发生时，window会触发一个ErrorEvent接口的事件，并执行window.onerror();
```
window.onerror = function(errorMessage, scriptURI, lineNo, columnNo, error) {
    console.log('errorMessage: ' + errorMessage); // 异常信息
    console.log('scriptURI: ' + scriptURI); // 异常文件路径
    console.log('lineNo: ' + lineNo); // 异常行号
    console.log('columnNo: ' + columnNo); // 异常列号
    console.log('error: ' + error); // 异常堆栈信息
};
console.log(a);
```
![onerror截图](https://segmentfault.com/img/remote/1460000013983115?w=700&h=244)
> window.onerror即提供了我们错误的信息，还提供了错误行列号，可以精准的进行定位，如此似乎正是我们想要的，但是接下来便是填坑过程。

> 但这里有个信息要注意，语法错误会导致出现语法错误的那个脚本块执行失败，所以语法错误会导致当前代码块运行终止，从而导致整个程序运行中断，如果语法错误这个发生在我们的错误监控语句块中，那么我们就什么也监控不到了。

3. window.addEventListener('error', cb, true)
4. window.addEventListener("unhandledrejection", cb)
5. Promise.then().catch(cb)
6. 封装XMLHttpRequest&fetch | 覆写请求接口对象

---








### 异常捕获问题
1. 跨域之后window.onerror是无法捕获异常信息
```
<script>
window.onerror = function() {
    console.log(arguments);
};
</script>
<script src="http://cdn.xxx.com/index.js"></script>
```
> 解决方案便是script属性配置 crossorigin="anonymous" 并且服务器添加Access-Control-Allow-Origin。一般的CDN网站都会将Access-Control-Allow-Origin配置为*，意思是所有域都可以访问。
```
<script src="http://cdn.xxx.com/index.js" crossorigin="anonymous"></script>
```
2. webpack压缩代码，无法定位错误位置
> 我们用webpack将代码打包压缩成bundle.js，这时候便出现了压缩后的代码无法找到原始报错位置的问题。
```
启用source-map，然后再服务端对source-map进行解析。
 ```
3. MVVM框架

    3.1 Vue 2.x    
    > 在Vue实例中，使用window.onerror来捕获异常，或许根本捕获不到，因为你的异常信息被框架自身的异常机制捕获了。比如Vue 2.x中我们应该这样捕获全局异常：
    ```
    Vue.config.errorHandler = function (err, vm, info) {
        let { 
            message, // 异常信息
            name, // 异常名称
            script,  // 异常脚本url
            line,  // 异常行号
            column,  // 异常列号
            stack  // 异常堆栈信息
        } = err;
        
        // vm为抛出异常的 Vue 实例
        // info为 Vue 特定的错误信息，比如错误所在的生命周期钩子
    }
    ```
    > Vue官方推荐使用 [Sentry](https://sentry.io/for/vue/) 和 [Bugsnag](https://docs.bugsnag.com/platforms/browsers/vue/) 捕获异常，并且为 Vue 提供了官方集成.

    3.2 React 16.x
    > 在 React 16.x 版本中引入了 Error Boundary
    ```
    class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false };
        }

        componentDidCatch(error, info) {
            this.setState({ hasError: true });
            
            // 将异常信息上报给服务器
            logErrorToMyService(error, info); 
        }

        render() {
            if (this.state.hasError) {
                return '出错了';
            }
        
            return this.props.children;
        }
    }
    ```
    ```
    <ErrorBoundary>
        <MyWidget />
    </ErrorBoundary>
    ```




---










### 异常上报

1. ES5语法，在HTML文件head头部引入，方便更全面的捕获所有异常及性能问题
2. 采集用户及设备信息，用埋点的那一套。
3. 部分重要日志使用img请求上报, url参数带上错误信息

```
window.onerror = function(errorMessage, scriptURI, lineNo, columnNo, error) {

    // 构建错误对象
    var errorObj = {
        errorMessage: errorMessage || null,
        scriptURI: scriptURI || null,
        lineNo: lineNo || null,
        columnNo: columnNo || null,
        stack: error && error.stack ? error.stack : null
    };

    if (XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    
        xhr.open('post', '/middleware/errorMsg', true); // 上报给node中间层处理
        xhr.setRequestHeader('Content-Type', 'application/json'); // 设置请求头
        xhr.send(JSON.stringify(errorObj)); // 发送参数
    }
}
```

![流程图](https://segmentfault.com/img/remote/1460000013983119?w=850&h=627)




### 前端查询
1. 筛选条件：
```
device_id: 未登录筛选用户
user_id: 已登录筛选用户
phone: 客服反馈用户

project_id: 筛选项目
event_id: 筛选事件

日期时间: 精确定位事件时间
备注: 自定义备注信息

```
[视频体验](https://static.fundebug.cn/product.mp4)

[网页demo](https://www.fundebug.com/dashboard/5c879a65abc2a30114e0ca81/errors/inbox?filters=%7B"startTime":1544854560000,"endTime":1552630560000%7D&sortby=%7B"sortfield":"lastSeen","sortvalue":"descending"%7D&search=&eventId=&errorStatus=&token=)




---


## 性能监控
> 不同用户，不同机型、不同系统、不同网络环境
1. 白屏时间 (地址栏输入网址后回车 - 浏览器出现第一个元素)
1. 首屏时间 (地址栏输入网址后回车 - 浏览器第一屏渲染完成)
1. http等请求的响应时间
1. 静态资源整体下载时间
1. 页面组件渲染时间
1. 页面交互动画完成时间
1. 爬虫耗时


### 数据监控
> 交给我们强大的埋点系统