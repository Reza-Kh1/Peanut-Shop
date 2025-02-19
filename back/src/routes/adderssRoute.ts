import express from "express"
import isLogin from "../middlewares/isLogin"
import { createAddress, deleteAddress, getAddress, updateAddress } from "../controllers/addressCtrl"
const route = express.Router()
route.route("/").post(isLogin, createAddress)
route.route("/:id").put(isLogin, updateAddress).delete(deleteAddress).get(getAddress)
export = route