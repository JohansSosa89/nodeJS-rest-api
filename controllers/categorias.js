const { request, response } = require("express");
const { Categoria } = require("../models");


const categoriasGet = async(req = request, res = response) => {

    try {
        const {limite = 5, desde = 0 } = req.query;
        const query = { estado: true };
    
        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .populate('usuario', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);
    
        res.status(200).json({
            total,
            categorias
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error buscando las categorias'
        });
    }
};

const categoriaGet = async(req = request, res = response) => {

    try {

        const { id } = req.params;
        const categoria = await Categoria.findById(id)
                                .populate('usuario', 'nombre');

        res.status(200).json({
            categoria
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un error buscando la categoría'
        });
    }

};

const categoriasPost = async(req = request, res = response) => {

    try {
        const nombre = req.body.nombre.toUpperCase();

        const categoriaDB = await Categoria.findOne({ nombre });

        if(categoriaDB){
            return res.status(400).json({
                msg: `La categoría ${ categoriaDB.nombre }, ya existe`
            });
        }

        //Generar la data a guardar
        const data = {
            nombre,
            usuario: req.usuario._id
        };

        const categoria = new Categoria( data );

        //Guardar en DB
        await categoria.save();

        res.status(201).json({
            categoria
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un error creando la categoría'
        });
    }
};

const categoriasPut = async(req = request, res = response) => {

    try {

        const { id } = req.params;
        const nombre = req.body.nombre.toUpperCase();
        
        const data = {
            nombre,
            usuario: req.usuario._id
        };

        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            categoria
        });        
    } catch (error) {

        res.status(500).json({
            msg: 'Hubo un error actualizando la categoría'
        });
    }

};

const categoriasDelete = async(req = request, res = response) => {

    try {
        const { id } = req.params;

        const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            categoria
        });        
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error eliminando la categoría'
        });
    }

};

module.exports = {
    categoriasGet,
    categoriaGet,
    categoriasPost,
    categoriasPut,
    categoriasDelete
};