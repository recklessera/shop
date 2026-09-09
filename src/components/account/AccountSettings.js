"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { updatePrismaProfile } from "@/app/account/actions";

// --- NEW: Added the states array to ensure consistency with checkout ---
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export default function AccountSettings({ dbUser, authUser }) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // State: Profile (Prisma)
  const [name, setName] = useState(dbUser?.name || "");
  const [phone, setPhone] = useState(dbUser?.phone_number || "");
  
  // --- NEW: Handle address as an object, not a JSON string ---
  const [address, setAddress] = useState({
    street: dbUser?.saved_addresses?.street || "",
    city: dbUser?.saved_addresses?.city || "",
    state: dbUser?.saved_addresses?.state || "",
  });

  // State: Security (Supabase)
  const [email, setEmail] = useState(authUser?.email || "");
  const [password, setPassword] = useState("");

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const result = await updatePrismaProfile(dbUser.id, {
      name,
      phone_number: phone,
      // --- NEW: Stringify the object right before sending it to the server ---
      saved_addresses: JSON.stringify(address),
    });

    if (result.error) showMessage(result.error, "error");
    else showMessage("Profile updated successfully!");
    
    setLoading(false);
  };

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const updates = {};
    if (email !== authUser.email) updates.email = email;
    if (password) updates.password = password;

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase.auth.updateUser(updates);
      if (error) {
        showMessage(error.message, "error");
      } else {
        showMessage("Security details updated. If you changed your email, please verify it.", "success");
        setPassword(""); // Clear password field
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 border border-gray-200">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-6">
        <button 
          onClick={() => setActiveTab("profile")}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "profile" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"}`}
        >
          Profile Details
        </button>
        <button 
          onClick={() => setActiveTab("security")}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "security" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"}`}
        >
          Login & Security
        </button>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 text-sm font-bold ${message.type === "error" ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
          {message.text}
        </div>
      )}

      {/* Profile Form (Prisma Data) */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-brand-primary" />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-brand-primary" />
            </div>
          </div>

          {/* --- NEW: Clean Address Fields --- */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-2">Saved Address</h3>
            
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Street Address</label>
              <input 
                type="text" 
                value={address.street} 
                onChange={(e) => setAddress({ ...address, street: e.target.value })} 
                className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-brand-primary" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">City</label>
                <input 
                  type="text" 
                  value={address.city} 
                  onChange={(e) => setAddress({ ...address, city: e.target.value })} 
                  className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-brand-primary" 
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">State</label>
                <select 
                  value={address.state} 
                  onChange={(e) => setAddress({ ...address, state: e.target.value })} 
                  className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-brand-primary bg-transparent cursor-pointer"
                >
                  <option value="" disabled>Select State</option>
                  {NIGERIAN_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-brand-primary hover:text-black transition-colors mt-4 disabled:opacity-50">
            {loading ? "Saving..." : "Save Profile Details"}
          </button>
        </form>
      )}

      {/* Security Form (Supabase Data) */}
      {activeTab === "security" && (
        <form onSubmit={handleSecurityUpdate} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-brand-primary" />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">New Password (leave blank to keep current)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-brand-primary" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-brand-primary hover:text-black transition-colors mt-4 disabled:opacity-50">
            {loading ? "Updating..." : "Update Security Settings"}
          </button>
        </form>
      )}
    </div>
  );
}