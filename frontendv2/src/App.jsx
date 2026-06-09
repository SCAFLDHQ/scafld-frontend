import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Canvas from './pages/Canvas';
import GitHubCallback from './pages/GitHubCallback';
import GoogleCallback from './pages/GoogleCallback';
import { Navigate } from 'react-router-dom';
import AccountSettings from './pages/AccountSettings';
import ComingSoon from './pages/ComingSoon';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/github/callback" element={<GitHubCallback />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/project/:projectId" element={
            <ProtectedRoute><Canvas /></ProtectedRoute>
          } />
          {/* Legacy redirect — keep old canvas links working */}
          <Route path="/canvas/:projectId" element={
            <ProtectedRoute><Canvas /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute><AccountSettings /></ProtectedRoute>
          } />
          <Route path="/profile" element={<Navigate to="/settings" replace />} />
          <Route path="/pricing" element={<ComingSoon />} />
          <Route path="/marketplace" element={<ComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
