import express from "express"
import { forgetPassword, signOut, signIn, signUp } from "../controllers/authCtrl"
const route = express.Router()
route.route("/logout").get(signOut)
route.route("/").post(signUp).put(signIn)
route.route("/forget-pass").post(forgetPassword)
export = route