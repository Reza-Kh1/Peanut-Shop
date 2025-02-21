import express from 'express';
import isLogin from '../middlewares/isLogin';
import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from '../controllers/categoryCtrl';
const route = express.Router();
route.route('/').post(isLogin, createCategory).get(getCategory);
route
  .route('/:id')
  .put(isLogin, updateCategory)
  .delete(isLogin, deleteCategory);
export = route;
