import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { MdDataSaverOn } from 'react-icons/md'
import { CategoryType } from '../../type'
type CategoryForm = {
  name: string
  subCategoryId: string
}
type FormCategryType = {
  actionHandler: (value: CategoryForm) => void
  data?: CategoryType
  pendingBtn: boolean
  allCategory: CategoryType[]
}

export default function FormCategry({ actionHandler, data, pendingBtn, allCategory }: FormCategryType) {
  const { register, handleSubmit, setValue, watch, getValues } = useForm<CategoryForm>()
  const selectRole = watch("subCategoryId")
  const syncData = () => {
    if (!data) return
    setValue("subCategoryId", data?.subCategoryTo?.id.toString() || "")
    setValue("name", data.name || "")
  }
  useEffect(() => {
    syncData()
  }, [data])
  if (data && !getValues("name")) return
  return (
    <form onSubmit={handleSubmit((data) => actionHandler(data))} className='grid gap-5 grid-cols-2'>
      <TextField variant='standard' defaultValue={data?.name || ""}{...register("name")} label="اسم" />
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">انتخاب دسته مادر</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard-label"
          value={selectRole || ""}
          variant='standard'
          label="سطح کاربری"
          onChange={({ target }) => setValue("subCategoryId", target.value)}
        >
          <MenuItem value={""} onClick={() => setValue("subCategoryId", "")}>بدون دسته</MenuItem>
          {allCategory.map((item, index) => (
            <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className='col-span-3'>
        <Button disabled={pendingBtn} type='submit' className='shadow-md gap-2 flex items-center' variant='outlined'>
          ذخیره اطلاعات
          <MdDataSaverOn />
        </Button>
      </div>
    </form>
  )
}
