// cart.js

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = cart.reduce((sum, item) => sum + item.price, 0);

// Formata o valor em reais (BRL)
const formatarPreco = (valor) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

// Atualiza a exibição do carrinho
function updateCart() {
  const cartList = document.getElementById("cart-list");
  const totalElement = document.getElementById("total");
  const messageElement = document.getElementById("cart-message");
  if (!cartList || !totalElement) return;

  cartList.innerHTML = "";
  
  // Prepara a mensagem do carrinho
  let mensagem = "";
  if (cart.length > 0) {
    mensagem = "Itens selecionados:\n";
    cart.forEach(item => {
      mensagem += `${item.name} - ${formatarPreco(item.price)}\n`;
    });
    mensagem += `\nTotal: ${formatarPreco(total)}`;
  } else {
    mensagem = "Nenhum item selecionado";
  }
  
  // Atualiza a mensagem se o elemento existir
  if (messageElement) {
    messageElement.textContent = mensagem;
  }

  if (cart.length === 0) {
    cartList.innerHTML = "<li>Seu carrinho está vazio.</li>";
  } else {
    cart.forEach((item, index) => {
      let li = document.createElement("li");
      li.textContent = `${item.name} - ${formatarPreco(item.price)} `;
      let btn = document.createElement("button");
      btn.textContent = "X";
      btn.setAttribute("aria-label", `Remover ${item.name} do carrinho`);
      btn.style.border = "2px solid red";
      btn.style.borderRadius = "50%";
      btn.style.color = "red";
      btn.style.background = "white";
      btn.style.width = "24px";
      btn.style.height = "24px";
      btn.style.fontWeight = "bold";
      btn.style.cursor = "pointer";
      btn.onclick = () => removeFromCart(index);
      li.appendChild(btn);
      cartList.appendChild(li);
    });
  }

  total = cart.reduce((sum, item) => sum + item.price, 0);
  totalElement.textContent = formatarPreco(total);
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Adiciona item ao carrinho
function addToCart(name, price) {
  if (typeof price !== "number" || isNaN(price)) return;
  cart.push({ name, price });
  total += price;
  updateCart();
}

// Remove item do carrinho
function removeFromCart(index) {
  total -= cart[index].price;
  cart.splice(index, 1);
  updateCart();
}

// Inicializa ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  updateCart();

  // Busca de itens: suporta input, botão e tecla Enter
  const searchInput = document.getElementById("search") || document.querySelector('.search');
  const searchButton = document.getElementById("search-button");

  function performSearch(term) {
    const q = (term || "").toLowerCase();
    // seleciona elementos que podem conter os itens (classes inconsistentes no HTML)
    const nodes = document.querySelectorAll('.item');
    nodes.forEach((item) => {
      const name = (item.dataset.name || "").toLowerCase();
      const desc = (item.textContent || "").toLowerCase();
      const matches = name.includes(q) || desc.includes(q);
      item.style.display = matches ? "block" : "none";
    });
  }

  if (searchInput) {
    // pesquisa enquanto digita
    searchInput.addEventListener('input', (e) => performSearch(e.target.value));
    // também permite buscar ao pressionar Enter
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(searchInput.value);
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener('click', () => performSearch(searchInput ? searchInput.value : ''));
  }

  // Event delegation para os botões de adicionar: usa data-attributes definidos no HTML
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.add-button');
    if (!btn) return;
    const name = btn.dataset.name || btn.getAttribute('data-name');
    const priceRaw = btn.dataset.price || btn.getAttribute('data-price');
    const price = Number(priceRaw);
    if (!name || isNaN(price)) return;
    addToCart(name, price);
  });
});
