
import Admin from "../pages/Admin/Admin";
import Category from "../pages/Category/Category";
import Comments from "../pages/Comments/Comments";
import CreateProduct from "../pages/CreateProduct/CreateProduct";
import Dashboard from "../pages/Dashboard/Dashboard";
import Discount from "../pages/Discount/Discount";
import ForgetPassword from "../pages/ForgetPassword/ForgetPassword";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound/NotFound";
import Payment from "../pages/Payment/Payment";
import Product from "../pages/Product/Product";
import SingleProduct from "../pages/SingleProduct/SingleProduct";
import Support from "../pages/Support/Support";
import Users from "../pages/Users/Users";
import Upload from "../pages/Upload/Upload";
import SingleSupport from "../pages/SingleSupport/SingleSupport";


export default [
  { path: "/", element: <Login /> },
  { path: "/forget-password", element: <ForgetPassword /> },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "user", element: <Users /> },
      { path: "category", element: <Category /> },
      { path: "payment", element: <Payment /> },
      { path: "comment", element: <Comments /> },
      { path: "discount", element: <Discount /> },
      { path: "support", element: <Support /> },
      { path: "support/:id", element: <SingleSupport /> },
      { path: "uploader", element: <Upload /> },
      { path: "product", element: <Product /> },
      { path: "product/create-product", element: <CreateProduct /> },
      { path: "product/:slug", element: <SingleProduct /> },
    ],
  },
  { path: "/*", element: <NotFound /> },
];
