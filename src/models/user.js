const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const chalk = require('chalk')

const userSchema = new mongoose.Schema({

    'name': {
        type: String,
        required: true,
        trim: true
    },

    'email': {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },

    'age': {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },

    //Goal1: Add a password feild to User
    'password': {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Ensure than pass does not contain "password"')
            }
        }
    },

    //Goal: create token feild is Array Object [{}]
    'tokens': [{
        token: {
            type: String,
            required: true
        }
    }]
})
//Tạo token khi login (chú ý: schema.methods() không dùng arrow function)
userSchema.methods.generateAuthToken = async function () {
    //lưu giá trị req body gồm email vs pass vs _id vào biến user bằng this
    const user = this
    //tạo token bằng object _id
    const token = await jwt.sign({_id: user._id.toString()}, 'this-is-my-new-course')
    //join string trong biến token thành 1 chuỗi mới với .concat()
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}


//Xác thực thông tin tĩnh bằng (email/password) với method schema.static()
userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email })
    console.log(user)

    if (!user) {
        throw new Error('==>Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login!')
    }
    console.log('password success!!')

    return user
}

//Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User