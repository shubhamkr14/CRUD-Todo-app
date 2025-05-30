import axios from "axios";
import React, { useEffect, useState } from "react";

function Todo() {
  const [todoList, setTodoList] = useState([]);

  const [editableId, setEditableId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [editedDeadline, setEditedDeadline] = useState("");

  const [newTask, setNewTask] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const API_URL = "https://my-json-server-bbsk.onrender.com/todos";

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setTodoList(res.data))
      .catch((err) => console.log(err));
  }, []);

  const toggleEditable = (id) => {
    const rowData = todoList.find((data) => data.id === id);
    if (rowData) {
      setEditableId(id);
      setEditedTask(rowData.task);
      setEditedStatus(rowData.status);
      setEditedDeadline(rowData.deadline || "");
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask || !newStatus || !newDeadline) {
      alert("All fields must be filled out.");
      return;
    }

    const newTodo = {
      task: newTask,
      status: newStatus,
      deadline: newDeadline,
    };

    axios
      .post(API_URL, newTodo)
      .then((res) => {
        setTodoList((prev) => [...prev, res.data]);
        setNewTask("");
        setNewStatus("");
        setNewDeadline("");
      })
      .catch((err) => console.log(err));
  };

  const saveEditedTask = (id) => {
    if (!editedTask || !editedStatus || !editedDeadline) {
      alert("All fields must be filled out.");
      return;
    }

    const updatedData = {
      task: editedTask,
      status: editedStatus,
      deadline: editedDeadline,
    };

    axios
      .put(`${API_URL}/${id}`, updatedData)
      .then((res) => {
        setTodoList((prev) =>
          prev.map((todo) => (todo.id === id ? res.data : todo))
        );
        setEditableId(null);
        setEditedTask("");
        setEditedStatus("");
        setEditedDeadline("");
      })
      .catch((err) => console.log(err));
  };

  const deleteTask = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        setTodoList((prev) => prev.filter((todo) => todo.id !== id));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <h2 className="text-center">Add Task</h2>
          <form className="bg-light p-4" onSubmit={addTask}>
            <div className="mb-3">
              <label>Task</label>
              <input
                className="form-control"
                type="text"
                value={newTask}
                placeholder="Enter Task"
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Status</label>
              <input
                className="form-control"
                type="text"
                value={newStatus}
                placeholder="Enter Status"
                onChange={(e) => setNewStatus(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Deadline</label>
              <input
                className="form-control"
                type="datetime-local"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success btn-sm">
              Add Task
            </button>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <h2 className="text-center">Todo List</h2>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-primary">
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {todoList.map((data) => (
                  <tr key={data.id}>
                    <td>
                      {editableId === data.id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editedTask}
                          onChange={(e) => setEditedTask(e.target.value)}
                        />
                      ) : (
                        data.task
                      )}
                    </td>
                    <td>
                      {editableId === data.id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editedStatus}
                          onChange={(e) => setEditedStatus(e.target.value)}
                        />
                      ) : (
                        data.status
                      )}
                    </td>
                    <td>
                      {editableId === data.id ? (
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={editedDeadline}
                          onChange={(e) => setEditedDeadline(e.target.value)}
                        />
                      ) : data.deadline ? (
                        new Date(data.deadline).toLocaleString()
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      {editableId === data.id ? (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => saveEditedTask(data.id)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => toggleEditable(data.id)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm ml-1"
                        onClick={() => deleteTask(data.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Todo;
