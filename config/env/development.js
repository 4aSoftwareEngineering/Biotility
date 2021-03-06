'use strict';

var defaultEnvConfig = require('./default');
module.exports = {
    db: {
        // uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://abc:abc@ds055574.mongolab.com:55574/intro_soft',
        // options: {
        //   user: 'abc',
        //   pass: 'abc'
        // },

        uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://team4a:team4a@ds041394.mongolab.com:41394/biotility',
        options: {
            user: '',
            pass: ''
        },
        // Enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false
    },
    log: {
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'dev',
        // Stream defaults to process.stdout
        // Uncomment to enable logging to a log on the file system
        options: {
            //stream: 'access.log'
        }
    },
    app: {
        title: defaultEnvConfig.app.title + ' - Development Environment'
    },
    mailer: {
        from: process.env.MAILER_FROM || 'MAILER_FROM',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
            auth: {
                user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
                pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
            }
        }
    },
    livereload: true,
    seedDB: process.env.MONGO_SEED || false
};
