const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/category');

const Article = connection.define('article',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//relationship
Category.hasMany(Article); //a category has many articles
Article.belongsTo(Category); //an article belongs to a category

//Article.sync({force: true});

module.exports = Article;