const express = require('express')
const cors = require('cors')

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 2022;

    //Paths
    this.mediaPath = '/api/media'

    //Middlewares
    this.middlewares()

    //Routes
    this.routes()
  }

  middlewares() {
    //CORS
    this.app.use(cors())

    //Read & Parse body
    this.app.use(express.json())

    //public directory
    this.app.use(express.static('public'))
  }

  routes() {
    this.app.use(this.mediaPath, require('../routes/media'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server running on port', this.port)
    })
  }

}


module.exports = Server