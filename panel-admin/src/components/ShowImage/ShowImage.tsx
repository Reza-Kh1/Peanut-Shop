import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useState } from 'react'
import Upload from '../../pages/Upload/Upload'
import { FaImage } from 'react-icons/fa6'
import ImageCustom from '../ImageCustom/ImageCustom'
import { data } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'

export default function ShowImage() {
    const [openModal, setOpenModal] = useState(false)
    const [dataImage, setDataImage] = useState({
        url: "",
        alt: ""
    })
    return (
        <>
            <Button onClick={() => setOpenModal(true)} className='!bg-black shadow-md !text-white flex gap-1 !px-4 !py-2 items-center !text-sm'>
                نمایش عکس ها
                <FaImage />
            </Button>
            <Dialog
                maxWidth="xl"
                fullWidth
                open={openModal}
                keepMounted
                onClose={() => setOpenModal(false)}
            >
                <DialogContent>
                    <Upload setImage={(value) => setDataImage({ alt: "", url: value })} />
                    {dataImage.url ?
                        <div className='flex my-8 gap-10 justify-between items-center'>
                            
                            <TextField onChange={({ target }) => setDataImage({ ...dataImage, alt: target.value })}
                                value={dataImage.alt}
                                variant='outlined' fullWidth label="عنوان عکس" />
                            <div className='relative '>
                                <ImageCustom src={dataImage.url} alt={dataImage.alt || ""} width={250} height={250} />
                                <i onClick={() => setDataImage({ alt: "", url: "" })} className='absolute left-2 top-2 rounded-full shadow-md cursor-pointer p-2 bg-black/35 text-white hover:bg-black/90 '>
                                    <FaTrash />
                                </i>
                            </div>
                        </div>
                        : null}
                </DialogContent>
                <DialogActions>
                    <div className='flex justify-between items-center w-full'>
                        <Button className='!bg-black shadow-md !text-white flex gap-1 !px-4 !py-2 items-center !text-sm' onClick={() => setOpenModal(false)}>ذخیره</Button>
                        <Button onClick={() => setOpenModal(false)}>بستن</Button>
                    </div>
                </DialogActions>
            </Dialog>
        </>
    )
}
