
var gTodos;
var gSortBy;
var gFilterBy = 'All';

function createTodos() {
    var todos = loadFromStorage('todos')
    if (!todos || !todos.length) {
        todos = [
            createTodo('Learn JS'),
            createTodo('Master CSS'),
            createTodo('Live good'),
        ]
    }
    gTodos = todos;
    saveTodos();
}

function createTodo(txt) {
    var date = new Date(Date.now());
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return {
        id: makeId(),
        txt: txt,
        isDone: false,
        createdAt: ((hours >= 1 && hours < 10) ? '0' + hours : hours) + ':' + ((minutes >= 1 && minutes < 10) ? '0' + minutes : minutes) + ' ' + date.toLocaleDateString('en-IL'),
        timeForSort: Date.now()
    }
}

function getTodosForDisplay() {
    if (gFilterBy === 'All') return gTodos;
    return gTodos.filter(function (todo) {
        return (todo.isDone && gFilterBy === 'Done') ||
            (!todo.isDone && gFilterBy === 'Active')
    })
}


function addTodo(txt) {
    var todo = createTodo(txt);
    gTodos.unshift(todo);
    saveTodos();
}

function deleteTodo(todoId) {
    var todoIdx = gTodos.findIndex(function (todo) { return todo.id === todoId });
    if (!confirm()) return;
    gTodos.splice(todoIdx, 1);
    saveTodos();
}

function toggleTodo(todoId) {
    var todo = gTodos.find(function (todo) { return todo.id === todoId });
    todo.isDone = !todo.isDone;
    saveTodos();
}

function setFilter(txt) {
    gFilterBy = txt;
}

function getTotalCount() {
    return gTodos.length
}

function getActiveCount() {
    var activeTodos = gTodos.filter(function (todo) { return !todo.isDone })
    return activeTodos.length;
}

function saveTodos() {
    saveToStorage('todos', gTodos)
}

function sortByName() {
    gTodos.sort(function (a, b) {
        var txtA = a.txt.toUpperCase();
        var txtB = b.txt.toUpperCase();
        if (txtA < txtB) {
            return -1;
        }
        if (txtA > txtB) {
            return 1;
        }
        return 0;
    });
}


function sortByTime() {
    gTodos.sort(function (a, b) {
        return b.timeForSort - a.timeForSort;
    });
}

function sortByImportance() {
    gTodos.sort(function (a, b) {
        return a.importance - b.importance;
    });
}

function printMsg(todos) {

    if (todos.length === 0) var strHTML = '<p>No todos</p>';
    else {
        if (document.querySelector('.active-count').textContent === '0') var strHTML = '<p>No Active Todos</p>';
        else var strHTML = '<p>No Done Todos All</p>';
    }

    document.querySelector('.message').innerHTML = strHTML;
}


