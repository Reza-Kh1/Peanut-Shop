import express from 'express';
import { createChat, deleteMessage, getAllChat, sendMessage } from '../controllers/supportCtrl';
const route = express.Router();
route.route('/').post(sendMessage).get(getAllChat);
route.route("/chat").post(createChat);
route
    .route('/:id')
    .delete(deleteMessage)

export = route;
