
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
            <form className="register-form" onSubmit={handleSubmit}>
                <h1>Criar conta</h1>
                <p>Cadastre-se para começar a organizar suas tarefas.</p>

                <label htmlFor="firstName">Nome</label>
                <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    autoComplete="given-name"
                    required
                />

                <label htmlFor="email">E-mail</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                />

                <label htmlFor="password">Senha</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    required
                />

                {error && <p className="register-error">{error}</p>}

                <button type="submit" disabled={loading}>
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
