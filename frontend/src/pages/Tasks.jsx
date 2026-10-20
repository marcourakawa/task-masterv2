
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Tasks.css";



function getApiErrorMessage(error, fallback) {
    if (!error.response) {
        return "Não foi possível conectar ao servidor. Verifique sua conexão.";
    }

    const status = error.response.status;
    const data = error.response.data;

    if (status === 400) {
        if (typeof data === "object" && data !== null) {
            const messages = Object.values(data)
                .flat()
                .filter((message) => typeof message === "string");

            if (messages.length > 0) {
                return messages.join(" ");
            }
        }

        return "Os dados enviados são inválidos.";
    }

    if (status === 403) {
        return "Você não tem permissão para realizar esta ação.";
    }

    if (status === 404) {
        return "A tarefa ou o recurso solicitado não foi encontrado.";
    }

    if (status >= 500) {
        return "Ocorreu um erro no servidor. Tente novamente mais tarde.";
    }

    return fallback;
}


function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);

    const navigate = useNavigate();

    
    async function loadTasks() {
        const token = sessionStorage.getItem("access");

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        try {
            const response = await api.get("tasks/");
            setTasks(response.data);
        } catch (error) {
            setError(
                getApiErrorMessage(
                    error,
                    "Não foi possível carregar as tarefas."
                )
            );
        } finally {
            setLoading(false);
        }
    }

    

    useEffect(() => {
        loadTasks();
    }, []);

    
    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        const token = sessionStorage.getItem("access");

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        setSaving(true);

        try {
            let response;

            const taskData = {
                title: title.trim(),
                description: description.trim(),
                due_date: dueDate || null,
            };

            if (editingTaskId !== null) {
                response = await api.patch(
                    `tasks/${editingTaskId}/`,
                    taskData
                );

                setTasks((currentTasks) =>
                    currentTasks.map((task) =>
                        task.id === editingTaskId ? response.data : task
                    )
                );

                setEditingTaskId(null);
            } else {
                response = await api.post("tasks/", taskData);

                setTasks((currentTasks) => [
                    response.data,
                    ...currentTasks,
                ]);
            }

            setTitle("");
            setDescription("");
            setDueDate("");
        } catch (error) {
            setError(
                getApiErrorMessage(
                    error,
                    "Não foi possível salvar a tarefa."
                )
            );
        } finally {
            setSaving(false);
        }
    }



    
    async function handleStatusChange(taskId, newStatus) {
        const token = sessionStorage.getItem("access");

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        try {
            const response = await api.patch(
                `tasks/${taskId}/`,
                { status: newStatus }
            );

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === taskId ? response.data : task
                )
            );
        } catch (error) {
            setError(
                getApiErrorMessage(
                    error,
                    "Não foi possível atualizar o status da tarefa."
                )
            );
        }
    }

    
    async function handleDelete(taskId) {
        const confirmed = window.confirm(
            "Tem certeza que deseja excluir esta tarefa?"
        );

        if (!confirmed) {
            return;
        }

        const token = sessionStorage.getItem("access");

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        try {
            await api.delete(`tasks/${taskId}/`);

            setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== taskId)
            );
        } catch (error) {
            setError(
                getApiErrorMessage(
                    error,
                    "Não foi possível excluir a tarefa."
                )
            );
        }
    }

    function handleLogout() {
        sessionStorage.removeItem("access");
        sessionStorage.removeItem("refresh");
        navigate("/login", { replace: true });
    }

    function getStatusLabel(status) {
        const labels = {
            pending: "Pendente",
            in_progress: "Em andamento",
            completed: "Concluída",
        };

        return labels[status] || status;
    }

    function handleEdit(task) {
        setEditingTaskId(task.id);
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.due_date || "");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <main className="tasks-page">
            <header className="tasks-header">
                <div>
                    <h1>Task Master</h1>
                    <p>Organize suas tarefas e acompanhe seu progresso.</p>
                </div>

                    <button
                        className="logout-button"
                        type="button"
                        onClick={handleLogout}
                    >
                        Sair
                    </button>
            </header>

            <section className="task-form-card">
                <h2>{editingTaskId !== null ? "Editar tarefa" : "Nova tarefa"}</h2>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Título</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Ex.: Estudar Python"
                        maxLength={200}
                        required
                    />

                    <label htmlFor="description">Descrição</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        placeholder="Descreva sua tarefa..."
                        rows={3}
                    />

                    <label htmlFor="dueDate">Data de vencimento</label>
                    <input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(event) => setDueDate(event.target.value)}
                    />

                    {error && (
                        <p className="tasks-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={saving}>
                        {saving
                            ? "Salvando..."
                            : editingTaskId !== null
                                ? "Salvar alterações"
                                : "Adicionar tarefa"}
                    </button>


                    {editingTaskId !== null && (
                        <button
                            type="button"
                            className="cancel-edit-button"
                            onClick={() => {
                                setEditingTaskId(null);
                                setTitle("");
                                setDescription("");
                                setDueDate("");
                                setError("");
                            }}
                        >
                            Cancelar edição
                        </button>
                    )}
                    
                </form>
            </section>

            <section className="task-list-section">
                <div className="task-list-heading">
                    <h2>Minhas tarefas</h2>
                    <span>{tasks.length} tarefa(s)</span>
                </div>

                {loading ? (
                    <p>Carregando tarefas...</p>
                ) : tasks.length === 0 ? (
                    <div className="empty-tasks">
                        <h3>Nenhuma tarefa por aqui</h3>
                        <p>Adicione sua primeira tarefa usando o formulário.</p>
                    </div>
                ) : (
                    <div className="task-list">
                        {tasks.map((task) => (
                            <article className="task-card" key={task.id}>
                                <div className="task-card-content">
                                    <h3>{task.title}</h3>

                                    {task.description && (
                                        <p>{task.description}</p>
                                    )}

                                    {task.due_date && (
                                        <p className="task-date">
                                            Vencimento: {task.due_date}
                                        </p>
                                    )}
                                </div>

                                <div className="task-card-actions">
                                    <span className={`task-status status-${task.status}`}>
                                        {getStatusLabel(task.status)}
                                    </span>

                                    <select
                                        aria-label={`Status da tarefa ${task.title}`}
                                        value={task.status}
                                        onChange={(event) =>
                                            handleStatusChange(task.id, event.target.value)
                                        }
                                    >
                                        <option value="pending">Pendente</option>
                                        <option value="in_progress">Em andamento</option>
                                        <option value="completed">Concluída</option>
                                    </select>

                                    <button
                                        type="button"
                                        className="edit-task-button"
                                        onClick={() => handleEdit(task)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        className="delete-task-button"
                                        onClick={() => handleDelete(task.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Tasks;
