const Promise = require('../source');

test('使用静态Promise.resolve方法', async () => {
    expect.assertions(1);
    await expect(Promise.resolve('Success')).resolves.toBe('Success');
});

test('resolve一个数组', async () => {
    expect.assertions(1);
    await expect(Promise.resolve([1, 2, 3])).resolves.toEqual([1, 2, 3]);
});

test('resolve另一个promise', () => {
    expect.assertions(1);
    let original = Promise.resolve(33);
    let cast = Promise.resolve(original);
    expect(original).toBe(cast);
});

describe('resolve thenable', () => {
    test('Resolve一个thenable对象', async () => {
        expect.assertions(2);
        let p = Promise.resolve({
            then: function (onFulfill, onReject) {
                onFulfill('fulfilled!');
            },
        });
        expect(p instanceof Promise).toBe(true);
        await expect(p).resolves.toBe('fulfilled!');
    });

    test('Thenable在callback之前抛出异常', async () => {
        expect.assertions(1);
        let thenable = {
            then: function (resolve) {
                throw new TypeError('Throwing');
                resolve('Resolving');
            },
        };
        let p = Promise.resolve(thenable);
        await expect(p).rejects.toThrow('Throwing');
    });

    test('Thenable在callback之后抛出异常', async () => {
        expect.assertions(1);
        let thenable = {
            then: function (resolve) {
                resolve('Resolving');
                throw new TypeError('Throwing');
            },
        };
        let p = Promise.resolve(thenable);
        await expect(p).resolves.toBe('Resolving');
    });
});
