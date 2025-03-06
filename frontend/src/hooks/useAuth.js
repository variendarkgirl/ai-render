
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Custom hook to use authentication context
 * @returns {Object} Auth context values and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;
