const Promise = require('../source');

test(`使用静态Promise.reject()方法`, () => {
    return expect(Promise.reject(new Error('fail'))).rejects.toThrow('fail');
});
