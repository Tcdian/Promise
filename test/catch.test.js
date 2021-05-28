const Promise = require('../source');

test('捕获抛出的错误', async () => {
    expect.assertions(1);
    const p1 = new Promise(() => {
        throw 'Uh-oh!';
    });
    await p1.catch((error) => {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error).toBe('Uh-oh!');
    });
});

test('捕获 rejected', async () => {
    expect.assertions(1);
    await Promise.reject('fail').catch((error) => {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error).toBe('fail');
    });
});
