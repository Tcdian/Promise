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
    const original = Promise.resolve(33);
    const cast = Promise.resolve(original);
    expect(original).toBe(cast);
});

describe('resolve thenable', () => {
    test('Resolve一个thenable对象', async () => {
        expect.assertions(2);
        const p = Promise.resolve({
            then: function (onFulfill) {
                onFulfill('fulfilled!');
            },
        });
        expect(p instanceof Promise).toBe(true);
        await expect(p).resolves.toBe('fulfilled!');
    });

    test('Thenable在callback之前抛出异常', async () => {
        expect.assertions(1);
        const thenable = {
            then: function (resolve) {
                throw new TypeError('Throwing');
                // eslint-disable-next-line no-unreachable
                resolve('Resolving');
            },
        };
        const p = Promise.resolve(thenable);
        await expect(p).rejects.toThrow('Throwing');
    });

    test('Thenable在callback之后抛出异常', async () => {
        expect.assertions(1);
        const thenable = {
            then: function (resolve) {
                resolve('Resolving');
                throw new TypeError('Throwing');
            },
        };
        const p = Promise.resolve(thenable);
        await expect(p).resolves.toBe('Resolving');
    });
});
