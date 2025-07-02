import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Diagnostic from './pages/Diagnostic';
import TuningParts from './pages/TuningParts';
import Community from './pages/Community';
import CommonIssues from './pages/CommonIssues';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import AccountSettingsPage from './pages/AccountSettingsPage';


import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import './index.css';

function App() {
  useEffect(() => {
    // Check for dark mode preference and apply it
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Listen for changes in dark mode preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener on component unmount
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <AuthProvider>
      <ProfileProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/diagnostic" element={<Diagnostic />} />
                  <Route path="/tuning" element={<TuningParts />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/issues" element={<CommonIssues />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/edit" element={<EditProfilePage />} />
                  <Route path="/settings" element={<AccountSettingsPage />} />
                  
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;