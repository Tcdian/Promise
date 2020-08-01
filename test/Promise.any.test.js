const Promise = require('../source');

test('Promise.any() First to fulfil', () => {
    const pErr = new Promise((resolve, reject) => {
        reject('Always fails');
    });

    const pSlow = new Promise((resolve, reject) => {
        setTimeout(resolve, 500, 'Done eventually');
    });

    const pFast = new Promise((resolve, reject) => {
        setTimeout(resolve, 100, 'Done quick');
    });

    return expect(Promise.any([pErr, pSlow, pFast])).resolves.toBe('Done quick');
});

test('Promise.any() Rejections with AggregateError', () => {
    const pErr = new Promise((resolve, reject) => {
        reject('Always fails');
    });

    return expect(Promise.any([pErr])).rejects.toThrow('No Promise in Promise.any was resolved');
});
