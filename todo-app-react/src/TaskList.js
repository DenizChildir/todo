import React, { useState } from 'react';

function TaskItem({ task, taskId, toggleTaskCompletion, deleteTask, editTask, handleTaskDragStart }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTaskText, setEditedTaskText] = useState(task ? task.text : '');

    if (!task) {
        return null;
    }

    function handleEditChange(event) {
        setEditedTaskText(event.target.value);
    }

    function handleEditSubmit(event) {
        event.preventDefault();
        editTask(taskId, editedTaskText);
        setIsEditing(false);
    }

    function handleDragStart(event) {
        handleTaskDragStart(event, taskId);
    }

    if (isEditing) {
        return (
            <form onSubmit={handleEditSubmit}>
                <input type="text" value={editedTaskText} onChange={handleEditChange} />
                <button type="submit">Save</button>
            </form>
        );
    } else {
        return (
            <li className={task.completed ? 'completed' : ''} draggable="true" onDragStart={handleDragStart}>
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(taskId)}
                />
                <span onDoubleClick={() => setIsEditing(true)}>{task.text}</span>
                <button onClick={() => deleteTask(taskId)}>Delete</button>
            </li>
        );
    }
}

export default TaskItem;
