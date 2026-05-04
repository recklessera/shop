"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { updatePrismaProfile } from "@/app/account/actions";

export default function AccountSettings({ dbUser, authUser }) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // State: Profile (Prisma)
  const [name, setName] = useState(dbUser?.name || "");
  const [phone, setPhone] = useState(dbUser?.phone_number || "");
  const [address, setAddress] = useState(
    dbUser?.saved_addresses ? JSON.stringify(dbUser.saved_addresses, null, 2) : "{\n  \"street\": \"\",\n  \"city\": \"\",\n  \"state\": \"\"\n}"
  );

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
      saved_addresses: address,
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
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-brand-primary" />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-brand-primary" />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Saved Address (JSON format)</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="4" className="border-2 border-gray-200 p-2 text-sm font-mono focus:outline-none focus:border-brand-primary" />
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