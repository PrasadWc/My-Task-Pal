import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TimeInput from "../../inputs/TimeInput";
import DatePicker from "../../inputs/DateInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosinstance";

const AddEditTasks = ({ taskData, type, onClose }) => {
  const [title, setTitle] = useState(taskData?.title || "");
  const [content, setContent] = useState(taskData?.content || "");
  const [date, setDate] = useState(taskData?.date || "");
  const [time, setTime] = useState(taskData?.time || "");
  const [loading, setLoading] = useState(false);

  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content || !date || !time) {
      alert("All fields are required!");
      return;
    }

    const newtaskData = {
      title,
      content,
      date,
      time,
      isComplete,
    };

    setLoading(true);
    console.log(newtaskData);
    if (type === "edit") {
      const taskid = taskData._id;
      try {
        await axiosInstance.put(`/tasks/update/${taskid}`, newtaskData);
        alert("Task updated successfully!");
        onClose();
        window.location.reload();
      } catch (error) {
        alert("Failed to update task. Please try again.");
        console.error("Error updating task:", error);
      } finally {
        setLoading(false);
      }
    }
    if (type === "add") {
      try {
        await axiosInstance.post("/tasks/add", newtaskData);
        alert("Task added successfully!");
        onClose();
        window.location.reload();
      } catch (error) {
        alert("Failed to add task. Please try again.");
        console.error("Error adding task:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col w-full relative z-10 shadow-xl"
      >
        <h6 className="text-gray-900 text-2xl mb-1 font-medium">
          {type === "edit" ? "UPDATE TASK" : "ADD TASK"}
        </h6>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-full absolute right-1.5 top-1.5 hover:bg-slate-200 cursor-pointer"
        >
          <MdClose className="size-5 text-slate-400" />
        </button>

        {type === "edit" && (
          <div className="relative mb-4">
            <label className="flex items-center justify-between space-x-2">
              <span className="leading-7 text-sm text-gray-600">
                Is Task Completed?
              </span>
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                checked={isComplete}
                onChange={(e) => setIsComplete(e.target.checked)}
              />
            </label>
          </div>
        )}

        <div className="relative mb-4">
          <label className="leading-7 text-sm text-gray-600">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>

        <div className="relative mb-4">
          <label className="leading-7 text-sm text-gray-600">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
          ></textarea>
        </div>
        <div className="relative mb-4">
          <label className="leading-7 text-sm text-gray-600">
            Time and Date
          </label>
          <div className="grid grid-cols-2 gap-4">
            <TimeInput value={time} onChange={setTime} />
            <DatePicker value={date} onChange={setDate} />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
        >
          {type === "edit"
            ? loading
              ? "updating..."
              : "update"
            : loading
            ? "Adding..."
            : "Add Task"}
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddEditTasks;
