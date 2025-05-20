document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("productId");

  let product = null;
  let carrito = [];
  const quantityInput = document.getElementById("quantity");
  const cartButton = document.getElementById("cart");
  const buyButton = document.getElementById("checkout");
  const form = document.getElementById("order-form");

  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      product = products.find((p) => p.id === productId);

      if (product) {
        document.getElementById("product-name").textContent = product.name;
        document.getElementById("productImg").src = product.img;
        document.getElementById(
          "productImg"
        ).alt = `Camiseta de ${product.name}`;
        document.getElementById(
          "product-price"
        ).textContent = `${product.price}€`;

        var s = s_gi("ageo1xxlonprueba");
        s.pageName = "Página del producto";
        s.channel = "Ecommerce";
        s.t();

        // Mostrar u ocultar campos de dorsal
        const customizationOptions = document.getElementById(
          "customization-options"
        );
        customizationOptions.style.display = product.customizable
          ? "block"
          : "none";
      } else {
        document.getElementById("product-name").textContent =
          "Producto no encontrado";
        document.getElementById("productImg").alt = "Camiseta no disponible";
      }
    })
    .catch((error) => {
      console.error("Error cargando el producto:", error);
    });

  // Controles de cantidad
  document.getElementById("increase").addEventListener("click", () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  });

  document.getElementById("decrease").addEventListener("click", () => {
    const value = parseInt(quantityInput.value);
    if (value > 1) quantityInput.value = value - 1;
  });

  // Mostrar campos de dorsal si se selecciona
  const dorsalFields = document.getElementById("dorsal-fields");
  document.querySelectorAll("input[name='dorsalOption']").forEach((radio) => {
    radio.addEventListener("change", () => {
      dorsalFields.style.display = radio.value === "yes" ? "block" : "none";
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!product) {
      alert("El producto no se ha cargado correctamente.");
      return;
    }

    const quantity = parseInt(document.getElementById("quantity").value);
    const size = document.getElementById("size").value;
    const wantsDorsal =
      document.querySelector("input[name='dorsalOption']:checked").value ===
      "yes";
    const dorsal_number = document.getElementById("dorsal-number").value;
    const dorsal_name = document.getElementById("dorsal-name").value;

    const orderDetails = {
      ...product,
      quantity,
      size,
      wantsDorsal,
      dorsal_number: wantsDorsal ? dorsal_number : null,
      dorsal_name: wantsDorsal ? dorsal_name : null,
      total: parseFloat(product.price.replace(",", ".")) * quantity,
    };

    // Guardar en carrito (sessionStorage)
    if (sessionStorage.getItem("carrito")) {
      carrito = JSON.parse(sessionStorage.getItem("carrito"));
    }
    carrito.push(orderDetails);
    sessionStorage.setItem("carrito", JSON.stringify(carrito));

    // Feedback al usuario
    let resumen = `Producto añadido:\n- Cantidad: ${quantity}\n- Talla: ${size}`;
    resumen += wantsDorsal
      ? `\n- Dorsal: ${dorsal_number} - ${dorsal_name}`
      : `\n- Sin dorsal`;

    if (e.submitter === cartButton) {
      // Adobe Analytics: add_to_cart
      var s = s_gi("ageo1xxlonprueba");
      s.linkTrackVars =
        "products,events,eVar3,eVar13,eVar7,eVar8,eVar9,eVar10,eVar11,eVar16";
      s.linkTrackEvents = "scAdd";
      s.events = "scAdd";
      s.products = `;${product.id};${quantity};${parseFloat(
        product.price.replace(",", ".")
      )};evar13=${product.name}|eVar3=${product.category}|eVar7=${size}|eVar8=${
        product.team
      }|eVar9=${product.color}|eVar10=${
        wantsDorsal ? "Sí" : "No"
      }|eVar11=${dorsal_name}|eVar16=${dorsal_number}`;
      s.tl(true, "o", "add_to_cart");
      alert(`El producto ha sido añadido al carrito.\n\n${resumen}`);
    } else if (e.submitter === buyButton) {
      // Adobe Analytics: begin_checkout
      var s = s_gi("ageo1xxlonprueba");
      s.linkTrackVars =
        "products,events,eVar3,eVar13,eVar7,eVar8,eVar9,eVar10,eVar11,eVar16";
      s.linkTrackEvents = "scCheckout";
      s.events = "scCheckout";
      s.products = `;${product.id};${product.quantity};${parseFloat(
        product.price.replace(",", ".")
      )};evar13=${product.name}|eVar3=${product.category}|eVar7=${size}|eVar8=${
        product.team
      }|eVar9=${product.color}|eVar10=${
        wantsDorsal ? "Sí" : "No"
      }|eVar11=${dorsal_name}|eVar16=${dorsal_number}`;
      s.tl(true, "o", "begin_checkout");

      window.location.href = "purchase.html";
    }
  });
});
