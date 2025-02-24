import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react'
import toast from 'react-hot-toast';
import { PaginationType, UserType } from '../../type';
import SearchBox from '../../components/SearchBox/SearchBox';
import PaginationAdmin from '../../components/PaginationAdmin/PaginationAdmin';
import DontData from '../../components/DontData/DontData';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaPen } from 'react-icons/fa';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import FormUser from './FormUser';
import PendingApi from '../../components/PendingApi/PendingApi';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import { getAllUser } from '../../services/fetchData';
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
type UsersForm = {
  name: string
  phone: string
  email: string
  password: string
  role: string
}
export default function Users() {
  const [searchQuery, setSearchQuery] = useState<any>();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [dataUser, setDataUser] = useState<UserType>()
  const { data } = useInfiniteQuery<{
    data: UserType[],
    pagination: PaginationType
  }>({
    queryKey: ["getUser", searchQuery],
    queryFn: () => getAllUser(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage || undefined,
    initialPageParam: "",
  });
  const { isPending: pendingCreate, mutate: createUser } = useMutation({
    mutationFn: (body: UsersForm) => {
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
  const { isPending: pendingDelete, mutate: deleteUser } = useMutation({
    mutationFn: (id: string) => {
      return axios.delete(`user/${id}`);
    },
    onSuccess: () => {
      toast.success("کاربر حذف شد");
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    },
    onError: ({ response }: any) => {
      console.log(response);
      toast.error(response?.data?.message);
    },
  });
  const { isPending: pendingUpdate, mutate: updateUser } = useMutation({
    mutationFn: (body: UsersForm) => {
      return axios.put(`user/${dataUser?.id}`, body);
    },
    onSuccess: () => {
      toast.success("کاربر ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
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
      <SearchBox name={["email", "phone"]} setSearch={setSearchQuery} />
      <div className=' bg-white p-3 rounded-xl shadow-md flex flex-col gap-5'>
        <div className='flex justify-between items-center'>
          <span>
            افزودن کاربر
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
        {showForm && <FormUser pendingBtn={pendingCreate} actionHandler={createUser} />}
      </div>
      {data?.pages[0].data.length ?
        <div className='bg-white p-3 rounded-xl shadow-md'>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>نام</StyledTableCell>
                  <StyledTableCell align='center'>شماره تلفن</StyledTableCell>
                  <StyledTableCell align='center'>ایمیل</StyledTableCell>
                  <StyledTableCell align='center'>سطح دسترسی</StyledTableCell>
                  <StyledTableCell align='center'>تاریخ ثبت نام</StyledTableCell>
                  <StyledTableCell align='center'>عملیات ها</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.pages[0].data.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align='center'>{row.phone}</StyledTableCell>
                    <StyledTableCell align='center'>{row.email}</StyledTableCell>
                    <StyledTableCell align='center'>{row.role === "ADMIN" ? "ادمین" : row.role === "AUTHOR" ? "نویسنده" : "مشتری"}</StyledTableCell>
                    <StyledTableCell align='center'>{new Date(row.createdAt).toLocaleDateString("fa")}</StyledTableCell>
                    <StyledTableCell align='center'>
                      <div className='flex gap-3 w-full justify-center'>
                        <Button onClick={() => { setDataUser(row), setOpenModal(true) }} className='!bg-black shadow-md !text-white flex gap-1 !px-4 !py-2 items-center !text-sm'>
                          ویرایش
                          <FaPen />
                        </Button>
                        <DeleteButton deletePost={() => deleteUser(row.id)} text='حذف' pendingDelete={pendingDelete} />
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        : <DontData text='هیچ کاربری یافت نشد.' />}
      <PaginationAdmin allPage={data?.pages[0].pagination.allPage} search={searchQuery} setSearch={setSearchQuery} />
      <Dialog
        maxWidth="md"
        fullWidth
        open={openModal}
        keepMounted
        onClose={() => setOpenModal(false)}
      >
        <DialogTitle>{"ویرایش اطلاعات کاربر"}</DialogTitle>
        <DialogContent>
          <FormUser actionHandler={updateUser} pendingBtn={pendingUpdate} data={dataUser as UsersForm} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>بستن</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
