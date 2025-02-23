import Sidebar from '../../components/Sidebar/Sidebar'
import LoadingFetch from '../../components/LoadingFetch/LoadingFetch'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'

export default function Admin() {
  return (
    <div className="w-full p-3 md:p-5 flex gap-5 min-h-screen bg-slate-100">
      <Sidebar />
      <main className='flex flex-col gap-5 w-10/12'>
        <Navbar />
        <Outlet />
      </main>
      <LoadingFetch />
    </div>
  )
}
