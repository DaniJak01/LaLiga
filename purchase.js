document.addEventListener("DOMContentLoaded", function () {
  let cartItems = JSON.parse(sessionStorage.getItem("carrito"));

  if (cartItems && cartItems.length > 0) {
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
              ? `Número: ${item.number}, Nombre: ${item.name}`
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

    // Adobe Analytics: pageView
    var s = s_gi("ageo1xxlonprueba");
    s.pageName = "Página de compra";
    s.channel = "Ecommerce";
    s.events = "";
    s.t();
  } else {
    window.location.href = "index.html";
  }

  // Eliminar producto del carrito
  window.deleteItem = function (index) {
    const removedItem = cartItems[index];

    // Adobe Analytics: remove_from_cart
    var s = s_gi("ageo1xxlonprueba");
    s.events = "scRemove";
    s.products = `;${removedItem.id};${removedItem.quantity};${parseFloat(
      removedItem.price.replace(",", ".")
    )}`;
    s.linkTrackVars = "events,products";
    s.linkTrackEvents = "scRemove";
    s.tl(true, "o", "remove_from_cart");

    cartItems.splice(index, 1);
    sessionStorage.setItem("carrito", JSON.stringify(cartItems));
    location.reload();
  };

  // Pasos
  const stepShipping = document.getElementById("step-shipping");
  const stepPayment = document.getElementById("step-payment");
  const stepConfirm = document.getElementById("step-confirm");

  const step1Indicator = document.getElementById("step-indicator-shipping");
  const step2Indicator = document.getElementById("step-indicator-payment");
  const step3Indicator = document.getElementById("step-indicator-confirm");

  // Paso 1 → 2
  const nextToPaymentBtn = document.getElementById("next-to-payment");
  nextToPaymentBtn.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!name || !lastName || !address) {
      alert("Por favor, completa todos los campos de envío.");
      return;
    }

    // Adobe Analytics: add_shipping_info
    var s = s_gi("ageo1xxlonprueba");
    s.events = "scCheckout";
    s.eVar4 = "Dirección: " + address;
    s.linkTrackVars = "events,eVar4";
    s.linkTrackEvents = "scCheckout";
    s.tl(true, "o", "add_shipping_info");

    stepShipping.style.display = "none";
    stepPayment.style.display = "flex";
    step1Indicator.classList.remove("active");
    step2Indicator.classList.add("active");
  });

  // Botón volver ← Paso 2 a Paso 1
  const backToShippingBtn = document.getElementById("back-to-shipping");
  backToShippingBtn.addEventListener("click", () => {
    stepPayment.style.display = "none";
    stepShipping.style.display = "flex";
    step2Indicator.classList.remove("active");
    step1Indicator.classList.add("active");
  });

  const goToConfirmBtn = document.getElementById("go-to-confirm");
  goToConfirmBtn.addEventListener("click", () => {
    const paymentMethod = document.getElementById("payment-method").value;

    // Adobe Analytics: add_payment_info
    var s = s_gi("ageo1xxlonprueba");
    s.events = "scCheckout";
    s.eVar5 = paymentMethod;
    s.linkTrackVars = "events,eVar5";
    s.linkTrackEvents = "scCheckout";
    s.tl(true, "o", "add_payment_info");

    stepPayment.style.display = "none";
    stepConfirm.style.display = "flex";
    step2Indicator.classList.remove("active");
    step3Indicator.classList.add("active");
  });

  // Botón volver de confirmación ← paso 2
  const backToPaymentBtn = document.getElementById("back-to-payment");
  backToPaymentBtn.addEventListener("click", () => {
    stepConfirm.style.display = "none";
    stepPayment.style.display = "flex";
    step3Indicator.classList.remove("active");
    step2Indicator.classList.add("active");
  });

  // Finalizar compra (Paso 3)
  const confirmBtn = document.getElementById("confirm-purchase");
  confirmBtn.addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const lastName = document.getElementById("last-name").value;
    const address = document.getElementById("address").value;
    const paymentSelect = document.getElementById("payment-method");
    const paymentMethod =
      paymentSelect.options[paymentSelect.selectedIndex].text;

    const totalValue = parseFloat(
      document
        .getElementById("total-pay")
        .textContent.replace("€", "")
        .replace(",", ".")
    );

    const transactionId = "ORD-" + Math.floor(Math.random() * 999999);

    // Adobe Analytics: purchase
    var s = s_gi("ageo1xxlonprueba");
    s.linkTrackVars =
      "events,purchaseID,products,eVar13,eVar3,eVar7,eVar8,eVar9,eVar10,eVar11,eVar16,revenue,currencyCode";
    s.linkTrackEvents = "purchase";
    s.events = "purchase";
    s.purchaseID = transactionId;
    s.eVar6 = paymentMethod;
    s.products = cartItems
      .map(
        (item) =>
          `;${item.id};${item.quantity};${parseFloat(
            item.price.replace(",", ".")
          )};evar13=${item.name}|eVar3=${item.category}|eVar7=${
            item.size
          }|eVar8=${item.team}|eVar9=${item.color}|eVar10=${
            item.wantsDorsal ? "Sí" : "No"
          }|eVar11=${item.dorsal_name}|eVar16=${item.dorsal_number}`
      )
      .join(",");
    s.tl(true, "o", "purchase");
    s.revenue = totalValue.toFixed(2);
    s.currencyCode = "EUR";

    const resumenPedido = {
      name,
      lastName,
      address,
      paymentMethod,
      totalValue,
      items: cartItems,
      transactionId,
    };

    sessionStorage.setItem("resumenPedido", JSON.stringify(resumenPedido));
    sessionStorage.removeItem("carrito");
    window.location.href = "thank-you.html";
  });
});
