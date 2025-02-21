import express from 'express';
import isLogin from '../middlewares/isLogin';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getSingleProduct,
  updateProduct,
} from '../controllers/productCtrl';
const route = express.Router();
route.route('/').post(isLogin, createProduct).get(getProduct);
route
  .route('/:id')
  .put(isLogin, updateProduct)
  .delete(isLogin, deleteProduct)
  .get(getSingleProduct);
export = route;
