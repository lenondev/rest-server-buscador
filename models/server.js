const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { dbConnection } = require("../database/config.db");

// EXPRESS SERVER
class Server {
  constructor() {
    this.port = process.env.PORT;
    this.app = express();
    this.paths = {
      /*ABC*/ 
      auth:       '/api/auth',
      buscar:     '/api/buscar',
      categorias: '/api/categorias',
      productos:  '/api/productos',
      uploads:    '/api/uploads',
      usuarios:   '/api/usuarios',
    }

    // DB connection
    this.conectarDB();

    //Middllewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async conectarDB(){
      await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static("public"));

    // Fileupload - Carga de archivos
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true,
    }));
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth.routes'));
    this.app.use(this.paths.buscar, require('../routes/buscar.routes'));
    this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
    this.app.use(this.paths.productos, require('../routes/productos.routes'));
    this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
    this.app.use(this.paths.usuarios, require('../routes/usuarios.routes'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App running on port http/localhost:${this.port}/`);
    });
  }
}

module.exports = Server;
