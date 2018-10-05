const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class TcPromise {
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error(`Promise resolver ${fn} is not a function`)
    }
    this._status = PENDING
    this._val = void 0
    this._onFulfilledCallback = []
    this._onRejectedCallback = []
    try {
      fn(this._resolve.bind(this), this._rejected.bind(this))
    } catch (ex) {
      this._rejected(ex)
    }
  }

  _resolve(value) {
    if (this._status !== PENDING) return
    setTimeout(() => {
      const runFulfilled = (runVal) => {
        let cb
        while(cb = this._onFulfilledCallback.shift()) {
          cb(runVal)
        }
      }
      const runRejected = (runErr) => {
        let cb
        while(cb = this._onRejectedCallback.shift()) {
          cb(runErr)
        }
      }

      if (value instanceof TcPromise) {
        value.then(runVal => {
          this._val = runVal
          this._status = FULFILLED
          runFulfilled(runVal)
        }, runErr => {
          this._val = runErr
          this._status = REJECTED
          runRejected(runErr)
        })
      } else {
        this._val = value
        this._status = FULFILLED
        runFulfilled(value)
      }
    })
  }

  _rejected(error) {
    if (this._status !== PENDING) return
    setTimeout(() => {
      this._status = REJECTED
      this._val = error
      let cb
      while(cb = this._onRejectedCallback.shift()) {
        cb(error)
      }
    })
  }

  then(onFulfilled, onRejected) {
    const { _status, _val } = this
    return new TcPromise((resolveNext, rejectNext) => {
      const fulfilled = (value) => {
        try {
          if (typeof onFulfilled !== 'function') {
            resolveNext(value)
          } else {
            let result = onFulfilled(value)
            if (result instanceof TcPromise) {
              result.then(resolveNext, rejectNext)
            } else {
              resolveNext(value)
            }
          }
        } catch (ex) {
          rejectNext(ex)
        }
      }

      const rejected = (error) => {
        try {
          if (typeof onRejected !== 'function') {
            rejectNext(error)
          } else {
            let result = onRejected(error)
            if (result instanceof TcPromise) {
              result.then(resolveNext, rejectNext)
            } else {
              resolveNext(result)
            }
          }
        } catch (ex) {
          rejectNext(ex)
        }
      }

      switch (_status) {
        case PENDING:
          this._onFulfilledCallback.push(fulfilled)
          this._onRejectedCallback.push(rejected)
          break
        case FULFILLED:
          fulfilled(_val)
          break
        case REJECTED:
          rejected(_val)
          break
      }
    })
  }

  catch(onRejected) {
    return this.then(void 0, onRejected)
  }

  finally(onFinally) {
    return this.then(
      value => TcPromise.resolve(onFinally()).then(() => value),
      reason => TcPromise.resolve(onFinally()).then(() => { throw reason })
    )
  }

  static resolve(value) {
    if (value instanceof TcPromise) {
      return value
    }
    return new TcPromise(resolve => resolve(value))
  }

  static all(promiseList) {
    return new TcPromise((resolve, reject) => {
      const result = []
      let count = promiseList.length
      for(let [index, promise] of promiseList.entries()) {
        this.resolve(promise).then(val => {
          result[index] = val
          count--
          if (count === 0) resolve(result)
        }, err => {
          reject(err)
        })
      }
    })
  }

  static race(promiseList) {
    return new TcPromise((resolve, reject) => {
      for(let promise of promiseList) {
        this.resolve(promise).then(val => {
          resolve(val)
        }, err => {
          reject(err)
        })
      }
    })
  }
}
