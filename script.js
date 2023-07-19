(function () {
    let tasks = [];
    const taskList = document.getElementById('list');
    const addTaskInput = document.getElementById('add-task');
    const tasksCounter = document.getElementById('tasks-counter');
    const addTaskBtn = document.getElementById('add-icon');
    const allCompleteBtn = document.getElementById('all-complete');

    // Fetching todo item from API
    async function fetchTodos() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos/');
            const data = await response.json();
            tasks = data.slice(0, 5);
            renderList();
        } catch (error) {
            console.log(error);
        }
    }

    //Todo create li element
    function addTaskToDom(task) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''}  class="custom-checkbox">
            <label for="${task.id}">${task.title}</label>
            <i class="fa-regular fa-circle-xmark delete" data-id="${task.id}"></i>
        `;
        taskList.append(li);
    }

    // To render todo item
    function renderList() {
        taskList.innerHTML = '';
        for (let i = 0; i < tasks.length; i++) {
            addTaskToDom(tasks[i]);
        }
        tasksCounter.innerHTML = tasks.length;
    }

    function toggleTask (taskId) {
        const task=tasks.filter(function(task){
            return task.id === Number(taskId);
        });

        if(task.length>0){
            const currentTask=task[0];
            currentTask.completed = !currentTask.completed;
            renderList();
            return;
        }
    }

    // To delete todo item from list
    function deleteTask(taskId) {
        const newTasks = tasks.filter(function (task) {
            return task.id !== Number(taskId);
        });
        tasks = newTasks;
        renderList();
    }

    // To add todo item in list
    function addTask(task) {
        if (task) {
            tasks.push(task);
            renderList();
            return;
        }
    }

    // To handle keyup event from input tag
    function handleInputKeypress(e) {
        if (e.target.value !== '') {
            addTaskBtn.style.visibility = 'visible';
        }
        else {
            addTaskBtn.style.visibility = 'hidden';
        }

        // To haldle click event on add button to add todo
        addTaskBtn.addEventListener('click', function () {
            const text = e.target.value;
            if (!text) {
                return;
            }
            const task = {
                title: text,
                id: Date.now(),
                completed:false
            }
            e.target.value = '';
            addTask(task);
            addTaskBtn.style.visibility = 'hidden';
        });
    }

    // To handle click event on document
    function handleClickListener(e) {
        const target = e.target;
        if (target.className === 'fa-regular fa-circle-xmark delete') {
            const taskId = target.dataset.id;
            deleteTask(taskId);
            return;
        }
        else if (target.id === 'all-complete') {
            const checkboxes = document.querySelectorAll('.custom-checkbox');
            checkboxes.forEach(function (checkbox) {
                checkbox.setAttribute('checked', 'true');
            });
        }
        else if (target.id === 'clear-completed') {
            const checkboxes = document.querySelectorAll('.custom-checkbox');
            checkboxes.forEach(function (checkbox) {
                checkbox.removeAttribute('checked');
            });
        }
        else if(target.className === 'custom-checkbox'){
            const taskId=target.id;
            toggleTask(taskId);
            return;
        }
    }

    // To initializing the function 
    function initializeApp() {
        fetchTodos();
        addTaskInput.addEventListener('keyup', handleInputKeypress);
        document.addEventListener('click', handleClickListener);
    }

    initializeApp();
})();