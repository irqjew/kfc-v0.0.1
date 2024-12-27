import * as api from './functions.js';

// Фильтр
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn-filter');

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetId = event.target.getAttribute('data-target');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Корзина
document.addEventListener('DOMContentLoaded', () => {
    const orderButtons = document.querySelectorAll('.btnOrder');
    const allZakaz = document.querySelector('.allZakaz');
    const orderPriceDisplay = document.querySelector('.orderPrise'); // Элемент для итоговой суммы

    // Загружаем состояние корзины при загрузке страницы
    api.fetchCart().then(cart => {
        // Очищаем корзину перед загрузкой новых данных
        allZakaz.innerHTML = '';

        // Загружаем товары в корзину
        cart.forEach(product => {
            const newItem = createCartItem(product);
            allZakaz.appendChild(newItem);
            attachCounterEvents(newItem);
        });

        // Обновляем состояние кнопок "Беру!"
        orderButtons.forEach(button => {
            const foodItem = button.closest('.food');
            const foodId = parseInt(foodItem.dataset.id); // Преобразуем data-id в число

            // Если товар есть в корзине, обновляем кнопку
            if (cart.some(item => item.id === foodId)) {
                button.textContent = 'Взято';
                button.style.backgroundColor = 'green';
            } else {
                button.textContent = 'Беру!';
                button.style.backgroundColor = '';
            }
        });

        updateOrderPrice(); // Обновляем итоговую сумму
    });

    orderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const foodItem = button.closest('.food');
            const foodId = parseInt(foodItem.dataset.id); // Преобразуем data-id в число
            const foodName = foodItem.querySelector('.nameAndPriseOrder').textContent; // Получаем название
            const foodPrice = foodItem.querySelector('.nameAndPriseOrder:last-of-type').textContent; // Получаем цену
            const foodImageSrc = foodItem.querySelector('img').src; // Получаем источник изображения

            if (button.textContent === 'Беру!') {
                const product = {
                    id: foodId, // Уникальный ID товара
                    name: foodName,
                    price: parseInt(foodPrice),
                    image: foodImageSrc,
                    quantity: 1
                };

                // Отправляем товар на сервер как "взятый"
                api.addTakenItem(foodId).then(() => {
                    // Добавляем товар в корзину на сервере
                    return api.addToCart(product);
                }).then(() => {
                    // Обновляем кнопку
                    button.textContent = 'Взято';
                    button.style.backgroundColor = 'green';

                    // Добавляем товар в корзину
                    const newItem = createCartItem(product);
                    allZakaz.appendChild(newItem);
                    attachCounterEvents(newItem);
                    updateOrderPrice(); // Обновляем итоговую сумму
                });
            } else {
                // Удаляем товар из списка "взятых"
                api.removeTakenItem(foodId).then(() => {
                    // Удаляем товар из корзины на сервере
                    return api.removeFromCart(foodId);
                }).then(() => {
                    // Обновляем кнопку
                    button.textContent = 'Беру!';
                    button.style.backgroundColor = '';

                    // Удаляем товар из корзины
                    removeItemFromCart(foodId);
                    updateOrderPrice(); // Обновляем итоговую сумму
                });
            }
        });
    });

    // Функция для создания элемента корзины
    function createCartItem(product) {
        const newItem = document.createElement('div');
        newItem.classList.add('one');
        newItem.dataset.id = product.id; // Используем уникальный ID товара
        newItem.innerHTML = `
            <div class="one_name">
                <img class="one_name_img" src="${product.image}" alt="${product.name}">
                <p class="nameOne">${product.name}</p>
            </div>
            <div class="prise">
                <p class="priseOne">${product.price} руб.</p>
            </div>
            <div class="counter-container">
                <button class="btnMinus">-</button>
                <span class="counter">${product.quantity}</span>
                <p>шт.</p>
                <button class="btnPlus">+</button>
            </div>
            <div class="priseAll"></div>
        `;
        return newItem;
    }

    // Функция для удаления товара из корзины
    function removeItemFromCart(productId) {
        const itemsInBasket = allZakaz.querySelectorAll('.one');
        itemsInBasket.forEach(item => {
            if (parseInt(item.dataset.id) === productId) {
                item.remove(); // Удаляем элемент из корзины
            }
        });

        // Обновляем состояние кнопки "Беру!"
        const originalButton = Array.from(orderButtons).find(btn => parseInt(btn.closest('.food').dataset.id) === productId);
        if (originalButton) {
            originalButton.textContent = 'Беру!';
            originalButton.style.backgroundColor = '';
        }
    }

    // Функция для обработки событий счетчика
    function attachCounterEvents(container) {
        const btnPlus = container.querySelector('.btnPlus');
        const btnMinus = container.querySelector('.btnMinus');
        const counterDisplay = container.querySelector('.counter');
        const priceDisplay = container.querySelector('.prise .priseOne'); // Получаем цену из элемента
        const totalPriceDisplay = container.querySelector('.priseAll'); // Элемент для отображения итоговой цены
        const productId = parseInt(container.dataset.id); // Преобразуем data-id в число

        let count = parseInt(counterDisplay.textContent); // Начальное значение счетчика
        let price = parseInt(priceDisplay.textContent); // Получаем цену из элемента

        function updateCounter() {
            counterDisplay.textContent = count;
            updateTotalPrice(); // Обновляем итоговую цену

            // Обновляем количество товара на сервере
            api.updateCartItem(productId, count).then(() => {
                updateOrderPrice(); // Обновляем итоговую сумму
            });

            if (count === 0) {
                container.remove(); // Удаляем элемент из DOM, если счетчик равен 0
                updateOrderPrice(); // Обновляем общую сумму заказа после удаления

                // Возвращаем кнопку в исходное состояние (если она была взята)
                const originalButton = Array.from(orderButtons).find(btn => parseInt(btn.closest('.food').dataset.id) === productId);
                if (originalButton) {
                    originalButton.textContent = 'Беру!';
                    originalButton.style.backgroundColor = '';
                }
            }
        }

        function updateTotalPrice() {
            const totalPrice = price * count; // Итоговая цена для текущего элемента
            totalPriceDisplay.textContent = `${totalPrice} руб.`; // Обновляем текст с итоговой ценой
        }

        btnPlus.addEventListener('click', () => {
            count++;
            updateCounter();
        });

        btnMinus.addEventListener('click', () => {
            if (count > 0) {
                count--;
                updateCounter();
            }
        });

        updateTotalPrice(); // Инициализируем отображение итоговой цены при загрузке
    }

    // Функция для обновления итоговой суммы
    function updateOrderPrice() {
        let totalOrderPrice = 0; // Переменная для хранения общей суммы заказа

        const itemsInBasket = allZakaz.querySelectorAll('.one');
        itemsInBasket.forEach(item => {
            const itemCounter = item.querySelector('.counter');
            const itemPrice = item.querySelector('.prise .priseOne');
            const itemCount = parseInt(itemCounter.textContent);
            const itemUnitPrice = parseInt(itemPrice.textContent);

            totalOrderPrice += itemCount * itemUnitPrice; // Суммируем стоимости всех элементов
        });

        orderPriceDisplay.textContent = `Итоговая сумма: ${totalOrderPrice} руб.`; // Обновляем итоговую сумму
    }
});

// Открытие корзины
document.addEventListener('DOMContentLoaded', function() {
    const basketButton = document.querySelector('.header-logo-basket'); // Кнопка для открытия корзины
    const korzinaObertka = document.querySelector('.korzina-obertka'); // Корзина
    const exitButton = document.getElementById('exit'); // Кнопка закрытия корзины

    // Функция для открытия корзины
    basketButton.addEventListener('click', function() {
        korzinaObertka.style.display = 'flex'; // Показываем корзину с использованием flex
    });

    // Функция для закрытия корзины
    exitButton.addEventListener('click', function() {
        korzinaObertka.style.display = 'none'; // Скрываем корзину
    });
});