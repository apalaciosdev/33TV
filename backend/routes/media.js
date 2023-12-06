const { Router } = require('express')
const { searchMedia, getEpisodes, getReproducers, getTest } = require('../controllers/media')
const router = Router()


router.get('/search/:query', [], searchMedia)

router.post('/getEpisodes', [], getEpisodes)

router.post('/getReproducers', [], getReproducers)

router.head('/test', [], getTest)

module.exports = router