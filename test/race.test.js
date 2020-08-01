const Promise = require('../source');

test('Promise.race的异步性', () => {
    const p = Promise.race([Promise.resolve(33), Promise.resolve(44)]);
    expect(p.status).toBe('pending');
    return expect(p).resolves.toBe(33);
});

describe('Promise.race', () => {
    test('两个resolve，p2 先完成', () => {
        const p1 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 500, 'one');
        });
        const p2 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 100, 'two');
        });
        return expect(Promise.race([p1, p2])).resolves.toBe('two');
    });

    test('resolve 先完成', () => {
        const p3 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 100, 'three');
        });
        const p4 = new Promise(function (resolve, reject) {
            setTimeout(reject, 500, 'four');
        });
        return expect(Promise.race([p3, p4])).resolves.toBe('three');
    });

    test('reject 先完成', () => {
        const p5 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 500, 'five');
        });
        const p6 = new Promise(function (resolve, reject) {
            setTimeout(reject, 100, 'six');
        });
        return expect(Promise.race([p5, p6])).rejects.toBe('six');
    });
});
