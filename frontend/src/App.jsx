import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CompanyDetail from './pages/CompanyDetail';
import ExperienceDetail from './pages/ExperienceDetail';
import PostExperience from './pages/PostExperience';

// Protected Route component for /post
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900 text-slate-100 flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/company/:name" element={<CompanyDetail />} />
              <Route path="/experience/:id" element={<ExperienceDetail />} />
              <Route
                path="/post"
                element={
                  <ProtectedRoute>
                    <PostExperience />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="bg-gray-900 border-t border-gray-805 py-6 text-center text-xs text-gray-500">
            <div className="max-w-7xl mx-auto px-4">
              <p>&copy; {new Date().getFullYear()} PrepSphere. Empowering students through collective interview knowledge.</p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
