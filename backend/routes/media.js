const { Router } = require('express')
const { searchMedia, getEpisodes, getReproducers, getMultiMediaPage, getTest } = require('../controllers/media')
const router = Router()


router.get('/search/:query', [], searchMedia)

router.post('/getEpisodes', [], getEpisodes)

router.post('/getReproducers', [], getReproducers)

router.post('/getMultiMediaPage', [], getMultiMediaPage)

router.head('/test', [], getTest)

module.exports = router