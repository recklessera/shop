import { login } from './actions'
import { Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react'

export default async function LoginPage({ searchParams }) {
  // Await the searchParams to safely access them in Next.js 15+
  const params = await searchParams

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="h-16 w-16 bg-gray-900 rounded-2xl shadow-xl flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-all duration-300 mb-6">
          <ShieldCheck className="h-8 w-8 text-brand-gold" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight uppercase tracking-widest">
          Reckless Era<span className="text-brand-pink">.</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium">
          Authorized Personnel Only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Login Card */}
        <div className="bg-white py-10 px-6 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-12 border border-gray-100">
          <form className="space-y-6" action={login}>
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition-all bg-gray-50 hover:bg-white focus:bg-white"
                  placeholder="admin@recklessera.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition-all bg-gray-50 hover:bg-white focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message Alert */}
            {params?.message && (
              <div className="rounded-xl bg-brand-red/10 p-4 border border-brand-red/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 text-brand-red flex-shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-brand-red">
                  {params.message}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-gray-900 text-white rounded-xl px-8 py-3.5 text-sm font-bold hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 transition-all hover:-translate-y-0.5"
              >
                Sign into Dashboard
              </button>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8 font-medium tracking-wide">
          &copy; {new Date().getFullYear()} Reckless Era. All rights reserved.
        </p>
      </div>
    </div>
  )
}