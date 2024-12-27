// Получить список "взятых" товаров
export async function fetchTakenItems() {
    try {
      const response = await fetch('http://localhost:3000/taken-items');
      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка:', error);
      return [];
    }
  }
  
  // Добавить товар в список "взятых"
export async function addTakenItem(itemId) {
    try {
      const response = await fetch('http://localhost:3000/taken-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });
      if (!response.ok) {
        throw new Error('Ошибка при добавлении товара');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }
  
  // Удалить товар из списка "взятых"
export async function removeTakenItem(itemId) {
    try {
      const response = await fetch(`http://localhost:3000/taken-items/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Ошибка при удалении товара');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }

export async function fetchCart() {
    try {
      const response = await fetch('http://localhost:3000/cart');
      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка:', error);
      return [];
    }
  }
  
  // Добавить товар в корзину на сервере
export async function addToCart(product) {
    try {
      const response = await fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product }),
      });
      if (!response.ok) {
        throw new Error('Ошибка при добавлении товара');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }
  
  // Удалить товар из корзины на сервере
export async function removeFromCart(productId) {
    try {
      const response = await fetch(`http://localhost:3000/cart/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Ошибка при удалении товара');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }
  
  // Обновить количество товара в корзине на сервере
export async function updateCartItem(productId, quantity) {
    try {
      const response = await fetch(`http://localhost:3000/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) {
        throw new Error('Ошибка при обновлении товара');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }