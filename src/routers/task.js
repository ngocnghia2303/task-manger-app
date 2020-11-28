const express = require('express')
const Task = require('../models/task')

const router = new express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
    return console.log('testing TASK done!')
})

router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = Task.findById(_id)
        if (!task) {
            return res.status(404).send('Please check id task request')
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

//Goal: Allow for task updates
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["compelete", "description"]
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update!' })
    }

    try {
        const task = await Task.findById(req.params.id)
        updates.forEach((update)=>task[update] = req.body[update])
        await task.save()

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true, runValidators: true
        // })

        if (!task) {
            return res.status(404).send('Task not found ====> Please check id task requesed!')
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }

})

//GOAL: Delete Task with http method DELETE
router.delete('/tasks/:id', async (req, res) => {

    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send('Please check id task requested!')
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router