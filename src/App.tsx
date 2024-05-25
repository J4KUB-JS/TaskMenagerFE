import {
  deleteTasks,
  getTasks,
  postTask,
  putTask,
  toggleTaskDone,
} from "./services/index";
import { Task } from "./types";

import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const emptyFormData = {
  id: 0,
  name: "",
  desc: "",
  dueDate: "",
  done: false,
};

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<Task>(emptyFormData);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [order, setOrder] = useState<string>("DESC");

  useEffect(() => {
    getTasks().then((res) => {
      setTasks(res.data);
    });
  }, []);

  const searchTasks = (val: string) => {
    getTasks(order, val).then((res) => {
      setTasks(res.data);
    });
  };

  const orderTasks = (val: string) => {
    getTasks(val).then((res) => {
      setTasks(res.data);
    });
  };

  const openDrawer = (formData?: Task) => {
    setFormData(formData || emptyFormData);
    setIsDrawerOpen(true);
  };

  const removeTask = (id: number) => {
    deleteTasks(id).then(() => {
      setTasks((prevState) => prevState.filter((task) => task.id !== id));
    });
  };

  const setTaskStatus = (id: number) => {
    toggleTaskDone(id).then((res) => {
      setTasks((prevState) =>
        prevState.map((task) => (task.id === id ? res.data : task))
      );
    });
  };

  const addTask = (formData: Task) => {
    postTask(formData)
      .then((res) => {
        setTasks((prevState) => [...prevState, { ...res.data, isNew: true }]);
      })
      .finally(() => {
        setIsDrawerOpen(false);
      });
  };

  const editTask = (formData: Task) => {
    putTask(formData)
      .then((res) => {
        setTasks((prevState) =>
          prevState.map((task) =>
            task.id === formData.id ? { ...res.data, isNew: true } : task
          )
        );
      })
      .finally(() => {
        setIsDrawerOpen(false);
      });
  };

  return (
    <div className="max-w-[1100px] mx-auto py-10">
      {/* Navigation with search and crete btn */}
      <div className="navbar bg-base-100 w-full">
        <div className="flex-1">
          <div className="text-2xl font-bold">Task Menager</div>
        </div>
        <div className="flex-none gap-2">
          <button
            className="btn btn-primary"
            onClick={() => {
              openDrawer();
            }}
          >
            Create Task
          </button>
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              onChange={(e) => {
                searchTasks(e.target.value);
              }}
            />
            <SearchIcon />
          </label>
        </div>
      </div>

      {/* Add/Edit drawer form */}
      <div className="drawer drawer-end">
        <input
          id="my-drawer-4"
          type="checkbox"
          checked={isDrawerOpen}
          onChange={() => {}}
          className="drawer-toggle"
        />
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
            onClick={() => setIsDrawerOpen(false)}
          ></label>
          <ul className="menu p-6 w-[500px] min-h-full bg-white text-base-content">
            <div className="text-2xl font-bold text-left mb-8 mt-5">
              {formData.id ? "Edit Task" : "Add Task"}
            </div>
            <label className="form-control w-full ">
              <div className="label">
                <span className="label-text">Name</span>
              </div>
              <input
                value={formData.name}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }));
                }}
                type="text"
                placeholder="Important Task"
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Due date</span>
              </div>
              <input
                value={formData.dueDate}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    dueDate: e.target.value,
                  }));
                }}
                type="text"
                placeholder="10-05-2024"
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <textarea
                value={formData.desc}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    desc: e.target.value,
                  }));
                }}
                className="textarea textarea-bordered h-32"
                placeholder="Details about the task"
              ></textarea>
            </label>
            <button
              className="btn btn-primary mt-10"
              onClick={() => {
                formData.id ? editTask(formData) : addTask(formData);
              }}
            >
              Submit
            </button>
          </ul>
        </div>
      </div>

      {/* Table of tasks */}
      <div className="overflow-x-auto mt-10 w-full">
        <table className="table static">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th className="flex gap-2 items-center">
                Due date
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setOrder(order === "DESC" ? "ASC" : "DESC");
                    orderTasks(order === "DESC" ? "ASC" : "DESC");
                  }}
                >
                  {order === "DESC" ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              return (
                <tr
                  key={task.id}
                  className={`${task.isNew ? "border-l-2 border-l-blue-500" : ""}`}
                >
                  <th>{task.id}</th>
                  <td>{task.name}</td>
                  <td>{task.desc}</td>
                  <td className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => setTaskStatus(task.id)}
                      className="checkbox checkbox-primary"
                    />
                    {task.done ? "Done" : "To do"}
                  </td>
                  <td>{task.dueDate}</td>
                  <td className="flex gap-5">
                    <button
                      className="btn btn-sm btn-circle"
                      onClick={() => openDrawer(task)}
                    >
                      <EditIcon fontSize="small" />
                    </button>
                    <button
                      className="btn btn-sm btn-circle"
                      onClick={() => removeTask(task.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
