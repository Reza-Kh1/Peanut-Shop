import { useState } from 'react'
import PendingApi from '../../components/PendingApi/PendingApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllDiscount } from '../../services/fetchData';
import { DiscountType } from '../../type';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaAngleDown, FaAngleUp, FaPen } from 'react-icons/fa';
import FormDiscount from './FormDiscount';
import { StyledTableCell, StyledTableRow } from '../Users/Users';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import DontData from '../../components/DontData/DontData';
import axios from 'axios';
import toast from 'react-hot-toast';
type DiscountForm = {
  code: string
  type: "FIXED" | "PERCENT"
  discount: number;
  amount: number
}
export default function Discount() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [dataDiscount, setDataDiscount] = useState<DiscountType>()
  const { data } = useQuery<{
    data: DiscountType[],
  }>({
    queryKey: ["GetDiscount"],
    queryFn: getAllDiscount,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
  const { isPending: pendingCreate, mutate: createDiscount } = useMutation({
    mutationFn: (body: DiscountForm) => {
      return axios.post("discount", body);
    },
    onSuccess: () => {
      toast.success("تخفیف جدید ایجاد شد");
      queryClient.invalidateQueries({ queryKey: ["GetDiscount"] });
    },
    onError: ({ response }: any) => {
      console.log(response);
      toast.error(response?.data?.message);
    },
  });
  const { isPending: pendingDelete, mutate: deleteDiscount } = useMutation({
    mutationFn: (id: number) => {
      return axios.delete(`discount/${id}`);
    },
    onSuccess: () => {
      toast.success("تخفیف حذف شد");
      queryClient.invalidateQueries({ queryKey: ["GetDiscount"] });
    },
    onError: ({ response }: any) => {
      console.log(response);
      toast.error(response?.data?.message);
    },
  });
  const { isPending: pendingUpdate, mutate: updateDiscount } = useMutation({
    mutationFn: (body: DiscountForm) => {
      return axios.put(`discount/${dataDiscount?.id}`, body);
    },
    onSuccess: () => {
      toast.success("تخفیف ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["GetDiscount"] });
      setOpenModal(false)
    },
    onError: ({ response }: any) => {
      console.log(response);
      toast.error(response?.data?.message);
    },
  });
  return (
    <>
      {(pendingCreate || pendingDelete || pendingUpdate) && <PendingApi />}
      <div className=' bg-white p-3 rounded-xl shadow-md flex flex-col gap-5'>
        <div className='flex justify-between items-center'>
          <span>
            افزودن تخفیف
          </span>
          <Button onClick={() => setShowForm(prev => !prev)} className='flex gap-5' variant='outlined' color='inherit'>
            {showForm ?
              <>
                بستن
                <FaAngleDown />
              </>
              :
              <>
                نمایش
                <FaAngleUp />
              </>
            }
          </Button>
        </div>
        {showForm && <FormDiscount pendingBtn={pendingCreate} actionHandler={createDiscount} />}
      </div>
      {data?.data.length ?
        <div className='bg-white p-3 rounded-xl shadow-md'>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>کد تخفیف</StyledTableCell>
                  <StyledTableCell align='center'>تعداد دفعات مجاز برای مصرف</StyledTableCell>
                  <StyledTableCell align='center'>نوع تخفیف</StyledTableCell>
                  <StyledTableCell align='center'>درصد / قیمت</StyledTableCell>
                  <StyledTableCell align='center'>شروع تخفیف</StyledTableCell>
                  <StyledTableCell align='center'>پایان تخفیف</StyledTableCell>
                  <StyledTableCell align='center'>عملیات ها</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.code||"-----"}
                    </StyledTableCell>
                    <StyledTableCell align='center'>{row.amount||"-----"}</StyledTableCell>
                    <StyledTableCell align='center'>{row.type === "FIXED" ? "تومان" : "درصد"}</StyledTableCell>
                    <StyledTableCell align='center'>{row.type === "FIXED" ? Number(row.discount).toLocaleString("fa") + "تومان" : row.discount + "%"}</StyledTableCell>
                    <StyledTableCell align='center'>{new Date(row.startDate).toLocaleDateString("fa")}</StyledTableCell>
                    <StyledTableCell align='center'>{new Date(row.endDate).toLocaleDateString("fa")}</StyledTableCell>
                    <StyledTableCell align='center'>
                      <div className='flex gap-3 w-full justify-center'>
                        <Button onClick={() => { setDataDiscount(row), setOpenModal(true) }} className='!bg-black shadow-md !text-white flex gap-1 !px-4 !py-2 items-center !text-sm'>
                          ویرایش
                          <FaPen />
                        </Button>
                        <DeleteButton deletePost={() => deleteDiscount(row.id)} text='حذف' pendingDelete={pendingDelete} />
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        : <DontData text='هیچ تخفیفی ثبت نشد.' />}
      <Dialog
        fullScreen
        fullWidth
        open={openModal}
        keepMounted
        onClose={() => setOpenModal(false)}
      >
        <DialogTitle>{"ویرایش کد تخفیف"}</DialogTitle>
        <DialogContent>
          <div className='mt-10'>
            <FormDiscount actionHandler={(value) => updateDiscount(value)} pendingBtn={pendingUpdate} data={dataDiscount as DiscountType} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>بستن</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}