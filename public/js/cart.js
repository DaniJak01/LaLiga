document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  const checkoutButton = document.getElementById("checkout");
  const continueShoppingButton = document.getElementById("continue-shopping");

  let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "Tu carrito está vacío.";
      cartItemsContainer.appendChild(emptyMessage);
      totalPriceElement.textContent = "Total: 0,00 €";
      return;
    }

    carrito.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");

      const img = document.createElement("img");
      img.src = item.img;
      img.alt = "Camiseta";
      img.width = 140;

      const detailsDiv = document.createElement("div");

      const talla = document.createElement("p");
      talla.innerHTML = `<strong>Talla:</strong> ${item.size}`;

      const cantidad = document.createElement("p");
      cantidad.innerHTML = `<strong>Cantidad:</strong> ${item.quantity}`;

      const dorsal = document.createElement("p");
      dorsal.innerHTML = item.wantsDorsal
        ? `<strong>Dorsal:</strong> ${item.dorsal_number} - ${item.dorsal_name}`
        : "Sin dorsal";

      const precio = document.createElement("p");
      precio.innerHTML = `<strong>Precio:</strong> ${item.total
        .toFixed(2)
        .replace(".", ",")} €`;

      const eliminarBtn = document.createElement("button");
      eliminarBtn.textContent = "Eliminar";
      eliminarBtn.classList.add("delete-btn");
      eliminarBtn.addEventListener("click", () => {
        window.removedItem = carrito[index];
        carrito.splice(index, 1);
        sessionStorage.setItem("carrito", JSON.stringify(carrito));
        renderCart();
      });

      detailsDiv.appendChild(talla);
      detailsDiv.appendChild(cantidad);
      detailsDiv.appendChild(dorsal);
      detailsDiv.appendChild(precio);
      detailsDiv.appendChild(eliminarBtn);

      itemDiv.appendChild(img);
      itemDiv.appendChild(detailsDiv);
      cartItemsContainer.appendChild(itemDiv);

      total += item.total;
    });

    totalPriceElement.textContent = `Total: ${total
      .toFixed(2)
      .replace(".", ",")} €`;
  }

  renderCart();

  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    ecommerce: {
      currency: "EUR",
      value: carrito.reduce((sum, item) => sum + item.total, 0),
      items: carrito.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price.replace(",", ".")),
        item_category: item.category,
        item_size: item.size,
        team: item.team,
        color: item.color,
        dorsal: item.wantsDorsal ? "Sí" : "No",
        dorsal_name: item.wantsDorsal ? item.dorsal_name : null,
        dorsal_number: item.wantsDorsal ? item.dorsal_number : null,
      })),
    },
  });

  checkoutButton.addEventListener("click", () => {
    if (carrito.length > 0) {
      window.location.href = "purchase.html";
    } else {
      alert("Tu carrito está vacío. No puedes realizar la compra.");
    }
  });

  continueShoppingButton.addEventListener("click", () => {
    window.location.href = "shop.html";
  });
});
