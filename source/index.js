const resolvePromise = require('./resolvePromise');
function Promise(executor) {
    const _this = this;
    _this.status = 'pending';
    _this.value = undefined;
    _this.reason = undefined;
    _this.fulfilledCallbacks = [];
    _this.rejectedCallbacks = [];
    function resolve(value) {
        if (_this.status === 'pending') {
            _this.status = 'fulfilled';
            _this.value = value;
            _this.fulfilledCallbacks.forEach((func) => {
                func();
            });
        }
    }
    function reject(reason) {
        if (_this.status === 'pending') {
            _this.status = 'rejected';
            _this.reason = reason;
            _this.rejectedCallbacks.forEach((func) => {
                func();
            });
        }
    }
    executor(resolve, reject);
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    const _this = this;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected =
        typeof onRejected === 'function'
            ? onRejected
            : (error) => {
                  throw error;
              };
    let promise2;
    if (_this.status === 'fulfilled') {
        promise2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const x = onFulfilled(_this.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
    if (_this.status === 'rejected') {
        promise2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const x = onRejected(_this.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
    if (_this.status === 'pending') {
        promise2 = new Promise((resolve, reject) => {
            _this.fulfilledCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(_this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            });
            _this.rejectedCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        const x = onRejected(_this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        });
    }
    return promise2;
};

Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
};

Promise.prototype.finally = function () {
    const _this = this;
    let promise2;
    if (_this.status === 'fulfilled') {
        promise2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    resolve(_this.value);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
    if (_this.status === 'rejected') {
        promise2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    reject(_this.reason);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
    if (_this.status === 'pending') {
        promise2 = new Promise((resolve, reject) => {
            _this.fulfilledCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        resolve(_this.value);
                    } catch (error) {
                        reject(error);
                    }
                });
            });
            _this.rejectedCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        reject(_this.reason);
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        });
    }
    return promise2;
};

Promise.resolve = function (value) {
    if (value instanceof Promise) {
        return value;
    }
    let promise2;
    promise2 = new Promise((resolve, reject) => {
        resolvePromise(promise2, value, resolve, reject);
    });
    return promise2;
};

Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
        reject(reason);
    });
};

Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let promise of promises) {
            Promise.resolve(promise).then(resolve, reject);
        }
    });
};

Promise.all = function (promises) {
    promises = [...promises];
    return new Promise((resolve, reject) => {
        if (promises.length === 0) {
            resolve([]);
            return;
        }
        const result = new Array(promises.length);
        let remaining = promises.length;
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then((value) => {
                result[index] = value;
                if (--remaining === 0) {
                    resolve(result);
                }
            }, reject);
        });
    });
};

Promise.allSettled = function (promises) {
    promises = [...promises];
    return new Promise((resolve, reject) => {
        if (promises.length === 0) {
            resolve([]);
            return;
        }
        const result = new Array(promises.length);
        let remaining = promises.length;
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
                (value) => {
                    result[index] = { status: 'fulfilled', value };
                    if (--remaining === 0) {
                        resolve(result);
                    }
                },
                (reason) => {
                    result[index] = { status: 'rejected', reason };
                    if (--remaining === 0) {
                        resolve(result);
                    }
                }
            );
        });
    });
};

Promise.any = function (promises) {
    promises = [...promises];
    return new Promise((resolve, reject) => {
        if (promises.length === 0) {
            resolve([]);
            return;
        }
        let remaining = promises.length;
        promises.forEach((promise) => {
            Promise.resolve(promise).then(resolve, (reason) => {
                if (--remaining === 0) {
                    // AggregateError 未支持
                    reject(new Error('No Promise in Promise.any was resolved'));
                }
            });
        });
    });
};

module.exports = Promise;
