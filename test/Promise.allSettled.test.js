const Promise = require('../source');

test('Promise.allSettled', async () => {
    expect.assertions(1);
    const p = Promise.allSettled([
        Promise.resolve(33),
        new Promise((resolve) => setTimeout(() => resolve(66), 0)),
        99,
        Promise.reject('reject'),
    ]);
    await expect(p).resolves.toEqual([
        { status: 'fulfilled', value: 33 },
        { status: 'fulfilled', value: 66 },
        { status: 'fulfilled', value: 99 },
        { status: 'rejected', reason: 'reject' },
    ]);
});
