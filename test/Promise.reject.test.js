const Promise = require('../source');

test('使用静态Promise.reject()方法', async () => {
    expect.assertions(1);
    await expect(Promise.reject(new Error('fail'))).rejects.toThrow('fail');
});
