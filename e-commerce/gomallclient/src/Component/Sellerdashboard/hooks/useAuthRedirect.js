import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const login = localStorage.getItem('isLoggedIn');
    if (login !== 'true') {
      navigate('/login');
    }
  }, [navigate]);
};
