// controllers/controller.js

const redis = require('../config/redis')
const dataList = 'Received'

// Add input to Redis Queue
exports.addToRedisQueue = (req, res) => {
    const input = req.body

    // Push into redis queue
    redis.lpush(dataList, JSON.stringify(input), (err) => {
        if (err) 
            console.log('Error performing LPUSH on Redis: ' + err)

            // Send success message
        res
            .status(200)
            .send({success: true, message: 'OK', value: input})
    })
}