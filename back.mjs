import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let cart = [];
let takenItems = [];

app.get('/taken-items', (req, res) => {
  res.json(takenItems);
});

app.post('/taken-items', (req, res) => {
  const { itemId } = req.body;

  if (!takenItems.includes(itemId)) {
    takenItems.push(itemId);
  }

  res.json(takenItems);
});

app.delete('/taken-items/:itemId', (req, res) => {
  const { itemId } = req.params;

  takenItems = takenItems.filter(id => id !== itemId);

  res.json(takenItems);
});

app.post('/cart', (req, res) => {
  const { product } = req.body;
  cart.push(product);
  res.json(cart);
});

app.delete('/cart/:id', (req, res) => {
    const { id } = req.params;

    cart = cart.filter(item => item.id !== parseInt(id));

    takenItems = takenItems.filter(itemId => itemId !== parseInt(id));

    res.json(cart);
});

app.get('/cart', (req, res) => {
  res.json(cart);
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});