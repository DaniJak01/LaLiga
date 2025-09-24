document.addEventListener("DOMContentLoaded", function () {
  function renderCart() {
    const existingContainer = document.querySelector(".cart-items");
    if (existingContainer) existingContainer.remove();

    let cartItems = JSON.parse(sessionStorage.getItem("carrito")) || [];

    if (cartItems.length === 0) {
      window.location.href = "index.html";
      return;
    }

    let cartItemsContainer = document.createElement("div");
    cartItemsContainer.classList.add("cart-items");

    let total = 0;

    cartItems.forEach((item, index) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item");

      cartItemElement.innerHTML = `
        <img src="${item.img}" alt="Camiseta">
        <div class="cart-item-details">
          <p><strong>Cantidad:</strong> ${item.quantity}</p>
          <p><strong>Talla:</strong> ${item.size}</p>
          <p><strong>Dorsal:</strong> ${
            item.wantsDorsal
              ? `Número: ${item.dorsal_number}, Nombre: ${item.dorsal_name}`
              : "Sin dorsal"
          }</p>
          <p><strong>Total:</strong> ${(item.total.toFixed(2) + " €").replace(
            ".",
            ","
          )}</p>
        </div>
        <button class="delete-btn" onclick="deleteItem(${index})">Eliminar</button>
      `;

      cartItemsContainer.appendChild(cartItemElement);
      total += item.total;
    });

    document.querySelector(".item-details").appendChild(cartItemsContainer);
    document.getElementById("total-pay").textContent = (
      total.toFixed(2) + " €"
    ).replace(".", ",");

    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      ecommerce: {
        currency: "EUR",
        value: total,
        items: cartItems.map((item) => ({
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
  }

  renderCart();

  window.deleteItem = function (index) {
    let cartItems = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const removedItem = cartItems[index];
    window.removedItem = removedItem;

    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      ecommerce: {
        currency: "EUR",
        value:
          parseFloat(removedItem.price.replace(",", ".")) *
          removedItem.quantity,
        items: [
          {
            item_id: removedItem.id,
            item_name: removedItem.name,
            quantity: removedItem.quantity,
            price: parseFloat(removedItem.price.replace(",", ".")),
            item_category: removedItem.category,
            item_size: removedItem.size,
            team: removedItem.team,
            color: removedItem.color,
            dorsal: removedItem.wantsDorsal ? "Sí" : "No",
            dorsal_name: removedItem.wantsDorsal
              ? removedItem.dorsal_name
              : null,
            dorsal_number: removedItem.wantsDorsal
              ? removedItem.dorsal_number
              : null,
          },
        ],
      },
    });

    cartItems.splice(index, 1);
    sessionStorage.setItem("carrito", JSON.stringify(cartItems));
    renderCart();
  };

  const stepShipping = document.getElementById("step-shipping");
  const stepPayment = document.getElementById("step-payment");
  const stepConfirm = document.getElementById("step-confirm");

  const step1Indicator = document.getElementById("step-indicator-shipping");
  const step2Indicator = document.getElementById("step-indicator-payment");
  const step3Indicator = document.getElementById("step-indicator-confirm");

  const nextToPaymentBtn = document.getElementById("next-to-payment");
  nextToPaymentBtn.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const province = document.getElementById("province").value;
    const promoCode = document.getElementById("promo-code").value || "";

    window.shippingAddress = address;

    if (!name || !lastName || !address || !email || !province) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    sessionStorage.setItem("name", name);
    sessionStorage.setItem("lastName", lastName);
    sessionStorage.setItem("address", address);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("phone", phone);
    sessionStorage.setItem("province", province);
    sessionStorage.setItem("promoCode", promoCode);

    stepShipping.style.display = "none";
    stepPayment.style.display = "flex";
    step1Indicator.classList.remove("active");
    step2Indicator.classList.add("active");
  });

  const backToShippingBtn = document.getElementById("back-to-shipping");
  backToShippingBtn.addEventListener("click", () => {
    stepPayment.style.display = "none";
    stepShipping.style.display = "flex";
    step2Indicator.classList.remove("active");
    step1Indicator.classList.add("active");
  });

  const goToConfirmBtn = document.getElementById("go-to-confirm");
  goToConfirmBtn.addEventListener("click", () => {
    const paymentSelect = document.getElementById("payment-method");
    const paymentMethod =
      paymentSelect.options[paymentSelect.selectedIndex].text;

    window.paymentMethod = paymentMethod;

    stepPayment.style.display = "none";
    stepConfirm.style.display = "flex";
    step2Indicator.classList.remove("active");
    step3Indicator.classList.add("active");
  });

  const backToPaymentBtn = document.getElementById("back-to-payment");
  backToPaymentBtn.addEventListener("click", () => {
    stepConfirm.style.display = "none";
    stepPayment.style.display = "flex";
    step3Indicator.classList.remove("active");
    step2Indicator.classList.add("active");
  });

  const confirmBtn = document.getElementById("confirm-purchase");
  confirmBtn.addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const lastName = document.getElementById("last-name").value;
    const address = document.getElementById("address").value;
    const paymentSelect = document.getElementById("payment-method");
    const paymentMethod =
      paymentSelect.options[paymentSelect.selectedIndex].text;
    const promoCode = document.getElementById("promo-code")?.value || "";

    const totalValue = parseFloat(
      document
        .getElementById("total-pay")
        .textContent.replace("€", "")
        .replace(",", ".")
    );

    const transactionId = "ORD" + Math.floor(Math.random() * 999999);

    const cartItems = JSON.parse(sessionStorage.getItem("carrito")) || [];

    dataLayer.push({
      ecommerce: {
        transaction_id: transactionId,
        currency: "EUR",
        value: totalValue,
        items: cartItems.map((item) => ({
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

    const resumenPedido = {
      name,
      lastName,
      address,
      email,
      phone,
      province,
      paymentMethod,
      totalValue,
      items: cartItems,
      transactionId,
      promoCode,
    };

    sessionStorage.setItem("resumenPedido", JSON.stringify(resumenPedido));
    setTimeout(() => {
      window.location.href = "thank-you.html";
    }, 300);
  });
});
