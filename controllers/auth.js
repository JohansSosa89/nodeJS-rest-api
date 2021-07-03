const bcryptjs = require('bcryptjs');
const { response, request } = require("express");
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const Usuario = require('../models/usuario');



const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
     
        // Verificar si el email existe 
        const usuario = await Usuario.findOne({ correo });

        if(!usuario){
            return res.status(400).json({
                msg: `No existe un usuario registrado con el siguiente correo: ${correo}`
            });
        }

        // Si el usuario no esta activo 
        if(!usuario.estado){
            return res.status(400).json({
                msg: `El usuario: ${correo} no se encuentra activo`
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        
        if(!validPassword){
            return res.status(400).json({
                msg: `El password es invalido`
            });
        }

        //Generar el JWT 
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error: Pongase en contacto con el Administrador'
        });
    }
};

const googleSignIn = async(req = request, res = response) => {

    const { id_token } = req.body;
    
    try {

        const { correo, nombre, img } = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({ correo });

        //Si usuario no existe crearlo en la DB
        if(!usuario){
            const data = {
                nombre,
                correo,
                password: 'userPass',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        //existe el usuario en la DB
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Usuario bloqueado - Por favor contacte con el administrador'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        res.status(400).json({
            msg: 'El google Token es invalido'
        });

    }


};

const renovarToken = async(req = request, res = response) => {
    const {usuario} = req;

    //Generar el JWT 
    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    });
};

module.exports = {
    login,
    googleSignIn,
    renovarToken
};