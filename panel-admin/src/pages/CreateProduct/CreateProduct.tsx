import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CategoryType, ProductType } from '../../type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Button, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material'
import { MdDataSaverOn } from 'react-icons/md'
import { getAllCategory } from '../../services/fetchData'
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
type CreateProductType = {
  data: ProductType
  updateProduct: (value: FormPrductType) => void
}
export default function CreateProduct({ data, updateProduct }: CreateProductType) {
  const { data: dataCategory } = useQuery<{ data: CategoryType[] }>({
    queryKey: ["GetCategory"],
    queryFn: getAllCategory,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
  const { register, handleSubmit, setValue, watch, getValues } = useForm<FormPrductType>()
  const [isBoolean, setIsBoolean] = useState({ isStatus: false, isAvailable: false })
  const queryClient = useQueryClient();
  const selectCategory = watch("categoryId")
  const selectDiscount = watch("discountId")
  const action = (data: FormPrductType) => {
    if (data) {
      updateProduct(data)
    } else {
      mutate(data)
    }
  }
  const { isPending, mutate } = useMutation({
    mutationFn: (body: FormPrductType) => {
      return axios.post("user", body);
    },
    onSuccess: () => {
      toast.success("کاربر جدید ایجاد شد");
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    },
    onError: ({ response }: any) => {
      console.log(response);
      toast.error(response?.data?.message);
    },
  });
  const syncData = () => {
    if (!data) return
    setValue("categoryId", data.categoryId || "")
    setValue("discountId", data.discountId || "")
    setValue("detail", data.categoryId || "")

    setValue("price", data.price || 0)
    setValue("slug", data.categoryId || "")
    setValue("stock", data.stock || 0)
    setValue("weight", data.weight || 0)
    setValue("name", data.name || "")
    setIsBoolean({
      isAvailable: data.isAvailable || false,
      isStatus: data.isStatus || false
    })

  }
  useEffect(() => {
    syncData()
  }, [data])
  if (data && !getValues("name")) return
  return (
    <form onSubmit={handleSubmit(action)} className='grid gap-5 bg-white p-3 items-center rounded-xl shadow-md  grid-cols-3'>
      <TextField variant='outlined' {...register("name")} label="اسم" />
      <TextField variant='outlined' {...register("slug")} label="اسلاگ محصول" />
      <TextField variant='outlined'  {...register("detail")} label="جزئیات" />
      <TextField variant='outlined'  {...register("description")} label="توضیحات" />
      <TextField variant='outlined'  {...register("stock")} label="تعداد" />
      <TextField variant='outlined'  {...register("weight")} label="وزن" />
      <TextField variant='outlined'  {...register("price")} label="قیمت" />
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">انتخاب تخفیف</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard-label"
          value={selectDiscount || ""}
          variant='outlined'
          label="انتخاب تخفیف"
          onChange={({ target }) => setValue("discountId", target.value)}
        >
          <MenuItem value={"ADMIN"}>ادمین</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">انتخاب دسته</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard-label"
          value={selectCategory || ""}
          variant='outlined'
          label="انتخاب دسته"
          onChange={({ target }) => setValue("categoryId", target.value)}
        >
          {dataCategory?.data.map((item, index) => (
            <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={isBoolean.isAvailable}
              onChange={({ target }) => setIsBoolean({ ...isBoolean, isAvailable: target.checked })}
              name="isAvailable" />
          }
          label="موجودی محصول"
        />
        <FormControlLabel
          control={
            <Switch checked={isBoolean.isStatus}
              onChange={({ target }) => setIsBoolean({ ...isBoolean, isStatus: target.checked })}
              name="isStatus" />
          }
          label="نمایش محصول"
        />
      </FormGroup>
      <div className='col-span-3'>
        <Button disabled={isPending} type='submit' className='shadow-md gap-2 flex items-center' variant='outlined'>
          ذخیره اطلاعات
          <MdDataSaverOn />
        </Button>
      </div>
    </form>
  )
}
