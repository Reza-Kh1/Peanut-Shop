import express from "express"
import { loginCompany, loginExpert, logOutUser, signUpCompany, signUpExpert, verifyPassword } from "../controllers/authCtrl"
const route = express.Router()
// route.route("/logout").get(logOutUser)
// route.route("/expert").post(signUpExpert).put(loginExpert)
// route.route("/company").post(signUpCompany).put(loginCompany)
// route.route("/verify/:id").post(verifyPassword)
export = route