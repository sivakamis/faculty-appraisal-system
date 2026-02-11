import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100 font-sans text-secondary-900 relative overflow-hidden">
            {/* Decorative Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

            {/* Navbar */}
            <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="bg-primary-900 p-2 rounded-lg text-white">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold text-primary-900 tracking-tight">Faculty Appraisal System</span>
                </div>
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-secondary-700 font-medium hover:text-primary-900 transition-colors"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-primary-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-800 transition-colors shadow-lg shadow-primary-900/20"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex flex-col items-center justify-center text-center mt-20 px-4 max-w-5xl mx-auto animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-extrabold text-primary-900 leading-tight mb-6">
                    Streamline Your <span className="text-primary-700">Academic Excellence</span>
                </h1>
                <p className="text-lg md:text-xl text-secondary-500 max-w-3xl mb-10 leading-relaxed">
                    A comprehensive platform for faculty performance appraisal, enabling transparent evaluation, goal tracking, and professional development across your institution.
                </p>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-primary-900 text-white px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-primary-800 transition-all transform hover:-translate-y-1 shadow-xl shadow-primary-900/20 flex items-center justify-center"
                    >
                        Start Your Appraisal <span className="ml-2">→</span>
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-white text-primary-900 border-2 border-primary-100 px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-primary-50 hover:border-primary-200 transition-all transform hover:-translate-y-1 shadow-sm flex items-center justify-center"
                    >
                        Sign In
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
