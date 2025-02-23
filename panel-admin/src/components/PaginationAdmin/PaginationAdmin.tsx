import { Pagination, PaginationItem } from '@mui/material'
import React from 'react'
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6'
type PaginationAdminType = {
    allPage?: number
    setSearch: (value: any) => void
    search: any
}
export default function PaginationAdmin({ allPage = 1, setSearch, search }: PaginationAdminType) {
    const pageHandler = (event: React.ChangeEvent<unknown>, page: number) => {
        if (search) {
            const params = new URLSearchParams(search.toString());
            params.set("page", page.toString());
            setSearch(params.toString())
        } else {
            const body = {
                page,
            }
            setSearch(body)
        }
    }
    return (
        <div className='bg-white p-3 rounded-xl shadow-md flex justify-center'>
            <Pagination renderItem={(item) => (
                <PaginationItem
                    slots={{ previous: () => <FaAngleRight />, next: () => <FaAngleLeft /> }}
                    {...item}
                />
            )} count={allPage} onChange={pageHandler} />
        </div>
    )
}
