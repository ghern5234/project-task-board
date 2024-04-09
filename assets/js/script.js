// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
console.log(nextId);

// Todo: create a function to generate a unique task id
function generateTaskId() {

// If nextId does not exist in local storage assign it id of 1
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
// Declare the date
  let today = dayjs();

// Create a task card container, add a class of #draggable and assign its id as the task.id from the task obj
  let main = $("<div>");
  main.addClass("draggable");
  main.attr("data-id", task.id);

// Compares the due date to the actual date and applies the appropriate class for styling
  if (today.isBefore(dayjs(task.dueDate)) === true) {
    main.addClass("addYellow");
  } else if (today.isAfter(dayjs(task.dueDate), "day") === true) {
    main.addClass("addRed");
  } else {
    console.log("The Same");
  }

// Creates elements and stores them in variables using jQuery
  let titleEl = $("<h1>");
  let descriptionEl = $("<p>");
  let dueDateEl = $("<p>");

// Creates delete button using jQuery for task cards and 
  let cardDeleteBtn = $("<button>")
    .addClass("btn btn-danger delete")
    .text("Delete")

// ?????
    .attr("data-projectId", task.id);

// Event listener assigned to delete button to initialize the delete task function when clicked
  cardDeleteBtn.on("click", handleDeleteTask);

// Changes the text of the elements with the corresponding information from the task obj
  titleEl.text(task.title);
  descriptionEl.text(task.description);
  dueDateEl.text(task.dueDate);

// Appends the elements to the card/main div
  main.append(titleEl);
  main.append(descriptionEl);
  main.append(dueDateEl);
  main.append(cardDeleteBtn);

// Searches for the id of the task card sections and assigne them to variables
  let todoSection = $("#todo-cards");
  let doneSection = $("#done-cards");
  let progressSection = $("#in-progress-cards");

// Iterates through array to assign the newly created task to the corresponding section//////
// Is this what's causing the cards to go back to the to-do section?/////////
  if (task.status === "to-do") {
    todoSection.append(main);
  } else if (task.status === "done") {
    doneSection.append(main);
  } else {
    progressSection.append(main);
  }

// Makes the task card draggable
  $(".draggable").draggable({
    opacity: 0.5,
    zIndex: 100,

//This is a function that creates the clone of the card that is dragged.
    helper: function (e) {
  
// Check if the target of the drag event is the card itself or a child element. 
// If it is the card itself, clone it. Otherwise find the parent card that is draggable and clone that.
      const original = $(e.target).hasClass("ui-draggable")
        ? $(e.target)
        : $(e.target).closest(".ui-draggable");
// Return the clone with the width set to the width of the original card so the clone does not take up the entire width of the lane.
// This is to also fix a bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
// Call and store the cards into variables
  let todoSection = $("#todo-cards");
  let doneSection = $("#done-cards");
  let progressSection = $("#in-progress-cards");

// Clear existing data in these variables/cards
  todoSection.empty();
  doneSection.empty();
  progressSection.empty();

// Initialize createTaskCard function and passes the i-th element of the taskList array as an argument.
  for (let i = 0; i < taskList.length; i++) {
    createTaskCard(taskList[i]);
  }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  
// Store user input in variables
  const titleElement = $("#title");
  const dateElement = $("#datepicker");
  const textElement = $("#description");


// Run function to generate a task id
  generateTaskId();


// Create and store an object containing the task card info in key-value pairs
  let taskInfo = {
    id: nextId,
    title: titleElement.val(),
    description: textElement.val(),
    dueDate: dateElement.val(),
    status: "to-do",
  };

// Push the task info/object into task list variable
  taskList.push(taskInfo);

// Call create taskCard function and pass the task info
  createTaskCard(taskInfo);

// Store the taskList into tasks in local storage
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  console.log("This is inside delete task");

//Create a varibale containing the id of the targeted task to delete
  const idToDelete = event.target.dataset.projectid;

//Iterate through the tasks to find and compare the task id with the id requesting to be deleted.
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == idToDelete) {

//Remove the index of the targeted task
      taskList.splice(i, 1);

//Update the local storage?????
      localStorage.setItem("tasks", JSON.stringify(taskList));
    }

//????
    renderTaskList();
  }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

// Get the project id from the event(task card being moved)
  const taskId = ui.draggable[0].dataset.id;

// Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

 // Iterate through task info
  for (let i = 0; i < taskList.length; i++) {
    if (taskId == taskList[i].id) {
      taskList[i].status = newStatus;
// Updating new status to local storage      
      localStorage.setItem("tasks", JSON.stringify(taskList));
      renderTaskList();
    }
  }

 
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

//Conditional to check if taskList is null, and if so assign it an empty array
  if (taskList === null) {
    taskList = [];
  }
  renderTaskList();

//Event handler for the save button to initialize handleAddTask function
  $("#save").click(handleAddTask);

//Make lanes droppable
  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });
});
