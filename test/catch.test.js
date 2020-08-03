const Promise = require('../source');

test('捕获抛出的错误', () => {
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
