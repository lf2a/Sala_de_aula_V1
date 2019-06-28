const express = require('express')
const router = express.Router()

router.use('/', require('./postagens'))
router.use('/', require('./comentarios'))

module.exports = router