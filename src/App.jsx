import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<div className="p-8 text-center text-2xl font-semibold">Login Page Coming Soon</div>} />
            <Route path="/signup" element={<div className="p-8 text-center text-2xl font-semibold">Signup Page Coming Soon</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;