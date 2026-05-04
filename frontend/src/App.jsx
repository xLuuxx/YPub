import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./components/pages/HomePage.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import AdminLoginPage from "./components/pages/admin/AdminLoginPage.jsx";
import AdminDashboardPage from "./components/pages/admin//AdminDashboardPage.jsx";
import AdminOrdersPage from "./components/pages/admin/AdminOrdersPage.jsx";
import AdminCocktailsPage from "./components/pages/admin/AdminCocktailsPage.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="cocktails" element={<AdminCocktailsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;