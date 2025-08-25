import './App.css'
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from './routers';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
function App() {

  return (
    <QueryClientProvider client={queryClient}>
        <ToastContainer
          closeButton={false}
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="light"
          toastClassName="Toast-Container"
          className="size-16"
        />
      <div className="App">
        <Router>
          <AppRoutes />
        </Router>
      </div>
    </QueryClientProvider>
  )
}

export default App
