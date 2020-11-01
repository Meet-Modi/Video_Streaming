module.exports = {
    secret: 'floccinaucinihilipilificationmeansuseless',
    database: {
        redis: {
            host: process.env.NODE_ENV === 'production' ? 'env_cache' : 'dev_env_videostream_cache',
            port: '6379',
            keyPrefix: 'cc',
            auth: 'CC_4932'
        }
    },
    DB_URI_DEV:
        'mongodb+srv://point-123:bPHytWEG08GHIGaj@cloudvideostream.sowj8.mongodb.net/test?retryWrites=true&w=majority',
    DB_URI:
        'mongodb+srv://point-123:bPHytWEG08GHIGaj@cloudvideostream.sowj8.mongodb.net/test?retryWrites=true&w=majority',
}
