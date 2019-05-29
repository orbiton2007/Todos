

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
        ${todo.txt}, created at ${todo.createdAt}, Importance: <div class="btn-group" role="group" aria-label="First group">
        <button type="button" onclick="onGetImportance(event, this, ${idx})">-</button>
        <input class="importance-input" placeholder="${todo.importance}">
        <button type="button" onclick="onGetImportance(event, this, ${idx})">+</button>
        
        <button onclick="onDeleteTodo(event, '${todo.id}')">x</button><span class="buttons-${todo.id}"></span></div>
        </li>`
    })

    document.querySelector('.todo-list').innerHTML = strHtmls.join('');
    renderButtons();
    renderStats();
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
            var strHTML = `<button class="btn-down" onclick="onMoveTodo(event, this, '${todo.id}')">Down</button>`;
            document.querySelector(`.buttons-${todo.id}`).innerHTML = strHTML;
        } else if (idx === todos.length - 1) {
            var strHTML = `<button class="btn-up" onclick="onMoveTodo(event, this, '${todo.id}')">Up</button>`;
            document.querySelector(`.buttons-${todo.id}`).innerHTML = strHTML;
        } else {
            var strHTML = `<button class="btn-down" onclick="onMoveTodo(event, this, '${todo.id}')">Down</button>
            <button class="btn-up" onclick="onMoveTodo(event, this, '${todo.id}')">Up</button>`;
            document.querySelector(`.buttons-${todo.id}`).innerHTML = strHTML;
        }
    });
}


function onAddTodo() {
    var txt = document.querySelector('.todo-input').value;
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

    if (elBtn.textContent === '-') {
        if (gTodos[idx].importance === 1) return;
        --gTodos[idx].importance;
    } else {
        if (gTodos[idx].importance === 9) return;
        ++gTodos[idx].importance;
    }
    document.querySelector('.importance-input').textContent = gTodos[idx].importance;
    renderTodos();
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