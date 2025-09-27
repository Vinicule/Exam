import React, { createContext, useReducer, useEffect, type ReactNode } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
}

// Export this interface so other files can use it 
export interface AuthContextType extends AuthState {
  dispatch: React.Dispatch<any>;
}

// Initial state checks local storage for a saved session
const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token') || null,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  dispatch: () => null,
});

// Reducer function to handle state changes
export const authReducer = (state: AuthState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Persist state to local storage
  useEffect(() => {
    if (state.user && state.token) {
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [state]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
