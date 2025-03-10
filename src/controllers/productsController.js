import productModel from "../models/product.js";

export const getProducts = async(req,res) => {
    try {
        const products = await productModel.find(); // Obtiene todos los productos
        res.status(200).render('templates/home', { products }); // Renderiza la vista con los productos
    } catch(e) {
        res.status(500).render('templates/error', {e});
    }
};

export const getProduct = async(req,res) => {
    try {
        const idProd = req.params.pid
        const prod = await productModel.findById(idProd)
        if(prod)
            res.status(200).render('templates/product', {prod})
        else
            res.status(404).render('templates/error', {e: "Producto no encontrado"})
    } catch(e) {
        res.status(500).render('templates/error', {e})
    }
}

export const createProduct = async(req,res) => {
    try {
        const product = req.body
        const rta = await productModel.create(product)
        res.status(201).send("Producto creado")
    }catch(e) {
        res.status(500).send(e)
    }
}

export const updateProduct = async(req,res) => {
    try {
        const idProd = req.params.pid
        const updateProduct = req.body
        const rta = await productModel.findByIdAndUpdate(idProd, updateProduct)
        if(rta)
            res.status(200).redirect('templates/home', {rta})
        else 
            res.status(404).render('templates/error', {e: "Producto no encontrado"})
    }catch(e) {
        res.status(500).render('templates/error', {e})
    }
}

export const deleteProduct = async(req,res) => {
    try {
        const idProd = req.params.pid
        const rta = await productModel.findByIdAndDelete(idProd)
        if(rta)
            res.status(200).redirect('templates/home', {rta})
        else 
            res.status(404).render('templates/error', {e: "Producto no encontrado"})
    }catch(e) {
        res.status(500).render('templates/error', {e})
    }
}