import {Application} from './application';
import {LoggerFactory} from './core/logging/logger.factory';
LoggerFactory.initLogger(__dirname);

/**
 * Starts the server.
 */
async function main() {
    const app = new Application();
    await app.init();
    app.run();
}

main();
