const { Categoria, Usuario, Role, Producto } = require('../models');


const esRoleValido = async(rol = '') => { 
    const existeRol = await Role.findOne({ rol });
    if(!existeRol){
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
};

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail){
        throw new Error(`El correo ${ correo } ya se encuentra registrado en la BD`);
    }
};

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El id nro ${ id } no existe`);
    }
};

const existeCategoria = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error(`La categoría con Id ${id} no existe`);
    }
};

const existeProducto = async(id) => {
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error(`El producto con Id ${id} no existe`);
    }
};

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const estaIncluida = colecciones.includes( coleccion);
    if(!estaIncluida){
        throw new Error(`La colección ${coleccion} no es permitida - ${colecciones}`)
    }

    return true;
};

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
};
