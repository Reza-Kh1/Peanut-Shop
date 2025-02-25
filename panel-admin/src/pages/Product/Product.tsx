import { useInfiniteQuery } from '@tanstack/react-query';
import { PaginationType, ProductType } from '../../type';
import { useState } from 'react';
import { getAllProduct } from '../../services/fetchData';
import SearchBox from '../../components/SearchBox/SearchBox';
import { FaDollarSign, FaPlus } from 'react-icons/fa';
import PaginationAdmin from '../../components/PaginationAdmin/PaginationAdmin';
import { Link } from 'react-router-dom';
import ImageCustom from '../../components/ImageCustom/ImageCustom';
import DontData from '../../components/DontData/DontData';
import { FaPen } from 'react-icons/fa6';
import { IoCheckboxOutline } from 'react-icons/io5';
import { CgCloseR } from "react-icons/cg";

export default function Product() {
  const [searchQuery, setSearchQuery] = useState<any>();
  const { data } = useInfiniteQuery<{
    data: ProductType[],
    pagination: PaginationType
  }>({
    queryKey: ["GetProduct", searchQuery],
    queryFn: () => getAllProduct(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage || undefined,
    initialPageParam: "",
  });
  const PriceDiscount = ({ price, type, discount }: any) => {
    if (type === "FIXED") {
      return Number(price - discount).toLocaleString("fa")
    } else {
      const newPrice = Number(price * (discount * 0.01))
      return Number(price - newPrice).toLocaleString("fa")
    }
  }
  return (
    <>
      <SearchBox name={["email", "phone"]} setSearch={setSearchQuery} />
      <div className=' bg-white p-3 rounded-xl shadow-md flex flex-col gap-5'>
        <div className='flex justify-between items-center'>
          <span>
            افزودن محصول
          </span>
          <Link to={"/admin/product/create-product"} className='flex gap-3 border rounded-md shadow-md py-2 items-center px-5'>
            ایجاد
            <FaPlus />
          </Link>
        </div>
      </div>
      {data?.pages[0].data.length ?
        <>
          <div className='grid grid-cols-2 gap-5 bg-white p-3 rounded-xl shadow-md'>
            {data?.pages[0].data.map((items, index) => (
              <div key={index} className='bg-gradient-to-b from-black/20 justify-between to-slate-50 rounded-xl shadow-md overflow-hidden p-5 flex flex-col gap-3'>
                <ImageCustom alt={""} className='w-full h-44 object-cover rounded-xl shadow-md' src={items.gallery?.length ? items.gallery[0]?.url : ""} width={300} height={300} />
                <div className='flex justify-between items-center'>
                  <span className='text-lg font-semibold'>{items.name}</span>
                  <span>{items.Category.name || ""}</span>
                </div>
                <div className='flex flex-col gap-2'>
                  <span className='flex items-center gap-2'>نمایش محصول : {items.isStatus ? <IoCheckboxOutline className='text-green-400' /> : <CgCloseR className='text-red-400' />}</span>
                  <span className='flex items-center gap-2'>موجودی محصول : {items.isAvailable ? <IoCheckboxOutline className='text-green-400' /> : <CgCloseR className='text-red-400' />}</span>
                  <span className='flex items-center gap-2'>دارای تخفیف : {items.Discount ? <IoCheckboxOutline className='text-green-400' /> : <CgCloseR className='text-red-400' />}</span>
                  <div className=' grid grid-cols-2 gap-2'>
                    <span>تاریخ انتشار : {new Date(items.updatedAt).toLocaleDateString("fa")}</span>
                  </div>
                  <div className=' grid grid-cols-2 gap-2'>
                    <span>امتیاز محصول : {items.rating || 0}</span>
                  </div>
                  <div className=' grid grid-cols-2 gap-2'>
                    <span>کامنت ها : {items.totalComment || 0}</span>
                  </div>
                  <div className=' grid grid-cols-2 gap-2'>
                    <span>شناسه محصول : {items.refCode}</span>
                  </div>
                </div>
                {items.Discount ?
                  <div className='flex flex-col gap-3'>
                    <span>جزئیات تخفیف :</span>
                    <div className='flex justify-between text-sm'>
                      <span>مقدار : {items.Discount.discount}</span>
                      <span>تاریخ شروع :{new Date(items.Discount.startDate).toLocaleDateString("fa")}</span>
                      <span>تاریخ پایان :{new Date(items.Discount.endDate).toLocaleDateString("fa")}</span>
                    </div>
                  </div>
                  : null}
                <p className='text-sm cutline cutline-3'>
                  {items.description}
                </p>
                <div className='flex justify-between'>
                  <Link to={"/admin/product/" + items.slug} className='!bg-black shadow-md justify-center gap-3 rounded-md !text-white flex !px-4 !py-2 items-center !text-sm' >
                    ویرایش
                    <FaPen />
                  </Link>
                  {items.Discount ?
                    <div className='flex items-end gap-1'>
                      <FaDollarSign className='mb-2' />
                      <div className='flex flex-col items-end'>
                        <span className='flex items-center gap-1 text-sm line-through text-slate-600'>
                          {Number(items.price).toLocaleString("fa")}
                          تومان
                        </span>
                        <span className='text-lg'><PriceDiscount discount={items.Discount.discount} price={items.price} type={items.Discount.type} /> تومان</span>
                      </div>
                    </div>
                    :
                    <span className='flex items-center gap-1 text-xl'><FaDollarSign />{Number(items.price).toLocaleString("fa")} تومان</span>
                  }
                </div>
              </div>
            ))}
          </div>
          <PaginationAdmin allPage={data?.pages[0].pagination.allPage} search={searchQuery} setSearch={setSearchQuery} />
        </>
        :
        <DontData text='هیچ محصولی ثبت نشده.' />
      }
    </>
  )
}
