const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const modelCategory = require('./category');

router.get('/admin/categories/new', (req, res) => {
    res.render('./admin/categories/new');
});

router.post('/categories/save', (req, res) => {
    var title = req.body.title;
    if (title != undefined) {
        modelCategory.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories');
        });
    } else {
        res.redirect('/admin/categories/new');
    }
});

router.get('/admin/categories', (req, res) => {
    modelCategory.findAll().then(categories => {
        res.render('./admin/categories/index', {
            categories: categories
        });
    });
});

router.post('/categories/delete', (req, res) => {
    var id = req.body.idCategory;
    if (id != undefined) {
        if (isNaN(id)) {
            res.redirect('/admin/categories');
        }
        modelCategory.destroy({
            where: { id: id }
        }).then(() => {
            res.redirect('/admin/categories');
        });
    } else {
        res.redirect('/admin/categories');
    }
});

router.get('/admin/categories/edit/:id', (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.redirect('/admin/categories');
    }

    modelCategory.findByPk(id).then(category => {
        if (category != undefined) {
            res.render('admin/categories/edit', {
                category: category
            });
        }
        res.redirect('/admin/categories');
    }).catch(erro => {
        res.redirect('/admin/categories');
    });
});

router.post('/categories/update', (req, res) => {
    var idCategory = req.body.idCategory;
    var title = req.body.title;
    modelCategory.update({
        title: title,
        slug: slugify(title)
    },{
        where: {id: idCategory}
    }).then(() => {
        res.redirect('/admin/categories');
    });
});

module.exports = router;