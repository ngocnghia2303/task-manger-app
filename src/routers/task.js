const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const chalk = require('chalk')

const router = new express.Router()
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        //owner của task = user._id
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
    return console.log('testing TASK done!')
})

/*
So now that we have timestamps enabled they could sort by when the task was last created or last updated
 they could sort by the completed value putting the complete tasks first or putting the incomplete
*/


//GET/tasks?limit=10&skip=20
//limit&skip
//GET/task?sortBy=createdAt:desc

/*
GOAL: Skip Option
- Parse query option to integer
- Test app
 + Fetch the 1 st page of 2 and then the 3rd page of 2
 (limit 2 object/1 page, 1 st => skip=0 and page 3rd =>skip=2)
 + Fetch the 1 st page of 3 and then the 2rd page of 3
*/

// Goal: Refactor GET/Tasks (Only tasks of the user login)
router.get('/tasks', auth, async (req, res) => {
    //filter by query string
    const match = {}
    const sort = {}

    if (req.query.compelete) {
        match.compelete = req.query.compelete === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1: 1
    }

    //GET/tasks?compelete=true
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            // limit result by property option.limit
            options: {
                //limit: 10
                //limit & skip by query String (Parse query option to integer)
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

//Goal: fetch task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })

        if (!task) {
            console.log(chalk('Please check id task request'))
            return res.status(404).send('Please check id task request')
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

//Goal: Allow for task updates
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["compelete", "description"]
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update!' })
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) {
            return res.status(404).send('Task not found ====> Please check id task requested!')
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
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