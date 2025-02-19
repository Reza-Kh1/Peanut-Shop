import express from "express"
import { getUsers, createUser, deleteUser, updateUser } from "../controllers/userCtrl"
import isLogin from "../middlewares/isLogin"
const route = express.Router()
route.route("/").post(createUser).get(getUsers)
route.route("/:id").put(isLogin, updateUser).delete(deleteUser)
export = route