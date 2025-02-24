import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdDataSaverOn } from 'react-icons/md';
import { DiscountType } from '../../type';
import DateInput from '../../components/DateInput/DateInput';

type DiscountForm = {
    code: string;
    type: 'FIXED' | 'PERCENT';
    discount: number;
    amount: number;
};

type FormDiscountType = {
    actionHandler: (value: DiscountForm) => void;
    data?: DiscountType;
    pendingBtn: boolean;
};

export default function FormDiscount({ actionHandler, data, pendingBtn }: FormDiscountType) {
    const { register, handleSubmit, setValue, watch, getValues } = useForm<DiscountForm>();
    const [startDate, setStartDate] = useState<Date | string>("");
    const [endDate, setEndDate] = useState<Date | string>("");
    const selectRole = watch('type');
    const action = (form: DiscountForm) => {
        const body = {
            code: form.code,
            type: form.type,
            discount: form.discount,
            amount: Number(form.amount),
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString()
        }
        actionHandler(body)
    }
    const syncData = () => {
        if (!data) return;
        setValue('discount', data.discount || 0);
        setValue('amount', data.amount || 0);
        setValue('code', data.code || '');
        setValue('type', data.type || '');
        setEndDate(data.endDate)
        setStartDate(data.startDate)
    };

    useEffect(() => {
        syncData();
    }, [data]);

    if (data && !getValues('discount')) return null;

    return (
        <form onSubmit={handleSubmit(action)} className="grid gap-5 grid-cols-3">
            <TextField variant="outlined" {...register('code')} label="کد تخفیف (اختیاری)" />
            <TextField variant="outlined"  {...register('discount')} label="مقدار تخفیف" />
            <TextField variant="outlined" type='number'{...register('amount')} label="تعداد دفعات مجاز (اختیاری)" />
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">نوع تخفیف</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard-label"
                    value={selectRole || ''}
                    variant="outlined"
                    label="نوع تخفیف"
                    onChange={({ target }) => setValue('type', target.value as 'FIXED' | 'PERCENT')}
                >
                    <MenuItem value={'FIXED'}>تومان</MenuItem>
                    <MenuItem value={'PERCENT'}>درصد</MenuItem>
                </Select>
            </FormControl>
            <div className='flex flex-col gap-3'>
                <span>شروع تخفیف</span>
                <DateInput date={startDate} setDate={setStartDate} />
            </div>
            <div className='flex flex-col gap-3'>
                <span>پایان تخفیف</span>
                <DateInput date={endDate} setDate={setEndDate} />
            </div>
            <div className="col-span-3">
                <Button
                    disabled={pendingBtn}
                    type="submit"
                    className="shadow-md gap-2 flex items-center"
                    variant="outlined"
                >
                    ذخیره اطلاعات
                    <MdDataSaverOn />
                </Button>
            </div>
        </form>
    );
}