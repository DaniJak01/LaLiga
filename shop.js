document.addEventListener("DOMContentLoaded", function () {
  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      showProducts(products);

      // dataLayer push único con todos los productos visibles inicialmente
      window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        ecommerce: {
          items: products.map((product) => ({
            item_id: product.id,
            item_name: product.name,
            price: parseFloat(product.price.replace(",", ".")),
            team: product.team,
            item_category: product.category,
            color: product.color,
          })),
        },
      });

      populateSelect(
        "team-filter",
        getUniqueValues(products, "team"),
        "Todos los equipos"
      );
      populateSelect(
        "type-filter",
        getUniqueValues(products, "category"),
        "Todos los tipos"
      );
      populateSelect(
        "color-filter",
        getUniqueValues(products, "color"),
        "Todos los colores"
      );

      function applyFilters(type, team, color) {
        const filteredProducts = products.filter((product) => {
          const matchesType = type === "all" || product.category === type;
          const matchesTeam = team === "all" || product.team === team;
          const matchesColor =
            color === "all" ||
            (Array.isArray(product.color) && product.color.includes(color));
          return matchesType && matchesTeam && matchesColor;
        });

        showProducts(filteredProducts);

        // Nueva lista tras filtro → actualizar en dataLayer
        dataLayer.push({
          ecommerce: {
            items: filteredProducts.map((product) => ({
              item_id: product.id,
              item_name: product.name,
              price: parseFloat(product.price.replace(",", ".")),
              team: product.team,
              item_category: product.category,
              color: product.color,
            })),
          },
        });
      }

      ["#type-filter", "#team-filter", "#color-filter"].forEach((selector) => {
        document.querySelector(selector).addEventListener("change", () => {
          const type = document.querySelector("#type-filter").value;
          const team = document.querySelector("#team-filter").value;
          const color = document.querySelector("#color-filter").value;
          applyFilters(type, team, color);
        });
      });
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
    });
});

function showProducts(products) {
  const container = document.querySelector(".products");
  container.innerHTML = "";

  products.forEach((product) => {
    const productHTML = `
            <div class="product-card">
                <div class="product-preview">
                    <a href="product.html?productId=${product.id}" onclick="trackSelectItem('${product.id}', '${product.name}', '${product.price}', '${product.team}', '${product.category}', '${product.color}')">
                        <img src="${product.img}" alt="${product.name}" class="product-image">
                    </a>
                </div>
                <div class="product-info">
                    <p>${product.name}</p>
                    <p>${product.price} €</p>
                </div>
            </div>
        `;
    container.innerHTML += productHTML;
  });
}

function getUniqueValues(products, key) {
  const values = new Set();
  products.forEach((product) => {
    if (Array.isArray(product[key])) {
      product[key].forEach((val) => values.add(val));
    } else {
      values.add(product[key]);
    }
  });
  return Array.from(values).sort();
}

function populateSelect(selectId, values, defaultLabel) {
  const select = document.getElementById(selectId);
  select.innerHTML = `<option value="all">${defaultLabel}</option>`;
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function trackSelectItem(
  productId,
  productName,
  productPrice,
  productTeam,
  productCategory,
  productColor
) {
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    ecommerce: {
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: parseFloat(productPrice.replace(",", ".")),
          team: productTeam,
          item_category: productCategory,
          color: productColor,
        },
      ],
    },
  });

  var s = s_gi("ageo1xxlonprueba");
  s.events = "prodView";
  s.products = `;${productId};;;eVar3=${productCategory}|eVar8=${productTeam}|eVar9=${productColor}|eVar13=${productName}`;
  s.linkTrackVars = "events,products";
  s.linkTrackEvents = "prodView";
  s.tl(true, "o", "select_item");
}
