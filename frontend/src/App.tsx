import "./App.css";
import AppRouter from "@/routes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
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
