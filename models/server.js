const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
const { socketcontroller } = require('../sockets/controller');


class Server {
    constructor(){
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = createServer(this.app);
        this.io     = require('socket.io')(this.server);
        
        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
        };

        //Conectar a base de datos
        this.conectarDB();
        //Midlewares
        this.middlewares(); 

        //application routes
        this.routes();

        //sockets events 
        this.sockets();
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
        this.app.use( express.static('public') );

        //Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/usuario'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));

    }

    sockets(){
        this.io.on('connection', (socket) =>  socketcontroller(socket, this.io));
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', process.env.PORT);
        });
    }
}

module.exports = Server;