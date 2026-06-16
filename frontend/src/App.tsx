import { BrowserRouter } from "react-router-dom"
import { Route,Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import LandingPage from "./pages/landing/LandingPage"
import { HowItWorks } from "./pages/landing/how-it-works"
import { ForBusinesses } from "./pages/landing/for-businesses"
import LoginPage from "./pages/auth/login"
import SignupPage from "./pages/auth/signup"
import HomePage from "./pages/app/home"
import { ProtectedRoute } from "./protected/ProtectedRoute"
import Verification from "./pages/auth/verification"
import ProfilePage from "./pages/app/profile"
import AddSpotPage from "./pages/app/add-spot"
import VerificationPage from "./pages/app/roles/admin/verificationPage"
import OwnerDashboard from "./pages/app/roles/owner/dashboard"
import AdminDashboard from "./pages/app/roles/admin/dashboard"
import SearchPage from "./pages/app/search"
import SpotDetailPage from "./components/spot"
import PasswordResetEmailPage from "./pages/auth/pass-reset-email"
import ResetPasswordPage from "./pages/auth/reset-password"

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage/>}/> 
        <Route path="/how-it-works" element={<HowItWorks/>}/> 
        <Route path="/for-buisnessess" element={<ForBusinesses/>}/> 
        <Route path="/login" element={<LoginPage/>}/> 
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/verification" element={<Verification/>}/>
        <Route path="/password-reset-email" element={<PasswordResetEmailPage/>}/>
        <Route path="/reset-password" element={<ResetPasswordPage/>}/>

        
        //Protected Routes
        <Route element={<ProtectedRoute/>}>
          <Route path="/app/home" element={<HomePage/>}/>
          <Route path="/app/search" element={<SearchPage/>}/>
          <Route path="/app/profile" element={<ProfilePage/>}/>
          <Route path="/app/add-spot" element={<AddSpotPage/>}/>
          <Route path="/spot/:id" element={<SpotDetailPage/>}/>
          <Route path="/admin/food-spots/:id" element={<VerificationPage/>}/>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="/owner/dashboard" element={<OwnerDashboard/>}/>
        </Route> 
      </Routes>
      
    </BrowserRouter>
    
  )
}

export default App
