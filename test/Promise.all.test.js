const Promise = require('../source');

describe('Promise.all 的使用', () => {
    test('Promise.all 等待所有都完成', async () => {
        expect.assertions(1);
        const p1 = Promise.resolve(3);
        const p2 = 1337;
        const p3 = new Promise((resolve) => {
            setTimeout(resolve, 100, 'foo');
        });
        await expect(Promise.all([p1, p2, p3])).resolves.toEqual([3, 1337, 'foo']);
    });

    test('Promise.all 失败', async () => {
        expect.assertions(1);
        await expect(Promise.all([1, 2, 3, Promise.reject(555)])).rejects.toBe(555);
    });
});

describe('Promise.all 的异步和同步', () => {
    test('Promise.all 成功异步', async () => {
        expect.assertions(2);
        const p = Promise.all([Promise.resolve(33), Promise.resolve(44)]);
        expect(p.state).toBe('pending');
        await expect(p).resolves.toEqual([33, 44]);
    });

    test('Promise.all 失败异步', async () => {
        expect.assertions(2);
        const p = Promise.all([Promise.resolve(33), Promise.reject(44)]);
        expect(p.state).toBe('pending');
        await expect(p).rejects.toBe(44);
    });

    test('Promise.all([]) 同步', () => {
        expect.assertions(1);
        const p = Promise.all([]);
        expect(p.state).toBe('fulfilled');
    });
});

describe('Promise.all 快速返回失败', () => {
    test('Promise.all 返回失败', async () => {
        const p1 = new Promise((resolve) => {
            setTimeout(resolve, 100, 'one');
        });
        const p2 = new Promise((resolve) => {
            setTimeout(resolve, 200, 'two');
        });
        const p3 = new Promise((resolve) => {
            setTimeout(resolve, 300, 'three');
        });
        const p4 = new Promise((resolve) => {
            setTimeout(resolve, 400, 'four');
        });
        const p5 = new Promise((resolve, reject) => {
            setTimeout(reject, 0, 'reject');
        });

        await expect(Promise.all([p1, p2, p3, p4, p5])).rejects.toBe('reject');
    });
});
