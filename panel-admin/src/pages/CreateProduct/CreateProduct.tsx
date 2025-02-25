import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CategoryType, DiscountType, ProductType } from '../../type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Autocomplete, Button, Chip, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material'
import { MdDataSaverOn } from 'react-icons/md'
import { getAllCategory, getAllDiscountProduct } from '../../services/fetchData'
import ShowImage from '../../components/ShowImage/ShowImage'
import ImageCustom from '../../components/ImageCustom/ImageCustom'
import { FaTrash } from 'react-icons/fa'
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
  data?: ProductType
  updateProduct?: (value: FormPrductType) => void
}
export default function CreateProduct({ data, updateProduct }: CreateProductType) {
  const { data: dataCategory } = useQuery<{ data: CategoryType[] }>({
    queryKey: ["GetCategory"],
    queryFn: getAllCategory,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
  const { data: dataDiscount } = useQuery<{ data: DiscountType[] }>({
    queryKey: ["GetDiscount"],
    queryFn: getAllDiscountProduct,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
  const { register, handleSubmit, setValue, watch, getValues } = useForm<FormPrductType>()
  const [isBoolean, setIsBoolean] = useState({ isStatus: false, isAvailable: false })
  const [tags, setTags] = useState<string[]>([])
  const [gallery, setGallery] = useState<{ url: string, alt: string }[] | null>(null)
  const queryClient = useQueryClient();
  const selectCategory = watch("categoryId")
  const selectDiscount = watch("discountId")
  const action = (form: FormPrductType) => {
    const body = {
      isStatus: isBoolean.isStatus,
      isAvailable: isBoolean.isAvailable,
      gallery: gallery || [],
      tags: tags
      , ...form,
      stock: Number(form.stock)
    }
    if (data) {
      if (!updateProduct) return
      updateProduct(body)
    } else {
      mutate(body)
    }
  }
  const { isPending, mutate } = useMutation({
    mutationFn: (body: FormPrductType) => {
      return axios.post("product", body);
    },
    onSuccess: () => {
      toast.success("محصول جدید ایجاد شد");
      queryClient.invalidateQueries({ queryKey: ["GetProduct"] });
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
    setValue("description", data.description || "")
    setValue("detail", data.detail || "")
    setValue("price", data.price || 0)
    setValue("slug", data.slug || "")
    setValue("stock", data.stock || 0)
    setValue("weight", data.weight || 0)
    setValue("name", data.name || "")
    setIsBoolean({
      isAvailable: data.isAvailable || false,
      isStatus: data.isStatus || false
    })
    setGallery(data.gallery || [])
    setTags(data.tags || [])
  }
  useEffect(() => {
    syncData()
  }, [data])
  if (data && !getValues("name")) return
  return (
    <form onSubmit={handleSubmit(action)} className='grid gap-5 bg-white p-3 items-center rounded-xl shadow-md  grid-cols-3'>
      <TextField variant='outlined' {...register("name")} label="اسم" />
      <TextField variant='outlined' {...register("slug")} label="اسلاگ محصول" />
      <TextField variant='outlined'  {...register("stock")} label="تعداد" />
      <TextField variant='outlined' placeholder='بر حسب گرم'  {...register("weight")} label="وزن" />
      <TextField variant='outlined'  {...register("price")} label="قیمت" />
      <FormControl fullWidth className='!m-0' variant="outlined" sx={{ m: 1, minWidth: 120 }}>
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
      <FormControl className='!m-0' variant="outlined" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">انتخاب تخفیف</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard-label"
          value={selectDiscount || ""}
          variant='outlined'
          label="انتخاب تخفیف"
          onChange={({ target }) => setValue("discountId", target.value)}
        >
          <MenuItem value={""} onClick={() => setValue("discountId", "")}>بدون تخفیف</MenuItem>
          {dataDiscount?.data.map((item, index) => (
            <MenuItem key={index} value={item.id}>{item.discount}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className='col-span-3 grid grid-cols-2 gap-10'>
        <TextField multiline rows={5} variant='outlined'  {...register("description")} label="توضیحات" />
        <TextField multiline rows={5} variant='outlined'  {...register("detail")} label="جزئیات" />
      </div>
      <Autocomplete
        multiple
        className='col-span-3'
        id="tags-filled"
        options={[]}
        defaultValue={[]}
        value={tags}
        onChange={(_, value: string[]) => {
          setTags(value || [])
        }}
        freeSolo
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip variant="outlined" label={option} key={key} {...tagProps} />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="تگ صفحه"
            placeholder="اینتر بزنید"
          />
        )}
      />
      <div className='col-span-3 flex gap-5'>
        <div className='flex flex-col w-2/12 gap-5'>
          <span>گالری محصولات</span>
          <ShowImage setAddImage={(value) => {
            let body
            if (gallery) {
              body = [...gallery, value]
            } else {
              body = [value]
            }
            setGallery(body)
          }} />
        </div>
        <div className='grid grid-cols-4 gap-3 w-10/12'>
          {gallery?.map((item, index) => (
            <div key={index} className='relative'>
              <ImageCustom className='w-full rounded-md shadow-md' src={item.url} alt={item.alt} height={150} width={150} />
              <i onClick={() => {
                setGallery(gallery.filter((row) => row.url !== item.url))
              }} className='absolute left-2 top-2 rounded-full shadow-md cursor-pointer p-2 bg-black/35 text-white hover:bg-black/90 '>
                <FaTrash />
              </i>
              <span className='absolute left-1/2 bottom-1 transform -translate-x-1/2 bg-black/70 text-white py-1 px-3 text-xs rounded-xl shadow-md'>{item.alt}</span>
            </div>
          ))}
        </div>
      </div>
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
