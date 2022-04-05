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
    <li>${todo}</li>
    <div class="task-buttons">
      <button>
        <i class="fas fa-check"></i>
      </button>
      <button>
        <i class="fas fa-pen"></i>
      </button>
      <button>
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
      addTodo(i.task,i.styleStatuses);
    })
  }
}

function completeDeleteEdit(action) {
  todoDiv = action.parentElement.parentElement.parentElement;
  if (action.classList[1] == "fa-check") {
    completeTodo(todoDiv);
  } else if (action.classList[1] == "fa-trash") {
    deleteTodo(todoDiv);
  } else if (action.classList[1] == "fa-pen") {
    // editTodo();
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
  console.log(todoes);
  localStorage.setItem("todo", JSON.stringify(todoes));

  //complete todo in html page structure
  div.classList.toggle("complete");
}