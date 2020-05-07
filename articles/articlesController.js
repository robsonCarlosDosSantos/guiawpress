const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const modelCategory = require('../categories/category');
const modelArticle = require('./article');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/articles', adminAuth, (req, res) => {
    modelArticle.findAll(
        {include: [{model: modelCategory}]
    }).then(articles => {
        res.render('admin/articles/index',{
            articles: articles,
            user: req.session.user
        });
    });
});

router.get('/admin/articles/new', adminAuth, (req, res) => {
    modelCategory.findAll().then( categories => {
        res.render('admin/articles/new',{
            categories: categories,
            user: req.session.user
        });
    }); 
});

router.post('/articles/save', adminAuth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var idCategory = req.body.idCategory;
    modelArticle.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: idCategory
    }).then(() => {
        res.redirect('/admin/articles',{
            user: req.session.user
        });
    });
});

router.post('/articles/delete', adminAuth, (req, res) => {
    var id = req.body.idArticle;
    if (id != undefined) {
        if (isNaN(id)) {
            res.redirect('/admin/articles',{
                user: req.session.user
            });
        }
        modelArticle.destroy({
            where: { id: id }
        }).then(() => {
            res.redirect('/admin/articles',{
                user: req.session.user
            });
        });
    } else {
        res.redirect('/admin/articles',{
            user: req.session.user
        });
    }
});

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.render('admin/articles',{
            user: req.session.user
        });
    }

    modelArticle.findByPk(id).then(article => {
        if (article != undefined) {
            modelCategory.findAll().then( categories => {
                res.render('admin/articles/edit', {
                    article: article,
                    categories: categories,
                    user: req.session.user
                });
            });
        }else{
            res.redirect('/admin/articles');
        }
    }).catch(erro => {
        res.redirect('/admin/articles');
    });
});

router.post('/articles/update', adminAuth, (req, res) => {
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
        res.redirect('/admin/articles',{
            user: req.session.user
        });
    });
});

router.get('/articles/page/:num', (req, res) => {
    var page = req.params.num;
    var offset = 0;
    var limit = 4; //limit depends on the index.js ('/')

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) -1) * limit;
    }
    modelArticle.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [['id','DESC']]
    }).then(articles => {

        var next;
        if(offset + limit >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        modelCategory.findAll().then(categories => {
            res.render('admin/articles/page',{
                result: result,
                categories: categories,
                user: req.session.user
            });
        });
    });
});

module.exports = router;