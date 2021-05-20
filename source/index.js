function Promise(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.fulfilledCallbacks = [];
    this.rejectedCallbacks = [];
    let resolve = (value) => {
        if (this.state === 'pending') {
            this.state = 'fulfilled';
            this.value = value;
            this.fulfilledCallbacks.forEach((func) => {
                func();
            });
        }
    };
    let reject = (reason) => {
        if (this.state === 'pending') {
            this.state = 'rejected';
            this.reason = reason;
            this.rejectedCallbacks.forEach((func) => {
                func();
            });
        }
    };
    try {
        executor(resolve, reject);
    } catch (error) {
        reject(error);
    }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected =
        typeof onRejected === 'function'
            ? onRejected
            : (reason) => {
                  throw reason;
              };
    let promise2;
    if (this.state === 'fulfilled') {
        promise2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onFulfilled(this.value);
                    resolution(promise2, x, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            }, 0);
        });
    }
    if (this.state === 'rejected') {
        promise2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(this.reason);
                    resolution(promise2, x, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            }, 0);
        });
    }
    if (this.state === 'pending') {
        promise2 = new Promise((resolve, reject) => {
            this.fulfilledCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolution(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            });
            this.rejectedCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolution(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            });
        });
    }
    return promise2;
};

Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected);
};

Promise.prototype.finally = function (onFinally) {
    let promise2;
    promise2 = new Promise((resolve, reject) => {
        this.then(
            (value) => {
                try {
                    let finallyR = typeof onFinally === 'function' && onFinally();
                    if (finallyR instanceof Promise) {
                        finallyR.then(() => {
                            resolution(promise2, value, resolve, reject);
                        }, reject);
                    } else {
                        resolution(promise2, value, resolve, reject);
                    }
                } catch (error) {
                    reject(error);
                }
            },
            (reason) => {
                try {
                    let finallyR = typeof onFinally === 'function' && onFinally();
                    if (finallyR instanceof Promise) {
                        finallyR.then(() => {
                            reject(reason);
                        }, reject);
                    } else {
                        reject(reason);
                    }
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
    return promise2;
};

Promise.resolve = function (value) {
    if (value instanceof Promise) {
        return value;
    }
    let promise2;
    promise2 = new Promise((resolve, reject) => {
        resolution(promise2, value, resolve, reject);
    });
    return promise2;
};

Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
        reject(reason);
    });
};

Promise.race = function (promises) {
    promises = [...promises];
    return new Promise((resolve, reject) => {
        promises.forEach((promise) => {
            Promise.resolve(promise).then(resolve, reject);
        });
    });
};

Promise.all = function (promises) {
    promises = [...promises];
    return new Promise((resolve, reject) => {
        let len = promises.length;
        if (len === 0) {
            resolve([]);
        }
        let result = new Array(len);
        let remaining = len;
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
        let len = promises.length;
        if (len === 0) {
            resolve([]);
        }
        let result = new Array(len);
        let remaining = len;
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
        let len = promises.length;
        if (len === 0) {
            resolve([]);
        }
        let remaining = len;
        let errors = new Array(len);
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(resolve, (reason) => {
                errors[index] = reason;
                if (--remaining === 0) {
                    reject(new AggregateError(errors, 'All Promises rejected'));
                }
            });
        });
    });
};

function resolution(promise, x, resolve, reject) {
    if (promise === x) {
        reject(new TypeError('Chaining cycle detected for promise'));
        return;
    }
    if (x instanceof Promise) {
        x.then((value) => {
            resolution(promise, value, resolve, reject);
        }, reject);
        return;
    }
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        let then;
        try {
            then = x.then;
        } catch (error) {
            reject(error);
            return;
        }
        if (typeof then === 'function') {
            let called = false;
            try {
                then.call(
                    x,
                    (y) => {
                        if (!called) {
                            called = true;
                            resolution(promise, y, resolve, reject);
                        }
                    },
                    (r) => {
                        if (!called) {
                            called = true;
                            reject(r);
                        }
                    }
                );
            } catch (error) {
                if (!called) {
                    called = true;
                    reject(error);
                }
            }
        } else {
            resolve(x);
        }
    } else {
        resolve(x);
    }
}

module.exports = Promise;
