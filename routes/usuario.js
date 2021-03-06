
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, 
        validarJWT, 
        esAdminRole, 
        tieneRole} = require('../Middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPost, 
        usuariosPut, 
        usuariosPatch, 
        usuariosDelete } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.post('/', [
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('password', 'El pasword debe ser mas de 6 caracteres').isLength({min: 6}),
        check('correo', 'El correo no es valido').isEmail(),
        check('correo').custom( emailExiste ),
        //check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom( esRoleValido ), 
        validarCampos
] , usuariosPost);

router.put('/:id', [
        check('id', 'No es un Id valido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom( esRoleValido ), 
        validarCampos
], usuariosPut);

router.delete('/:id', [
        validarJWT,
        //esAdminRole,
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        check('id', 'No es un Id valido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;