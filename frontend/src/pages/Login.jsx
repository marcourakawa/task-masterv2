
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("auth/token/", {
                username: email.trim(),
                password,
            });

            const { access, refresh } = response.data;

            sessionStorage.setItem("access", access);
            sessionStorage.setItem("refresh", refresh);

            navigate("/tasks");
        } catch {
            setError("E-mail ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Task Master</h1>
                <p>Entre na sua conta para continuar.</p>

                <label htmlFor="email">E-mail</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seu@email.com"
                    autoComplete="username"
                    required
                />

                <label htmlFor="password">Senha</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    required
                />

                {error && (
                    <p className="error-message">{error}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>

                <p className="register-link">
                    Ainda não tem uma conta?{" "}
                    <Link to="/register">Cadastre-se</Link>
                </p>
            </form>
        </main>
    );
}

export default Login;
