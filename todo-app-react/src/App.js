import { useState, useEffect} from 'react';

import DraggedTaskContext from './DraggedTaskContext';
import './App.css';
import SearchInput from "./SearchInput";
import TaskControls from "./TaskControls";
import TaskList from "./TaskList";

function App() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [draggedTask, setDraggedTask] = useState(null);

    useEffect(() => {
        loadTasksFromLocalStorage();
    }, []);

    useEffect(() => {
        saveTasksToLocalStorage();
    }, [tasks, saveTasksToLocalStorage]);

    function addTask(taskText) {
        if (taskText.trim() === '') {
            alert('Enter a task');
            return;
        }
        setTasks([...tasks, { text: taskText, completed: false }]);
    }

    function deleteTask(taskIndex) {
        setTasks(tasks.filter((_, index) => index !== taskIndex));
    }

    function toggleTaskCompletion(taskIndex) {
        setTasks(
            tasks.map((task, index) =>
                index === taskIndex
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    }

    function editTask(taskIndex, newTaskText) {
        if (newTaskText.trim() === '') {
            deleteTask(taskIndex);
        } else {
            setTasks(
                tasks.map((task, index) =>
                    index === taskIndex ? { ...task, text: newTaskText } : task
                )
            );
        }
    }
    function clearTasks() {
        setTasks(tasks.filter((task) => !task.completed));
    }

    function applyFilter(filterValue) {
        setFilter(filterValue);
    }

    function searchTasks(searchText) {
        setSearch(searchText);
    }

    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasksJSON = localStorage.getItem('tasks');

        if (tasksJSON) {
            const loadedTasks = JSON.parse(tasksJSON);
            setTasks(loadedTasks);
        }
    }

    function handleTaskDragStart(event, taskId) {
        setDraggedTask(taskId);
    }

    function handleTaskDragOver(event) {
        event.preventDefault();
    }

    function handleTaskDragEnter(event) {
        // Implement this function
    }

    function handleTaskDragLeave(event) {
        // Implement this function
    }

    function handleTaskDrop(event, targetTaskId) {
        // Implement this function
    }

    const filteredTasks = tasks.filter((task) => {
        switch (filter) {
            case 'completed':
                return task.completed;
            case 'incomplete':
                return !task.completed;
            default:
                return true;
        }
    });

    const searchedTasks = filteredTasks.filter((task) =>
        task.text.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div className="App">
            <header>
                <h1>To-Do list</h1>
            </header>
            <SearchInput searchTasks={searchTasks} />
            <TaskControls
                addTask={addTask}
                clearTasks={clearTasks}
                applyFilter={applyFilter}
            />
            <DraggedTaskContext.Provider value={{ draggedTask, setDraggedTask }}>
                <TaskList
                    tasks={searchedTasks}
                    toggleTaskCompletion={toggleTaskCompletion}
                    deleteTask={deleteTask}
                    editTask={editTask}
                    handleTaskDragStart={handleTaskDragStart}
                    handleTaskDragOver={handleTaskDragOver}
                    handleTaskDragEnter={handleTaskDragEnter}
                    handleTaskDragLeave={handleTaskDragLeave}
                    handleTaskDrop={handleTaskDrop}
                />
            </DraggedTaskContext.Provider>
        </div>
    );
}

export default App;
