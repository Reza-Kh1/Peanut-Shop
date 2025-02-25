import { useState } from 'react'
import DontData from '../../components/DontData/DontData';
import SearchBox from '../../components/SearchBox/SearchBox';
import { Button, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { StyledTableCell, StyledTableRow } from '../Users/Users';
import { IoEye } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { ChatType, PaginationType } from '../../type';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getSupport } from '../../services/fetchData';
import PaginationAdmin from '../../components/PaginationAdmin/PaginationAdmin';

export default function Support() {
  const [searchQuery, setSearchQuery] = useState<any>();
  const { data } = useInfiniteQuery<{
    data: ChatType[],
    pagination: PaginationType
  }>({
    queryKey: ["GetSupport", searchQuery],
    queryFn: () => getSupport(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage || undefined,
    initialPageParam: "",
  });
  return (
    <>
      <SearchBox name={["email", "phone"]} setSearch={setSearchQuery} />
      {data?.pages[0].data.length ?
        <>
          <div className='bg-white p-3 rounded-xl shadow-md'>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>موضوع</StyledTableCell>
                    <StyledTableCell align='center'>وضعیت</StyledTableCell>
                    <StyledTableCell align='center'>نام</StyledTableCell>
                    <StyledTableCell align='center'>شماره تلفن</StyledTableCell>
                    <StyledTableCell align='center'>تاریخ درخواست</StyledTableCell>
                    <StyledTableCell align='center'>عملیات ها</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.pages[0].data.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">
                        <p className='cutline cutline-1'>{row.title}</p>
                      </StyledTableCell>
                      <StyledTableCell align='center'>{row.isDone ? "بسته" : "باز"}</StyledTableCell>
                      <StyledTableCell align='center'>{row.User.name}</StyledTableCell>
                      <StyledTableCell align='center'>{row.User.phone}</StyledTableCell>
                      <StyledTableCell align='center'>{new Date(row.createdAt).toLocaleDateString("fa")}</StyledTableCell>
                      <StyledTableCell align='center'>
                        <div className='flex gap-3 w-full justify-center'>
                          <Link to={"/admin/support/" + row.id}>
                            <Button className='!bg-black shadow-md !text-white flex gap-1 !px-4 !py-2 items-center !text-sm'>
                              نمایش کامل
                              <IoEye />
                            </Button>
                          </Link>
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
        : <DontData text='هیچ درخواستی ثبت نشده.' />}
    </>
  )
}
