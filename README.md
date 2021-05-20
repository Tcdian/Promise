# Promise 实现

## 实现

根据 [Promises/A+ 标准](https://promisesaplus.com/) 实现的简单版 Promise，源码放置在 **source** 目录下

## 测试

通过 [Promises/A+ Compliance Test Suite](https://github.com/promises-aplus/promises-tests) 所有测试用例

其他的方法（ [catch](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch), [finally](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally), [Promise.all](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), [Promise.allSettled](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled), [Promise.any](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any), [Promise.race](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race), [Promise.reject](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject), [Promise.resolve](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve) ）根据 [MDN Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 上的介绍，使用 [jest](https://jestjs.io/en/) 写了一些简单的测试用例

测试结果：

<img src="./static/test.jpg" width="520px">
