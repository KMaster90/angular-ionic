const reasonInput = document.querySelector('#input-reason');
const inputAmount = document.querySelector('#input-amount');
const btnCancel = document.querySelector('#btn-cancel');
const btnConfirm = document.querySelector('#btn-confirm');
const expensesList = document.querySelector('#expenses-list');
const totalExpenses = document.querySelector('#total-expenses');
const ionAlertController = document.querySelector('ion-alert-controller');

let totalExpense = 0;

const clear = () => {
    reasonInput.value = '';
    inputAmount.value = ''
};

btnCancel.addEventListener('click', () => {
    console.log('Cancel');
    clear()
});
btnConfirm.addEventListener('click', () => {
    console.log('Clicked');

    const enteredReason = reasonInput.value;
    const enteredAmount = inputAmount.value;

    if (enteredReason.trim().length <= 0 || enteredAmount <= 0 || enteredAmount.trim().length <= 0) {
        ionAlertController.create({
            message: 'Please enter valid reason and amount!',
            header: 'Invalid inputs',
            buttons: ['Okay']
        }).then(alertElement => {
            alertElement.present()
        });
        return;
    }

    console.log(enteredReason, enteredAmount);

    const newItem = document.createElement('ion-item');
    newItem.textContent = enteredReason + ': $' + enteredAmount;

    expensesList.appendChild(newItem);
    totalExpense += +enteredAmount;
    totalExpenses.textContent = totalExpense;
    clear()
});
