// import models
import ProductModel from "../models/Product.mjs";
 
// function get All Products
export const ProductIndex = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
     
}
 
// function get single Product
export const ProductShow = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
     
}
 
// function Create Product
export const ProductCreate = async (req, res) => {
    try {
        console.log(req.body);
        const product = new ProductModel(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
 
// function Update Product
export const ProductUpdate = async (req, res) => {
    try {
        const cekId = await Product.findById(req.params.id);
        if(!cekId) {
            return res.status(404).json({
                message: "Data tidak ditemukan"
            }); 
        }
        const updatedProduct = await Product.updateOne({
            _id: req.params.id
        }, {
            $set: req.body
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
 
// function Delete Product
export const ProductDestroy = async (req, res) => {
    try {
        const cekId = await Product.findById(req.params.id);

        if(!cekId) {
            return res.status(404).json({message: "Data tidak ditemukan"});
        }

        const deletedProduct = await Product.deleteOne({
            _id: req.params.id
        });

        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}