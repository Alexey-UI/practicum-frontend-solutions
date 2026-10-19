const memoryDialog = document.querySelector('#memory-dialog');
const saveButton = document.querySelector('.save-button');
saveButton.addEventListener('click', () => memoryDialog.showModal());

const closeButton = memoryDialog.querySelector('.dialog__button');
closeButton.addEventListener('click', () => memoryDialog.close());
