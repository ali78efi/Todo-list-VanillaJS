const list = document.querySelector('.tasks-list');
const input = document.getElementById("todo-input");
const form = document.querySelector('form');

form.addEventListener('submit', (e) => { // e= event
  e.preventDefault(); // prevent submit action from refreshing the page
  addTodo(input.value); //rendering task in the tasks list 
  saveTodo(input.value);
  input.value = ''; //clear input for the next todo 
});

window.addEventListener('DOMContentLoaded', (e) => { //load tasks from local storage and render them in page loading 
  loadTodo();
})


list.addEventListener('click', (e) => { //active todo buttons(trash check pen ) 
  action = e.target;
  completeDeleteEdit(action);
})



function addTodo(todo, isComplete = " ") {
  const todoDiv = document.createElement("div");
  todoDiv.innerHTML = `
    <li contentEditable="false" >${todo}</li>
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
    styleStatuses: " "
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
      addTodo(i.task, i.styleStatuses);
    })
  }
}

function completeDeleteEdit(action) {
  todoDiv = action.parentElement.parentElement;
  console.log(todoDiv);
  if (action.classList[0] == "done") {
    completeTodo(todoDiv);
  } else if (action.classList[0] == "delete") {
    deleteTodo(todoDiv);
  } else if (action.classList[0] == "edit") {
    editTodo(todoDiv);
  }
}

function deleteTodo(div) {
  let li = div.children[0].innerText;
  let todoes = JSON.parse(localStorage.getItem("todo"));
  todoes.splice(todoes.indexOf(li), 1); //remove task from localStorage
  localStorage.setItem("todo", JSON.stringify(todoes));
  div.remove(); //remove div from page structure
}

function completeTodo(div) {

  //complete todo in local storage
  let li = div.children[0].innerText;
  let todoes = JSON.parse(localStorage.getItem("todo"));
  todoes.forEach(i => {
    if (Object.values(i)[0] == li) {
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
  let li = div.children[0].innerText;
  let todoes = JSON.parse(localStorage.getItem("todo"));

  if (div.children[0].contentEditable == "true") {
    div.children[0].contentEditable = "false";
    div.children[1].children[0].style.display = "inline-block";
    div.children[1].children[2].style.display = "inline-block";

  } else {
    div.children[0].contentEditable = "true";
    div.children[1].children[0].style.display = "none";
    div.children[1].children[2].style.display = "none";
  }

  div.classList.toggle("editing");



}