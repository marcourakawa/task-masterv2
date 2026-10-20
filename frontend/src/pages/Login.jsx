import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
                <div className="login-logo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6155B8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12l5 5L20 7" />
                    </svg>
                </div>

                <h1>Task Master</h1>
                <p>Entre na sua conta para continuar.</p>

                <div className="field">
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
                </div>

                <div className="field">
                    <label htmlFor="password">Senha</label>
                    <div className="password-field">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Sua senha"
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                {showPassword ? (
                                    <>
                                        <path d="M3 3l18 18" />
                                        <path d="M10.6 6.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.7A17 17 0 0 0 2 12s3.5 7 10 7a10.5 10.5 0 0 0 4.4-.9" />
                                        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                                    </>
                                ) : (
                                    <>
                                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="error-message" role="alert">{error}</p>
                )}

                <button type="submit" className="submit-button" disabled={loading}>
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