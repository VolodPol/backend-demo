import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGODB_URI;

console.log('url from mongo module: ', url)

mongoose.set('strictQuery',false);
await mongoose.connect(url)
    .then(_ => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.log('Error: could not connect to MondoDB: ', error.message);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        validate: {
            "validator": (value) => {
                return /\d?\d{2}-\d+/.test(value);
            },
            message: it => `The number ${it.value} has incorrect format. It should have 2-3 digits before a dash and more than one after the dash.`
        },
        minLength: 9
    },
});
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject["_id"].toString();
        delete returnedObject["_id"];
        delete returnedObject["__v"];
    }
})

const Person = mongoose.model('Person', personSchema);

export default Person;