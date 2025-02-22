import { Link, Outlet } from "react-router";

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <nav className="sidebar">
                <ul>
                    <li><Link to="/admin">داشبورد</Link></li>
                    <li><Link to="/admin/users">کاربران</Link></li>
                    <li><Link to="/admin/settings">تنظیمات</Link></li>
                </ul>
            </nav>
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}
