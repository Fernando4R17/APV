import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";


const checkAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { // Si hay un token y el token inicia con Bearer
        try {
            token = req.headers.authorization.split(' ')[1] // Se extrae el token 
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Se verifica el token con la palabra secreta con la cual se creó

            req.veterinario = await Veterinario.findById(decoded.id).select( // Se crea una sesión para el veterinario
                "-password -token -confirmado"
            );

            return next();
        } catch (error) {
            const e = new Error('Token no valido'); 
            res.status(403).json({msg: e.message});
        }
    } 

    if(!token) {
        const e = new Error('Token no valido o inexistente'); 
        res.status(403).json({msg: e.message});
    }

    next();
};

export default checkAuth;