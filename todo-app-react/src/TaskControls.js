import React from 'react';

const TaskControls = ({ addTask, clearTasks, applyFilter }) => {
    const handleAddTask = (event) => {
        event.preventDefault();
        const taskInput = event.target.elements.taskInput;
        const taskText = taskInput.value;
        if (taskText) {
            addTask(taskText);
            taskInput.value = ''; // Clear the input field after adding the task
        }
    };

    return (
        <form className="controls" onSubmit={handleAddTask}>
            <input
                type="text"
                id="task-input"
                name="taskInput"
                placeholder="Enter new task"
            />
            <button id="add-task" type="submit">
                add task
            </button>
            <button id="clear-tasks" onClick={clearTasks}>
                clear tasks
            </button>
            <label htmlFor="filter-tasks">filter tasks:</label>
            <select id="filter-tasks" onChange={(e) => applyFilter(e.target.value)}>
                <option value="all">all</option>
                <option value="completed">completed</option>
                <option value="incomplete">incomplete</option>
            </select>
        </form>
    );
};

export default TaskControls;
