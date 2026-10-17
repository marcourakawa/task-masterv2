
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import ProtectedRoute from "./ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <Tasks />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;