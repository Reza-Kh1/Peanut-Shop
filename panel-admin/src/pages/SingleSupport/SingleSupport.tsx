import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom';
import { getSingleChat } from '../../services/fetchData';
import { ChatType } from '../../type';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { FaSeedling } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import { RiSendPlaneFill } from 'react-icons/ri';

export default function SingleSupport() {
    const { id } = useParams()
    const [value, setValue] = useState<string>("")
    if (!id) return
    const { data } = useQuery<{ data: ChatType }>({
        queryKey: ["GetSupport", id],
        queryFn: () => getSingleChat(id),
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });
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
            <Button className='!bg-black shadow-md !text-white flex gap-1 !px-4 !py-2 items-center !text-sm !mt-5'>
                ارسال پیام
                <RiSendPlaneFill className='-rotate-90' />
            </Button>
        </div>
    )
}
