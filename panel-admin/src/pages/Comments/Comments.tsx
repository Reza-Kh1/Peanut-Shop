import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Rating, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import PaginationAdmin from '../../components/PaginationAdmin/PaginationAdmin'
import DontData from '../../components/DontData/DontData'
import { StyledTableCell, StyledTableRow } from '../Users/Users'
import SearchBox from '../../components/SearchBox/SearchBox'
import { FaPen } from 'react-icons/fa'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { getAllComment } from '../../services/fetchData'
import { CommentType, PaginationType } from '../../type'
import { useState } from 'react'
import PendingApi from '../../components/PendingApi/PendingApi'
import DeleteButton from '../../components/DeleteButton/DeleteButton'
import { MdClose, MdDataSaverOn } from 'react-icons/md'
import { FaCheck } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export default function Comments() {
  const { register, handleSubmit } = useForm<{ content: string }>()
  const [searchQuery, setSearchQuery] = useState<any>();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [dataComment, setDataComment] = useState<CommentType>()
  const [rate, setRate] = useState<number | null>(null)
  const { data } = useInfiniteQuery<{
    data: CommentType[],
    pagination: PaginationType
  }>({
    queryKey: ["GetComment", searchQuery],
    queryFn: () => getAllComment(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage || undefined,
    initialPageParam: "",
  });
  const { isPending: pendingDelete, mutate: deleteComment } = useMutation({
    mutationFn: ({ id, productId }: { id: number, productId: number }) => {
      return axios.delete(`comment/${id}?productId=${productId}`);
    },
    onSuccess: () => {
      toast.success("کامنت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["GetComment"] });
    },
    onError: ({ response }: any) => {
      console.log(response);
      toast.error(response?.data?.message);
    },
  });
  const { isPending: pendingApproved, mutate: approvedUpdate } = useMutation({
    mutationFn: ({ id, productId, rate }: any) => {
      return axios.put(`comment/${id}?productId=${productId}`, { isApproved: true, rating: rate });
    },
    onSuccess: () => {
      toast.success("کامنت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["GetComment"] });
      setOpenModal(false)
    },
    onError: ({ response }: any) => {
      console.log(response);
      toast.error(response?.data?.message);
    },
  });
  const { isPending: pendingUpdate, mutate: updateComment } = useMutation({
    mutationFn: (value: { content: string }) => {
      const body = {
        content: value.content,
        rating: rate,
        isApproved: true
      }
      return axios.put(`comment/${dataComment?.id}?productId=${dataComment?.productId}`, body);
    },
    onSuccess: () => {
      toast.success("کامنت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["GetComment"] });
      setOpenModal(false)
    },
    onError: ({ response }: any) => {
      console.log(response);
      toast.error(response?.data?.message);
    },
  });
  return (
    <>
      {(pendingApproved || pendingDelete || pendingUpdate) && <PendingApi />}
      <SearchBox name={["email", "phone"]} setSearch={setSearchQuery} />
      {data?.pages[0].data.length ?
        <>
          <div className='bg-white p-3 rounded-xl shadow-md'>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>نام</StyledTableCell>
                    <StyledTableCell align='center'>محصول</StyledTableCell>
                    <StyledTableCell align='center'>کامنت</StyledTableCell>
                    <StyledTableCell align='center'>امتیاز</StyledTableCell>
                    <StyledTableCell align='center'>وضعیت</StyledTableCell>
                    <StyledTableCell align='center'>تاریخ ثبت</StyledTableCell>
                    <StyledTableCell align='center'>عملیات ها</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.pages[0].data.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">{row.name}</StyledTableCell>
                      <StyledTableCell align='center'>
                        <Link className='underline' to={"/admin/product/" + row.Product.slug}>
                          {row.Product.name}
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell align='center'><p className='text-xs cutline cutline-1'>{row.content}</p></StyledTableCell>
                      <StyledTableCell align='center'>{row.rating}</StyledTableCell>
                      <StyledTableCell align='center'>{row.isApproved ?
                        <Button
                          size='small'
                          color="success"
                          endIcon={<FaCheck />}
                          variant="contained"
                        >
                          تایید
                        </Button>
                        :
                        <Button
                          size='small'
                          color="error"
                          endIcon={<MdClose />}
                          variant="contained"
                        >
                          تایید نشده
                        </Button>
                      }</StyledTableCell>
                      <StyledTableCell align='center'>{new Date(row.createdAt).toLocaleDateString("fa")}</StyledTableCell>
                      <StyledTableCell align='center'>
                        <div className='flex gap-3 w-full justify-center'>
                          <Button onClick={() => { setDataComment(row), setOpenModal(true), setRate(row.rating) }} className='!bg-black shadow-md !text-white flex gap-1 !px-4 !py-2 items-center !text-sm'>
                            ویرایش
                            <FaPen />
                          </Button>
                          {
                            row.isApproved ? null : <Button onClick={() => approvedUpdate({ rate: row.rating, id: row.id, productId: row.productId })} className='!bg-black shadow-md !text-white flex gap-1 !px-4 !py-2 items-center !text-sm'>
                              تایید
                              <FaCheck />
                            </Button>
                          }
                          <DeleteButton deletePost={() => deleteComment({ id: row.id, productId: row.productId })} text='حذف' pendingDelete={pendingDelete} />
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <PaginationAdmin allPage={data?.pages[0].pagination.allPage} search={searchQuery} setSearch={setSearchQuery} />
        </>
        : <DontData text='هیچ کامنتی یافت نشد.' />
      }
      <Dialog
        maxWidth="lg"
        fullWidth
        open={openModal}
        keepMounted
        onClose={() => setOpenModal(false)}
      >
        <DialogTitle>{"ویرایش اطلاعات کاربر"}</DialogTitle>
        <DialogContent>
          {dataComment ?
            <div className='mt-8 grid grid-cols-3 gap-5'>
              <TextField disabled variant='outlined' defaultValue={dataComment?.name || ""} label="اسم" />
              <TextField disabled variant='outlined' defaultValue={dataComment?.phone || ""} label="شماره تلفن" />
              <TextField disabled variant='outlined' defaultValue={dataComment?.email || ""} label="ایمیل" />
              <TextField disabled variant='outlined' defaultValue={dataComment?.Product.name || ""} label="محصول" />
              <TextField disabled variant='outlined' defaultValue={dataComment?.isApproved ? "تایید شده" : "تایید نشده"} label="وضعیت" />
              <Box sx={{ '& > legend': { mt: 2 } }}>
                <Typography component="legend">امتیاز کاربر</Typography>
                <Rating
                  style={{ direction: "ltr" }}
                  name="simple-controlled"
                  value={rate}
                  onChange={(event, newValue) => {
                    setRate(newValue);
                  }}
                />
              </Box>
              <form onSubmit={handleSubmit((data) => updateComment(data))} className='col-span-3'>

                <TextField variant='outlined' fullWidth multiline rows={6} {...register("content")} defaultValue={dataComment?.content || ""} label="کامنت" />
                <div className='mt-3'>
                  <Button disabled={pendingUpdate} type='submit' className='shadow-md gap-2 flex items-center' variant='outlined'>
                    ذخیره اطلاعات
                    <MdDataSaverOn />
                  </Button>
                </div>
              </form>
            </div>
            : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>بستن</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
