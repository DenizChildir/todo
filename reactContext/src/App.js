import React, { useEffect, useState, createContext, useContext } from 'react';
import './App.css';

const TaskListsContext = createContext();

const useTaskLists = () => {
    const context = useContext(TaskListsContext);
    if (!context) {
        throw new Error('useTaskLists must be used within a TaskListsProvider');
    }
    return context;
};

const TaskListsProvider = ({ children }) => {
    const [taskLists, setTaskLists] = useState([]);
    const [currentTaskListIndex, setCurrentTaskListIndex] = useState(0);

    useEffect(() => {
        const taskListsJSON = localStorage.getItem('taskLists');
        if (taskListsJSON) {
            setTaskLists(JSON.parse(taskListsJSON));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('taskLists', JSON.stringify(taskLists));
    }, [taskLists]);

    const addTaskList = (name) => {
        setTaskLists([...taskLists, { name, tasks: [] }]);
    };

    const deleteTaskList = (index) => {
        setTaskLists(taskLists.filter((_, i) => i !== index));
    };

    const switchTaskList = (index) => {
        setCurrentTaskListIndex(index);
    };

    const value = {
        taskLists,
        setTaskLists,
        currentTaskListIndex,
        setCurrentTaskListIndex,
        addTaskList,
        deleteTaskList,
        switchTaskList,
    };

    return <TaskListsContext.Provider value={value}>{children}</TaskListsContext.Provider>;
};

function App() {
    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [taskIndexToDelete, setTaskIndexToDelete] = useState(null);
    const {
        taskLists,
        setTaskLists,
        currentTaskListIndex,
        setCurrentTaskListIndex,
        addTaskList,
        deleteTaskList,
        switchTaskList,
    } = useTaskLists();

    const tasks = taskLists[currentTaskListIndex]?.tasks || [];

    const setTasks = (newTasks) => {
        setTaskLists(
            taskLists.map((taskList, i) => (i === currentTaskListIndex ? { ...taskList, tasks: newTasks } : taskList))
        );
    };

    const addTask = () => {
        const taskText = inputValue.trim();
        if (taskText === '') {
            alert('Enter a task');
            return;
        }
        setTasks([...tasks, { text: taskText, completed: false, priority: 'low' }]);
        setInputValue('');
    };
    const toggleTaskCompletion = (index) => {
        setTasks(
            tasks.map((task, i) =>
                i === index ? {...task, completed: !task.completed} : task
            )
        );
    };

    const deleteTask = (index) => {
        setShowConfirmModal(false);
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const editTask = (index, newText) => {
        setTasks(
            tasks.map((task, i) =>
                i === index ? {...task, text: newText} : task
            )
        );
    };

    const changeTaskPriority = (index, newPriority) => {
        setTasks(
            tasks.map((task, i) =>
                i === index ? {...task, priority: newPriority} : task
            )
        );
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'all') {
            return true;
        } else if (filter === 'completed') {
            return task.completed;
        } else if (filter === 'incomplete') {
            return !task.completed;
        }
        return false;
    });

    const searchedTasks = filteredTasks.filter((task) =>
        task.text.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="App">
            <header>
                <h1>Task Manager</h1>
            </header>
            <section className="task-list-selector">
                <button onClick={() => addTaskList('New List')}>Add Task List</button>
                {taskLists.map((taskList, index) => (
                    <button
                        key={index}
                        className={`task-list-button ${
                            index === currentTaskListIndex ? 'selected' : ''
                        }`}
                        onClick={() => switchTaskList(index)}
                    >
                        {taskList.name}
                    </button>
                ))}
                <button onClick={() => deleteTaskList(currentTaskListIndex)}>
                    Delete Current Task List
                </button>
            </section>
            <section className="add-task">
                <input
                    type="text"
                    placeholder="New task..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                />
                <button onClick={addTask}>Add</button>
            </section>
            <section className="filters">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchText}
                    onChange={handleSearchChange}
                />
                <select value={filter} onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="incomplete">Incomplete</option>
                </select>
            </section>
            <section className="list-container">
                <TaskList
                    tasks={searchedTasks}
                    toggleTaskCompletion={toggleTaskCompletion}
                    openConfirmModal={(index) => {
                        setTaskIndexToDelete(index);
                        setShowConfirmModal(true);
                    }}
                    editTask={editTask}
                    changeTaskPriority={changeTaskPriority}
                />
            </section>
            {showConfirmModal && (
                <ConfirmModal
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={() => deleteTask(taskIndexToDelete)}
                />
            )}
        </div>
    );
}

const TaskList = ({
                      tasks,
                      toggleTaskCompletion,
                      openConfirmModal,
                      editTask,
                      changeTaskPriority,
                  }) => {
    return (
        <ul>
            {tasks.map((task, index) => (
                <TaskItem
                    key={index}
                    task={task}
                    index={index}
                    toggleTaskCompletion={toggleTaskCompletion}
                    openConfirmModal={openConfirmModal}
                    editTask={editTask}
                    changeTaskPriority={changeTaskPriority}
                />
            ))}
        </ul>
    );
};

const TaskItem = ({
                      task,
                      index,
                      toggleTaskCompletion,
                      openConfirmModal,
                      editTask,
                      changeTaskPriority,
                  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(task.text);

    const handleEditBlur = () => {
        setIsEditing(false);
        editTask(index, editedText);
    };

    return (
        <li
            className={`task-item ${task.completed ? 'completed' : ''} ${task.priority}-priority`}
            onClick={() => !isEditing && toggleTaskCompletion(index)}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    onBlur={handleEditBlur}
                    autoFocus
                />
            ) : (
                <span>{task.text}</span>
            )}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    openConfirmModal(index);
                }}
            >
                Delete
            </button>
            <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
            <select
                value={task.priority}
                onChange={(e) => changeTaskPriority(index, e.target.value)}
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
        </li>
    );
};

const ConfirmModal = ({onClose, onConfirm}) => {
    return (
        <div className="confirm-modal">
            <div className="modal-content">
                <h3>Are you sure?</h3>
                <div className="modal-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default function AppWrapper() {
    return (
        <TaskListsProvider>
            <App />
        </TaskListsProvider>
    );
}

