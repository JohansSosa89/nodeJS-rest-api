const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarCampos, validarArchivoSubir } = require('../Middlewares');

const router = Router();


router.post( '/', [validarArchivoSubir], cargarArchivo );

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'Id invalido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], /*actualizarImagen*/ actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'Id invalido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);

module.exports = router;
