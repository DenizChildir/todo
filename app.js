
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const filterTasks = document.getElementById('filter-tasks');
const clearCompletedTasksButton = document.getElementById('clear-tasks');

taskList.addEventListener('click', handleTaskListClick);
addTaskButton.addEventListener('click', addTask);
filterTasks.addEventListener('change', applyTaskFilter);
clearCompletedTasksButton.addEventListener('click', clearCompletedTasks);
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

function clearCompletedTasks() {
    const tasks = document.querySelectorAll('.task-item');
    tasks.forEach((task) => {
        if (task.classList.contains('completed')) {
            taskList.removeChild(task);
        }
    });
    saveTasksToLocalStorage();
}
function addTask(taskText = '', completed = false, priority = 'low') {
    const taskInputText = taskInput.value.trim() || taskText;
    if (taskInputText === '') {
        alert('Enter a task');
        return;
    }

    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    taskItem.innerText = taskInputText;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('delete-task');
    taskItem.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.classList.add('edit-task');
    taskItem.appendChild(editButton);

    if (completed) {
        taskItem.classList.add('completed');
    }

    taskItem.classList.add(`${priority}-priority`);

    taskList.appendChild(taskItem);
    taskInput.value = '';

    saveTasksToLocalStorage();
}




function toggleTaskCompletion(event) {
    if (event.target.classList.contains('task-item')) {
        event.target.classList.toggle('completed');
    }
    saveTasksToLocalStorage();
}

function deleteTask(event) {
    if (event.target.classList.contains('delete-task')) {
        if (confirm('are you sure')) {
            const taskItem = event.target.parentNode
            taskList.removeChild(taskItem)
            saveTasksToLocalStorage()
        }
    }
}

function handleTaskListClick(event) {
    if (event.target.tagName === 'LI') {
        toggleTaskCompletion(event);
    } else if (event.target.classList.contains('delete-task')) {
        deleteTask(event);
    } else if (event.target.classList.contains('edit-task')) {
        editTask(event);
    }
}

function applyTaskFilter(event) {
    const filterValue = event.target.value;
    const tasks = document.querySelectorAll('.task-item');

    tasks.forEach((task) => {
        switch (filterValue) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'completed':
                task.classList.contains('completed') ? task.style.display = 'flex' : task.style.display = 'none';
                break;
            case 'incomplete':
                task.classList.contains('completed') ? task.style.display = 'none' : task.style.display = 'flex';
                break;
        }
    });
}

function editTask(event){
    if (event.target.classList.contains('edit-task')){
        const taskItem=event.target.parentNode
        const taskText=taskItem.textContent.slice(0,-10)

        const editInput=document.createElement('input')
        editInput.type='text';
        editInput.value=taskText;
        editInput.classList.add('edit-input');

        taskItem.replaceChild(editInput,taskItem.firstChild);
        editInput.focus();
        editInput.addEventListener('blur',saveEditedTask);

    }
}
function saveEditedTask(event) {
    const editInput = event.target;
    const taskItem = editInput.parentNode;
    const taskText = editInput.value.trim();

    if (taskText === '') {
        taskList.removeChild(taskItem);
    } else {
        const newTaskText = document.createTextNode(taskText);
        taskItem.replaceChild(newTaskText, editInput);
    }
    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage(){
    const tasks=Array.from(document.querySelectorAll('.task-item')).map((task)=>{
        return {
            text: task.firstChild.textContent,
            completed: task.classList.contains('completed')
        };
    });
    localStorage.setItem('tasks',JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasksJSON = localStorage.getItem('tasks');

    if (tasksJSON) {
        const tasks = JSON.parse(tasksJSON);
        tasks.forEach((task) => {
            addTask(task.text, task.completed, task.priority);
        });
    }
}


let draggedTask = null;

function handleTaskDragStart(event) {
    draggedTask = event.target;
    event.target.classList.add('dragging');
}

function handleTaskDragOver(event) {
    event.preventDefault();
}

function handleTaskDragEnter(event) {
    if (event.target.classList.contains('task-item')) {
        event.target.classList.add('drag-over');
    }
}

function handleTaskDragLeave(event) {
    if (event.target.classList.contains('task-item')) {
        event.target.classList.remove('drag-over');
    }
}

function handleTaskDrop(event) {
    if (event.target.classList.contains('task-item')) {
        event.target.classList.remove('drag-over');
        taskList.insertBefore(draggedTask, event.target);
        saveTasksToLocalStorage();
    }
}

taskList.addEventListener('dragstart', handleTaskDragStart);
taskList.addEventListener('dragover', handleTaskDragOver);
taskList.addEventListener('dragenter', handleTaskDragEnter);
taskList.addEventListener('dragleave', handleTaskDragLeave);
taskList.addEventListener('drop', handleTaskDrop);

const searchTasksInput = document.getElementById('search-tasks');

function searchTasks(event) {
    const searchText = event.target.value.toLowerCase();
    const tasks = document.querySelectorAll('.task-item');

    tasks.forEach((task) => {
        const taskText = task.firstChild.textContent.toLowerCase();
        if (taskText.includes(searchText)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

searchTasksInput.addEventListener('input', searchTasks);

function changeTaskPriority(event) {
    if (event.target.classList.contains('task-priority')) {
        const taskItem = event.target.parentNode;
        const priority = event.target.value;

        taskItem.classList.remove('low-priority', 'medium-priority', 'high-priority');
        taskItem.classList.add(`${priority}-priority`);

        saveTasksToLocalStorage();
    }
}
function handleTaskListChange(event) {
    changeTaskPriority(event);
}

taskList.addEventListener('change', handleTaskListChange);
