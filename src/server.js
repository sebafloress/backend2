import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/users.routes.js' // Asegúrate de que este archivo exista y contenga las rutas necesarias

const app = express()
const PORT = 8080

// Función para conectar a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://sebafloress:9qcTuqwBV2jN94Pa@backend2.cdkic.mongodb.net/?retryWrites=true&w=majority&appName=backend2")
        console.log("✅ DB is connected")
    } catch (error) {
        console.error("❌ Error connecting to DB:", error)
        process.exit(1) // Detiene la app si hay error en la conexión
    }
}

// Middleware
app.use(express.json()) // Para poder leer cuerpos de solicitudes JSON

// Definir una ruta base para evitar "Cannot GET /"
app.get('/', (req, res) => {
    res.send("¡Servidor funcionando correctamente! 🚀")
})

// Rutas
app.use('/api/users', userRouter) // Asegúrate de que el archivo userRouter esté correctamente definido

// Iniciar el servidor solo si la DB está conectada
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
})
