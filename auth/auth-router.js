const router = require('express').Router();
const users = require('../users/users-model');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 10) //10 tells how many times bcrypt runs the hashing algorythm
    user.password = hash;

    try{
        const saved = await users.add(user);
        res.status(201).json(saved);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/login', (req, res) => {
    let {username, password} = req.body;

    users.findBy({username})
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user; 
            res.status(200).json({message: `Welcome ${user.username}`});
        } else {
            res.status(401).json({message: 'invalid creds'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
            req.setEncoding('No way out!');
            } else {
                res.send('Logged out')
            }
        });
    } else {
        res.end();
    }
})

module.exports = router;