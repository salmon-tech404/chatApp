import "./App.css";
import AppRouter from "@/routes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster position='top-right' richColors />
      <AppRouter />
    </>
  );
}

export default App;
