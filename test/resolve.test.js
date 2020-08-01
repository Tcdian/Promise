const Promise = require('../source');

test(`使用静态Promise.resolve方法`, () => {
    return expect(Promise.resolve('Success')).resolves.toBe('Success');
});

test(`resolve一个数组`, () => {
    return expect(Promise.resolve([1, 2, 3])).resolves.toEqual([1, 2, 3]);
});

test(`resolve另一个promise`, () => {
    const original = Promise.resolve(33);
    const cast = Promise.resolve(original);
    expect(original).toBe(cast);
});

describe(`resolve thenable`, () => {
    test(`Resolve一个thenable对象`, () => {
        const p = Promise.resolve({
            then: function (onFulfill, onReject) {
                onFulfill('fulfilled!');
            },
        });
        expect(p instanceof Promise).toBe(true);
        return expect(p).resolves.toBe('fulfilled!');
    });

    test(`Thenable在callback之前抛出异常`, () => {
        const thenable = {
            then: function (resolve) {
                throw new TypeError('Throwing');
                resolve('Resolving');
            },
        };
        const p = Promise.resolve(thenable);
        return expect(p).rejects.toThrow('Throwing');
    });

    test(`Thenable在callback之后抛出异常`, () => {
        const thenable = {
            then: function (resolve) {
                resolve('Resolving');
                throw new TypeError('Throwing');
            },
        };
        const p = Promise.resolve(thenable);
        return expect(p).resolves.toBe('Resolving');
    });
});
