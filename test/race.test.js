const Promise = require('../source');

describe(`Promise.race –  setTimeout 的示例`, () => {
    test(`两个resolve，p2 先完成`, () => {
        const p1 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 500, 'one');
        });
        const p2 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 100, 'two');
        });
        return expect(Promise.race([p1, p2])).resolves.toBe('two');
    });

    test(`resolve 先完成`, () => {
        const p3 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 100, 'three');
        });
        const p4 = new Promise(function (resolve, reject) {
            setTimeout(reject, 500, 'four');
        });
        return expect(Promise.race([p3, p4])).resolves.toBe('three');
    });

    test(`reject 先完成`, () => {
        const p5 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 500, 'five');
        });
        const p6 = new Promise(function (resolve, reject) {
            setTimeout(reject, 100, 'six');
        });
        return expect(Promise.race([p5, p6])).rejects.toBe('six');
    });
});
