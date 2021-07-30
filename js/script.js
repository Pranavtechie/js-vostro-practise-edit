function randomString() {
  return new Date().getTime().toString();
}

function checkLocalData() {
  /**
   * Returns a boolean value based on the presence of the 'tasks' item in the localStorage
   */
  return localStorage.getItem("tasks") ? true : false;
}

function getLocalData() {
  /**
   * Fetches the 'tasks' data and returns the parsed value from the 'tasks' localStorage item
   */
  let checkValue = checkLocalData();
  return checkValue ? JSON.parse(localStorage.getItem("tasks")) : [];
}

function makeTaskElement(id, task, isChecked) {
  /**
   * Returns the uniqueId & HTML to be injected to the task container
   * @param {string} [The task entered by the user]
   */
  let templateLiteral = `
  <div class="todo-cover" id="${id + "-cover"}">
    <section id="${id + "-primary-part"}"class="primary-part"">
      <input type="checkbox" class="todo-element" id="${
        id + "-check"
      }" onchange="handleChange(this)" ${isChecked ? "checked" : ""}>
      <label for="${id + "-check"}" class="check-label">
        <input class="todo-text" id="${
          id + "-data"
        }" type="text" value="${task}" disabled>
      </label>
    </section>
    <section id="${id + "-secondary-part"}" class="secondary-part" >
      <button class="sec-btn edit" onclick=editTask(this.id) id="${
        id + "-edit-btn"
      }">
        <i class="fas fa-edit"></i>
      </button>
      <button class="sec-btn trash" id="${
        id + "-trash-btn"
      }" onclick="deleteTask(this.id)">
        <i class="trash fas fa-trash-alt"></i>
      </button>
    </section>
  </div>`;
  /* I could have simply returned the templateLiteral and I would have done `innerHTML +=`(for adding the new element) but if I do that DOM Resets and the checkbox disappears
  https://stackoverflow.com/questions/28583253/appending-child-resets-previous-appended-element-value-on-javascript */
  var parser = new DOMParser();
  var wrapper = parser.parseFromString(templateLiteral, "text/html");
  let makeTemplate = wrapper.getElementById(`${id + "-cover"}`);
  return makeTemplate;
}
function deleteFromLocalData(taskId) {
  let localData = getLocalData();
  let index = 0;
  for (task in localData) {
    if (localData[task].id === taskId) {
      index = task;
    }
  }
  localData.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(localData));
}
function deleteTask(taskId) {
  let ogId = parseInt(taskId) + "";
  deleteFromLocalData(ogId);
  let container = document.getElementById("todo-container");
  container.removeChild(document.getElementById(ogId + "-cover"));
  decrementTotalTasks();
}
function editTask(taskId) {
  let simpleId = parseInt(taskId) + "";
  let editBtn = document.getElementById(taskId);
  editBtn.innerHTML = `<i class="fas fa-check"></i>`;
  editBtn.classList.remove("edit");
  editBtn.classList.add("check");
  let taskInput = document.getElementById(simpleId + "-data");
  taskInput.removeAttribute("disabled");
  editBtn.removeAttribute("onclick");
  editBtn.setAttribute("onclick", "saveTask(this.id)");
  taskInput.focus();
  // The next three lines are to set the cursor the end of the text
  let taskInputValue = taskInput.value;
  taskInput.value = "";
  taskInput.value = taskInputValue;
}
function saveTask(btnId) {
  let editBtn = document.getElementById(btnId);
  let simpleId = parseInt(btnId) + "";
  let taskInput = document.getElementById(simpleId + "-data");
  editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
  editBtn.removeAttribute("onclick");
  editBtn.setAttribute("onclick", "editTask(this.id)");
  editBtn.classList.remove("check");
  editBtn.classList.add("edit");
  let localData = getLocalData();
  let taskIndex = 0;
  for (task in localData) {
    if (localData[task].id === simpleId) {
      taskIndex = task;
    }
  }
  localData[taskIndex].task = taskInput.value;
  localStorage.setItem("tasks", JSON.stringify(localData));
  taskInput.setAttribute("disabled", "");
}
function injectTasks() {
  let container = document.querySelector("#todo-container");
  let localData = getLocalData();
  if (localData === []) {
    return null;
  } else {
    localData.forEach((element) => {
      let taskHTML = makeTaskElement(
        element.id,
        element.task,
        element.isChecked
      );
      container.appendChild(taskHTML);
    });
  }
}
function addTaskToLocalData(id, task) {
  let localData = getLocalData();
  localData.push({ id: `${id}`, task: `${task}`, isChecked: false });
  localStorage.setItem("tasks", JSON.stringify(localData));
}

