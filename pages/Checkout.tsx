import React, { useState } from 'react';
import { useStore } from '../store';
import { Button } from '../components/ui';
import { Trash2, Lock, CreditCard, ShieldCheck, Tag, X, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Checkout = () => {
  const { cart, removeFromCart, cartTotal, discountedTotal, clearCart, completePurchase, applyPromoCode, removePromoCode, discount, appliedPromoCode } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const navigate = useNavigate();

  const handleFakePayment = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    
    // Simulate Stripe delay
    setTimeout(() => {
      setIsProcessing(false);
      completePurchase(); // Generates tickets and clears cart
      // Always redirect to account so users can manage/scratch tickets there
      navigate('/account');
    }, 2000);
  };

  const handleApplyPromo = () => {
    if (!promoInput) return;
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoError('');
      setPromoInput(''); // Clear input on success
    } else {
      setPromoError('Invalid code. Try BABY10 or WELCOME.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 pt-24 text-center px-4">
        <h2 className="text-3xl font-bold text-teal-900 mb-6">Your basket is empty</h2>
        <Link to="/competitions">
          <Button>Find a Prize</Button>
        </Link>
      </div>
    );
  }

  const subTotal = cartTotal();
  const finalTotal = discountedTotal();
  const savings = subTotal - finalTotal;

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-teal-900 mb-10 tracking-tight">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
             <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-cream-200">
               <h3 className="font-bold text-xl text-teal-900 mb-8 flex items-center gap-2">
                 Your Order <span className="text-stone-400 text-sm font-normal">({cart.length} items)</span>
               </h3>
               <div className="space-y-8">
                 {cart.map((item, idx) => (
                   <div key={`${item.competitionId}-${idx}`} className="flex gap-5 items-start">
                     <img src={item.image} alt={item.competitionTitle} className="w-24 h-24 rounded-2xl object-cover bg-cream-100" />
                     <div className="flex-grow pt-1">
                       <h4 className="font-bold text-teal-900 leading-tight mb-2 text-lg">{item.competitionTitle}</h4>
                       <p className="text-sm font-bold text-teal-500 bg-teal-50 inline-block px-2 py-1 rounded-md">{item.ticketCount} Tickets</p>
                     </div>
                     <div className="text-right pt-1">
                       <p className="font-bold text-teal-900 text-lg">£{item.price.toFixed(2)}</p>
                       <button onClick={() => removeFromCart(item.competitionId)} className="text-stone-300 hover:text-rose-400 mt-3 transition-colors">
                         <Trash2 size={18} />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Promo Code Section */}
               <div className="mt-8 pt-8 border-t border-cream-200">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Promotional Code</label>
                  
                  {appliedPromoCode ? (
                    <div className="flex justify-between items-center bg-teal-50 border border-teal-100 p-4 rounded-xl">
                       <div className="flex items-center gap-2">
                          <Tag size={16} className="text-teal-600" />
                          <span className="font-bold text-teal-900">{appliedPromoCode}</span>
                          <span className="text-xs bg-teal-200 text-teal-800 px-2 py-0.5 rounded-full font-bold">{(discount * 100).toFixed(0)}% OFF</span>
                       </div>
                       <button onClick={removePromoCode} className="text-stone-400 hover:text-rose-500">
                          <X size={18} />
                       </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                       <input 
                          type="text" 
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Enter code" 
                          className="flex-grow p-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none uppercase font-medium placeholder:normal-case"
                       />
                       <Button variant="secondary" onClick={handleApplyPromo} className="px-6">Apply</Button>
                    </div>
                  )}
                  {promoError && <p className="text-rose-500 text-sm mt-2">{promoError}</p>}
               </div>

               <div className="border-t border-cream-200 mt-8 pt-8 space-y-3">
                 <div className="flex justify-between items-center text-stone-500">
                    <span>Subtotal</span>
                    <span>£{subTotal.toFixed(2)}</span>
                 </div>
                 {discount > 0 && (
                   <div className="flex justify-between items-center text-emerald-600 font-medium">
                      <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                      <span>-£{savings.toFixed(2)}</span>
                   </div>
                 )}
                 <div className="flex justify-between items-center pt-2">
                   <span className="font-bold text-stone-900 text-xl">Total to Pay</span>
                   <span className="text-4xl font-bold text-teal-900">£{finalTotal.toFixed(2)}</span>
                 </div>
               </div>
             </div>
             
             <div className="mt-8 flex items-center justify-center gap-2 text-stone-400 text-sm font-medium">
               <ShieldCheck size={18} /> Guaranteed Secure Checkout via Stripe
             </div>
          </div>

          {/* Payment Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-cream-100">
              
              <h3 className="font-bold text-xl text-teal-900 mb-6">Express Checkout</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                 {/* Apple Pay Button - Official Style */}
                 <button 
                   type="button" 
                   onClick={handleFakePayment} 
                   disabled={isProcessing} 
                   className="flex items-center justify-center bg-black text-white h-14 rounded-xl hover:opacity-90 transition disabled:opacity-50"
                   style={{ backgroundColor: '#000' }}
                   aria-label="Pay with Apple Pay"
                 >
                    <svg width="50" height="20" viewBox="0 0 50 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.38 3.64c.49-.61 .83-1.46.74-2.31-.71.03-1.57.47-2.08 1.07-.46.53-.86 1.38-.75 2.19.79.06 1.59-.40 2.09-95Z" fill="white"/>
                      <path d="M10.36 5.77c-1.15-.07-2.13.65-2.67.65-.55 0-1.38-.62-2.27-.60-1.17.02-2.24.68-2.84 1.72-1.21 2.10-.31 5.21.87 6.92.58.84 1.26 1.77 2.16 1.74.87-.03 1.20-.56 2.25-.56 1.05 0 1.35.56 2.27.54.94-.02 1.54-.84 2.11-1.69.67-.96.94-1.89.96-1.94-.02-.01-1.84-.71-1.86-2.79-.02-1.75 1.43-2.59 1.49-2.63-.82-1.18-2.08-1.32-2.47-1.36Z" fill="white"/>
                      <path d="M19.57 2v13.38h2.06V11.7h2.86c2.61 0 4.45-1.79 4.45-4.35S27.13 2 24.55 2h-4.98Zm2.06 1.78h2.38c1.79 0 2.81.95 2.81 2.57 0 1.62-1.02 2.58-2.82 2.58h-2.37V3.78ZM32.35 15.5c1.32 0 2.55-.67 3.11-1.72h.04v1.60h1.91V9.34c0-1.95-1.56-3.21-3.95-3.21-2.22 0-3.92 1.27-3.96 3.02h1.86c.15-.83.88-1.37 2.04-1.37 1.31 0 2.01.62 2.01 1.75v.77l-2.63.16c-2.45.15-3.78 1.16-3.78 2.92 0 1.78 1.38 2.92 3.35 2.92Zm.56-1.63c-1.14 0-1.87-.55-1.87-1.39 0-.86.7-1.36 2.04-1.44l2.38-.15v.78c0 1.29-1.09 2.20-2.55 2.20ZM41.26 19c1.97 0 2.90-.75 3.71-3.03l3.54-9.88h-2.08l-2.39 7.65h-.04l-2.39-7.65h-2.15l3.43 9.48-.18.58c-.3 .96-.79 1.33-1.67 1.33-.16 0-.46-.01-.58-.03v1.64c.13.03.68.05.80.05Z" fill="white"/>
                    </svg>
                 </button>
                 
                 {/* Google Pay Button - Official Style */}
                 <button 
                   type="button" 
                   onClick={handleFakePayment} 
                   disabled={isProcessing} 
                   className="flex items-center justify-center bg-white h-14 rounded-xl hover:shadow-md transition disabled:opacity-50 border-2 border-stone-200"
                   aria-label="Pay with Google Pay"
                 >
                    <svg width="55" height="22" viewBox="0 0 55 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25.76 11.38v-4.51h5.57c.27.76.42 1.57.42 2.51 0 3.15-2.11 5.39-5.99 5.39-3.45 0-6.26-2.80-6.26-6.26S22.31 2.25 25.76 2.25c1.88 0 3.45.69 4.66 1.82l-1.31 1.31c-.79-.74-1.86-1.32-3.35-1.32-2.74 0-4.87 2.21-4.87 4.95s2.13 4.95 4.87 4.95c3.15 0 4.33-2.26 4.51-3.43h-4.51v-.15Z" fill="#5F6368"/>
                      <path d="M33.15 14.61c-2.29 0-4.15-1.73-4.15-4.13s1.86-4.13 4.15-4.13 4.15 1.73 4.15 4.13-1.86 4.13-4.15 4.13Zm0-6.98c-1.45 0-2.71 1.20-2.71 2.85s1.26 2.85 2.71 2.85 2.71-1.20 2.71-2.85-1.26-2.85-2.71-2.85Z" fill="#5F6368"/>
                      <path d="M43.15 14.61c-2.29 0-4.15-1.73-4.15-4.13s1.86-4.13 4.15-4.13 4.15 1.73 4.15 4.13-1.86 4.13-4.15 4.13Zm0-6.98c-1.45 0-2.71 1.20-2.71 2.85s1.26 2.85 2.71 2.85 2.71-1.20 2.71-2.85-1.26-2.85-2.71-2.85Z" fill="#5F6368"/>
                      <path d="M52.69 6.61v7.54c0 3.10-1.83 4.37-3.99 4.37-2.03 0-3.26-1.36-3.72-2.48l1.25-.52c.28.67.96 1.46 2.47 1.46 1.62 0 2.62-1.00 2.62-2.88v-.60h-.08c-.48.59-1.41 1.11-2.58 1.11-2.45 0-4.69-2.13-4.69-4.88 0-2.76 2.24-4.89 4.69-4.89 1.17 0 2.10.52 2.58 1.10h.08v-.82h1.37v.49Zm-1.44 3.81c0-1.72-1.15-2.99-2.62-2.99-1.49 0-2.74 1.27-2.74 2.99 0 1.70 1.25 2.96 2.74 2.96 1.47 0 2.62-1.26 2.62-2.96Z" fill="#5F6368"/>
                      <path d="M7.44 8.84v1.43H11.1c-.12.95-.43 1.64-.91 2.12-.58.58-1.49 1.22-3.19 1.22-2.54 0-4.52-2.05-4.52-4.59S4.46 4.43 7 4.43c1.40 0 2.42.55 3.18 1.26l1.01-1.01C9.86 3.40 8.50 2.75 7 2.75 3.49 2.75.75 5.39.75 8.90s2.74 6.15 6.25 6.15c1.83 0 3.22-.60 4.30-1.73 1.11-1.11 1.46-2.67 1.46-3.93 0-.39-.03-.75-.09-1.05H7.44v1.5Z" fill="#5F6368"/>
                    </svg>
                 </button>
              </div>

              <div className="relative mb-8 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cream-200"></div>
                </div>
                <span className="relative bg-white px-4 text-xs text-stone-400 font-bold uppercase tracking-wider">Or Pay With Card</span>
              </div>

              <form onSubmit={handleFakePayment}>
                <h3 className="font-bold text-xl text-teal-900 mb-8">Contact & Payment</h3>
                
                <div className="space-y-6 mb-10">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Email Address</label>
                    <input required type="email" className="w-full p-4 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none transition font-medium text-teal-900" placeholder="you@example.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div>
                       <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">First Name</label>
                       <input required type="text" className="w-full p-4 bg-cream-50 border border-cream-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 transition" placeholder="Jane" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Last Name</label>
                       <input required type="text" className="w-full p-4 bg-cream-50 border border-cream-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 transition" placeholder="Doe" />
                     </div>
                  </div>
                </div>

                <div className="bg-cream-50 p-6 rounded-2xl border border-cream-200 mb-8">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="bg-white p-2 rounded-lg text-teal-500 shadow-sm"><CreditCard /></div>
                      <span className="font-bold text-teal-900">Card Details</span>
                   </div>
                   <input disabled value="4242 4242 4242 4242" className="w-full p-4 bg-white border border-cream-200 rounded-xl mb-4 text-stone-400 cursor-not-allowed font-mono text-sm" />
                   <div className="grid grid-cols-2 gap-4">
                     <input disabled value="12/25" className="w-full p-4 bg-white border border-cream-200 rounded-xl text-stone-400 cursor-not-allowed font-mono text-sm" />
                     <input disabled value="123" className="w-full p-4 bg-white border border-cream-200 rounded-xl text-stone-400 cursor-not-allowed font-mono text-sm" />
                   </div>
                </div>

                <Button type="submit" disabled={isProcessing} size="lg" className="w-full text-lg py-5 shadow-lg shadow-teal-100">
                  {isProcessing ? 'Processing Payment...' : `Pay £${finalTotal.toFixed(2)}`}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};