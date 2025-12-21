import React, { useState } from 'react';
import { competitions as initialCompetitions } from '../mockData';
import { Competition, TicketBundle } from '../types';
import { Button } from '../components/ui';
import { Plus, ArrowLeft, Save, Trash2, Image as ImageIcon, Calendar, DollarSign, Tag, Check, Zap, Lock, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

// Categories matching types
const CATEGORIES = ['Toys', 'Nursery', 'Essentials', 'Holidays', 'Cash'];

export const Admin = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loginError, setLoginError] = useState('');

  const [view, setView] = useState<'list' | 'create'>('list');
  const [localCompetitions, setLocalCompetitions] = useState<Competition[]>(initialCompetitions);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Competition>>({
    title: '',
    category: 'Toys',
    description: '',
    retailValueGBP: 0,
    ticketPriceGBP: 0,
    maxTickets: 1000,
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    instantWin: false,
    bundles: []
  });

  const [drawDate, setDrawDate] = useState('');
  const [drawTime, setDrawTime] = useState('');

  // Bundle Helper State
  const [newBundleQty, setNewBundleQty] = useState(5);
  const [newBundlePrice, setNewBundlePrice] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow instant login for demo purposes
    setIsAuthenticated(true);
    setLoginError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Keep credentials pre-filled for easy re-login
    setUsername('admin');
    setPassword('admin');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const addBundle = () => {
    if (newBundleQty > 0 && newBundlePrice > 0) {
      const newBundle: TicketBundle = { quantity: newBundleQty, price: newBundlePrice };
      setFormData(prev => ({
        ...prev,
        bundles: [...(prev.bundles || []), newBundle]
      }));
      // Reset helpers for next entry
      setNewBundleQty(newBundleQty + 5);
      setNewBundlePrice(0);
    }
  };

  const removeBundle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bundles: prev.bundles?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct final object
    const finalDrawDate = new Date(`${drawDate}T${drawTime}`).toISOString();
    
    const newComp: Competition = {
      id: `new-${Date.now()}`,
      slug: formData.title?.toLowerCase().replace(/ /g, '-') || 'untitled',
      title: formData.title || 'Untitled',
      description: formData.description || '',
      category: formData.category as any,
      image: formData.image || '',
      retailValueGBP: formData.retailValueGBP || 0,
      ticketPriceGBP: formData.ticketPriceGBP || 0,
      maxTickets: formData.maxTickets || 100,
      ticketsSold: 0,
      drawDateTime: finalDrawDate,
      status: 'new', // Default status
      instantWin: formData.instantWin,
      bundles: formData.bundles || [] // Add bundles here
    };

    // Add to local list (simulation)
    setLocalCompetitions([newComp, ...localCompetitions]);
    
    // Reset and switch view
    setView('list');
    setFormData({
      title: '',
      category: 'Toys',
      description: '',
      retailValueGBP: 0,
      ticketPriceGBP: 0,
      maxTickets: 1000,
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=1000',
      status: 'active',
      instantWin: false,
      bundles: []
    });
  };

  // --- Login View ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-cream-200"
        >
          <div className="text-center mb-8">
            <div className="bg-teal-500 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-teal-200">
               <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-teal-900">Admin Portal</h1>
            <p className="text-stone-500 text-sm mt-2">Please sign in to manage competitions.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
             <div>
               <label className="block text-xs font-bold uppercase text-stone-400 mb-2 ml-1">Username</label>
               <input 
                 type="text" 
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full p-4 bg-cream-50 rounded-xl border border-cream-200 focus:ring-2 focus:ring-teal-500 outline-none text-teal-900 font-bold"
                 placeholder="Enter username"
               />
             </div>
             <div>
               <label className="block text-xs font-bold uppercase text-stone-400 mb-2 ml-1">Password</label>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full p-4 bg-cream-50 rounded-xl border border-cream-200 focus:ring-2 focus:ring-teal-500 outline-none text-teal-900 font-bold"
                 placeholder="••••••••"
               />
             </div>
             
             {loginError && (
               <div className="p-3 bg-rose-50 text-rose-600 text-sm font-bold rounded-lg text-center">
                 {loginError}
               </div>
             )}

             <Button size="lg" className="w-full mt-4 shadow-xl shadow-teal-100">Sign In</Button>
          </form>
          <p className="text-center text-xs text-stone-300 mt-8">Credentials pre-filled for demo</p>
        </motion.div>
      </div>
    );
  }

  // --- Views ---

  const ListView = () => (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {localCompetitions.map(comp => (
          <div key={comp.id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-cream-200">
             <div className="flex gap-4 mb-4">
                <img src={comp.image} className="w-16 h-16 rounded-xl object-cover bg-stone-100" alt="" />
                <div>
                   <h3 className="font-bold text-teal-900 leading-tight">{comp.title}</h3>
                   <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                        comp.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                        comp.status === 'sold_out' ? 'bg-stone-200 text-stone-600' : 
                        comp.status === 'new' ? 'bg-teal-100 text-teal-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {comp.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-md font-bold">
                        {comp.category}
                      </span>
                   </div>
                </div>
             </div>
             
             <div className="space-y-3">
                <div>
                   <div className="flex justify-between text-xs font-bold text-stone-500 mb-1">
                      <span>Sales Progress</span>
                      <span>{comp.ticketsSold}/{comp.maxTickets}</span>
                   </div>
                   <div className="w-full h-2 bg-cream-100 rounded-full overflow-hidden">
                       <div className="h-full bg-teal-500" style={{ width: `${(comp.ticketsSold / comp.maxTickets) * 100}%`}}></div>
                   </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-cream-100">
                   <div>
                      <div className="text-[10px] text-stone-400 uppercase font-bold">Revenue</div>
                      <div className="text-lg font-bold text-teal-900">£{(comp.ticketsSold * comp.ticketPriceGBP).toLocaleString()}</div>
                   </div>
                   <Button size="sm" variant="outline" className="border-cream-200">Edit</Button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-[2rem] shadow-sm overflow-hidden border border-cream-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-cream-50 border-b border-cream-200">
              <tr>
                <th className="p-6 text-xs font-bold uppercase tracking-wider text-stone-500">Competition</th>
                <th className="p-6 text-xs font-bold uppercase tracking-wider text-stone-500">Status</th>
                <th className="p-6 text-xs font-bold uppercase tracking-wider text-stone-500">Sales</th>
                <th className="p-6 text-xs font-bold uppercase tracking-wider text-stone-500">Revenue</th>
                <th className="p-6 text-xs font-bold uppercase tracking-wider text-stone-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {localCompetitions.map((comp) => (
                <tr key={comp.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img src={comp.image} className="w-12 h-12 rounded-lg object-cover bg-stone-100" alt="" />
                      <div>
                        <div className="font-bold text-teal-900">{comp.title}</div>
                        <div className="text-xs text-stone-500 font-mono">#{comp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      comp.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                      comp.status === 'sold_out' ? 'bg-stone-200 text-stone-600' : 
                      comp.status === 'new' ? 'bg-teal-100 text-teal-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {comp.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-cream-200 rounded-full overflow-hidden">
                         <div className="h-full bg-teal-500" style={{ width: `${(comp.ticketsSold / comp.maxTickets) * 100}%`}}></div>
                      </div>
                      <span className="text-xs font-medium text-stone-600">{comp.ticketsSold}/{comp.maxTickets}</span>
                    </div>
                  </td>
                  <td className="p-6 text-sm font-bold text-teal-900">
                    £{(comp.ticketsSold * comp.ticketPriceGBP).toLocaleString()}
                  </td>
                  <td className="p-6">
                    <button className="text-sm font-bold text-teal-600 hover:text-teal-800 hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const CreateView = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-24"
    >
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-cream-200">
          <h2 className="text-xl font-bold text-teal-900 mb-6 flex items-center gap-2">
            <Tag size={20} className="text-peach-400" /> Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-500 mb-2 ml-1">Competition Title</label>
              <input 
                required
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                type="text" 
                className="w-full p-4 bg-cream-50 rounded-xl border border-cream-200 focus:ring-2 focus:ring-teal-500 outline-none font-bold text-teal-900 placeholder:font-normal"
                placeholder="e.g. Win a 2024 Range Rover"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-2 ml-1">Category</label>
              <div className="relative">
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-cream-50 rounded-xl border border-cream-200 focus:ring-2 focus:ring-teal-500 outline-none appearance-none font-medium text-teal-900"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">▼</div>
              </div>
            </div>

            <div>
               <label className="block text-xs font-bold uppercase text-stone-500 mb-2 ml-1">Type</label>
               <div className="flex items-center gap-3 p-4 bg-cream-50 border border-cream-200 rounded-xl h-[58px]">
                  <input 
                    type="checkbox" 
                    id="instantWin"
                    name="instantWin"
                    checked={formData.instantWin}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 accent-teal-600 rounded cursor-pointer shrink-0" 
                  />
                  <label htmlFor="instantWin" className="text-sm font-bold text-teal-900 cursor-pointer flex items-center gap-2">
                     <Zap size={14} className={formData.instantWin ? "text-yellow-500" : "text-stone-300"} fill="currentColor" />
                     Instant Win Competition
                  </label>
               </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-500 mb-2 ml-1">Description</label>
              <textarea 
                required
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4} 
                className="w-full p-4 bg-cream-50 rounded-xl border border-cream-200 focus:ring-2 focus:ring-teal-500 outline-none text-stone-700"
                placeholder="Describe the prize and key details..."
              />
            </div>
          </div>
        </div>

        {/* Media & Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-cream-200">
             <h2 className="text-xl font-bold text-teal-900 mb-6 flex items-center gap-2">
               <ImageIcon size={20} className="text-peach-400" /> Imagery
             </h2>
             <label className="block text-xs font-bold uppercase text-stone-500 mb-2 ml-1">Main Image URL</label>
             <input 
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                type="url" 
                className="w-full p-4 bg-cream-50 rounded-xl border border-cream-200 mb-4 font-mono text-xs text-stone-600" 
                placeholder="https://..."
             />
             <div className="rounded-xl overflow-hidden bg-cream-100 aspect-video relative group border border-cream-100">
                {formData.image ? (
                  <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-400">No Preview</div>
                )}
             </div>
          </div>

          <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-cream-200">
             <h2 className="text-xl font-bold text-teal-900 mb-6 flex items-center gap-2">
               <DollarSign size={20} className="text-peach-400" /> Pricing & Limits
             </h2>
             
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-2 ml-1">Retail Value (£)</label>
                  <input 
                    name="retailValueGBP"
                    value={formData.retailValueGBP}
                    onChange={handleInputChange}
                    type="number" 
                    className="w-full p-3 bg-cream-50 rounded-xl border border-cream-200 focus:ring-2 focus:ring-teal-500 text-teal-900 font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-2 ml-1">Ticket Price (£)</label>
                  <input 
                    name="ticketPriceGBP"
                    value={formData.ticketPriceGBP}
                    onChange={handleInputChange}
                    type="number" 
                    step="0.01"
                    className="w-full p-3 bg-cream-50 rounded-xl border border-cream-200 focus:ring-2 focus:ring-teal-500 text-teal-900 font-bold" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-2 ml-1">Max Tickets Available</label>
                  <input 
                    name="maxTickets"
                    value={formData.maxTickets}
                    onChange={handleInputChange}
                    type="number" 
                    className="w-full p-3 bg-cream-50 rounded-xl border border-cream-200 focus:ring-2 focus:ring-teal-500 text-teal-900 font-bold" 
                  />
                </div>
             </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-cream-200">
          <h2 className="text-xl font-bold text-teal-900 mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-peach-400" /> Draw Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-2 ml-1">Draw Date</label>
                <input 
                  type="date" 
                  required
                  value={drawDate}
                  onChange={(e) => setDrawDate(e.target.value)}
                  className="w-full p-4 bg-cream-50 rounded-xl border border-cream-200 focus:ring-2 focus:ring-teal-500 text-teal-900 font-medium"
                />
             </div>
             <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-2 ml-1">Draw Time</label>
                <input 
                  type="time" 
                  required
                  value={drawTime}
                  onChange={(e) => setDrawTime(e.target.value)}
                  className="w-full p-4 bg-cream-50 rounded-xl border border-cream-200 focus:ring-2 focus:ring-teal-500 text-teal-900 font-medium"
                />
             </div>
          </div>
        </div>

        {/* Bundles Builder */}
        <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-cream-200">
          <h2 className="text-xl font-bold text-teal-900 mb-6 flex items-center gap-2">
             <Tag size={20} className="text-peach-400" /> Ticket Bundles
          </h2>
          <p className="text-sm text-stone-500 mb-6">Create discount tiers for users buying multiple tickets.</p>

          <div className="bg-cream-50 p-4 md:p-6 rounded-2xl border border-cream-200 mb-6">
             <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-4">
                   <label className="block text-xs font-bold uppercase text-stone-400 mb-1 ml-1">Qty</label>
                   <input 
                     type="number" 
                     value={newBundleQty}
                     onChange={(e) => setNewBundleQty(parseInt(e.target.value))}
                     className="w-full p-2 rounded-lg border border-cream-200 text-center font-bold text-teal-900" 
                     placeholder="5"
                   />
                </div>
                <div className="col-span-5">
                   <label className="block text-xs font-bold uppercase text-stone-400 mb-1 ml-1">Price (£)</label>
                   <input 
                     type="number" 
                     step="0.01"
                     value={newBundlePrice}
                     onChange={(e) => setNewBundlePrice(parseFloat(e.target.value))}
                     className="w-full p-2 rounded-lg border border-cream-200 text-center font-bold text-teal-900" 
                     placeholder="10.00"
                   />
                </div>
                <div className="col-span-3">
                   <Button type="button" onClick={addBundle} size="sm" className="w-full h-[42px]">
                     <Plus size={16} />
                   </Button>
                </div>
             </div>
          </div>

          <div className="space-y-3">
             {formData.bundles && formData.bundles.length > 0 ? (
               formData.bundles.map((bundle, idx) => (
                 <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-xl border border-cream-100 shadow-sm">
                    <div className="flex gap-2 md:gap-4 text-sm md:text-base">
                       <span className="font-bold text-teal-900">{bundle.quantity} Tickets</span>
                       <span className="text-stone-300">|</span>
                       <span className="font-bold text-teal-600">£{bundle.price.toFixed(2)}</span>
                    </div>
                    <button type="button" onClick={() => removeBundle(idx)} className="text-stone-300 hover:text-rose-500 p-2">
                       <Trash2 size={18} />
                    </button>
                 </div>
               ))
             ) : (
                <div className="text-center p-4 text-stone-400 text-sm italic">No bundles added yet.</div>
             )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-cream-200 z-50 md:sticky md:bottom-6 md:bg-transparent md:border-none md:p-0">
           <div className="bg-teal-900 text-white p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-sm font-medium text-teal-200 px-2 hidden md:block">Ready to launch?</span>
              <div className="flex gap-3 w-full md:w-auto">
                 <Button type="button" variant="ghost" onClick={() => setView('list')} className="flex-1 md:flex-none text-white hover:text-white hover:bg-teal-800">Cancel</Button>
                 <Button type="submit" variant="peach" className="flex-1 md:flex-none px-8 shadow-none justify-center">
                    <Save size={18} className="mr-2" /> <span className="hidden md:inline">Create Competition</span><span className="md:hidden">Save</span>
                 </Button>
              </div>
           </div>
        </div>
      </form>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-stone-100 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div className="flex justify-between items-start">
             <div>
                <h1 className="text-3xl font-bold text-stone-800 tracking-tight">
                  {view === 'list' ? 'Admin Dashboard' : 'Create Competition'}
                </h1>
                <p className="text-stone-500 mt-1 text-sm md:text-base">
                  {view === 'list' ? 'Manage your live prizes, entries and users.' : 'Fill in the details below to launch a new prize.'}
                </p>
             </div>
             <div className="md:hidden">
                <button onClick={handleLogout} className="p-2 bg-white rounded-full text-stone-400 border border-stone-200 shadow-sm">
                   <LogOut size={18} />
                </button>
             </div>
          </div>
          
          <div className="flex gap-3">
             <div className="hidden md:block">
               <Button variant="ghost" onClick={handleLogout} className="text-stone-500">
                 <LogOut size={18} className="mr-2" /> Logout
               </Button>
             </div>
             {view === 'list' ? (
                <Button onClick={() => setView('create')} className="w-full md:w-auto shadow-lg shadow-teal-100">
                  <Plus size={18} className="mr-2" /> Create New
                </Button>
             ) : (
                <Button variant="outline" onClick={() => setView('list')} className="w-full md:w-auto bg-white border-stone-200">
                  <ArrowLeft size={18} className="mr-2" /> Back to List
                </Button>
             )}
          </div>
        </div>

        {/* Content */}
        {view === 'list' ? <ListView /> : <CreateView />}

      </div>
    </div>
  );
};