import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem('userId'); // Retrieve stored ID

  useEffect(() => {
    if (userId) {
      axios.get(`https://movie-booking-backend-mebh.onrender.com/api/bookings/user/${userId}`)
        .then(res => setBookings(res.data))
        .catch(err => console.error("Error fetching history:", err));
    }
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">My Booking History</h2>
      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p className="text-gray-500">No bookings found yet. Time for a movie?</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
              <div>
                <h3 className="text-xl font-bold text-red-600">{booking.movieTitle}</h3>
                <p className="text-gray-600 font-medium">{booking.theater} | {booking.date} at {booking.time}</p>
                <p className="text-sm text-gray-400 mt-1 italic">Seats: {booking.seats.join(', ')}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${booking.totalPrice}</p>
                <p className="text-xs text-gray-400 uppercase tracking-tighter">{new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;