import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom';
import { getSingleChat } from '../../services/fetchData';
import { ChatType } from '../../type';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { RiSendPlaneFill } from 'react-icons/ri';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SingleSupport() {
    const { id } = useParams()
    const queryClient = useQueryClient();
    const [value, setValue] = useState<string>("")
    const navigate = useNavigate()
    if (!id) return
    const { data } = useQuery<{ data: ChatType }>({
        queryKey: ["GetSupport", id],
        queryFn: () => getSingleChat(id),
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });
    const sendMessage = () => {
        const local = localStorage.getItem("peanut")
        const jsonData = JSON.parse(local as string)
        const body = {
            senderType: "ADMIN",
            content: value,
            chatId: Number(id),
            userId: jsonData.id
        }
        axios.post("support", body).then(() => {
            toast.success("پاسخ ارسال شد")
            navigate("/admin/support")
            queryClient.invalidateQueries({ queryKey: ["GetSupport"] });
        }).catch((err) => {
            console.log(err);
            toast.error("با خطا مواجه شدیم")
        })
    }
    return (
        <div className='bg-white p-3 rounded-xl shadow-md'>
            <div className='grid grid-cols-2 gap-5 mb-12'>
                <div className='flex flex-col gap-2'>
                    <span className='text-sm text-slate-600'>موضوع :</span>
                    <span className='text-lg mr-1'> {data?.data.title}</span>
                </div>
                <div className='flex flex-col gap-2'>
                    <span className='text-sm text-slate-600'>وضعیت درخواست :</span>
                    <span className='text-lg mr-1'> {data?.data.isDone ? "باز" : "بسته"}</span>
                </div>
                <div className='flex flex-col gap-2'>
                    <span className='text-sm text-slate-600'>نام کاربر :</span>
                    <span className='text-lg mr-1'> {data?.data.User.name}</span>
                </div>
                <div className='flex flex-col gap-2'>
                    <span className='text-sm text-slate-600'>شماره کاربر :</span>
                    <span className='text-lg mr-1'> {data?.data.User.phone}</span>
                </div>
                <div className='flex flex-col gap-2'>
                    <span className='text-sm text-slate-600'>ایمیل کاربر :</span>
                    <span className='text-lg mr-1'> {data?.data.User.email}</span>
                </div>
            </div>
            <div className=' flex flex-col gap-5 mb-12'>
                {data?.data.Message.map((item, index) => (
                    <div key={index} className={`rounded-md p-3 shadow-md ${item.senderType === "CUSTOMER" ? "mr-8 text-white bg-black/80" : "ml-8 bg-gray-200 text-black"}`}>
                        <div className='flex justify-between items-center text-sm'>
                            <span>{new Date(item.createdAt).toLocaleDateString("fa")}</span>
                            <span>{data.data.User.name}</span>
                        </div>
                        <p className='mt-5'>{item.content}</p>
                    </div>
                ))}
            </div>
            <TextField placeholder='متن پیام...' fullWidth variant='standard' onChange={({ target }) => setValue(target.value)} value={value} multiline />
            <Button onClick={sendMessage} className='!bg-black shadow-md !text-white flex gap-1 !px-4 !py-2 items-center !text-sm !mt-5'>
                ارسال پیام
                <RiSendPlaneFill className='-rotate-90' />
            </Button>
        </div>
    )
}
