import "./App.css";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import { AuthProvider, useAuth } from "./auth";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <ChatPage /> : <AuthPage />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
