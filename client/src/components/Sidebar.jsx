import { Home, FileText, Users, Settings, PieChart, Menu, X, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import clsx from 'clsx';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Overview', icon: Home, roles: ['faculty', 'admin'] },
        { path: '/appraisal', label: 'Submit Appraisal', icon: FileText, roles: ['faculty'] },
        { path: '/my-appraisals', label: 'My Submissions', icon: PieChart, roles: ['faculty'] },
        { path: '/admin/dashboard', label: 'Admin Dashboard', icon: Users, roles: ['admin'] },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md text-secondary-700"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar Container */}
            <div className={clsx(
                "fixed md:static inset-y-0 left-0 z-40 w-72 bg-secondary-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col shadow-2xl",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-secondary-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-primary-300 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-white text-lg">U</span>
                        </div>
                        <span className="text-xl font-bold tracking-wide">UnivFaculty</span>
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-2">Menu</p>
                    {navItems.map((item) => (
                        (item.roles.includes(user?.role)) && (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    clsx(
                                        "flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group",
                                        isActive
                                            ? "bg-primary-600 text-white shadow-lg shadow-primary-900/20"
                                            : "text-secondary-300 hover:bg-secondary-800 hover:text-white"
                                    )
                                }
                            >
                                <item.icon className={clsx("h-5 w-5 transition-transform duration-200", { "scale-110": false })} />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        )
                    ))}
                </div>

                <div className="p-4 border-t border-secondary-800">
                    <div className="bg-secondary-800/50 rounded-xl p-4 mb-2">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="h-8 w-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-200 font-bold border border-primary-500/30">
                                {user?.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                <p className="text-xs text-secondary-400 truncate capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <LogOut className="w-3 h-3" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
