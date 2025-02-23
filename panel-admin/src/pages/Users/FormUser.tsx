import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { MdDataSaverOn } from 'react-icons/md'
type UsersForm = {
    name: string
    phone: string
    email: string
    password: string
    role: string
}
type FormUserType = {
    actionHandler: (value: UsersForm) => void
    data?: UsersForm
    pendingBtn: boolean
}
export default function FormUser({ actionHandler, data, pendingBtn }: FormUserType) {
    const { register, handleSubmit, setValue, watch, getValues } = useForm<UsersForm>()
    const selectRole = watch("role")
    const syncData = () => {
        if (!data) return
        setValue("email", data.email || "")
        setValue("name", data.name || "")
        setValue("phone", data.phone || "")
        setValue("role", data.role || "")
    }
    useEffect(() => {
        syncData()
    }, [data])
    if (data && !getValues("phone")) return
    return (
        <form onSubmit={handleSubmit((data) => actionHandler(data))} className='grid gap-5 grid-cols-3'>
            <TextField variant='standard' defaultValue={data?.name || ""}{...register("name")} label="اسم" />
            <TextField variant='standard' defaultValue={data?.phone || ""} {...register("phone")} label="شماره تلفن" />
            <TextField variant='standard' defaultValue={data?.email || ""} {...register("email")} label="ایمیل" />
            <TextField variant='standard' defaultValue={data?.password || ""} {...register("password")} label="پسورد" />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">سطح کاربری</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard-label"
                    value={selectRole || ""}
                    variant='standard'
                    label="سطح کاربری"
                    onChange={({ target }) => setValue("role", target.value)}
                >
                    <MenuItem value={"ADMIN"}>ادمین</MenuItem>
                    <MenuItem value={"AUTHOR"}>نویسنده</MenuItem>
                    <MenuItem value={"CUSTOMER"}>مشتری</MenuItem>
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
