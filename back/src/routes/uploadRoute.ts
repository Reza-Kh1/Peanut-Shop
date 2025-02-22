import express from 'express';
import { deleteFile, getAllMedia, uploadFile } from '../controllers/uploadCtrl';
import upload from '../middlewares/upload';

const route = express.Router();
route.route('/').post(upload, uploadFile).get(getAllMedia).delete(deleteFile)

export = route;
