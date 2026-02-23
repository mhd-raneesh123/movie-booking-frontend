import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold text-red-500 tracking-wider">ShowTime</Link>
      <div className="space-x-4">
        <Link to="/login" className="hover:text-red-400 transition-colors">Login</Link>
        <Link to="/signup" className="bg-red-600 px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;