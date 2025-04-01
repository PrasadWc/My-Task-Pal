import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import TaskCard from "../../components/Cards/TaskCard";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AddEditTasks from "./AddEditTasks";
import Modal from "react-modal";
import ProfileSideBar from "./ProfileSideBar";
import axiosInstance from "../../utils/axiosinstance";

const Home = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getAllTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/tasks/getall");
      if (response.data) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (taskDetails) => {
    setOpenAddEditModal({ isShown: true, data: taskDetails, type: "edit" });
  };

  const handleDelete = async (taskDetails) => {
    const taskid = taskDetails._id;
    try {
      const response = await axiosInstance.delete("/tasks/delete/" + taskid);
      if (response.status === 200 || 201) {
        alert("Task deleted successfully!");
        window.location.reload();
      }
    } catch (error) {
      alert("Failed to delete task. Please try again.");
      console.error("Error deleting task:", error);
    }
  };

  const getUserInfo = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/users/getuser");
      if (response.data) {
        setUserInfo(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllTasks();
  }, []);

  useEffect(() => {
    let sortedTasks = [...tasks];
    const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)

    if (sortOption === "newest") {
      // Sort tasks by date, ignoring the time part
      sortedTasks.sort((a, b) => {
        const dateA = new Date(a.date).getTime(); // Convert to timestamp
        const dateB = new Date(b.date).getTime(); // Convert to timestamp
        if (dateA > dateB) {
          return 1;
        }
        if (dateA < dateB) {
          return -1;
        } // Newest first
      });
    } else if (sortOption === "today") {
      // Filter tasks for today, only comparing the date part
      sortedTasks = sortedTasks.filter((task) => {
        const taskDate = new Date(task.date).toISOString().split("T")[0]; // Extract date part
        return taskDate === today;
      });
    }

    setFilteredTasks(sortedTasks);
  }, [sortOption, tasks]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      {userInfo && (
        <>
          <Navbar
            onLogout={handleLogout}
            userInfo={userInfo}
            onProfileClick={() => setSidebarOpen(true)}
          />
          <div className="container mx-auto mt-4 flex justify-end">
            <select
              className="p-2 border rounded-md"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="today">Today's Tasks</option>
            </select>
          </div>
          <div className="container mx-auto">
            <div className="grid grid-cols-3 gap-4 mt-8">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <TaskCard
                    key={index}
                    title={task.title}
                    content={task.content}
                    date={task.date}
                    time={task.time}
                    isComplete={task.isComplete}
                    createdOn={task.createdOn}
                    onEdit={() => handleEdit(task)}
                    onDelete={() => {
                      handleDelete(task);
                    }}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500">
                  No tasks for today
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setOpenAddEditModal({ isShown: true, type: "add", data: null });
            }}
            className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-700 absolute right-10 bottom-10 cursor-pointer"
          >
            <MdAdd className="size-8 text-amber-50" />
          </button>

          <Modal
            isOpen={openAddEditModal.isShown}
            onRequestClose={() => {}}
            style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
            contentLabel=""
            className="w-auto flex items-center justify-center rounded-md mx-auto mt-32 p-5"
          >
            <AddEditTasks
              type={openAddEditModal.type}
              taskData={openAddEditModal.data}
              onClose={() => {
                setOpenAddEditModal({
                  isShown: false,
                  type: "add",
                  data: null,
                });
              }}
            />
          </Modal>
          <ProfileSideBar
            userInfo={userInfo}
            open={isSidebarOpen}
            setOpen={setSidebarOpen}
          />
        </>
      )}
    </>
  );
};

export default Home;
