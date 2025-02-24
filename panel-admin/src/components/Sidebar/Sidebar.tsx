import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCartPlus, FaFileInvoiceDollar, FaRegComments } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { MdCategory, MdDoorBack } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import ImageCustom from "../ImageCustom/ImageCustom";
import { RiArticleLine } from 'react-icons/ri'
import { CiDiscount1 } from "react-icons/ci";
import { BiSupport } from "react-icons/bi";
type NavlinkAdminType = {
  name: string
  href: string
  icon: React.ReactNode
}
export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation()
  const logOutUser = () => {
    axios
      .get("auth/logout")
      .then(() => {
        toast.success("با موفقیت از حساب خارج شدید");
        navigate("/");
        localStorage.setItem("peanut", "");
      })
      .catch((err) => {
        console.log(err);
        toast.error("دوباره تلاش کنید!");
      })
  };
  const NavlinkAdmin = ({ name, href, icon }: NavlinkAdminType) => {
    return <Link to={href} className={`${pathname.startsWith(href) ? "bg-gray-100 shadow-md" : null} flex items-center p-2 rounded-md  justify-strat gap-2`}>
      <i className={`${pathname.startsWith(href) ? "text-white bg-gray-900" : "bg-white text-slate-800"} text-lg p-2 shadow-md rounded-lg`}>{icon}</i>
      <span>
        {name}
      </span>
    </Link>
  }
  return (
    <div className='hidden bg-white p-3 rounded-xl shadow-md md:flex w-2/12 sticky left-0 top-5 h-full flex-col gap-2'>
      <div className='flex items-center justify-between gap-2 border-b border-d-60/50 pb-5'>
        <ImageCustom alt={"logo"} src={"/erro.webp"} width={100} figureClass="w-24" className="w-24" height={60} />
        <h1 className='font-semibold text-d-100'>Peanut Shop</h1>
      </div>
      <div className='h-[calc(100vh-110px)] pr-2 overflow-y-auto custom-scroll flex flex-col gap-1'>
        <NavlinkAdmin href='/admin/dashboard' icon={<RiArticleLine />} name='داشبورد' />
        <NavlinkAdmin href='/admin/user' icon={<FaUsers />} name='کاربران' />
        <NavlinkAdmin href='/admin/category' icon={<MdCategory />} name='دسته بندی' />
        <NavlinkAdmin href='/admin/product' icon={<FaCartPlus />} name='محصولات' />
        <NavlinkAdmin href='/admin/comment' icon={<FaRegComments />} name='نظرات' />
        <NavlinkAdmin href='/admin/payment' icon={<FaFileInvoiceDollar />} name='سفارشات' />
        <NavlinkAdmin href='/admin/support' icon={<BiSupport />} name='پشتیبانی' />
        <NavlinkAdmin href='/admin/discount' icon={<CiDiscount1 />} name='ثبت تخفیف' />
        <button type='button' onClick={logOutUser} className={`flex items-center p-2 rounded-xl cursor-pointer justify-strat gap-2`}>
          <i className={`bg-white text-slate-800 text-lg p-2 shadow-md rounded-lg`}><MdDoorBack /></i>
          <span>
            Log out
          </span>
        </button>
      </div>
    </div>
  );
}
