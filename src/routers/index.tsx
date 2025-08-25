import { lazy, memo, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import ProtectedRoute from "./ProtectedRoute";

const Login = lazy(() => import("../page/authentication/login"));
const InstructorDashboard = lazy(
  () => import("../page/dashboard/instructorDashboard")
);
const StudentDashboard = lazy(
  () => import("../page/dashboard/studentDashboard")
);

const AppRoutes = memo(() => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path={routes.dashboard.default}
          element={<Navigate to={routes.dashboard.login} replace />}
        />
        <Route path={routes.dashboard.login} element={<Login />} />
        <Route
          path={routes.dashboard.instructor}
          element={
            <ProtectedRoute>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.dashboard.student}
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
});

export default AppRoutes;
