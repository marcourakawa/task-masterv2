import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Register.css";

function Register() {
    const [firstName, setFirstName] = useState("");
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
            await api.post("auth/register/", {
                first_name: firstName,
                email: email.trim(),
                password,
            });

            navigate("/login", {
                state: {
                    message: "Cadastro realizado! Faça login.",
                },
            });
        } catch (error) {
            const data = error.response?.data;

            if (data?.email) {
                setError(data.email[0]);
            } else if (data?.password) {
                setError(data.password[0]);
            } else if (data?.first_name) {
                setError(data.first_name[0]);
            } else {
                setError("Não foi possível realizar o cadastro.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="register-container">
            <span className="register-blob register-blob-lavender" aria-hidden="true" />
            <span className="register-blob register-blob-pink" aria-hidden="true" />
            <span className="register-blob register-blob-mint" aria-hidden="true" />
            <span className="register-blob register-blob-sky" aria-hidden="true" />

            <form className="register-form" onSubmit={handleSubmit}>
                <div className="register-logo">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6155B8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12l5 5L20 7" />
                    </svg>
                </div>

                <h1>Criar conta</h1>
                <p className="register-subtitle">Cadastre-se para começar a organizar suas tarefas.</p>

                <div className="register-field">
                    <label htmlFor="firstName">Nome</label>
                    <div className="register-input-wrapper">
                        <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
                        </svg>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            placeholder="Seu nome"
                            autoComplete="given-name"
                            required
                        />
                    </div>
                </div>

                <div className="register-field">
                    <label htmlFor="email">E-mail</label>
                    <div className="register-input-wrapper">
                        <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="14" rx="3" />
                            <path d="M3.5 7.5l8.5 6 8.5-6" />
                        </svg>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="seu@email.com"
                            autoComplete="email"
                            required
                        />
                    </div>
                </div>

                <div className="register-field">
                    <label htmlFor="password">Senha</label>
                    <div className="register-input-wrapper">
                        <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="4" y="11" width="16" height="9" rx="3" />
                            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Mínimo de 8 caracteres"
                            autoComplete="new-password"
                            minLength={8}
                            required
                        />
                    </div>
                </div>

                {error && (
                    <p className="register-error" role="alert">{error}</p>
                )}

                <button
                    type="submit"
                    className="register-submit"
                    disabled={loading}
                    aria-busy={loading}
                >
                    {loading && <span className="register-spinner" aria-hidden="true" />}
                    {loading ? "Criando conta..." : "Cadastrar"}
                </button>

                <p className="register-footer">
                    Já tem uma conta? <Link to="/login">Entrar</Link>
                </p>
            </form>
        </main>
    );
}

export default Register;