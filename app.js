let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;

// Set Budget Part
totalAmountButton.addEventListener("click", () => {
  tempAmount = parseFloat(totalAmount.value);
  // empty or negative input
  if (isNaN(tempAmount) || tempAmount <= 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    // Set Budget
    amount.innerHTML = tempAmount;
    // Set Balance
    balanceValue.innerText = tempAmount - parseFloat(expenditureValue.innerText);
    // Clear Input Box
    totalAmount.value = "";
  }
});

// Function To Disable Edit and Delete Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

// Function To Modify List Elements
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentBalance = parseFloat(balanceValue.innerText);
  let currentExpense = parseFloat(expenditureValue.innerText);
  let parentAmount = parseFloat(parentDiv.querySelector(".amount").innerText);
  if (edit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    productTitle.value = parentText;
    userAmount.value = parentAmount;
    disableButtons(true);
  }
  balanceValue.innerText = currentBalance + parentAmount;
  expenditureValue.innerText = currentExpense - parentAmount;
  parentDiv.remove();
};

// Function To Create List
const listCreator = (expenseName, expenseValue) => {
  let sublistContent = document.createElement("div");
  sublistContent.classList.add("sublist-content", "flex-space");
  list.appendChild(sublistContent);
  sublistContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "1.2em";
  editButton.addEventListener("click", () => {
    modifyElement(editButton, true);
  });
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "1.2em";
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
  document.getElementById("list").appendChild(sublistContent);
};

// Function To Add Expenses
checkAmountButton.addEventListener("click", () => {
  // empty checks
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  } else {
    productTitleError.classList.add("hide");
  }

  // Enable buttons
  disableButtons(false);
  
  // Expense
  let expenditure = parseFloat(userAmount.value);

  // Total expense (existing + new)
  let sum = parseFloat(expenditureValue.innerText) + expenditure;

  // Check if the new expenditure exceeds the budget
  if (sum > tempAmount) {
    productCostError.classList.remove("hide");
    productCostError.innerText = "Not enough money to cover this expense.";
    return false;
  } else {
    productCostError.classList.add("hide");
  }

  expenditureValue.innerText = sum;

  // Total balance(budget - total expense)
  const totalBalance = tempAmount - sum;
  balanceValue.innerText = totalBalance;

  // Create list
  listCreator(productTitle.value, userAmount.value);

  // Empty inputs
  productTitle.value = "";
  userAmount.value = "";
});
