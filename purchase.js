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

    // Inicial push de ecommerce sin evento
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

    // Adobe Analytics: pageView
    var s = s_gi("ageo1xxlonprueba");
    s.pageName = "Tienda: Checkout";
    s.channel = "Ecommerce";
    s.events = "";
    s.t();
  } else {
    window.location.href = "index.html";
  }

  // Eliminar producto del carrito
  window.deleteItem = function (index) {
    const removedItem = cartItems[index];

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

    // Adobe Analytics: remove_from_cart
    var s = s_gi("ageo1xxlonprueba");
    s.linkTrackVars = "products,events,eVar7,eVar8,eVar9,eVar10,eVar11,eVar12";
    s.linkTrackEvents = "scRemove";
    s.events = "scRemove";
    s.products = `${removedItem.category};${removedItem.name};${
      removedItem.quantity
    };${parseFloat(removedItem.price.replace(",", "."))};;eVar7=${
      removedItem.size
    }|eVar8=${removedItem.team}|eVar9=${removedItem.color.join("-")}|eVar10=${
      removedItem.wantsDorsal ? "Sí" : "No"
    }|eVar11=${removedItem.wantsDorsal ? removedItem.dorsal_name : ""}|eVar12=${
      removedItem.wantsDorsal ? removedItem.dorsal_number : ""
    }`;
    s.tl(true, "o", "remove_from_cart");

    setTimeout(() => {
      cartItems.splice(index, 1);
      sessionStorage.setItem("carrito", JSON.stringify(cartItems));
      location.reload();
    }, 300);
  };

  // Pasos
  const stepShipping = document.getElementById("step-shipping");
  const stepPayment = document.getElementById("step-payment");
  const stepConfirm = document.getElementById("step-confirm");

  const step1Indicator = document.getElementById("step-indicator-shipping");
  const step2Indicator = document.getElementById("step-indicator-payment");
  const step3Indicator = document.getElementById("step-indicator-confirm");

  // Paso 1 -> 2
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
    s.linkTrackVars = "events,eVar4";
    s.linkTrackEvents = "event7";
    s.events = "event7";
    s.eVar4 = "Dirección: " + address;
    s.tl(true, "o", "add_shipping_info");

    stepShipping.style.display = "none";
    stepPayment.style.display = "flex";
    step1Indicator.classList.remove("active");
    step2Indicator.classList.add("active");
  });

  // Botón volver <- Paso 2 a Paso 1
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

    // Adobe Analytics: add_payment_info
    var s = s_gi("ageo1xxlonprueba");
    s.linkTrackVars = "events,eVar5";
    s.linkTrackEvents = "event8";
    s.events = "event8";
    s.eVar5 = paymentMethod;
    s.tl(true, "o", "add_payment_info");

    stepPayment.style.display = "none";
    stepConfirm.style.display = "flex";
    step2Indicator.classList.remove("active");
    step3Indicator.classList.add("active");
  });

  // Botón volver de confirmación <- paso 2
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

    const transactionId = "ORD" + Math.floor(Math.random() * 999999);

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

    // Adobe Analytics: purchase
    var s = s_gi("ageo1xxlonprueba");

    s.events = "purchase";
    s.purchaseID = transactionId;
    s.eVar6 = paymentMethod;
    s.products = cartItems
      .map(
        (item) =>
          `${item.category};${item.name};${item.quantity};${parseFloat(
            item.price.replace(",", ".")
          )};;eVar7=${item.size}|eVar8=${item.team}|eVar9=${item.color.join(
            "-"
          )}|eVar10=${item.wantsDorsal ? "Sí" : "No"}|eVar11=${
            item.wantsDorsal ? item.dorsal_name : ""
          }|eVar12=${item.wantsDorsal ? item.dorsal_number : ""}`
      )
      .join(",");
    s.currencyCode = "EUR";
    s.t();

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
    setTimeout(() => {
      window.location.href = "thank-you.html";
    }, 300);
  });
});
