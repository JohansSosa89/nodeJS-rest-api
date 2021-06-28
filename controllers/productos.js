const { request, response } = require("express");
const { Producto } = require("../models");


const ObtenerProductos = async(req = request, res = response) => {

    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };

        const [ total, productos ] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate('categoria', 'nombre')
                .populate('usuario', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            productos
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener los productos'
        });
    }

};

const ObtenerProducto = async(req = request, res = response) => {

    try {

        const { id } = req.params;
        const producto = await Producto.findById(id)
                                .populate('categoria', 'nombre')
                                .populate('usuario', 'nombre');

        res.status(200).json({
            producto
        });  
        
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error buscando el producto'
        });
    }

};

const CrearProducto = async(req = request, res = response) => {

    try {

        const { 
                nombre, 
                descripcion, 
                disponible, 
                precio,
                categoria 
        } = req.body;

        const productoDB = await Producto.findOne({ nombre });

        if(productoDB){
            return res.status(400).json({
                msg: `${nombre} ya se encuentra registrado como un producto`
            });
        }

        const producto = new Producto({
            nombre,
            descripcion,
            disponible,
            precio,
            categoria,
            usuario: req.usuario._id
        });

        await producto.save();

        res.status(201).json({
            producto
        });   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al crear un producto'
        });
    }

};

const ActualizarProducto = async(req = request, res = response) => {

    try {
        const { id } = req.params;
        const { nombre, descripcion, disponible, precio } = req.body;

        const data = {
            nombre,
            descripcion,
            precio,
            disponible,
            usuario: req.usuario._id
        };

        const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            producto
        });   

    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error actualizando la categoria'
        });
    }

};

const EliminarProducto = async(req = request, res = response) => {

    try {

        const { id } = req.params;
        const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true});
        res.status(200).json({
            producto
        });   
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error eliminando el producto'
        });
    }

};

module.exports = {
    ObtenerProductos,
    ObtenerProducto,
    CrearProducto,
    ActualizarProducto,
    EliminarProducto
};