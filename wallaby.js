module.exports = function (config) {

    return {
        files: [
            'src/**/*.ts',
            '!src/**/*.spec.ts',
            '!src/**/*.ispec.ts'
        ],

        tests: [
           'src/**/*.spec.ts',
           '!src/**/*.ispec.ts'
        ],

        testRunner: 'mocha',
        env: {
            type: 'node',
            runner: 'node'
        },
        debug: true,
        compilers: {
            'src/**/*.ts': config.compilers.typeScript({
                typescript: require('typescript')
            })
        },
    }
};
