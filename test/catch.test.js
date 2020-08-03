const Promise = require('../source');

test('抛出一个错误，大多数时候将调用catch方法', () => {
    const p1 = new Promise(function (resolve, reject) {
        throw 'Uh-oh!';
    });
    return p1.catch((error) => {
        expect(error).toBe('Uh-oh!');
    });
});

test('捕获 rejected', () => {
    return Promise.reject('fail').catch((error) => {
        expect(error).toBe('fail');
    });
});
