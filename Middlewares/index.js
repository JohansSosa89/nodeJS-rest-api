const validarCampos = require('../Middlewares/validar-campos')
const validarJWT = require('../Middlewares/validar-jwt');
const validaRoles = require('../Middlewares/validar-roles');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles
}