const express = require('express');

const Users = require('./userDb');

const router = express.Router();

router.post('/', (req, res) => {

});

router.post('/:id/posts', (req, res) => {

});

router.get('/', (req, res) => {
    Users.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error retrieving users" })
        })
});

router.get('/:id', (req, res) => {

});

router.get('/:id/posts', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;
    Users.getById(id)
        .then(user => {
            if (user) {
                req.user = user;
                next();
            } else res.status(400).json({ message: "invalid user id" })
        });
};

function validateUser(req, res, next) {
    const { name } = req.body;
    if (!req.body) {
        res.status(400).json({ message: "missing post data" })
    } else if (!name) {
        res.status(400).json({ message: "missing required name field" })
    } else next();
};

function validatePost(req, res, next) {
    const { text } = req.body;
    if (!req.body) {
        res.status(400).json({ message: "missing post data" })
    } else if (!text) {
        res.status(400).json({ message: "missing required text field" })
    } else next();
};

module.exports = router;
