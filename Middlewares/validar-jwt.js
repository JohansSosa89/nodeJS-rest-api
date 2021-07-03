const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async(req = request, res = response, next = any) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'Autorización no valida - no hay token '
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Buscar el usuario en la base de datos segun el id obtenido
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(410).json({
                msg: 'Token no válido - Usuario no existe en la BD'
            });
        }

        //Verificar si es usuario no ha sido eliminado previamente
        if(!usuario.estado){
            return res.status(410).json({
                msg: 'Token no válido - Usuario borrado de la BD'
            });
        }
        
        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
};

module.exports = {
    validarJWT
};