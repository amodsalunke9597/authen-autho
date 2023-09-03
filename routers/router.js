const express = require('express');
const router = express.Router();

const autho = require('../middlewear/auth')

const authorization = require('../auth/authorization');

router.post('/signup', authorization.signup);
router.post('/login', authorization.login);
router.get('/test' , autho.auth, async(req, res) => {
    res.status(200).json({
        success: true,
        message: 'auth is working'
    })
})

router.get('/student' , autho.auth, autho.isStudent, async(req, res) => {
    res.status(200).json({
        success: true,
        message: 'This is a protected student route'
    })
})

router.get('/admin' , autho.auth, autho.isAdmin, async(req, res) => {
    res.status(200).json({
        success: true,
        message: 'This is a protected admin route'
    })
})

module.exports = router;