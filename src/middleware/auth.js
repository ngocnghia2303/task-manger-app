const User = require('../models/user')
const jwt = require('jsonwebtoken')
const chalk = require('chalk')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '')
        console.log(token)
        // verify a token symmetric - synchronous
        const decoded = jwt.verify(token, 'this-is-my-new-course')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({ error: 'Please check authenticate' })
    }
}

module.exports = auth