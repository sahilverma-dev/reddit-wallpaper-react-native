import { SafeAreaView, StatusBar } from "react-native";
import { QueryClientProvider, QueryClient } from "react-query";
import { ToastProvider } from "react-native-toast-notifications";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";

const App = () => {
  const client = new QueryClient();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <ToastProvider>
        <AuthProvider>
          <QueryClientProvider client={client}>
            <Navigation />
          </QueryClientProvider>
        </AuthProvider>
      </ToastProvider>
    </SafeAreaView>
  );
};

export default App;
