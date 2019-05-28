

function onInit() {
    createTodos();
    renderTodos();
}


function renderTodos() {
    var todos = getTodosForDisplay();

    var strHtmls = todos.map(function (todo, idx) {
        if (!todo.importance) todo.importance = 1;
        var className = (todo.isDone) ? 'done' : '';
        return `<li class="${className}" onclick="onToggleTodo('${todo.id}')">
        ${todo.txt}, created at ${todo.createdAt}, Importance: <input placeholder="${todo.importance}" onclick="onGetImportance(event, this, ${idx})" type="number" min="1" max="3" value="">  
        <button onclick="onDeleteTodo(event, '${todo.id}')">x</button><span class="buttons-${todo.id}"></span>
        </li>`
    })

    document.querySelector('.todo-list').innerHTML = strHtmls.join('');
    renderButtons();
    renderStats();
    printMsg(todos);
}


function renderStats() {
    document.querySelector('.total-count').innerText = getTotalCount();
    document.querySelector('.active-count').innerText = getActiveCount();
    document.querySelector('.left-todo').innerText = `${getActiveCount()} Left to do `
}


function renderButtons() {
    var todos = getTodosForDisplay();
    todos.forEach(function (todo, idx) {
        if(!todos.length || todos.length === 1) return;
        if (idx === 0) {
            var strHTML = `<button onclick="onMoveTodo(event, this, '${todo.id}')">Down</button>`;
            document.querySelector(`.buttons-${todo.id}`).innerHTML = strHTML;
        } else if (idx === todos.length - 1) {
            var strHTML = `<button onclick="onMoveTodo(event, this, '${todo.id}')">Up</button>`;
            document.querySelector(`.buttons-${todo.id}`).innerHTML = strHTML;
        } else {
            var strHTML = `<button onclick="onMoveTodo(event, this, '${todo.id}')">Down</button><button onclick="onMoveTodo(event, this, '${todo.id}')">Up</button>`;
            document.querySelector(`.buttons-${todo.id}`).innerHTML = strHTML;
        }
    });
}


function onAddTodo() {
    var txt = prompt('What todo?');
    if (!txt) return;
    addTodo(txt);
    onSetSort(gSortBy);
    renderTodos();

}

function onDeleteTodo(ev, todoId) {
    ev.stopPropagation();
    deleteTodo(todoId);
    renderTodos();
}

function onToggleTodo(todoId) {
    toggleTodo(todoId);
    renderTodos();
}

function onSetFilter(elBtn) {
    setFilter(elBtn.textContent);
    renderTodos();
}


function onGetImportance(ev, elBtn, idx) {
    ev.stopPropagation();
    gTodos[idx].importance = +elBtn.value;
    saveTodos();
}


function onSetSort(txt) {
    gSortBy = txt;
    if (txt === 'Text') sortByName();
    else if (txt === 'Importance') sortByImportance();
    else sortByTime();
    renderTodos();
}


function onMoveTodo(ev, elBtn, todoId) {
    ev.stopPropagation();
    var todoIdx = gTodos.findIndex(function (todo) { return todo.id === todoId });
    if (elBtn.textContent === 'Up') {
        gTodos.splice(todoIdx - 1, 0, gTodos[todoIdx]);
        gTodos.splice(todoIdx + 1, 1);
    } else {
        gTodos.splice(todoIdx + 2, 0, gTodos[todoIdx]);
        gTodos.splice(todoIdx, 1);
    }
    renderTodos();
}