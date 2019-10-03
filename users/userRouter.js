const express = require('express');
const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');
const router = express.Router();


router.post('/', validateUser, (req, res) => {
    const theUser = req.body;
    Users.insert(theUser)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ Error: 'couldnt create user' });
        });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const id = req.params.id;
    const postData = req.body;
    Users.getById(id)
    if (!postData.text) {
        res.status(400).json({ message: ' please provide text for comment' });
    } else {
        Posts.insert(postData)
            .then(user => {
                res.status(201).json(postData);
            })
            .catch(error => {
                console.log(error, id, postData);
                res.status(500).json({ Error: 'couldnt add post' });
            });
    }
});

router.get('/', (req, res) => {
    Users.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ Error: 'Error getting users' });
        });

});

router.get('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    Users.getById(id)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ Error: 'error getting individual user' })
        });

});

router.get('/:id/posts', validateUserId, (req, res) => {
    const userId = req.params.id;
    Users.getUserPosts(userId)
        .then(user => {
            console.log(user);
            res.status(200).json(user)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ Error: 'cant find post' });
        });
});

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    Users.remove(id)
        .then(user => {
            // if (!user) {
            //     res.status(404).json({ Error: 'user with id not found' });
            // } else {
            res.status(200).json({ Message: 'user deleted' });
            // }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ Error: 'error getting individual user' })
        });

});


router.put('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    Users.update(id, changes)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            res.status(500).json({ Message: 'couldnt update' });
        });
});

//custom middleware

function validateUserId(req, res, next) {
    const id = req.params.id;
    Users.getById(id)
        .then(thing => {
            if (!thing) {
                res.status(404).json({ Error: ' invalid user id' });
            } else {
                console.log(id);
                req.user = thing;
                next();
            };
        });
};

function validateUser(req, res, next) {
    const UserData = req.body;
    if (Object.keys(UserData).length === 0) {
        res.status(404).json({ Error: 'missing user data' });
    } else {
        if (!UserData.name) {
            res.status(404).json({ Error: 'missing required text field' });
        } else {
            next();
        };
    };
};

function validatePost(req, res, next) {
    const PostData = req.body;
    if (Object.keys(PostData).length === 0) {
        res.status(404).json({ Error: 'missing post data' });
    } else {
        if (!PostData.user_id) {
            res.status(404).json({ Error: 'missing user_id field' });
        } else {
            if (!PostData.text) {
                res.status(404).json({ Error: 'missing required text field' });
            } else {
                next();
            };
        };
    };
};

module.exports = router;