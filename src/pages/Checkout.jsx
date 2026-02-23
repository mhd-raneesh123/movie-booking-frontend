import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf'; //
import axios from 'axios';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, selectedSeats, totalPrice, theater, time, date } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('card'); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // 1. PDF Generation Logic
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("MOVIE TICKET", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(`Movie: ${movie?.title}`, 20, 40);
    doc.text(`Theater: ${theater || "Main Screen"}`, 20, 50);
    doc.text(`Date: ${date || "N/A"}`, 20, 60);
    doc.text(`Time: ${time || "N/A"}`, 20, 70);
    doc.text(`Seats: ${selectedSeats?.join(', ')}`, 20, 80);
    doc.text(`Total Paid: $${totalPrice + 2}`, 20, 90);

    doc.setFontSize(10);
    doc.text("Please present this digital ticket at the entrance.", 20, 110);
    
    doc.save(`Ticket_${movie?.title || 'Movie'}.pdf`);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const userId = localStorage.getItem('userId');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Save to history
      await axios.post('http://localhost:5000/api/bookings/save', {
        userId,
        movieTitle: movie?.title,
        theater,
        date,
        time,
        seats: selectedSeats,
        totalPrice: totalPrice + 2
      }); 

      setIsProcessing(false);
      setIsPaid(true);
    } catch (err) {
      console.error("Error saving booking:", err);
      setIsProcessing(false);
      alert("Payment successful, but failed to record booking.");
    }
  };

  // 2. Success Screen with PDF Download Button
  if (isPaid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-green-500 max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your ticket has been recorded in your history.</p>
          
          <div className="bg-gray-50 p-4 rounded-xl text-left border-l-4 border-red-500 mb-6 font-medium">
            <p className="text-gray-900">{movie?.title}</p>
            <p className="text-sm text-gray-500">Seats: {selectedSeats?.join(', ')}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={generatePDF} 
              className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition shadow-md"
            >
              Download PDF Ticket
            </button>
            <button 
              onClick={() => navigate('/profile')} 
              className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-black transition"
            >
              Go to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 flex flex-col md:flex-row gap-10">
      <div className="md:w-3/5">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose Payment Method</h2>
        
        {/* Method Toggle Buttons */}
        <div className="flex gap-4 mb-8">
          <button 
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-semibold ${
              paymentMethod === 'card' ? 'border-red-500 bg-red-50 text-red-600 shadow-sm' : 'border-gray-200 text-gray-500'
            }`}
          >
            💳 Card
          </button>
          <button 
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-semibold ${
              paymentMethod === 'upi' ? 'border-red-500 bg-red-50 text-red-600 shadow-sm' : 'border-gray-200 text-gray-500'
            }`}
          >
            📱 UPI
          </button>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          {paymentMethod === 'card' ? (
            <div className="space-y-4">
              <input type="text" placeholder="Cardholder Name" className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
              <input type="text" placeholder="Card Number" className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
              <div className="flex gap-4">
                <input type="text" placeholder="MM/YY" className="w-1/2 p-4 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
                <input type="password" placeholder="CVV" className="w-1/2 p-4 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200">
                <input 
                  type="text" 
                  placeholder="username@upi" 
                  className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-center font-mono" 
                  required 
                />
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all transform active:scale-95 shadow-lg mt-6">
            {isProcessing ? "Verifying Payment..." : `Securely Pay $${totalPrice + 2}`}
          </button>
        </form>
      </div>

      <div className="md:w-2/5">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-8">
          <h3 className="text-xl font-bold mb-4 pb-2 border-b">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600"><span>Movie</span><span className="font-semibold text-gray-900">{movie?.title}</span></div>
            <div className="flex justify-between text-gray-600"><span>Theater</span><span className="font-semibold text-gray-900">{theater}</span></div>
            <div className="flex justify-between text-gray-600"><span>Seats</span><span className="font-semibold text-gray-900">{selectedSeats?.join(', ')}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax</span><span className="font-semibold text-gray-900">$2.00</span></div>
            <div className="border-t pt-3 flex justify-between text-2xl font-bold text-gray-900">
              <span>Total</span>
              <span>${totalPrice + 2}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;