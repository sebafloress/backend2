import { generateToken } from '../utils/jwt.js';

export const login = async (req, res) => {
    try{
        if(!req.user){
            return res.status(401).send("Usuario o contraseña invalido");
        }
        const token = generateToken(req.user);
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }

        res.status(200).cookie('coderCookie', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        }).send({message: "Usuario logueado correctamente"})
    }catch(e){
        console.log(e);
        res.status(500).send("Error al loguear usuario")
    }
}
export const register = async (req, res) => {
    try{
        console.log(req.user);
        if(!req.user){
            return res.status(400).send("El mail ya se encuentra registrado");
        }
        res.status(201).send({message: "Usuario creado con éxito"})
    }catch(e){
        console.log(e);
        res.status(500).send("Error al crear usuario")
    }
}
export const viewRegister = (req, res) => {
    res.status(200).render('register', {
        title: "Registro de Usuario",
        url_js: "/js/register.js",
        url_css: "/css/register.css"
    });
};
export const viewLogin = (req, res) => {
    res.status(200).render('login', {
        title: "Inicio de Sesión de Usuario",
        url_js: "/js/login.js",
        url_css: "/css/login.css"
    })
}
export const githubLogin = (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(400).send("Usuario no autenticado correctamente");
        }
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        };
        const token = generateToken(req.user);
        res.status(200).cookie('coderCookie', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        }).redirect("/api/products");
    } catch (e) {
        console.log(e);
        res.status(500).send("Error al loguear usuario");
    }
};
export const loginFail = (req, res) => {
    res.render("error", { message: "Error al iniciar sesión" });
};