const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generar-jwt");
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();

const socketcontroller = async(socket, io) => {

    const token = socket.handshake.headers['x-token'];
    const usuario = await comprobarJWT(token);
    if(!usuario){
        return socket.disconnect();
    }

    //Agregar el usuario conectado 
    chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    //Conectar a una sala especial
    socket.join(usuario.id); //global, socket.id y usuario.id
    
    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    //recibir el mensaje enviado
    socket.on('enviar-mensaje', ({uid, mensaje}) => {
        
        if(uid){
            //Mensaje privado
            socket.to(uid).emit('mensaje-privado', { De: usuario.nombre, mensaje });
        }else{
            chatMensajes.enviarMensaje(usuario.uid, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
    });
};

module.exports = {
    socketcontroller
};