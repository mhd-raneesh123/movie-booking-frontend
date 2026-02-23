import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf'; //

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Destructure movie, seats, and price from Booking.jsx
  // Note: Add 'theater', 'time', and 'date' to this list if you pass them from Booking.jsx
  const { movie, selectedSeats, totalPrice, theater, time, date } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // PDF Generation Logic
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

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
    }, 2000);
  };

  if (isPaid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-green-500 max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your digital ticket is ready.</p>
          
          <div className="bg-gray-50 p-4 rounded-xl text-left border-l-4 border-red-500 mb-6">
            <p className="font-bold text-lg">{movie?.title}</p>
            <p className="text-sm text-gray-500">Seats: {selectedSeats?.join(', ')}</p>
            <p className="text-sm text-gray-500">Method: {paymentMethod.toUpperCase()}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={generatePDF} 
              className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition"
            >
              Download PDF Ticket
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Back to Home
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
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setPaymentMethod('card')}
            className={`flex-1 py-3 px-4 rounded-xl border-2 transition font-semibold ${paymentMethod === 'card' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200'}`}
          >
            💳 Credit/Debit Card
          </button>
          <button 
            onClick={() => setPaymentMethod('upi')}
            className={`flex-1 py-3 px-4 rounded-xl border-2 transition font-semibold ${paymentMethod === 'upi' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200'}`}
          >
            📱 UPI (GPay/PhonePe)
          </button>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          {paymentMethod === 'card' ? (
            <div className="space-y-4 animate-fadeIn">
              <input type="text" placeholder="Cardholder Name" className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
              <input type="text" placeholder="Card Number (16 Digits)" className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
              <div className="flex gap-4">
                <input type="text" placeholder="MM/YY" className="w-1/2 p-4 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
                <input type="password" placeholder="CVV" className="w-1/2 p-4 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn text-center">
              <div className="bg-gray-100 p-6 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-500 mb-2">Enter your UPI ID</p>
                <input type="text" placeholder="username@okaxis" className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-center text-lg font-mono" required />
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
            <div className="flex justify-between"><span className="text-gray-500">Movie</span><span className="font-semibold">{movie?.title}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Seats</span><span className="font-semibold">{selectedSeats?.join(', ')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tax (GST)</span><span className="font-semibold">$2.00</span></div>
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