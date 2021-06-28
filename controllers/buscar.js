const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Categoria, Producto, Role, Usuario } = require('../models/index');

const cloeccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response) => {

    const esIdValido = ObjectId.isValid( termino );

    if( esIdValido ){
        const usuario = await Usuario.findById(termino);
        return res.status(200).json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp( termino, 'i');

    const usuarios = await Usuario.find({ 
        $or : [{ nombre: regex }, { correo:regex }], 
        $and: [{ estado: true }]
    });

    return res.status(200).json({
        results: usuarios
    });
};

const buscarCategorias = async(termino = '', res = response) => {

    const esIdValido = ObjectId.isValid( termino );

    if( esIdValido ){
        const categoria = await Categoria.findById(termino)
                                .populate('usuario', 'nombre');

        return res.status(200).json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp( termino, 'i');

    const categorias = await Categoria.find({ nombre: regex, estado: true })
                                .populate('usuario', 'nombre');

    return res.status(200).json({
        results: categorias
    });
};

const buscarProductos = async(termino = '', res = response) => {

    const esIdValido = ObjectId.isValid( termino );

    if( esIdValido ){
        const producto = await Producto.findById(termino)
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre');
        return res.status(200).json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp( termino, 'i');

    const productos = await Producto.find({ nombre: regex, estado: true })
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre');

    return res.status(200).json({
        results: productos
    });
};

const buscar = (req = request, res = response) => {

    try {
        
        const { coleccion, termino } = req.params;

        if(!cloeccionesPermitidas.includes( coleccion )){
            return res.status(400).json({
                msg: `Las colecciones permitidas son: ${ cloeccionesPermitidas }`
            });
        }

        switch (coleccion) {
            case 'categorias':
                buscarCategorias(termino, res);
            break;

            case 'productos':
                buscarProductos(termino, res);
            break;

            case 'roles':
        
            break;

            case 'usuarios':
                buscarUsuarios(termino, res);
            break;
        
            default:
                res.status(500).json({
                    msg: 'Error en busqueda'
                });
            
        }

    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error realizando la busqueda'
        });
    }
};

module.exports = {
    buscar
};