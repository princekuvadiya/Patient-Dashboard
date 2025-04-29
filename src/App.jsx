// import { Suspense, lazy, useEffect } from 'react';
// import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import Layout from './components/Layout';
// import LoadingSpinner from './components/LoadingSpinner';

// // Lazy load pages
// const LoginPage = lazy(() => import('./pages/LoginPage'));
// const RegisterPage = lazy(() => import('./pages/RegisterPage'));
// const DashboardPage = lazy(() => import('./pages/DashboardPage'));
// const WeightProgressPage = lazy(() => import('./pages/WeightProgressPage'));
// const ShipmentsPage = lazy(() => import('./pages/ShipmentsPage'));

// const PublicRoute = ({ children }) => {
//   const { currentUser } = useAuth();
//   return !currentUser ? children : <Navigate to="/" replace />;
// };

// const ProtectedRoute = ({ children }) => {
//   const { currentUser } = useAuth();
//   return currentUser ? children : <Navigate to="/login" replace />;
// };

// function App() {
//   const { loading, currentUser } = useAuth();

//   if (loading) {
//     return <LoadingSpinner fullScreen />;
//   }

//   return (
//     <Suspense fallback={<LoadingSpinner fullScreen />}>
//       <Routes>
//         <Route
//           path="/login"
//           element={
//             <PublicRoute>
//               <LoginPage />
//             </PublicRoute>
//           }
//         />
//         <Route
//           path="/register"
//           element={
//             <PublicRoute>
//               <RegisterPage />
//             </PublicRoute>
//           }
//         />

//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Layout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<DashboardPage />} />
//           <Route path="weight-progress" element={<WeightProgressPage />} />
//           <Route path="shipments" element={<ShipmentsPage />} />
//         </Route>

//         <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} replace />} />
//       </Routes>
//     </Suspense>
//   );
// }

// export default App;
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WeightProgressPage = lazy(() => import('./pages/WeightProgressPage'));
const ShipmentsPage = lazy(() => import('./pages/ShipmentsPage'));

const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  return currentUser ? <Navigate to="/" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  return currentUser ? children : <Navigate to="/login" replace />;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="weight-progress" element={<WeightProgressPage />} />
          <Route path="shipments" element={<ShipmentsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;