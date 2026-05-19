import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/todos');
      const data = await res.json();
      if (data.success) setTodos(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
      });
      const data = await res.json();
      if (data.success) {
        setTodos([data.data, ...todos]);
        setNewTodo('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      const data = await res.json();
      if (data.success) {
        setTodos(todos.map(t => t.id === id ? data.data : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1>📝 Coolify Todo App</h1>
      <p style={styles.subtitle}>Deployed with PostgreSQL + Express + React</p>
      
      <div style={styles.addForm}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Enter a new task..."
          style={styles.input}
        />
        <button onClick={addTodo} style={styles.addButton}>Add Task</button>
      </div>
      
      <ul style={styles.todoList}>
        {todos.map(todo => (
          <li key={todo.id} style={styles.todoItem}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
              style={styles.checkbox}
            />
            <span style={{ ...styles.todoText, textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)} style={styles.deleteButton}>Delete</button>
          </li>
        ))}
      </ul>
      
      <div style={styles.stats}>
        {todos.filter(t => !t.completed).length} active, {todos.filter(t => t.completed).length} completed ({todos.length} total)
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: '50px auto', padding: 20, fontFamily: 'Arial, sans-serif' },
  subtitle: { color: '#666', marginBottom: 20 },
  loading: { textAlign: 'center', marginTop: 50 },
  addForm: { display: 'flex', gap: 10, marginBottom: 20 },
  input: { flex: 1, padding: 10, border: '1px solid #ddd', borderRadius: 5, fontSize: 16 },
  addButton: { padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' },
  todoList: { listStyle: 'none', padding: 0 },
  todoItem: { display: 'flex', alignItems: 'center', padding: 10, background: '#f5f5f5', marginBottom: 10, borderRadius: 5 },
  checkbox: { marginRight: 15, width: 20, height: 20 },
  todoText: { flex: 1, fontSize: 16 },
  deleteButton: { background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 5, cursor: 'pointer' },
  stats: { textAlign: 'center', marginTop: 20, color: '#666' }
};

createRoot(document.getElementById('root')).render(<App />);
