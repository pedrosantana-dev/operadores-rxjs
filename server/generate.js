const mongoose = require('mongoose');
const Product = require('./product');
const faker = require('faker');
const {mongo} = require("mongoose");

mongoose.connect(
    'mongodb://localhost:27017/http_client',
    {useNewUrlParser: true});

let generateProducts = async () => {
    for (let i = 0; i < 10; i++) {
        let p = new Product({
            name: faker.commerce.productName(),
            department: faker.commerce.department(),
            price: faker.commerce.price()
        });
        try {
            await p.save();
        } catch (err) {
            throw new Error('Error generating products');
        }
    }

}

generateProducts().then(()=> {
    mongoose.disconnect();
    console.log('OK');
});