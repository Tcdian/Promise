const Promise = require('../source');

test('Promise.race的异步性', async () => {
    expect.assertions(2);
    let p = Promise.race([Promise.resolve(33), Promise.resolve(44)]);
    expect(p.state).toBe('pending');
    await expect(p).resolves.toBe(33);
});

describe('Promise.race', () => {
    test('两个resolve，p2 先完成', async () => {
        expect.assertions(1);
        let p1 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 500, 'one');
        });
        let p2 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 100, 'two');
        });
        await expect(Promise.race([p1, p2])).resolves.toBe('two');
    });

    test('resolve 先完成', async () => {
        expect.assertions(1);
        let p3 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 100, 'three');
        });
        let p4 = new Promise(function (resolve, reject) {
            setTimeout(reject, 500, 'four');
        });
        await expect(Promise.race([p3, p4])).resolves.toBe('three');
    });

    test('reject 先完成', async () => {
        expect.assertions(1);
        let p5 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 500, 'five');
        });
        let p6 = new Promise(function (resolve, reject) {
            setTimeout(reject, 100, 'six');
        });
        await expect(Promise.race([p5, p6])).rejects.toBe('six');
    });
});
