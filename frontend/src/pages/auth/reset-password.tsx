import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import LoaderComponent from "../../../components/loader";
import { useAuth } from "../../context/AuthContext";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = searchParams.get("token");

    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        token,
        newPassword,
      });
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <LoaderComponent />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <Link
        to="/"
        className="flex items-center gap-2 font-extrabold text-xl text-foreground mb-8"
      >
        <span>Spoonful</span>
      </Link>

      <div className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-sm p-7">
        <h1 className="text-2xl font-extrabold text-foreground mb-1">
          Reset Password
        </h1>

        <p className="text-sm text-muted-foreground mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-foreground mb-1.5"
            >
              New Password
            </label>

            <input
              id="password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength={8}
              className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-2xl hover:bg-primary/90 transition-colors shadow-sm text-sm"
          >
            Reset Password
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-5">
          <Link
            to="/login"
            className="font-bold text-primary hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}