const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { response, request } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');
const { Usuario, Producto } = require('../models');

const cargarArchivo = async(req = request, res = response) => {

    try {
     
        //const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );
        res.json({ nombre });   

    } catch (error) {
        res.status(400).json({msg: error});
    }
};

const actualizarImagen = async(req = request, res = response) => {

    try {
        const { id, coleccion } = req.params;

        let modelo;
    
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe el usuario con el id: ${id}`
                    });
                }
            break;
    
            case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe el producto con el id: ${id}`
                    });
                }
            break;
        
            default:
                return res.status(500).jsonn({msg: 'Se olvido validar esto'});
        }

        //Limpiar imagenes previas
        try {
            if(modelo.img){
                // Borrar la imagen del servidor 
                const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
                if(fs.existsSync(pathImagen)){
                    fs.unlinkSync(pathImagen);
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    
        modelo.img = await subirArchivo( req.files, undefined, coleccion );
    
        await modelo.save();
        
        res.json(modelo);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrio un error actualizando la imagen'
        });
    }
};

const actualizarImagenCloudinary = async(req = request, res = response) => {

    try {
        const { id, coleccion } = req.params;

        let modelo;
    
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe el usuario con el id: ${id}`
                    });
                }
            break;
    
            case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe el producto con el id: ${id}`
                    });
                }
            break;
        
            default:
                return res.status(500).jsonn({msg: 'Se olvido validar esto'});
        }

        //Limpiar imagenes previas
        if(modelo.img){
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [ public_id ] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }

        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        modelo.img = secure_url;
        await modelo.save();
        res.json(modelo);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrio un error actualizando la imagen'
        });
    }
};

const mostrarImagen = async(req = request, res = response) => {
    try {
        const { id, coleccion } = req.params;

        let modelo;
    
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe el usuario con el id: ${id}`
                    });
                }
            break;
    
            case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe el producto con el id: ${id}`
                    });
                }
            break;
        
            default:
                return res.status(500).jsonn({msg: 'Se olvido validar esto'});
        }

        if(modelo.img){
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if(fs.existsSync(pathImagen)){
                return res.sendFile(pathImagen);
            }
        }

        const noImagenPath = path.join(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagenPath);


    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrio un error cargando la imagen'
        });
    }
};

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
};