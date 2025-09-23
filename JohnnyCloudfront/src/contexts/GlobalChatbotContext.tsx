import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface GlobalChatbotContextType {
  isOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
  isActivated: boolean;
  setActivated: (activated: boolean) => void;
}

const GlobalChatbotContext = createContext<GlobalChatbotContextType | undefined>(undefined);

export function useGlobalChatbot() {
  const context = useContext(GlobalChatbotContext);
  if (context === undefined) {
    throw new Error("useGlobalChatbot must be used within a GlobalChatbotProvider");
  }
  return context;
}

interface GlobalChatbotProviderProps {
  children: ReactNode;
}

export function GlobalChatbotProvider({ children }: GlobalChatbotProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const openChatbot = useCallback(() => {
    setIsOpen(true);
    setIsActivated(true);
  }, []);

  const closeChatbot = useCallback(() => {
    setIsOpen(false);
    setIsActivated(false);
    // Emit custom event for Johnny5AssistantIcon
    window.dispatchEvent(new CustomEvent("chatbotClosed"));
  }, []);

  const toggleChatbot = useCallback(() => {
    setIsOpen(prev => !prev);
    setIsActivated(prev => !prev);
  }, []);

  const setActivated = useCallback((activated: boolean) => {
    setIsActivated(activated);
  }, []);

  const value = {
    isOpen,
    openChatbot,
    closeChatbot,
    toggleChatbot,
    isActivated,
    setActivated,
  };

  return (
    <GlobalChatbotContext.Provider value={value}>
      {children}
    </GlobalChatbotContext.Provider>
  );
}


