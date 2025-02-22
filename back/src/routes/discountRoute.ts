import express from 'express';
import { checkDiscount, createDiscount, deleteDiscount, getAllDiscount, updateDiscount } from '../controllers/discountCtrl';
const route = express.Router();
route.route("/").post(createDiscount).get(getAllDiscount)
route.route("/check").get(checkDiscount)
route.route("/:id").put(updateDiscount).delete(deleteDiscount)
export = route;
