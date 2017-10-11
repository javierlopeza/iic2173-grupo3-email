// config/redis.js

const redis = require('redis')

const config = {
    production: {
        redisURL: process.env.REDIS_URL
    },
    dev: {
        redisURL: 'redis://127.0.0.1:6379'
    },
    test: {
        redisURL: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
    },
    default: {
        redisURL: process.env.REDIS_URL
    }
}

const client = redis.createClient(config[process.env.NODE_ENV].redisURL)

client.on('connect', () => {
    console.log('Connected to Redis at: ' + config[process.env.NODE_ENV].redisURL)
})

module.exports = client
