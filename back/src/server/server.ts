import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { globalHandler, notFound } from '../middlewares/globalError';
import authRoute from '../routes/authRoute';
import userRoute from '../routes/userRoute';
import adderssRoute from '../routes/adderssRoute';
import categoryRoute from '../routes/categoryRoute';
import productRoute from '../routes/productRoute';
import commentRoute from '../routes/commentRoute';
import discountRoute from '../routes/discountRoute';
import uploadRoute from '../routes/uploadRoute';
///////////// config Security
dotenv.config();
const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  }),
);
app.use(helmet.xssFilter());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
const defualtApi = process.env.API_VERSION;

///////////// Api Routes
app.use(defualtApi + 'auth', authRoute);
app.use(defualtApi + 'user', userRoute);
app.use(defualtApi + 'address', adderssRoute);
app.use(defualtApi + 'category', categoryRoute);
app.use(defualtApi + 'product', productRoute);
app.use(defualtApi + 'comment', commentRoute);
app.use(defualtApi + 'discount', discountRoute);
app.use(defualtApi + 'upload', uploadRoute);
app.use(globalHandler);
app.use(notFound);

///////////// Config Server
const server = http.createServer(app);
const hostName: string | undefined = process.env.HOST_NAME;
const port = Number(process.env.PORT_SERVER);
server.listen(port, hostName, () => {
  console.log(`server run in port ${port}`);
});
