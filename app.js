// Get elements
const totalAmount = document.querySelector("#total-amount");
const userAmount = document.querySelector("#user-amount");
const checkAmountButton = document.querySelector("#check-amount");
const totalAmountButton = document.querySelector("#total-amount-button");
const newBudgetButton = document.querySelector("#new-budget-button");
const productTitle = document.querySelector("#product-title");
const errorMessage = document.querySelector("#budget-error");
const productTitleError = document.querySelector("#product-title-error");
const productCostError = document.querySelector("#product-cost-error");
const amount = document.querySelector("#amount");
const expenditureValue = document.querySelector("#expenditure-value");
const balanceValue = document.querySelector("#balance-amount");
const list = document.querySelector("#list");
let tempAmount = 0;

// Load data from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
    const budgetData = JSON.parse(localStorage.getItem("budgetData"));
    if (budgetData) {
        tempAmount = parseFloat(budgetData.tempAmount);
        amount.innerHTML = tempAmount;
        expenditureValue.innerText = budgetData.expenditureValue;
        balanceValue.innerText = budgetData.balanceValue;
        list.innerHTML = budgetData.expenses;
        attachListeners();
    }
});

// Attach listeners to buttons
const attachListeners = () => {
    const editButtons = document.querySelectorAll(".edit-button");
    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            modifyElement(button, true);
        });
    });

    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            modifyElement(button);
        });
    });
};

// Set budget
totalAmountButton.addEventListener("click", () => {
    tempAmount = parseFloat(totalAmount.value);
    if (isNaN(tempAmount) || tempAmount <= 0) {
        errorMessage.classList.remove("hide");
    } else {
        errorMessage.classList.add("hide");
        amount.innerHTML = tempAmount;
        balanceValue.innerText = tempAmount - parseFloat(expenditureValue.innerText);
        totalAmount.value = "";
        saveData();
    }
});

// New budget button
newBudgetButton.addEventListener("click", () => {
    tempAmount = 0;
    amount.innerHTML = "0";
    expenditureValue.innerText = "0";
    balanceValue.innerText = "0";
    list.innerHTML = "";
    localStorage.removeItem("budgetData");
    errorMessage.classList.add("hide");
    productTitleError.classList.add("hide");
    productCostError.classList.add("hide");
});

// Disable or enable edit and delete buttons
const disableButtons = (bool) => {
    let editButtons = document.querySelectorAll(".edit-button");
    let deleteButtons = document.querySelectorAll(".delete-button");
    editButtons.forEach((element) => {
        element.disabled = bool;
    });
    deleteButtons.forEach((element) => {
        element.disabled = bool;
    });
};

// Modify list element
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
    saveData();
};

// Create list element
const listCreator = (expenseName, expenseValue) => {
    let sublistContent = document.createElement("div");
    sublistContent.classList.add("sublist-content", "flex-space");
    list.appendChild(sublistContent);
    sublistContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;
    let editButton = document.createElement("button");
    editButton.classList.add("edit-button", "edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square" style="font-size: 1.2em;"></i>`;
    editButton.addEventListener("click", () => {
        modifyElement(editButton, true);
    });
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button", "delete");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can" style="font-size: 1.2em;"></i>`;
    deleteButton.addEventListener("click", () => {
        modifyElement(deleteButton);
    });
    sublistContent.appendChild(editButton);
    sublistContent.appendChild(deleteButton);
    list.appendChild(sublistContent);
    saveData();
};

// Add expenses
checkAmountButton.addEventListener("click", () => {
    if (!userAmount.value || !productTitle.value) {
        productTitleError.classList.remove("hide");
        return false;
    } else {
        productTitleError.classList.add("hide");
    }

    disableButtons(false);

    let expenditure = parseFloat(userAmount.value);
    let sum = parseFloat(expenditureValue.innerText) + expenditure;

    if (sum > tempAmount) {
        productCostError.classList.remove("hide");
        productCostError.innerText = "Not enough money to cover this expense.";
        return false;
    } else {
        productCostError.classList.add("hide");
    }

    expenditureValue.innerText = sum;
    const totalBalance = tempAmount - sum;
    balanceValue.innerText = totalBalance;

    listCreator(productTitle.value, userAmount.value);
    productTitle.value = "";
    userAmount.value = "";
});

// Save data to localStorage
const saveData = () => {
    const budgetData = {
        tempAmount,
        expenditureValue: expenditureValue.innerText,
        balanceValue: balanceValue.innerText,
        expenses: list.innerHTML
    };
    localStorage.setItem("budgetData", JSON.stringify(budgetData));
};
