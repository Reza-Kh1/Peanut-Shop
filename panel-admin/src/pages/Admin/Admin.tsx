import Sidebar from '../../components/Sidebar/Sidebar'
import LoadingFetch from '../../components/LoadingFetch/LoadingFetch'
import { Outlet } from 'react-router-dom'

export default function Admin() {
  return (
    <div className="w-full p-3 md:p-5 flex gap-10 min-h-screen bg-[#f4f4f5] ">
        <Sidebar />
      <main>
        <Outlet />
        <LoadingFetch />
      </main>
    </div>
  )
}
