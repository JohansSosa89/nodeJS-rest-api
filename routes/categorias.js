const { Router } = require('express');
const { check } = require('express-validator');

const { 
        categoriasGet, 
        categoriasPost, 
        categoriasPut, 
        categoriasDelete, 
        categoriaGet 
} = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../Middlewares');

const router = Router();

/**
 * {{url}}/api/categorias
 * Obtener las categorias - Publico
 */
router.get('/', categoriasGet);


/**
 * {{url}}/api/categorias/id
 * Obtener una categoria por id - Publico
 */
 router.get('/:id', [
     check('id', 'No es un Id valido').isMongoId(),
     check('id').custom(existeCategoria),
     validarCampos
 ], categoriaGet);

 
/**
 * {{url}}/api/categorias
 * Crear una categoría - Privado - debe tener un token valido
 */
router.post('/', [ 
    validarJWT, 
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], categoriasPost);


/**
 * {{url}}/api/categorias
 * Actualizar una categoría - Privado - tener token valido 
 */
 router.put('/:id', [
     validarJWT,
     check('id', 'No es un Id valido').isMongoId(),
     check('id').custom(existeCategoria),
     validarCampos
 ], categoriasPut);

 
/**
 * {{url}}/api/categorias
 * Eliminar categoria - Admin
 */
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], categoriasDelete);

module.exports = router;