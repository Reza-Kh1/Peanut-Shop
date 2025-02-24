import express from "express"
import { forgetPassword, signOut, signIn, signUp } from "../controllers/authCtrl"
const route = express.Router()
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
});
route.route("/logout").get(signOut)
route.route("/").post(signUp).put(limiter, signIn)
route.route("/forget-pass").post(limiter, forgetPassword)
export = route