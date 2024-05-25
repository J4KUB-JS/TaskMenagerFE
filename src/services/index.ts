import axios from "axios";
import { Task } from "../types";

export const getTasks = (order: string = "DESC", val: string = "") => {
  return axios
    .get(`http://127.0.0.1:8000/tasks?order=${order}&search=${val}`)
    .then((res) => res.data);
};

export const toggleTaskDone = (id: number) => {
  return axios.get(`http://127.0.0.1:8000/tasks/${id}`).then((res) => res.data);
};

export const deleteTasks = (id: number) => {
  return axios.delete(`http://127.0.0.1:8000/tasks/${id}`);
};

export const putTask = (formData: Task) => {
  return axios
    .put(`http://127.0.0.1:8000/tasks/${formData.id}`, formData)
    .then((res) => res.data);
};

export const postTask = (formData: Task) => {
  return axios.post(`http://127.0.0.1:8000/tasks`, formData).then((res) => res.data);
};
