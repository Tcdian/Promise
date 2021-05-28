const Promise = require('../source');

test('Promise.resolve(2).finally(() => {})', async () => {
    expect.assertions(1);
    await expect(Promise.resolve(2).finally(() => {})).resolves.toBe(2);
});

test('Promise.reject(3).finally(() => {})', async () => {
    expect.assertions(1);
    await expect(Promise.reject(3).finally(() => {})).rejects.toBe(3);
});

describe('finally throw error', () => {
    test('fulfilled', async () => {
        expect.assertions(1);
        await expect(
            Promise.resolve(1).finally(() => {
                throw new Error('finally error');
            })
        ).rejects.toEqual(new Error('finally error'));
    });

    test('rejected', async () => {
        expect.assertions(1);
        await expect(
            Promise.reject(1).finally(() => {
                throw new Error('finally error');
            })
        ).rejects.toEqual(new Error('finally error'));
    });
});

describe('finally return Promise', () => {
    test('fulfilled', async () => {
        expect.assertions(1);
        await expect(
            Promise.resolve(1).finally(() => {
                return Promise.resolve(2);
            })
        ).resolves.toEqual(1);
    });

    test('rejected', async () => {
        expect.assertions(1);
        await expect(
            Promise.resolve(1).finally(() => {
                return Promise.reject(2);
            })
        ).rejects.toEqual(2);
    });
});
