const router = require('express').Router()

router.get('/', (req, res) => {
    res.json({
        error: null,
        data: {
            title: 'Ruta protegida',
            user: req.user
        }
    })
})

module.exports = router