const express = require('express')
const { update } = require('../models/user')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        //generate a token for the saved user
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
    return console.log('testing USER done!')
})

router.get('/users/me', auth, async (req, res) => {
    //Model method ex: find()
    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // } catch (error) {
    //     res.status(500).send(error)
    // }
    res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    //find user by id. Handler result & errors by Promises
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(400).send('Please check id user requested')
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

//UPDATE HTTP REQUEST
router.patch('/users/:id', async (req, res) => {
    //GOAL: Cho phép update document được req bằng _id

    //Lọc keys (tên thuộc tính)
    const updates = Object.keys(req.body)

    const allowedUpdate = ["name", "email", "password", "age"]

    //GOAL: UPDATE doccument dựa trên tên thuộc tính có trong mảng
    //kiểm tra giá trị update có tồn tại trong mảng thuộc tính trên không
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update!' })
    }
    try {
        //update dynamic => sử dụng req.body
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        if (!user) {
            return res.status(404).send('Please check id user requested')
        }
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})


//GOAL: delete User with http method DELETE. Queries: model.findByIdAndDelete(_id)
router.delete('/users/:id', async (req, res) => {

    //handler process errors
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            res.status(404).send('Please check id user requested!')
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

//GOAL: Login app by email/password
router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //lấy đối số là user từ request để tạo token
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})

module.exports = router