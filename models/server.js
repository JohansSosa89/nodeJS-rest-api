const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Conectar a base de datos
        this.conectarDB();
        //Midlewares
        this.middlewares(); 

        //application routes
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS 
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use( express.json() );

        //Public directory
        this.app.use( express.static('public') )
    }

    routes(){
        
        this.app.use(this.usuariosPath, require('../routes/usuario'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', process.env.PORT);
        });
    }
}

module.exports = Server;