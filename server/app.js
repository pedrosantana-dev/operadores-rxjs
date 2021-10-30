const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./product');
const morgan = require('morgan');

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'));

mongoose.connect('mongodb://localhost:27017/http_client',
    {useNewUrlParser: true});


app.get('/products', (req, res) => {
    Product.find({}).lean().exec((err, prods) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(prods);
        }
    });
});

app.get('/productserr', (req, res) => {
    setTimeout(() => {
        res.status(500).send({
            message: 'Messagem de erro do servidor'
        });
    }, 2000);
});

app.get('/productsdelay', (req, res) => {
    setTimeout(() => {
        Product.find({}).lean().exec((err, prods) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).json(prods);
            }
        });
    }, 5000);
});

app.get('/products_ids', (req, res) => {
    Product.find({}).lean().exec((err, prods) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(
                prods.map(p => p._id));
        }
    });
});

app.get('/products/name/:id', (req, res) => {
    const id = req.params.id;
    Product.findById(id, (err, prod) => {
        if (err)
            res.status(500).send(err);
        else if (!prod)
            res.status(404).send({});
        else
            res.status(200).send(prod.name);
    });
});

app.post('/products', (req, res) => {
    let p = new Product({
        name: req.body.name,
        department: req.body.department,
        price: req.body.price
    });
    p.save((err, prod) => {
        if (err)
            res.status(500).json(err);
        else
            res.status(200).json(prod);
    });
});

app.delete('/products/:id', (req, res) => {
    Product.deleteOne({_id: req.params.id},
        (err) => {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json({});
        });
});

app.patch('/products/:id', (req, res) => {
    Product.findById(req.params.id, (err, prod) => {
        if (err)
            res.status(500).json(err);
        else if (!prod)
            res.status(404).json({});
        else {
            prod.name = req.body.name;
            prod.department = req.body.department;
            prod.price = req.body.price;
            prod.save((err, prod) => {
                if (err)
                    res.status(500).json(err);
                else
                    res.status(200).json(prod);
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor executando na porta', 3000);
});