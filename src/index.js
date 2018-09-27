const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

export default class TcPromise {
  constructor(func) {
    this._status = PENDING
    this._value = void 0
    this._fulfilledQueue = []
    this._rejectedQueue = []
    if (typeof func !== 'function') {
      throw new Erroe(`Promise resolver ${func} is not a function`)
    }
    try {
      func(this._resolve.bind(this), this._reject.bind(this))
    } catch (err) {
      this._reject(err)
    }
  }

  _resolve(val) {
    setTimeout(() => {

      if(this._status !== PENDING) return

      const runFulfilled = (val) => {
        this._value = val
        this._status = FULFILLED
        let fulfilledCb
        while (fulfilledCb = this._fulfilledQueue.shift()) {
          fulfilledCb(val)
        }
      }

      const runRejected = (err) => {
        this._value = value
        this._status = REJECTED
        let rejectedCb
        while (rejectedCb = this._rejectedQueue.shift()) {
          rejectedCb(err)
        }
      }

      if (val instanceof TcPromise) {
        val.then(value => {
          runFulfilled(value)
        }, error => {
          runRejected(error)
        })
      } else {
        runFulfilled(val)
      }
    }, 0)
  }

  _reject(err) {
    setTimeout(() => {
      if(this._status !== PENDING) return
      this._status = REJECTED
      this._value = err
      let rejectedCb
      while(rejectedCb = this._rejectedQueue.shift()) {
        rejectedCb(err)
      }
    }, 0)
  }

  then(onFulfilled, onRejected) {
    const { _value, _status } = this
    return new TcPromise((onFulfilledNext, onRejectedNext) => {

      let fulfilled = value => {
        try {
          if (typeof onFulfilled !== 'function') {
            onFulfilledNext(value)
          } else {
            let result = onFulfilled(value)
            if (result instanceof TcPromise) {
              result.then(onFulfilledNext, onRejectedNext)
            } else {
              onFulfilledNext(result)
            }
          }
        } catch (err) {
          onRejectedNext(err)
        }
      }

      let rejected = error => {
        try {
          if (typeof onRejected !== 'function') {
            onRejectedNext(error)
          } else {
            let result = onRejected(error)
            if (result instanceof TcPromise) {
              res.then(onFulfilledNext, onRejectedNext)
            } else {
              onFulfilledNext(result)
            }
          }
        } catch (err) {
          onRejectedNext(err)
        }
      }
      switch (_status) {
        case PENDING:
          this._fulfilledQueue.push(fulfilled)
          this._rejectedQueue.push(rejected)
          break
        case FULFILLED:
          fulfilled(_value)
          break
        case REJECTED:
          rejected(_value)
          break
      }
    })
  }
}

// 测试用例

new TcPromise(resolve => resolve(8))
  .then()
  .then()
  .then(function foo(value) {
    alert(value)
  })

// function loadImg(src) {
//   const promise = new TcPromise((resolve, reject) => {
//     let img = document.createElement('img')
//     img.onload = () => {
//       resolve(img)
//     }
//     img.onerror = () => {
//       reject()
//     }
//     img.src = src
//   })
//   return promise
// }

// let src = 'https://www.imooc.com/static/img/index/hhhhhhhhhhlogo.png'
// let result = loadImg(src)
// result.then(function() {
//   console.log(111)
// }, function () {
//   console.log(222)
// }).then(() => {
//   console.log(1)
// })
// result.then(function () {
//   console.log(11111111)
// }, function() {
//   console.log(22222222)
// })