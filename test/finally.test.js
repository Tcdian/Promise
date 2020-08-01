const Promise = require('../source');

test('Promise.resolve(2).finally(() => {})', () => {
    return expect(Promise.resolve(2).finally(() => {})).resolves.toBe(2);
});

test('Promise.reject(3).finally(() => {})', () => {
    return expect(Promise.reject(3).finally(() => {})).rejects.toBe(3);
});
