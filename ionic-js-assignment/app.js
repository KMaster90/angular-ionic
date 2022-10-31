const name = document.querySelector('#name');
const rate = document.querySelector('#rate');
const btnAdd = document.querySelector('#btn-add');
const courseList = document.querySelector('#expenses-list')
async function presentAlert() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Alert';
    alert.subHeader = 'Important message';
    alert.message = 'This is an alert!';
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    await alert.present();
}

const clear = () => {
    name.value = '';
    rate.value = '';
}

btnAdd.addEventListener('click', () => {
    const nameValue = name.value || '';
    const rateValue = rate.value || 0;
    console.log(nameValue, rateValue);
    if (nameValue.trim().length <= 0 || rateValue.trim().length <= 0 || rateValue > 5) {
        presentAlert()
        return;
    }
    const newItem = document.createElement('ion-item');
    newItem.innerHTML = `<strong>${nameValue}:</strong>&nbsp;${rateValue}/5`;
    courseList.appendChild(newItem);
    clear();
});
