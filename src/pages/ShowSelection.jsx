import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const ShowSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const movie = location.state?.movie;

  const [selectedDate, setSelectedDate] = useState('Today, 23 Feb');
  const [selectedTheater, setSelectedTheater] = useState(null);

  const dates = ['Today, 23 Feb', 'Tue, 24 Feb', 'Wed, 25 Feb', 'Thu, 26 Feb'];
  
  const theaters = [
    { name: "PVR: Directors Cut", times: ["10:30 AM", "02:15 PM", "07:00 PM", "10:45 PM"] },
    { name: "Cinepolis: VIP Lounge", times: ["11:00 AM", "03:30 PM", "06:45 PM"] },
    { name: "Inox: Insignia", times: ["09:00 AM", "12:45 PM", "04:00 PM", "08:15 PM"] }
  ];

const handleTimeSelect = (theaterName, timeSlot) => {
  navigate(`/book/${id}`, { 
    state: { 
      movie: movie, 
      theater: theaterName, 
      time: timeSlot, 
      date: selectedDate 
    } 
  });
};
if (!movie) {
  return <div className="text-center p-20 text-xl">No movie data found. Please go back to Home.</div>;
    }
    
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{movie?.title}</h1>
        <p className="text-gray-500 mb-8">{movie?.genre} • English</p>

        {/* Date Selector */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
          {dates.map(date => (
            <button 
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold transition ${selectedDate === date ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-600 border hover:border-red-500'}`}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Theater & Time Slots */}
        <div className="space-y-6">
          {theaters.map(theater => (
            <div key={theater.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4 text-gray-800">📍 {theater.name}</h3>
              <div className="flex flex-wrap gap-3">
                {theater.times.map(time => (
                  <button 
                    key={time}
                    onClick={() => handleTimeSelect(theater.name, time)}
                    className="px-5 py-2 border border-green-500 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition text-sm"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowSelection;