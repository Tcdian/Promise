const promisesAplusTests = require('promises-aplus-tests');
const Promise = require('../source/index');

const deferred = function () {
    const dfd = {};
    dfd.promise = new Promise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};

promisesAplusTests({ deferred }, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
});
