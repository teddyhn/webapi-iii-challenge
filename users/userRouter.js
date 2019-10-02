const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    Users.insert(req.body)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error adding new user" })
        });
});

router.post('/:id/posts', validatePost, (req, res) => {
    Posts.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error adding post" })
        })
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

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
    Users.getUserPosts(req.user.id)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({ message: "posts could not be found" })
        });
});

router.delete('/:id', validateUserId, (req, res) => {
    Users.remove(req.user.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "user successfully deleted" })
            } else {
                res.status(404).json({ messsage: "user could not be found" })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error removing the user" })
        });
});

router.put('/:id', [ validateUserId, validateUser ], (req, res) => {
    Users.update(req.params.id, req.body)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "user successfully updated" })
            } else res.status(404).json({ message: "user could not be found" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error updating the user" })
        });
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
    if (req.body && Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "missing user data" })
    } else if (req.body.name) {
        next();
    } else res.status(400).json({ message: "missing required name field" });
};

function validatePost(req, res, next) {
    const { text } = req.body;
    if (req.body && Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "missing post data" })
    } else if (!text) {
        res.status(400).json({ message: "missing required text field" })
    } else next();
};

module.exports = router;
