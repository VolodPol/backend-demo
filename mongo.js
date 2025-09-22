import mongoose from 'mongoose';

const args = process.argv;

if (args.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = args[2];

const url = `mongodb+srv://volod_pol:${password}@fullstack-open.tshznnt.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullstack-open`;

mongoose.set('strictQuery',false);
await mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

if (args.length > 4) {
    const newPerson = new Person({
        name: args[3],
        number: args[4]
    });
    newPerson.save().then(
        saved => {
            console.log(`added ${saved.name} ${saved.number} to phonebook`);
            mongoose.connection.close().finally();
        }
    )
} else if (args.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        })
        mongoose.connection.close();
    })
} else {
    console.log('wrong number of arguments!');
    process.exit(1);
}