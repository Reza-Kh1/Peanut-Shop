import { Button, TextField } from '@mui/material'
import React from 'react'
import { FaSearch } from 'react-icons/fa'
type SearchAdmin = {
    name: string[]
    setSearch: (value: any) => void
}
export default function SearchBox({ name, setSearch }: SearchAdmin) {
    const search = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const query = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            if (value.toString()) {
                query.set(`${key}[like]`, `%${value.toString()}%`);
            }
        }
        query.set("page", "1");
        setSearch(query.toString())
    }
    return (
        <form onSubmit={search} className='bg-white p-3 shadow-md rounded-xl grid grid-cols-1 md:grid-cols-2 gap-5'>
            {name.map((row, index) => (
                <TextField
                    key={index}
                    name={row}
                    label={"Search " + row}
                    type="text"
                    variant='standard'
                    placeholder='Search...'
                />
            ))}
            <div className='md:col-span-2'>
                <Button type='submit' className='bg-white rounded-md shadow-md text-b-70 border border-b-70'>
                    Search Items
                    <FaSearch />
                </Button>
            </div>
        </form>
    )
}
