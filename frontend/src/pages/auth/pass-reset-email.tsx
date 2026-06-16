import { Link } from "react-router-dom"
import { useState } from "react"
import toast from 'react-hot-toast'
import LoaderComponent from "../../../components/loader"
import { useAuth } from "../../context/AuthContext"


export default function PasswordResetEmailPage() {
  const [loading,setLoading] = useState(false);
  const [email, setEmail] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const {RequestPasswordReset} = useAuth();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      await RequestPasswordReset(email);
      setLoading(false)
      setEmailSent(true);
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error) {
      setErrorMsg((error as Error).message);
      toast.error((error as Error).message)
      setLoading(false)
    }
  }
  

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-foreground mb-8">
        <span>Spoonful</span>
      </Link>

      <div className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-sm p-7">
        <h1 className="text-2xl font-extrabold text-foreground mb-1">Reset your passoword</h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Forgot your password ? No worries , reset it with ease..
        </p>
        {errorMsg && (
          <div className="bg-red-500/10 text-red-500 text-xs font-semibold px-4 py-3 rounded-2xl border border-red-500/20 mb-4 animate-in fade-in slide-in-from-top-1">
            ⚠️ {errorMsg}
          </div>
        )}

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
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-2xl hover:bg-primary/90 transition-colors shadow-sm text-sm mt-1 flex items-center justify-center gap-2"
            disabled={loading || emailSent}
          >
            {loading ? (
              <div className="scale-75 origin-center flex items-center justify-center"><LoaderComponent /></div>
            ) : emailSent ? (
              "Email sent"
            ) : (
              "Next"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-5">
          New to Spoonful?{" "}
          <Link to="/signup" className="font-bold text-primary hover:underline">
            Create account
          </Link>
        </p>
        <p className="text-center text-sm text-muted-foreground mt-5">
          Already have an Account?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
