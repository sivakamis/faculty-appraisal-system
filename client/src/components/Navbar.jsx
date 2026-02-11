import { LogOut, User, Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="bg-white/90 backdrop-blur-sm shadow-sm px-4 md:px-6 py-4 flex justify-between items-center sticky top-0 z-30 border-b border-secondary-200">
            {/* Spacer for Mobile Menu Button */}
            <div className="md:hidden w-8"></div>

            <h1 className="text-xl md:text-2xl font-bold text-primary-900 hidden md:block">Dashboard</h1>
            <h1 className="text-lg font-bold text-primary-900 md:hidden">AppraisalSys</h1>

            <div className="flex items-center space-x-4 md:space-x-6">
                <button className="relative p-2 text-secondary-400 hover:text-primary-600 transition-colors">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
                <div className="flex items-center space-x-3 bg-secondary-50 px-3 py-1.5 rounded-full border border-secondary-200">
                    <div className="bg-primary-100 p-1.5 rounded-full">
                        <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-sm font-bold text-secondary-800 leading-tight">{user?.name}</span>
                        <span className="text-xs text-secondary-500 leading-tight capitalize">{user?.role}</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
