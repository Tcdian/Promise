/* eslint-disable jest/no-conditional-expect */
const Promise = require('../source');

test('捕获抛出的错误', async () => {
    expect.assertions(1);
    const p1 = new Promise(() => {
        throw 'Uh-oh!';
    });
    await p1.catch((error) => {
        expect(error).toBe('Uh-oh!');
    });
});

test('捕获 rejected', async () => {
    expect.assertions(1);
    await Promise.reject('fail').catch((error) => {
        expect(error).toBe('fail');
    });
});
