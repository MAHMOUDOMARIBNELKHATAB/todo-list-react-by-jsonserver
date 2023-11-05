import { useState } from "react";
import { axiosInstance } from "./axios/axios.config";
import { useEffect } from "react";

const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState("");

  const handleChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleDelete = (id) => {
    axiosInstance.delete(`todos/${id}`).then((data) => {
      if (data.status === 200) {
        getData()
      }
    });
  };
  const handleSearch = (e) => {
    console.log(e.target.value);
    axiosInstance.get("/todos?q=" + e.target.value).then((res) => {
      console.log(res.data);
      setTodos(res.data);
    });
  };
  const handleDone = (status) => {
    status.isCompleted = true;
    axiosInstance.patch("/todos/" + status.id, status).then(() =>
      axiosInstance.get("/todos").then((response) => {
        setTodos(response.data);
      })
    );
  };

  const addTask = async (e) => {
    e.preventDefault();
    axiosInstance
      .post("/todos", { taskName: taskName, isCompleted: false })
      .then(() => getData());
  };
  const getData = () => {
    axiosInstance.get("/todos").then((response) => {
      setTodos(response.data);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="todolist">
      <div className="search" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Search ex: todo 1"
          onChange={handleSearch}
        />
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Add a task........"
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {todos?.map((todo, id) => (
          <div
            key={id}
            className={`list ${todo.isCompleted ? "completed" : ""}`}
          >
            <p> {todo.taskName}</p>
            <div className="span-btns">
              {!todo.isCompleted && (
                <span onClick={() => handleDone(todo)} title="completed">
                  ✓
                </span>
              )}
              <span
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="delete"
              >
                x
              </span>
              <span
                className="edit-btn"
                onClick={() => handleEdit(todo)}
                title="edit"
              >
                ↻
              </span>
            </div>
          </div>
        ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;
