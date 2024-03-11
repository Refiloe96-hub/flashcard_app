const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
const cardListContainer = document.querySelector(".card-list-container");
const prevButton = document.getElementById("prev-flashcard"); // Assuming you have this button
const nextButton = document.getElementById("next-flashcard"); // Assuming you have this button
let flashcards = [];
let currentFlashcardIndex = 0;
let editBool = false;

// Add question when user clicks 'Add Flashcard' button
addQuestion.addEventListener("click", () => {
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionCard.classList.remove("hide");
});

// Hide Create flashcard Card
closeBtn.addEventListener("click", () => {
  container.classList.remove("hide");
  addQuestionCard.classList.add("hide");
  if (editBool) {
    editBool = false;
    submitQuestion();
  }
});

// Submit Question
cardButton.addEventListener("click", () => {
  let tempQuestion = question.value.trim();
  let tempAnswer = answer.value.trim();
  if (!tempQuestion || !tempAnswer) {
      errorMessage.classList.remove("hide");
  } else {
      const flashcard = { question: tempQuestion, answer: tempAnswer };
      flashcards.push(flashcard); // Add to the flashcards array
      currentFlashcardIndex = flashcards.length - 1; // Set to display the newly added flashcard
      displayCurrentFlashcard();
      container.classList.remove("hide");
      errorMessage.classList.add("hide");
      question.value = "";
      answer.value = "";
      addQuestionCard.classList.add("hide");
  }
});

// Post a new flashcard to the server
function postFlashcard(flashcard) {
  fetch('/flashcards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flashcard),
  })
  .then(response => response.json())
  .then(data => {
    addFlashcardToList(data);
    container.classList.remove("hide");
    errorMessage.classList.add("hide");
    question.value = "";
    answer.value = "";
    addQuestionCard.classList.add("hide");
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

// Add flashcard to the list in the UI
function addFlashcardToList(flashcard) {
  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = `
    <p class="question-div">${flashcard.question}</p>
    <p class="answer-div hide">${flashcard.answer}</p>
    <a href="#" class="show-hide-btn">Show/Hide</a>
  `;
  const link = div.querySelector(".show-hide-btn");
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const answerDiv = div.querySelector(".answer-div");
    answerDiv.classList.toggle("hide");
  });
  cardListContainer.appendChild(div);
}

// Fetch all flashcards from the server when the page loads
function fetchFlashcards() {
  fetch('/flashcards')
  .then(response => response.json())
  .then(data => {
      flashcards = data;
      displayCurrentFlashcard(); // Display the first flashcard
  })
  .catch(error => console.error('Error fetching flashcards:', error));
}

prevButton.addEventListener("click", () => navigateFlashcard(-1));
nextButton.addEventListener("click", () => navigateFlashcard(1));

// Call fetchFlashcards to load existing flashcards
document.addEventListener("DOMContentLoaded", fetchFlashcards);

// Navigate to the previous or next flashcard
function navigateFlashcard(direction) {
  currentFlashcardIndex += direction;

  // Ensure index stays within bounds
  if (currentFlashcardIndex < 0) {
      currentFlashcardIndex = 0;
  } else if (currentFlashcardIndex >= flashcards.length) {
      currentFlashcardIndex = flashcards.length - 1;
  }

  displayCurrentFlashcard();
}

// Display the current flashcard
function displayCurrentFlashcard() {
  if (flashcards.length === 0) return;
  const flashcard = flashcards[currentFlashcardIndex];

  cardListContainer.innerHTML = ''; // Clear previous flashcard

  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = `
      <p class="question-div">${flashcard.question}</p>
      <p class="answer-div hide">${flashcard.answer}</p>
      <a href="#" class="show-hide-btn">Show/Hide</a>
  `;

  const link = div.querySelector(".show-hide-btn");
  link.addEventListener("click", (e) => {
      e.preventDefault();
      const answerDiv = div.querySelector(".answer-div");
      answerDiv.classList.toggle("hide");
  });

  cardListContainer.appendChild(div);
}


//Card Generate
function viewlist() {
  var listCard = document.getElementsByClassName("card-list-container");
  var div = document.createElement("div");
  div.classList.add("card");
  //Question
  div.innerHTML += `
  <p class="question-div">${question.value}</p>`;
  //Answer
  var displayAnswer = document.createElement("p");
  displayAnswer.classList.add("answer-div", "hide");
  displayAnswer.innerText = answer.value;

  //Link to show/hide answer
  var link = document.createElement("a");
  link.setAttribute("href", "#");
  link.setAttribute("class", "show-hide-btn");
  link.innerHTML = "Show/Hide";
  link.addEventListener("click", () => {
    displayAnswer.classList.toggle("hide");
  });

  div.appendChild(link);
  div.appendChild(displayAnswer);

  //Edit button
  let buttonsCon = document.createElement("div");
  buttonsCon.classList.add("buttons-con");
  var editButton = document.createElement("button");
  editButton.setAttribute("class", "edit");
  editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  editButton.addEventListener("click", () => {
    editBool = true;
    modifyElement(editButton, true);
    addQuestionCard.classList.remove("hide");
  });
  buttonsCon.appendChild(editButton);
  disableButtons(false);

  //Delete Button
  var deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "delete");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  buttonsCon.appendChild(deleteButton);

  div.appendChild(buttonsCon);
  listCard[0].appendChild(div);
  hideQuestion();
}

//Modify Elements
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement.parentElement;
  let parentQuestion = parentDiv.querySelector(".question-div").innerText;
  if (edit) {
    let parentAns = parentDiv.querySelector(".answer-div").innerText;
    answer.value = parentAns;
    question.value = parentQuestion;
    disableButtons(true);
  }
  parentDiv.remove();
};

//Disable edit and delete buttons
const disableButtons = (value) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = value;
  });
};