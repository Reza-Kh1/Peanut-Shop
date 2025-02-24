import { useState } from 'react'
import UploadMedia from '../../components/UploadMedia/UploadMedia'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ImageCustom from '../../components/ImageCustom/ImageCustom';
import DontData from '../../components/DontData/DontData';
import { getAllImage } from '../../services/fetchData';
import { FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';
import { HiDownload } from "react-icons/hi";
type UploadType = {
  setImage?: (value: string) => void
}
export default function Upload({ setImage }: UploadType) {
  const [searchQuery, setSearchQuery] = useState<any>();
  const queryClient = useQueryClient();
  const { data } = useInfiniteQuery<{ data: string[] }>({
    queryKey: ["GetMedia", searchQuery],
    queryFn: () => getAllImage(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage || undefined,
    initialPageParam: "",
  });
  const { mutate } = useMutation({
    mutationFn: async (url: string) => {
      axios.delete(`upload?url=${url}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetMedia'] });
    },
    onError: (err) => {
      toast.error(err.message || "عکس حذف نشد!");
    },
  });
  return (
    <div className=' bg-white p-3 rounded-xl shadow-md flex flex-col gap-5'>
      <div className='flex flex-col gap-3'>
        <span>افزودن عکس</span>
        <div className='w-1/5'>
          <UploadMedia />
        </div>
      </div>

      {data?.pages[0].data?.length ?
        <div className='grid grid-cols-5 gap-3 items-center'>
          {data?.pages[0]?.data.map((items, index) => (
            <div className='relative ' key={index}>
              <ImageCustom src={items} alt={items} width={300} height={300} />
              {setImage ?
                <i onClick={() => setImage(items)} className='absolute right-2 top-2 rounded-full shadow-md cursor-pointer p-2 bg-black/35 text-white hover:bg-black/90 '>
                  <HiDownload />
                </i>
                : null}
              <i onClick={() => mutate(items)} className='absolute left-2 top-2 rounded-full shadow-md cursor-pointer p-2 bg-black/35 text-white hover:bg-black/90 '>
                <FaTrash />
              </i>
            </div>
          ))}
        </div>
        :
        <DontData text='هیچ عکسی آپلود نشده' />
      }
    </div>
  )
}
