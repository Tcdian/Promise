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

Promise.all = function (promises) {};

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        reject(new TypeError('Chaining cycle detected for promise'));
        return;
    }
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        let called = false;
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(
                    x,
                    (y) => {
                        if (called) {
                            return;
                        }
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    (error) => {
                        if (called) {
                            return;
                        }
                        called = true;
                        reject(error);
                    }
                );
            } else {
                resolve(x);
            }
        } catch (error) {
            if (called) {
                return;
            }
            called = true;
            reject(error);
        }
    } else {
        resolve(x);
    }
}

module.exports = Promise;
