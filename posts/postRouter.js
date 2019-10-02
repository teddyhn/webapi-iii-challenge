const express = require('express');

const Posts = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
    Posts.get()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error retrieving posts" })
        });
});

router.get('/:id', validatePostId, (req, res) => {
    res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res) => {
    Posts.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "post successfully deleted" })
            } else res.status(404).json({ message: "post could not be found" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error removing the post" })
        });
});

router.put('/:id', [ validatePostId, validatePost ], (req, res) => {
    Posts.update(req.params.id, req.body)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "post successfully updated" })
            } else res.status(404).json({ message: "post could not be found" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error updating the post" })
        });
});

// custom middleware

function validatePostId(req, res, next) {
    const { id } = req.params;
    Posts.getById(id)
        .then(post => {
            if (post) {
                req.post = post;
                next();
            } else res.status(400).json({ message: "invalid post id" })
        });
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