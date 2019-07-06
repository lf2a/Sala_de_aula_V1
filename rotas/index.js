const express = require('express')
const router = express.Router()

var auth = (req, res, next) => {
    if (req.session && req.session.admin)
        return next();
    else
        res.render('pages/401');
};

router.use('/', require('./login'))

router.use('/', require('./signup'))

router.use('/', auth, require('./logout'))

router.use('/', auth, require('./home'))

router.use('/', auth, require('./professor'))

router.use('/', auth, require('./grupo'))

router.use('/', auth, require('./postagens'))

router.use('/', auth, require('./estudante'))

router.use('/', auth, require('./usuario'))

router.use('/', auth, require('./postagem'))

// rota para erro 404 (conteudo não encontrado)
router.get('/404', (req, res) => {
    res.render('pages/404')
})

// rota para erro 401 (acesso não autorizado)
router.get('/401', (req, res) => {
    res.render('pages/401')
})

module.exports = router