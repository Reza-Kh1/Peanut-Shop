import { useState } from 'react'
import PendingApi from '../../components/PendingApi/PendingApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoryType } from '../../type';
import { getAllCategory } from '../../services/fetchData';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaAngleDown, FaAngleUp, FaPen } from 'react-icons/fa';
import FormCategry from './FormCategry';
import { StyledTableCell, StyledTableRow } from '../Users/Users';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import DontData from '../../components/DontData/DontData';

export default function Category() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [dataUser, setDataUser] = useState<CategoryType>()
  const { data } = useQuery<{ data: CategoryType[] }>({
    queryKey: ["GetCategory"],
    queryFn: getAllCategory,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
  const { isPending: pendingCreate, mutate: createCategory } = useMutation({
    mutationFn: (body: { name: string, subCategoryId: string }) => {
      return axios.post("category", body);
    },
    onSuccess: () => {
      toast.success("دسته جدید ایجاد شد");
      queryClient.invalidateQueries({ queryKey: ["GetCategory"] });
    },
    onError: ({ response }: any) => {
      console.log(response);
      toast.error(response?.data?.message);
    },
  });
  const { isPending: pendingDelete, mutate: deleteCategory } = useMutation({
    mutationFn: (id: number) => {
      return axios.delete(`category/${id}`);
    },
    onSuccess: () => {
      toast.success("دسته حذف شد");
      queryClient.invalidateQueries({ queryKey: ["GetCategory"] });
    },
    onError: ({ response }: any) => {
      console.log(response);
      toast.error(response?.data?.message);
    },
  });
  const { isPending: pendingUpdate, mutate: updateCategory } = useMutation({
    mutationFn: (body: { name: string, subCategoryId: string }) => {      
      return axios.put(`category/${dataUser?.id}`, body);
    },
    onSuccess: () => {
      toast.success("دسته ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["GetCategory"] });
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
            افزودن دسته
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
        {showForm && <FormCategry pendingBtn={pendingCreate} allCategory={data?.data || []} actionHandler={createCategory} />}
      </div>
      {data?.data.length ?
        <div className='bg-white p-3 rounded-xl shadow-md'>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align='center'>#</StyledTableCell>
                  <StyledTableCell align='center'>نام دسته</StyledTableCell>
                  <StyledTableCell align='center'>دسته مادر</StyledTableCell>
                  <StyledTableCell align='center'>عملیات ها</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align='center'>{index + 1}</StyledTableCell>
                    <StyledTableCell align='center'>{row.name}</StyledTableCell>
                    <StyledTableCell align='center'>{row?.subCategoryTo?.name || "------"}</StyledTableCell>
                    <StyledTableCell align='center'>
                      <div className='flex gap-3 w-full justify-center'>
                        <Button onClick={() => { setDataUser(row), setOpenModal(true) }} className='!bg-black shadow-md !text-white flex gap-1 !px-4 !py-2 items-center !text-sm'>
                          ویرایش
                          <FaPen />
                        </Button>
                        <DeleteButton deletePost={() => deleteCategory(row.id)} text='حذف' pendingDelete={pendingDelete} />
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        : <DontData text='هیچ دسته ای ایجاد نشده است' />}
      <Dialog
        maxWidth="md"
        fullWidth
        open={openModal}
        keepMounted
        onClose={() => setOpenModal(false)}
      >
        <DialogTitle>{"ویرایش اطلاعات کاربر"}</DialogTitle>
        <DialogContent>
          <FormCategry actionHandler={updateCategory} pendingBtn={pendingUpdate} data={dataUser as CategoryType} allCategory={data?.data || []} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>بستن</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
