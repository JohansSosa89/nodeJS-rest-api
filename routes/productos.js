const { Router } = require('express');
const { check } = require('express-validator');


const { 
        ObtenerProductos, 
        ObtenerProducto, 
        CrearProducto, 
        ActualizarProducto, 
        EliminarProducto 
} = require('../controllers/productos');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../Middlewares');

const router = Router();

router.get('/', ObtenerProductos);

router.get('/:id', [
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], ObtenerProducto);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('categoria', 'El producto debe estar asociado a una categoría').notEmpty(),
    check('categoria', 'No es un Id valido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], CrearProducto);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], ActualizarProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], EliminarProducto);

module.exports = router;