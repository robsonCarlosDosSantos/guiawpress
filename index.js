const express = require('express');
const app = express();
const bodyParse = require('body-parser');
const connection = require('./database/database');
//controllers
const categoriesController = require('./categories/categoriesController');
const articlesController = require('./articles/articlesController');
//models
const Category = require('./categories/category');
const Article = require('./articles/article'); 

//view engine
app.set('view engine', 'ejs');

//file static
app.use(express.static('public'));

//body parser
app.use(bodyParse.urlencoded({ extended: false}));
app.use(bodyParse.json());

//Datadase
connection.authenticate().then(() => {
    console.log('Conexao com sucesso!');
}).catch((erro) => {
    console.log('Conexao erro: '+erro);
});

//externs routers config
app.use('/',categoriesController);
app.use('/',articlesController);

app.get('/',(req, res) => {
    res.render('index');
});

app.listen('8080',() => {
    console.log('Servidor rodando!');
});