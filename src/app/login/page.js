import { login } from './actions'

export default async function LoginPage({ searchParams }) {
  // Await the searchParams to safely access them in Next.js 15+
  const params = await searchParams

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-2xl/9 font-bold tracking-tight text-foreground">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action={login}>
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-foreground">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full border border-gray-300 bg-background px-3 py-1.5 text-base text-foreground outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-foreground sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-foreground">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full border border-gray-300 bg-background px-3 py-1.5 text-base text-foreground outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-foreground sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center bg-foreground px-3 py-1.5 text-sm/6 font-semibold text-background shadow-xs hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity"
            >
              Sign in
            </button>
          </div>
          
          {params?.message && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 border border-red-200">
              {params.message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}