function addNewTask() {
  let task = document.getElementById("todo-input");
  if (task.value !== "") {
    let taskId = randomString();
    addTaskToLocalData(taskId, task.value);
    const jsonData = JSON.parse(localStorage.getItem("tasks"));
    let taskHTML = makeTaskElement(taskId, task.value, task.isChecked);
    let toDoDiv = document.querySelector("#todo-container");
    toDoDiv.appendChild(taskHTML);
    task.value = "";
    incrementTotalTasks();
  } else {
    alert("No task has been typed!");
  }
}

function handleChange(checkbox) {
  let localData = getLocalData();
  let simpleId = parseInt(checkbox.id) + "";
  let taskIndex = 0;
  for (task in localData) {
    if (localData[task].id === simpleId) {
      taskIndex = task;
    }
  }
  if (checkbox.checked === true) {
    localData[taskIndex].isChecked = true;
    localStorage.setItem("tasks", JSON.stringify(localData));
    incrementCompletedTasks();
  } else if (checkbox.checked === false) {
    localData[taskIndex].isChecked = false;
    localStorage.setItem("tasks", JSON.stringify(localData));
    decrementCompletedTasks();
  }
}
let inputElement = document.querySelector("#todo-input");
inputElement.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    addNewTask();
  }
});
// Todo: https://www.youtube.com/watch?v=icwJYT-Ilpw
//stackoverflow.com/questions/42213858/how-can-i-get-parent-id-by-onclick-on-a-child-in-js
// localStorage.setItem(
//   "tasks",
//   JSON.stringify([
//     { id: "3431243", task: "This is the task description", isChecked: false },
//     {
//       id: "3432433",
//       task: "This is another description of the task",
//       isChecked: false,
//     },
//   ])
// );
document.addEventListener("DOMContentLoaded", (event) => {
  injectTasks();
});

let totalTasks = 0;
let completedTasks = 0;

let totalTasksElement = document.getElementById("total-tasks");
let completedTasksElement = document.getElementById("completed-tasks");

function setTaskValues() {
  let localData = getLocalData();
  for (task in localData) {
    if (localData[task].isChecked === false) {
      totalTasks++;
    } else if (localData[task].isChecked === true) {
      totalTasks++;
      completedTasks++;
    }
  }
  completedTasksElement.textContent = `${completedTasks}`;
  totalTasksElement.textContent = `${totalTasks}`;
}

setTaskValues();

function incrementCompletedTasks() {
  let updatedValue = parseInt(completedTasksElement.textContent) + 1;
  completedTasksElement.textContent = `${updatedValue}`;
}
function decrementCompletedTasks() {
  let updatedValue = parseInt(completedTasksElement.textContent) - 1;
  completedTasksElement.textContent = `${updatedValue}`;
}
function incrementTotalTasks() {
  let updatedValue = parseInt(totalTasksElement.textContent) + 1;
  totalTasksElement.textContent = `${updatedValue}`;
}

function decrementTotalTasks() {
  let updatedValue = parseInt(totalTasksElement.textContent) - 1;
  totalTasksElement.textContent = `${updatedValue}`;
}
// Todo : figure out what to do when the checkbox is checked
