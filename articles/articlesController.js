const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const modelCategory = require('../categories/category');
const modelArticle = require('./article');

router.get('/admin/articles',(req, res) => {
    modelArticle.findAll(
        {include: [{model: modelCategory}]
    }).then(articles => {
        res.render('admin/articles/index',{
            articles: articles
        });
    });
});

router.get('/admin/articles/new',(req, res) => {
    modelCategory.findAll().then( categories => {
        res.render('admin/articles/new',{
            categories: categories
        });
    }); 
});

router.post('/articles/save',(req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var idCategory = req.body.idCategory;
    modelArticle.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: idCategory
    }).then(() => {
        res.redirect('/admin/articles');
    });
});

router.post('/articles/delete', (req, res) => {
    var id = req.body.idArticle;
    if (id != undefined) {
        if (isNaN(id)) {
            res.redirect('/admin/articles');
        }
        modelArticle.destroy({
            where: { id: id }
        }).then(() => {
            res.redirect('/admin/articles');
        });
    } else {
        res.redirect('/admin/articles');
    }
});

router.get('/admin/articles/edit/:id', (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.render('admin/articles');
    }

    modelArticle.findByPk(id).then(article => {
        if (article != undefined) {
            modelCategory.findAll().then( categories => {
                res.render('admin/articles/edit', {
                    article: article,
                    categories: categories
                });
            });
        }else{
            res.redirect('/admin/articles');
        }
    }).catch(erro => {
        res.redirect('/admin/articles');
    });
});

router.post('/articles/update', (req, res) => {
    var idArticle = req.body.idArticle;
    var title = req.body.title;
    var body = req.body.body;
    var idCategory = req.body.idCategory;

    modelArticle.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: idCategory
    },{
        where: {id: idArticle}
    }).then(() => {
        res.redirect('/admin/articles');
    });
});

module.exports = router;