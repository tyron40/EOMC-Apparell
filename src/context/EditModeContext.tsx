import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (user?.isAdmin) {
      const savedMode = localStorage.getItem('adminEditMode');
      setIsEditMode(savedMode === 'true');
    } else {
      setIsEditMode(false);
    }
  }, [user]);

  const toggleEditMode = () => {
    if (user?.isAdmin) {
      const newMode = !isEditMode;
      setIsEditMode(newMode);
      localStorage.setItem('adminEditMode', String(newMode));
    }
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
}
