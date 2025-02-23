import axios from 'axios'
import { useEffect, useState } from 'react'
import Cookies from "js-cookie"
import { Button, CircularProgress, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast'
type FormPage = {
  name?: string
  phone: string
  email: string
  password: string
}
export default function Login() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { register, handleSubmit } = useForm<FormPage>()
  const actionHandler = (form: FormPage) => {
    setLoading(true)
    const body = {
      password: form.password,
      email: form.email,
      phone: form.phone
    } as FormPage
    if (isLogin) {
      body.name = form.name
      axios.post("auth", body).then(({ data }) => {
        if (data?.role === "CUSTOMER") {
          toast.error("شما اجازه دسترسی ندارید !")
          return
        }
        localStorage.setItem("peanut", JSON.stringify(data))
        navigate("/admin/dashboard", { replace: true })
      }).catch((err) => {
        console.log(err)
      }).finally(() => setLoading(false))
    } else {
      axios.put("auth", body).then(({ data }) => {
        if (data?.role === "CUSTOMER") {
          toast.error("شما اجازه دسترسی ندارید !")
          return
        }
        localStorage.setItem("peanut", JSON.stringify(data))
        navigate("/admin/dashboard", { replace: true })
      }).catch((err) => {
        console.log(err.response.data)
        toast.error(err.response.data.message || "دوباره تلاش کنید !")
      }).finally(() => setLoading(false))
    }
  }
  useEffect(() => {
    const token = Cookies.get('PEANUT_USER')
    if (token) {
      navigate("/admin/dashboard", { replace: true })
    }
  }, [])
  return (
    <div className='w-full items-start mb-80 flex justify-center h-[500px] bg-slate-400 bg-no-repeat bg-center bg-cover rounded-xl shadow-md before:bg-black/40 before:w-full before:h-full relative before:absolute before:top-0 before:left-0 before:rounded-xl' style={{ backgroundImage: "url(./login-admin.jpg)" }}>
      <div className='w-2/3 md:w-1/2 z-10 text-center mt-16'>
        {isLogin ?
          <>
            <h1 className='font-semibold text-3xl mb-3 text-gray-100'>خوش آمدید !</h1>
            <span className='text-gray-300'>برای ورود ایمیل یا شماره تلفن و رمز عبور خود را وارد کنید.</span>
          </> :
          <>
            <h1 className='font-semibold text-3xl mb-3 text-gray-100'>خوش آمدید !</h1>
            <span className='text-gray-300'>از این فرم های عالی برای ورود به سیستم یا ایجاد حساب جدید در حساب خود به صورت رایگان استفاده کنید.</span>
          </>
        }
      </div>
      <form onSubmit={handleSubmit(actionHandler)} className='text-center flex flex-col gap-4 md:gap-7 z-10 w-11/12 md:w-1/3 p-4 md:p-8 bg-slate-50 shadow-md border border-gray-400 rounded-xl absolute bottom-10 left-1/2 transform -translate-x-1/2 translate-y-1/2'>
        <span className='font-semibold text-3xl '>
          {isLogin ? "ثبت نام" : "ورود"}
        </span>
        {
          isLogin ?
            <TextField
              {...register("name")}
              variant='standard'
              label="نام کاربری"
            />
            : null
        }
        <TextField
          {...register("phone")}
          variant='standard'
          label="شماره تلفن"
        />
        <TextField
          {...register("email")}
          variant='standard'
          label="ایمیل"
        />
        <TextField
          variant='standard'
          required
          {...register("password")}
          label="پسورد"
          type="password"
        />
        {
          !isLogin ?
            <>
              <Button type='submit' color='primary' variant='contained' disabled={loading}>
                ورود
                {loading && <CircularProgress color='inherit' className='mr-3' size="25px" />}
              </Button>
              <span>ثبت حساب کاربری جدید ؟
                <button type='button' className='text-blue-400 mr-2 cursor-pointer' onClick={() => setIsLogin(prev => !prev)}>ثبت نام</button>
              </span>
            </>
            :
            <>
              <Button type='submit' disabled={loading} variant='contained' className={`text-w-100 w-full rounded-md p-5`}>
                ثبت نام
                {loading && <CircularProgress color='inherit' className='mr-3' size="25px" />}
              </Button>
              <span>از قبل حساب کاربری دارید؟
                <button type='button' className='text-blue-400 mr-2 cursor-pointer' onClick={() => setIsLogin(prev => !prev)}>ورود به حساب</button>
              </span>
            </>
        }
      </form>
    </div>
  )
}
