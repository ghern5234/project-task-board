// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
// function helloWorld(a) {
//      console.log(a);
// }
// helloWorld(4);
// helloWorld(6);
// helloWorld(7);

// console.log(nextId);
// Todo: create a function to generate a unique task id
function generateTaskId() {
  // If nextId does not exist in local storage
  if (nextId === null) {
    nextId = 1;
    // Otherwise increment by 1
  } else {
    nextId++;
  }
  // Save id to local storage
  localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  console.log("in the create taskCard function");
  console.log(task);
  let main = $("<div>")
  main.addClass("addYellow")
  let titleEl = $("<h1>");
  let descriptionEl = $("<p>");
  let dueDateEl = $("<p>");
  
  titleEl.text(task.title);
  descriptionEl.text(task.description);
  dueDateEl.text(task.dueDate);

  console.log(titleEl)
  main.append(titleEl);
  main.append(descriptionEl);
  main.append(dueDateEl)

  let todoSection = $("#todo-cards");
  todoSection.append(main);
};
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  console.log("in the handleAddTask");

//Store user input in variables
  const titleElement = $("#title");
  const dateElement = $("#datepicker");
  const textElement = $("#description");

  console.log(titleElement.val());
  console.log(dateElement.val());
  console.log(textElement.val());

//Run function to generate task id
  generateTaskId();

//Store the value of the variables in an object
  let taskInfo = {
    id: nextId,
    title: titleElement.val(),
    description: textElement.val(),
    dueDate: dateElement.val(),
  };

  console.log(`this is nextID ${nextId}`);
  console.log("This is the object taskInfo ", taskInfo);

//Push the user input object into task list variable
  taskList.push(taskInfo);

//Call create taskCard function
  createTaskCard(taskInfo);

//Store the taskList into tasks in local storage
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
//Conditional to check if taskList is null, and if so assign it an empty array
  if (taskList === null) {
    taskList = [];
  }
//Event handler for the save button to initialize handleAddTask function  
  $("#save").click(handleAddTask);
});
