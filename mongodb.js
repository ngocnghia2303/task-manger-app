const { MongoClient, ObjectID } = require('mongodb')

const chalk = require('chalk');

// const connectionURL = 'mongodb://127.0.0.1:27017';
const connectionURL = 'mongodb://localhost:27017';
const databaseName = 'task-manager';

const id = new ObjectID();
console.log(chalk.inverse.blue(id))
console.log(chalk.inverse.green(id.getTimestamp()))

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log(chalk.inverse.red('Unable to connect to database!'));
    }
    console.log(chalk.inverse.green('Connected correctly!'));
    const db = client.db(databaseName);

    db.collection('users').updateOne({
        name: 'Linda HTV'
    }, {
        $inc: {
            age: 3
        }
    }).then((result) => {
        console.log(`Update compelete: ${result}`)
    }).catch((error) => {
        console.log(`Can not update document: ${error}`)
    });

    db.collection('task').updateMany({
        "compelete": false
    },{
        $set: {
            "compelete": true
        }
    }).then((result)=>{
        console.log(`Update compelete: ${result.modifiedCount}`)
    }).catch((error)=>{
        console.log(`Can not update document: ${error}`)
    })
    //INSERT ONE DOCUMENT
    // db.collection('users').insertOne({
    //     name: 'Ngoc Nghia',
    //     age: 27
    // }, (error, result)=>{
    //     if(error){
    //         return console.log(chalk.inverse.red('Unable to insert user'));
    //     } console.log(result.ops) 
    //     //ops: Contains the document inserted with added _id fields
    //     //result: Contains the result document from MongoDB
    // });

    //INSERT MANY DOCUMENT USER
    // db.collection('user').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 26
    //     },
    //     {
    //         name: 'Gunter',
    //         age: 25
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log(chalk.inverse.red('Unable to insert user'))
    //     } console.log(result.ops)
    // });

    //INSERT MANY DOCUMENT TASK
    // db.collection('task').insertMany([
    //     {
    //         description: 'Clean the house',
    //         compelete: true
    //     },
    //     {
    //         description: 'Renew inspection',
    //         compelete: false
    //     },
    //     {
    //         description: 'Pot Plant',
    //         compelete: false
    //     },
    // ], (error, result)=>{
    //     if(error){
    //        return console.log(chalk.inverse.red('Unable to insert tasks!'))
    //     }
    //     console.log(result.ops)
    // })

    //FIND DOCUMENT
    //FindOne
    // db.collection('user').findOne({ _id: new ObjectID("5f90d78e0d94d27824da2fb6") }, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch!');
    //     }
    //     console.log(user)
    // });

    // db.collection('user').find({ age: 26}).toArray((error, users)=>{
    //     if(error){
    //         return console.log('Dont have users!')
    //     }
    //     console.log(users)
    // })

    // db.collection('task').findOne({_id: new ObjectID('5f922df819633430c4063aa7')},(error, result)=>{
    //     if(error){
    //        return console.log('Unable find result')
    //     }
    //     console.log(result)
    // });

    // db.collection('task').find({"compelete" : false}).toArray((error, tasks)=>{
    //     if(error){
    //         return console.log('Unable find result')
    //      }
    //      console.log(tasks)
    // })
});