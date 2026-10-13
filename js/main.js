// Модальное окно, кнопки заказа, кнопка закрытия, скрытое поле
const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');

// Клик по «Заказать»: записываем товар в скрытое поле и открываем окно
orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedProductInput.value = button.dataset.product;
    orderDialog.showModal();
  });
});

// Закрытие по кнопке «Закрыть»
closeDialogButton.addEventListener('click', () => {
  orderDialog.close();
});

// Форма и сообщение об успехе
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

orderForm.addEventListener('submit', (event) => {
  // Реальную отправку отменяем: backend пока нет
  event.preventDefault();

  // Снимаем прошлые признаки ошибок
  const formElements = Array.from(orderForm.elements);
  formElements.forEach((element) => {
    if (element.willValidate) {
      element.removeAttribute('aria-invalid');
    }
  });

  // Проверяем HTML-ограничения; ошибочные поля подсвечиваем
  if (!orderForm.checkValidity()) {
    formElements.forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute('aria-invalid', 'true');
      }
    });
    orderForm.reportValidity();
    return;
  }

  // Успех: сообщение, очистка формы, закрытие окна
  successMessage.hidden = false;
  orderForm.reset();
  orderDialog.close();
});