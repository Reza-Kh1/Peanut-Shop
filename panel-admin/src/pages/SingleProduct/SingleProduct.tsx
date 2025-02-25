import React from 'react'
import CreateProduct from '../CreateProduct/CreateProduct'
import { getSingleProduct } from '../../services/fetchData';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductType } from '../../type';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
type FormPrductType = {
    slug: string,
    name: string,
    description: string,
    price: number,
    weight: number,
    stock: number,
    detail: string,
    discountId: string | null,
    categoryId: string,
}
export default function SingleProduct() {
    const { slug } = useParams()
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    if (!slug) return
    const { data } = useQuery<ProductType>({
        queryKey: ["GetProduct", slug],
        queryFn: () => getSingleProduct(slug),
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });
    const { mutate } = useMutation({
        mutationFn: (body: FormPrductType) => {
            console.log(body);
            
            return axios.put(`product/${data?.id}`, body);
        },
        onSuccess: () => {
            toast.success("محصول ویرایش شد");
            queryClient.invalidateQueries({ queryKey: ["GetProduct", slug] });
            queryClient.invalidateQueries({ queryKey: ["GetProduct"] });
            navigate("/admin/product")
        },
        onError: ({ response }: any) => {
            console.log(response);
            toast.error(response?.data?.message);
        },
    });
    if (!data) return
    return (
        <CreateProduct data={data} updateProduct={mutate} />
    )
}
