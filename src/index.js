import passport from 'passport';
import passportConfig from './config/passport.config.js'; // Importar configuración de Passport
import path from 'path'
import { __dirname } from './path.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { create } from 'express-handlebars'
import MongoStore from 'connect-mongo'
import sessionRouter from './routes/sessions.routes.js'
import mongoose from 'mongoose'
import express from 'express'

const app = express()
const PORT = 8080
const hbs = create({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layout"),  // Ruta correcta
    partialsDir: path.join(__dirname, "views/partials") // Ruta de los parciales
});

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Agregado para recibir datos de formularios
app.use(cookieParser("CoderSecret")) 

// Conectar a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://sebafloress:OE34HpJkXyJkdBET@backend2.cdkic.mongodb.net/?retryWrites=true&w=majority&appName=backend2");
        console.log("✅ DB is connected");
    } catch (error) {
        console.error("❌ Error al conectarme a DB:", error.message);
        process.exit(1); // Detener la app si hay error
    }
};

// Configuración de sesiones con MongoDB
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://sebafloress:OE34HpJkXyJkdBET@backend2.cdkic.mongodb.net/?retryWrites=true&w=majority&appName=backend2",
        ttl: 15
    }),
    secret: 'SessionSecret',
    resave: false,
    saveUninitialized: false
}));

// Configuración de Handlebars
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views/templates'))

// Inicializar Passport
app.use(passport.initialize());

// Rutas
app.use('/public', express.static(__dirname + '/public'))
app.use('/api/sessions', sessionRouter);

// Nueva ruta para renderizar home.handlebars
app.get('/', (req, res) => {
    const prods = {
        docs: [
            { title: 'Producto 1', description: 'Descripción del Producto 1', price: 100, _id: '1' },
            { title: 'Producto 2', description: 'Descripción del Producto 2', price: 200, _id: '2' },
            { title: 'Producto 3', description: 'Descripción del Producto 3', price: 300, _id: '3' }
        ],
        hasPrevPage: false,
        hasNextPage: true,
        prevPage: null,
        nextPage: 2,
        limit: 10,
        pageNumbers: [
            { number: 1, isCurrent: true },
            { number: 2, isCurrent: false },
        ]
    };
    res.render('home', { title: "Inicio", message: "Bienvenido al servidor 🚀", prods });
});

// Rutas
app.use('/public', express.static(__dirname + '/public'))
app.use('/api/sessions', sessionRouter)

const auth = (req, res, next) => {
    if (req.session?.email === "f@f.com") {
        return next();
    } else {
        return res.status(401).send("Error al autenticar usuario");
    }
};

// Creación de cookies
app.get('/setCookie', (req, res) => {
    res.status(200).cookie('coderCookie', "Esta es mi primera cookie", { maxAge: 100000 }).send("Cookie creada");
});

app.get('/setSignedCookie', (req, res) => {
    res.status(200).cookie('coderCookieSigned', "Esta es mi primera cookie firmada", { maxAge: 1000000, signed: true }).send("Cookie creada");
});

// Consultar cookies
app.get('/getCookie', (req, res) => {
    res.status(200).send(req.cookies);
});

app.get('/getCookieSigned', (req, res) => {
    res.status(200).send(req.signedCookies);
});

// Eliminar cookies
app.get('/deleteCookie', (req, res) => {
    res.status(200).clearCookie("coderCookie").send("Cookie eliminada");
});

// Crear sesión
app.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.status(200).send(`Ingresaste un total de ${req.session.counter} veces`);
    } else {
        req.session.counter = 1;
        res.status(200).send("Bienvenido/a!");
    }
});

// Logout (destruir sesión)
app.get('/logout', (req, res) => {
    req.session.destroy((e) => {
        if (e) {
            res.status(500).send(e);
        } else {
            res.status(200).send("Logout exitoso");
        }
    });
});

// Cambié `/login` a `POST` ya que se envían credenciales en el body
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if ((email === "f@f.com" && password === "1234") || (email === "pepe@pepe.com" && password === "1234")) {
        req.session.email = email;
        req.session.admin = true;
        res.status(200).send("Usuario logueado");
    } else {
        res.status(400).send("Credenciales no válidas");
    }
});

// Ruta privada
app.get('/private', auth, (req, res) => {
    res.status(200).send("Contenido de f@f.com");
});

// Conectar a MongoDB y luego iniciar el servidor
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
