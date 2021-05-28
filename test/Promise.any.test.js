const Promise = require('../source');

test('Promise.any() First to fulfil', async () => {
    expect.assertions(1);
    const pErr = new Promise((resolve, reject) => {
        reject('Always fails');
    });

    const pSlow = new Promise((resolve) => {
        setTimeout(resolve, 500, 'Done eventually');
    });

    const pFast = new Promise((resolve) => {
        setTimeout(resolve, 100, 'Done quick');
    });

    await expect(Promise.any([pErr, pSlow, pFast])).resolves.toBe('Done quick');
});

test('Promise.any() Rejections with AggregateError', async () => {
    expect.assertions(1);
    const pErr = new Promise((resolve, reject) => {
        reject('Always fails');
    });

    await expect(Promise.any([pErr])).rejects.toEqual(new AggregateError(['Always fails'], 'All Promises rejected'));
});
