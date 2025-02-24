import { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/colors/purple.css"
import persian_fa from "react-date-object/locales/persian_fa";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_en from "react-date-object/locales/persian_en";
import moment from "moment";
import toast from "react-hot-toast";
type EndOffType = {
    setDate: (value: any) => void,
    date: string | Date
}
export default function DateInput({ setDate, date }: EndOffType) {
    const [dayCount, setDayCount] = useState<any>(date || null);
    const changeHandler = (value: any) => {
        const date = new DateObject({
            date: value,
            format: "YYYY/MM/DD HH:mm:ss",
            calendar: persian,
            locale: persian_fa,
        });
        date.convert(gregorian, persian_en);
        const time = new Date(date.format())
        const nowTime = new Date()
        if (time > nowTime) {
            setDate(time)
        } else {
            setDate(new Date())
            toast.error("تاریخ معتبر وارد کنید !")
        }
    }
    useEffect(() => {
        if (date) {
            setDayCount(moment(date).diff(moment(), "days"))
        }
    }, [date])
    return (
        <div className="flex gap-2 items-center">
            <DatePicker
                multiple={false}
                value={date}
                format="YYYY/MM/DD HH:mm:ss"
                plugins={[
                    <TimePicker position="bottom" />,
                ]}
                onChange={changeHandler}
                calendar={persian}
                className="teal"
                locale={persian_fa}
                calendarPosition="bottom-right"
            />
            {dayCount && (
                <div className="w-4/12">
                    <span className="bg-gray-200 p-2 rounded">
                        {dayCount}
                        روز
                    </span>
                </div>
            )}
        </div>
    )
}