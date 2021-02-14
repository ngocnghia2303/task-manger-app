const express = require('express')
const multer = require('multer')
const { update } = require('../models/user')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account.js')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const sharp = require('sharp')

//GOAL: Create User
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        //send Email welcome user joining
        sendWelcomeEmail(user.email, user.name)
        //generate a token for the saved user
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
    return console.log('testing USER done!')
})

//GOAL: Read my profile
router.get('/users/me', auth, async (req, res) => {
    //Model method ex: find()
    res.send(req.user)
})

//UPDATE HTTP REQUEST
router.patch('/users/me', auth, async (req, res) => {
    //Lọc keys (tên thuộc tính)
    const updates = Object.keys(req.body)
    //GOAL: tạo mảng chứa thuộc tính cho phép thay đổi
    const allowedUpdate = ["name", "email", "password", "age"]
    //kiểm tra giá trị update có tồn tại trong mảng thuộc tính trên không
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//GOAL: Delete User with http method DELETE. Queries: model.findByIdAndDelete(_id)
router.delete('/users/me', auth, async (req, res) => {

    //handler process errors
    try {

        //using middleware remove() user tasks
        await req.user.remove()
        //send email cancelation user
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
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


//GOAL: Logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

//GOAL: Logout All
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

//GOAL: Upload avatar by Multer
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|gif|png|tiff|bmp|jpeg )$/)) {
            return cb(new Error('please upload file images'))
        }
        cb(undefined, true)
    }

})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 300
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

//GOAL: Setup router Delete /users/me/avatar (note: authentication user)
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//GOAL: GET avatar by id user
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        /*
        res.set({ 
            'Content-Type': 'application/json'
        }); 
        */
        res.set('Content-Type', 'image/png')
        //output is avatar of user byID
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send(error)
    }
})

module.exports = router