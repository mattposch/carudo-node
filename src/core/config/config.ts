import { loadEnv } from './config.loader';

// load env settings and check if mandatory entries are available
loadEnv([
    'NODE_ENV', 'MONGODB_URI'
]);

// define and export config. Default values are defined here.
export const config: any = {
    common: {
        companyName: process.env.COMPANY_NAME || 'Carudo',
        host:        process.env.COMMON_HOST || 'localhost:4000',
    },
    environment: {
        isDev:      (process.env.NODE_ENV || 'development') === 'development',
        isProd:     (process.env.NODE_ENV || 'development') === 'production',
        name:       process.env.NODE_ENV || 'development',
    },
    features: {
        // myfeature: process.env.FEATURES_MYFEATURE === 'true' || false,
    },
    logging: {
        level:      process.env.LOG_LEVEL || 'info',
        loggly: {
            enabled: process.env.LOGGLY_ENABLED === 'true' || false,
            options: {
                json: true,
                subdomain: process.env.LOGGLY_SUBDOMAIN,
                tags: ['Winston-NodeJS'],
                token: process.env.LOGGLY_TOKEN,
            }
        }
    },
    mail: {
        apikey:     process.env.MAIL_APIKEY,
        domain:     process.env.MAIL_DOMAIN,
        enabled:    process.env.MAIL_ENABLED === 'true' || false,
        sender:     process.env.MAIL_SENDER || 'test@test.com',
    },
    mongo: {
        pw:         process.env.DB_PASS,
        uri:        process.env.MONGODB_URI,
        user:       process.env.DB_USER,
    },
    server: {
        port:       process.env.PORT || 4000,
    },
    token: {
        expiresIn:  process.env.TOKEN_EXPIRESIN || '10h',
        prefix:     process.env.TOKEN_PREFIX || 'JWT',
        security:   process.env.TOKEN_SECRET || 'test123',
    }
};
