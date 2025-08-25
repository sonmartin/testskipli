import { lazy, memo, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";


const Login = lazy(() => import("../page/authentication/login"));
const InstructorDashboard = lazy(() => import("../page/dashboard/instructorDashboard"));
const StudentDashboard = lazy(() => import("../page/dashboard/studentDashboard"));

const AppRoutes = memo(() => {

    return (
        <Suspense>
            <Routes>
                <Route
                    path={routes.dashboard.login}
                    element={
                        <Login />
                    }
                />
                <Route path={routes.dashboard.instructor} element={<InstructorDashboard />} />
                <Route path={routes.dashboard.student} element={<StudentDashboard />} />
            </Routes>
        </Suspense>
    );
});

export default AppRoutes