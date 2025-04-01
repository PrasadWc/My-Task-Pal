import Tasks from "../models/taskModel.js";

//create tasks
export const addTask = async (req, res) => {
    const { title, content,date, time,user } =
      req.body;
    const newTask = new Tasks({
        title, content, date, time, user: req.user.id
    });

    try {
      await newTask.save();
      res.status(201).json({ message: "Task Added successfully" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  };

//read all tasks from database for authenticated user
export const getAll = async (req, res) => {
    try {
      const tasks = await Tasks.find({ user: req.user.id });
      res.status(200).json({ tasks });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

//update a task by authenticated user
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, date, time, isComplete } = req.body;
        
        // Find the task by ID
        const task = await Tasks.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        // Checking that the logged-in user is the author
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this task" });
        }
        
        // Update the task
        const updatedTask = await Tasks.findByIdAndUpdate(
            id,
            { title, content, date, time, isComplete, updatedAt: new Date().getTime() },
            { new: true } // Return the updated document
        );
        
        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete a task by authenticated user
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
  
        const task = await Tasks.findById(id);
        if (!task) {
            return res.status(404).json({ message: "task not found" });
        }
  
        // Checking that the logged-in user is the author
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this task" });
        }
  
        await Tasks.findByIdAndDelete(id);
        res.status(200).json({ message: "task deleted successfully" });
  
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };
