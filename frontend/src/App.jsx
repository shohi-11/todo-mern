import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  // Load todos when app starts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Add a new todo
  const addTodo = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/todos", { text });
      setTodos([...todos, res.data]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle completion
  const toggleTodo = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app">
      <div className="todo-card">
        {/* Header */}
        <div className="todo-header">
          <div className="title">📝 To-Do List</div>
          <div className="subtle">Simple MERN + MongoDB</div>
        </div>

        {/* Input Row */}
        <div className="input-row">
          <input
            type="text"
            value={text}
            placeholder="Enter a task..."
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button className="btn btn-primary" onClick={addTodo}>
            Add
          </button>
        </div>

        {/* Todo List */}
        <ul className="todo-list">
          {todos.length === 0 ? (
            <div className="empty">No tasks yet — add one!</div>
          ) : (
            todos.map((todo) => (
              <li key={todo._id} className="todo-item">
                <div className="todo-left">
                  <div
                    className={`checkbox ${todo.completed ? "checked" : ""}`}
                    onClick={() => toggleTodo(todo._id)}
                  >
                    {todo.completed ? "✓" : ""}
                  </div>
                  <div
                    className={`todo-text ${
                      todo.completed ? "completed" : ""
                    }`}
                  >
                    {todo.text}
                  </div>
                </div>

                <div className="actions">
                  <button
                    className="delete-btn"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Footer */}
        <div className="footer">
          <div>{todos.filter((t) => !t.completed).length} items left</div>
          <div className="subtle">Made with ❤️</div>
        </div>
      </div>
    </div>
  );
}

export default App;
