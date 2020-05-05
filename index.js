const express = require('express');
const app = express();
const bodyParse = require('body-parser');
const connection = require('./database/database');
//controllers
const categoriesController = require('./categories/categoriesController');
const articlesController = require('./articles/articlesController');
//models
const modelCategory = require('./categories/category');
const modelArticle = require('./articles/article');

//view engine
app.set('view engine', 'ejs');

//file static
app.use(express.static('public'));

//body parser
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

//Datadase
connection.authenticate().then(() => {
    console.log('Conexao com sucesso!');
}).catch((erro) => {
    console.log('Conexao erro: ' + erro);
});

//externs routers config
app.use('/', categoriesController);
app.use('/', articlesController);

app.get('/', (req, res) => {
    var limit = 4; //limit depends on the articlesController.js ('/articles/page/:num')
    modelArticle.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: limit
    }).then(articles => {
        modelCategory.findAll().then(categories => {
            res.render('index', {
                articles: articles,
                categories: categories
            });
        });
    });
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    modelArticle.findOne({ where: { slug: slug } }).then(article => {
        if (article != undefined) {
            modelCategory.findAll().then(categories => {
                res.render('article', {
                    article: article,
                    categories: categories
                });
            });
        } else {
            res.redirect('/');
        }
    }).catch(erro => {
        res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    modelCategory.findOne(
        {
            where:
                { slug: slug },
            include: [
                { model: modelArticle }
            ]
        }).then(category => {
            if (category != undefined) {
                modelCategory.findAll().then(categories => {
                    res.render('index', {
                        articles: category.articles,
                        categories: categories
                    });
                });
            } else {
                res.redirect('/');
            }
        }).catch(erro => {
            res.redirect('/');
        });
});

app.listen('8080', () => {
    console.log('Servidor rodando!');
});