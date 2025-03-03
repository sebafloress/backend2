import 'dotenv/config'
import express from 'express'
import path from 'path'
import { __dirname } from './path.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import {create} from 'express-handlebars'
import passport from 'passport'
import initalizatePassport from './config/passport.config.js'
import MongoStore from 'connect-mongo'
import indexRouter from './routes/index.routes.js'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()
const PORT = 8080
const hbs = create({
    extname: '.handlebars',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, 'views/partials'),
});
app.use(cors())
//const fileStorage = new FileStore(session)
app.use(express.json())
app.use(cookieParser(process.env.SECRET_COOKIE)) //Si agrego contraseña "firmo" las cookies
app.use(session({
    //ttl Time to Live tiempo de vida (segundos)
    //retries: Cantidad de veces que el servidor va a intentar leer ese archivo
    //store: new fileStorage({path: './src/sessions', ttl: 10, retries: 1 }),
    store: MongoStore.create({
        mongoUrl: process.env.URL_MONGO,
        mongoOptions: {},
        ttl: 15000000000
    }),
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true
}))

mongoose.connect(process.env.URL_MONGO)
.then(() => console.log("DB is connected"))
.catch((e) => console.log("Error al conectarme a DB:", e))

initalizatePassport()
app.use(passport.initialize())
app.use(passport.session())
app.engine('handlebars', hbs.engine)
app.set('views', path.join(__dirname, 'views/templates')) 
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, "public")))
//Rutas
app.use('/', indexRouter)


app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})