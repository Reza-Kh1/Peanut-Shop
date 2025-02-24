import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { PaginationType, ProductType } from '../../type';
import { useState } from 'react';
import { getAllProduct } from '../../services/fetchData';
import SearchBox from '../../components/SearchBox/SearchBox';
import { Button } from '@mui/material';
import { FaPlus } from 'react-icons/fa';
import PaginationAdmin from '../../components/PaginationAdmin/PaginationAdmin';
import { Link } from 'react-router-dom';

export default function Product() {
  const [searchQuery, setSearchQuery] = useState<any>();
  const queryClient = useQueryClient();
  const { data } = useInfiniteQuery<{
    data: ProductType[],
    pagination: PaginationType
  }>({
    queryKey: ["getUser", searchQuery],
    queryFn: () => getAllProduct(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage || undefined,
    initialPageParam: "",
  });
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
        {/* {showForm && <FormUser pendingBtn={pendingCreate} actionHandler={createUser} />} */}
      </div>
      <div>
      </div>
      <PaginationAdmin allPage={data?.pages[0].pagination.allPage} search={searchQuery} setSearch={setSearchQuery} />

    </>
  )
}
