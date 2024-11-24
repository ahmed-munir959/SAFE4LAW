import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ForgetPassword from './components/ForgetPassword';
import VerifyOtp from './components/VerifyOtp';
import ResetPassword from './components/ResetPassword';
import Service from './components/Service';
import FileUpload from './components/FileUpload';
import FileDownload from './components/FileDownload';
import FileListing from './components/FileListing';
import UpdateProfile from './components/UpdateProfile';
import UpdatePassword from './components/UpdatePassword';
import VerifyEmail from './components/VerifyEmail';
import EmailVerification from './components/EmailVerification';
import AboutUs from './components/AboutUs';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/verifyotp" element={<VerifyOtp />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/service" element={
            <ProtectedRoute>
              <Service />
            </ProtectedRoute>
          } />
          <Route path="/fileupload" element={
            <ProtectedRoute>
              <FileUpload />
            </ProtectedRoute>
          } />
          <Route path="/filedownload" element={
            <ProtectedRoute>
              <FileDownload />
            </ProtectedRoute>
          } />
          <Route path="/filelisting" element={
            <ProtectedRoute>
              <FileListing />
            </ProtectedRoute>
          } />
          <Route path="/updateprofile" element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          } />
          <Route path="/updatepassword" element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          } />
          <Route path="/about" element={
            <ProtectedRoute>
              <AboutUs />
            </ProtectedRoute>
          } />

          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;