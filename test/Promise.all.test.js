const Promise = require('../source');

describe('Promise.all 的使用', () => {
    test('Promise.all 等待所有都完成', async () => {
        expect.assertions(1);
        let p1 = Promise.resolve(3);
        let p2 = 1337;
        let p3 = new Promise((resolve, reject) => {
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
        let p = Promise.all([Promise.resolve(33), Promise.resolve(44)]);
        expect(p.state).toBe('pending');
        await expect(p).resolves.toEqual([33, 44]);
    });

    test('Promise.all 失败异步', async () => {
        expect.assertions(2);
        let p = Promise.all([Promise.resolve(33), Promise.reject(44)]);
        expect(p.state).toBe('pending');
        await expect(p).rejects.toBe(44);
    });

    test('Promise.all([]) 同步', () => {
        expect.assertions(1);
        let p = Promise.all([]);
        expect(p.state).toBe('fulfilled');
    });
});

test('Promise.all 的快速返回失败行为', async () => {
    expect.assertions(1);
    let p1 = new Promise((resolve, reject) => {
        setTimeout(resolve, 1000, 'one');
    });
    let p2 = new Promise((resolve, reject) => {
        setTimeout(resolve, 2000, 'two');
    });
    let p3 = new Promise((resolve, reject) => {
        setTimeout(resolve, 3000, 'three');
    });
    let p4 = new Promise((resolve, reject) => {
        setTimeout(resolve, 4000, 'four');
    });
    let p5 = new Promise((resolve, reject) => {
        reject('reject');
    });

    await expect(Promise.all([p1, p2, p3, p4, p5])).rejects.toBe('reject');
});
