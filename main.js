const list = document.querySelector('.tasks-list');
list.innerHTML = "";
const input = document.getElementById("todo-input");
const form = document.querySelector('form');
const filter = document.querySelector('.filter-tasks');
const modal = document.querySelector('.modal-container');
let count = findCount();

form.addEventListener('submit', (e) => { // e= event
  e.preventDefault(); // prevent submit action from refreshing the page
  addTodo(input.value); //rendering task in the tasks list 
  saveTodo(input.value);
  input.value = ''; //clear input for the next todo 
  count++;
});

window.addEventListener('DOMContentLoaded', (e) => { //load tasks from local storage and render them in page loading 
  loadTodo();
})


list.addEventListener('click', (e) => { //active todo buttons(trash check pen ) 
  action = e.target;
  completeDeleteEdit(action);
})
window.addEventListener("keydown", (e) => { // aplly editing tasks with enter key 
  const div = document.activeElement.parentElement;
  if (e.key == "Enter" && div.classList.contains("editing")) {
    editTodo(div);
  }
})

filter.addEventListener("click", filterTodo);




function addTodo(todo, isComplete = " ", id = `task${count}`) {
  const todoDiv = document.createElement("div");
  todoDiv.innerHTML = `
    <li id="${id}" contentEditable="false" >${todo}</li>
    <div class="task-buttons">
      <button class="done">
        <i class="fas fa-check"></i>
      </button>
      <button class="edit">
        <i class="fas fa-pen"></i>
      </button>
      <button class="delete">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    `;
  todoDiv.classList.add('todo');
  todoDiv.classList.add(isComplete);
  list.appendChild(todoDiv);
}

function saveTodo(todo) {
  const todoObj = {
    task: todo,
    styleStatuses: " ",
    id: `task${count}`
  };
  let todoes = JSON.parse(localStorage.getItem('todo'));
  if (todoes == null) todoes = [];
  todoes.push(todoObj);
  localStorage.setItem('todo', JSON.stringify(todoes));
}

function loadTodo() {
  let todoes = JSON.parse(localStorage.getItem('todo'));
  if (todoes) {
    todoes.forEach((i) => {
      addTodo(i.task, i.styleStatuses, i.id);
    })
  }
}

function completeDeleteEdit(action) {
  todoDiv = action.parentElement.parentElement;
  if (action.classList[0] == "done") {
    completeTodo(todoDiv);
  } else if (action.classList[0] == "delete") {
    askDeleteTodo(todoDiv);
  } else if (action.classList[0] == "edit") {
    editTodo(todoDiv);
  }
}

function deleteTodo(div) {
  let todoId = div.children[0].id;
  console.log(todoId);
  let todoes = JSON.parse(localStorage.getItem("todo"));
  todoes.forEach((item, index) => {
    if (item.id == todoId) {
      todoes.splice(index, 1); //remove task from localStorage
    }
  })

  localStorage.setItem("todo", JSON.stringify(todoes));
  div.remove(); //remove div from page structure
}

function completeTodo(div) {
  //complete todo in local storage
  let todoId = div.children[0].id;
  let todoes = JSON.parse(localStorage.getItem("todo"));
  todoes.forEach(i => {
    if (Object.values(i)[2] == todoId) {
      if (i.styleStatuses == "complete") {
        i.styleStatuses = " ";
      } else {
        i.styleStatuses = "complete";
      }
    }
  })
  localStorage.setItem("todo", JSON.stringify(todoes));

  //complete todo in html page structure
  div.classList.toggle("complete");
}

function editTodo(div) {
  let todoId = div.children[0].id;
  let li = div.children[0].innerText;
  let todoes = JSON.parse(localStorage.getItem("todo"));

  if (div.children[0].contentEditable == "true") {
    div.children[0].contentEditable = "false";
    div.children[1].children[0].style.display = "inline-block";
    div.children[1].children[2].style.display = "inline-block";

    todoes.forEach((item, index) => {
      if (item.id == todoId) {
        item.task = li;
      }
    })

  } else {
    div.children[0].contentEditable = "true";
    div.children[0].focus();
    div.children[1].children[0].style.display = "none";
    div.children[1].children[2].style.display = "none";
  }
  localStorage.setItem("todo", JSON.stringify(todoes));
  div.classList.toggle("editing");
}

function findCount() {
  let c = 0;
  let todoes = JSON.parse(localStorage.getItem('todo'));
  if (todoes)
    if (todoes.length > 0) {
      c = todoes[todoes.length - 1].id;
      c = Number(c.replace(/\D/g, ''));
      c++;
    }
  return c;
}

function filterTodo(event) {
  const tasks = list.childNodes;
  tasks.forEach((todo) => {
    switch (event.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("complete")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (todo.classList.contains("complete")) {
          todo.style.display = "none";
        } else {
          todo.style.display = "flex";
        }
        break;
    }
  })
}

function askDeleteTodo(div) {
  modal.classList.remove("invis");
  modal.children[0].children[1].innerText = `TASK:  ${div.children[0].innerText} `;
  modal.children[0].addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("yes")) {
      deleteTodo(div);
      modal.classList.add("invis");
    } else if (e.target.classList.contains("no")) {
      modal.classList.add("invis");
      div = "";
    }
  })

}