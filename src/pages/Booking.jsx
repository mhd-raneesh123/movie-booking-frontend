import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const { theater, time, date } = location.state || {};
  const [selectedSeats, setSelectedSeats] = useState([]);

  const totalSeats = Array.from({ length: 40 }, (_, i) => i + 1);

  // --- NEW: SEAT TIER LOGIC ---
  const getSeatInfo = (num) => {
    if (num <= 16) return { type: 'Silver', price: 10, color: 'bg-slate-200', active: 'bg-slate-500' };
    if (num <= 32) return { type: 'Gold', price: 15, color: 'bg-yellow-100', active: 'bg-yellow-600' };
    return { type: 'Platinum', price: 25, color: 'bg-purple-100', active: 'bg-purple-700' };
  };

  // Calculate dynamic total based on selected seat types
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + getSeatInfo(seat).price, 0);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies')
      .then(response => {
        const foundMovie = response.data.find(m => String(m._id) === String(id));
        if (foundMovie) setMovie(foundMovie);
      })
      .catch(error => console.error("Error fetching movie:", error));
  }, [id]);

  const toggleSeat = (seatNumber) => {
    setSelectedSeats(prev => 
      prev.includes(seatNumber) ? prev.filter(seat => seat !== seatNumber) : [...prev, seatNumber]
    );
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }
    navigate('/checkout', { 
      state: { 
        movie, 
        selectedSeats, 
        theater, 
        time, 
        date, 
        totalPrice // Passing the dynamic calculated price
      } 
    });
  };

  if (!movie) return <div className="text-center p-10 text-xl font-bold">Loading Movie Data...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row gap-10">
      <div className="md:w-1/3">
        <img src={movie.posterUrl} alt={movie.title} className="w-full rounded-xl shadow-lg mb-6 object-cover" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{movie.title}</h1>
        <p className="text-red-500 font-bold mb-4">{movie.genre} • {new Date(movie.releaseDate).toLocaleDateString()}</p>
        <p className="text-gray-700 leading-relaxed mb-6">{movie.description}</p>
      </div>

      <div className="md:w-2/3 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Select Your Seats</h2>
        
        <div className="mb-6 text-center bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-700">
            <span className="font-bold text-red-600">{theater || "No Theater Selected"}</span> 
            <span className="mx-2">|</span> 
            <span>{date || "No Date"}</span> 
            <span className="mx-2">at</span> 
            <span className="font-bold text-gray-900">{time || "No Time"}</span>
          </p>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mb-6 text-[10px] font-bold uppercase">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-200 rounded"></div> Silver $10</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-100 rounded"></div> Gold $15</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-100 rounded"></div> Platinum $25</div>
        </div>

        <div className="w-full h-8 bg-gray-300 rounded-t-3xl mb-10 shadow-inner flex items-center justify-center">
           <span className="text-gray-500 text-sm font-bold tracking-widest uppercase">Screen</span>
        </div>

        <div className="grid grid-cols-8 gap-3 mb-8">
          {totalSeats.map(seat => {
            const isSelected = selectedSeats.includes(seat);
            const seatInfo = getSeatInfo(seat);
            return (
              <button
                key={seat}
                onClick={() => toggleSeat(seat)}
                className={`h-10 w-10 rounded-t-lg text-xs font-bold transition-all duration-200 
                  ${isSelected ? `${seatInfo.active} text-white shadow-md scale-105` : `${seatInfo.color} text-gray-600 hover:brightness-95`}`}
              >
                {seat}
              </button>
            );
          })}
        </div>

        <div className="border-t pt-6 mt-6 flex justify-between items-center">
          <div>
            <p className="text-gray-600">Selected Seats: <span className="font-bold text-gray-900">{selectedSeats.length}</span></p>
            <p className="text-xl font-bold text-gray-900">Total: ${totalPrice}</p>
          </div>
          <button 
            onClick={handleBooking}
            className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;