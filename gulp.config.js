module.exports = function() {
    var sourceDir   = 'src/';
    var outDir      = 'dist/';

    var outSourceDir = outDir + sourceDir;

    var config = {
        paths : {
            sourceDir:                  sourceDir,
            sourcePattern:              sourceDir + '**/*.ts',
            outDir:                     outDir,
            outSourceDir:               outSourceDir,
            outSourcePattern:           outSourceDir + '**/*.js',
            outIntegrationTestPattern:  outSourceDir + '**/*.ispec.js',
            outUnitTestPattern:         outSourceDir + '**/*.spec.js',
            outCoverageDir:             outDir + 'coverage/',
            sourceMapsDir:              'srcmaps/'
        },
        nodemon: {
            script: outSourceDir + 'main.js',
            ext: 'js',
            watch: [outSourceDir],
            ignore: ['.idea/*', '.vscode/*', 'node_modules/*'],
            exec: 'node',
            env: {
                'NODE_ENV': 'development'
            }
        },
        scheduler: {
            script: outSourceDir + 'scheduler.js',
            ext: 'js',
            watch: [outSourceDir],
            ignore: ['.idea/*', '.vscode/*', 'node_modules/*'],
            exec: 'node',
            env: {
                'NODE_ENV': 'development'
            }
        }

    };
    
    return config;
};