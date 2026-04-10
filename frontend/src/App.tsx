import "./App.css";
import AppRouter from "@/routes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useThemeStore } from "@/store/useThemeStore";
import { useEffect } from "react";

function App() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // Tự động Add / Remove class 'dark' khi F5 hoặc bật/tắt công tắc
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <>
      <TooltipProvider>
        <Toaster position='top-right' richColors />
        <AppRouter />
      </TooltipProvider>
    </>
  );
}

export default App;
