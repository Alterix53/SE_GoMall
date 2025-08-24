import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔐 useAuthRedirect: Checking authentication...');
    const login = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');
    console.log('🔐 useAuthRedirect: isLoggedIn =', login);
    console.log('🔐 useAuthRedirect: token =', token ? 'exists' : 'missing');
    
    if (login !== 'true') {
      console.log('🔐 useAuthRedirect: Redirecting to /login - isLoggedIn is not "true"');
      navigate('/login');
    } else {
      console.log('🔐 useAuthRedirect: Authentication OK, staying on page');
    }
  }, [navigate]);
};
