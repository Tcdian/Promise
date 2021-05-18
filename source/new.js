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
