function randomString() {
  let length = 32;
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

let inputElement = document.querySelector("#todo-input");
let addToDo = () => {
  let inputValue = document.querySelector("#todo-input").value;
  if (inputValue === "") {
    return null;
  } else {
    let randomStr = randomString();
    let toDoDiv = document.querySelector("#todo-container");
    toDoDiv.innerHTML += `<p class="todo-cover"><input type="checkbox" class="todo-element" id="${randomStr}"><label for="${randomStr}">${inputValue}</label></p>`;
    document.querySelector("#todo-input").value = "";
  }
};
inputElement.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    addToDo();
  }
});
