const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment');

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render("moviesAdd")
    },
    create: async function (req, res) {
        const movie = await db.Movie.create(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            }
        )
        if (!movie) {
            return res.send(error)
        }

        return res.redirect('/movies')
    },
    edit: async function (req, res) {
        const Movie = await db.Movie.findByPk(req.params.id);
        if (!Movie) {
            return res.send(error)
        }
        return res.render("moviesEdit", {
            Movie,
            date: moment(Movie.release_date).format('YYYY-MM-DD')
        })
    },
    update: function (req, res) {
        let movieId = req.params.id;
        db.Movie
            .update(
                {
                    title: req.body.title,
                    rating: req.body.rating,
                    awards: req.body.awards,
                    release_date: req.body.release_date,
                    length: req.body.length,
                    genre_id: req.body.genre_id
                },
                {
                    where: { id: movieId }
                })
            .then(() => {
                return res.redirect('/movies')
            })
            .catch(error => res.send(error))
    },
    delete: async function (req, res) {
        const Movie = await db.Movie.findByPk(req.params.id);
        if (!Movie) {
            return res.send(error)
        }
        return res.render("moviesDelete", {
            Movie,
            date: moment(Movie.release_date).format('YYYY-MM-DD')
        })
    },
    destroy: async function (req, res) {
        await db.Movie.destroy({
            where: {
                id: req.params.id
            }
        })

        return res.redirect("/movies")
    }

}

module.exports = moviesController;