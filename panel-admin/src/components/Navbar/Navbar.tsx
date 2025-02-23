import { Button } from '@mui/material'
import { FaChevronLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
    const navigate = useNavigate()
    return (
        <div className='w-full bg-white p-3 rounded-xl shadow-md flex justify-between items-center'>
            <p className='flex gap-2'>
                <span>
                    {JSON.parse(localStorage.getItem("peanut") as string).role === "ADMIN" ? "ادمین" : "نویسنده"}
                </span>
                <span>
                    {JSON.parse(localStorage.getItem("peanut") as string).name}
                </span>
            </p>
            <span>{new Date().toLocaleDateString("fa")}</span>
            <Button onClick={() => navigate(-1)} className='!bg-black !shadow-md !text-white p-3 flex gap-3'>
                بازگشت
                <FaChevronLeft />
            </Button>
        </div>
    )
}
