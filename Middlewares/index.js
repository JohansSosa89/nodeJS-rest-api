const validarCampos = require('../Middlewares/validar-campos');
const validarJWT = require('../Middlewares/validar-jwt');
const validaRoles = require('../Middlewares/validar-roles');
const validarArchivo = require('../Middlewares/validar-archivo');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo
};