import { BrowserRouter } from "react-router-dom"
import { Route,Routes } from "react-router-dom"
import LandingPage from "./pages/landing/LandingPage"
import { HowItWorks } from "./pages/landing/how-it-works"
import { ForBusinesses } from "./pages/landing/for-businesses"
import LoginPage from "./pages/auth/login"
import SignupPage from "./pages/auth/signup"
import HomePage from "./pages/app/home"
import { ProtectedRoute } from "./protected/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/> 
        <Route path="/how-it-works" element={<HowItWorks/>}/> 
        <Route path="/for-buisnessess" element={<ForBusinesses/>}/> 
        <Route path="/login" element={<LoginPage/>}/> 
        <Route path="/signup" element={<SignupPage/>}/>

        //Protected Routes
        <Route element={<ProtectedRoute/>}>
          <Route path="/app/home" element={<HomePage/>}/>
        </Route> 
      </Routes>
      
    </BrowserRouter>
    
  )
}

export default App
