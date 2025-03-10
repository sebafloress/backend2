import passport from "passport";
import local from 'passport-local'
import GithubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import { validatePassword, createHash } from "../utils/bcrypt.js";
import userModel from "../models/user.js";

const localStrategy = local.Strategy 
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = (req) =>{
    let token = null
    if(req && req.cookies) {
        token = req.cookies['coderCookie'] 
        console.log(req.cookies);
    }
    
    return token
}

//Middleware para errores de passport
export const passportCall = (strategy) => {
    return async(req,res,next) => {
        
        passport.authenticate(strategy, function(err,user, info) {
            if(err) return next(err)
            
            if(!user) {
                return res.status(401).send({error: info.messages?info.messages: info.toString()})
            }
            req.user = user
            next()
        } (req,res,next))
    }
}

const initalizatePassport = () => {


    passport.use('register', new localStrategy({passReqToCallback: true, usernameField: 'email'}, async (req,username, password, done) => {
        try {
            const {first_name, last_name, email, password, age} = req.body

            const findUser = await userModel.findOne({email: email})
            
            //Si usuario existe
            if(!findUser) {
                const user = await userModel.create({
                    first_name : first_name,
                    last_name : last_name, 
                    email: email, 
                    password: createHash(password),
                    age: age
                })
                return done(null, user) 
            } else {
                return done(null, false) 
            }
    
        }catch (e) {
            console.log(e);
            return done(e)
        }
    }))

    passport.use('login', new localStrategy({usernameField:'email'}, async (username, password, done) => {
        try {
            const user = await userModel.findOne({email: username})
            if(user && validatePassword(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        }catch(e){
            return done(e)
        }

        
    
    }))

    passport.use('github', new GithubStrategy({
        clientID: "Ov23lig5RXoE0L85g0QR",
        clientSecret: "35a0d696a775c4aef969b24037b6b6d3bcee5d5d",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {

            
            let user = await userModel.findOne({email: profile._json.email}) 
            if(!user) {
                const user = await userModel.create({
                    first_name : profile._json.name,
                    last_name : " ", //Dato no proporcionado por github 
                    email: profile._json.email, 
                    password: '1234', //Dato no proporcionado, generar pass por defecto
                    age: 18 //Dato no proporcionado por gitbub
                })
                done(null, user)
            } else {
                //Se loguea correctamente con el mismo mail (no lo vuelvo a registrar)
                done(null, user)
            }
        }catch(e) {
            console.log(e);
            return done(e)
        }
        
    }))
    
    passport.use(
        "current", 
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: "codercoder",
            },
            async (jwt_payload, done) => {
                try {
                    const user = await userModel.findById(jwt_payload.id); // Buscar por ID
                    if (!user) return done(null, false);
                    return done(null, user); // Devolver usuario completo
                } catch (e) {
                    return done(e);
                }
            }
        )
    );

     
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}

export default initalizatePassport