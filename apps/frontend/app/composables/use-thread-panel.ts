type ThreadPanelMessage = {
  id: string;
  initials: string;
  color: string;
  name: string;
  time: string;
  text: string;
  reactions?: Array<{ emoji: string; count: number }>;
};

export const useThreadPanel = () => {
  const isOpen = useState<boolean>("thread-panel-open", () => false);
  const activeMessage = useState<ThreadPanelMessage | null>("thread-panel-active-message", () => null);

  const openThread = (message?: ThreadPanelMessage) => {
    activeMessage.value = message ?? null;
    isOpen.value = true;
  };

  const closeThread = () => {
    isOpen.value = false;
  };

  return {
    isOpen,
    activeMessage,
    openThread,
    closeThread,
  };
};
