const express = require('express');
const router = express.Router();
const brcrypt = require('bcryptjs');
const modelUser = require('./user');

router.get('/admin/users', (req, res) => {
    modelUser.findAll().then(users => {
        res.render('admin/users/', {
            users: users,
            user: req.session.user
        });
    }).catch((erro) => {
        res.redirect('/', {
            user: req.session.user
        });
    });
});

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create', {
        uuser: req.session.user
    });
});

router.post('/users/create', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    modelUser.findOne({ where: { email: email } }).then(user => {
        if (user == undefined) {
            var salt = brcrypt.genSaltSync(10);
            var hash = brcrypt.hashSync(password, salt);

            modelUser.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect('/', {
                    user: req.session.user
                });
            }).catch((erro) => {
                res.redirect('/', {
                    user: req.session.user
                });
            });
        } else {
            res.redirect('/admin/users/create', {
                user: req.session.user
            });
        }
    });
});

router.get('/login', (req, res) => {
    res.render('admin/users/login');
});

router.post('/authenticate', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    modelUser.findOne({ where: { email: email } }).then(user => {
        if (user != undefined) {
            var validate = brcrypt.compareSync(password, user.password);

            if (validate) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles');
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
});


module.exports = router;