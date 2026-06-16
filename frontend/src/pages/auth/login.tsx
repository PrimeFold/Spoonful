import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import toast from 'react-hot-toast'
import { useAuth } from "../../context/AuthContext"
import LoaderComponent from "../../../components/loader"
import { findUser, generateOtp, type User } from "../../../lib/auth"

export default function LoginPage() {
  const [loading,setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const {} = useAuth();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn({email:email,password:password});
      await new Promise(resolve => setTimeout(resolve, 400));
      const user:User = await findUser(email);
      await new Promise(resolve => setTimeout(resolve, 400));
      setLoading(false)
      try {
        const response =  await generateOtp();
        if(!response.success){
          throw new Error(response.message)
        }
      } catch (error) {
        toast.error((error as Error).message)
      }
      if(user.emailVerified==true){
        navigate("/app/home")
      }else{
        navigate("/verification")
      }
    } catch (error) {
      toast.error((error as Error).message)
      setLoading(false)
    }
  }

  if(loading) return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <LoaderComponent/>
    </main>
  )
  

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-foreground mb-8">
        <span>Spoonful</span>
      </Link>

      <div className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-sm p-7">
        <h1 className="text-2xl font-extrabold text-foreground mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Good to see you again. Your next meal is waiting.
        </p>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-border bg-background hover:bg-secondary transition-colors text-sm font-semibold text-foreground py-3 rounded-2xl mb-5"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium">or with email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              required
              className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full bg-input border border-border rounded-xl px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="text-right mt-1.5">
              <Link to="#" className="text-xs text-primary font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-2xl hover:bg-primary/90 transition-colors shadow-sm text-sm mt-1"
            disabled={loading}
          >
            Log in
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-5">
          New to Spoonful?{" "}
          <Link to="/signup" className="font-bold text-primary hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
