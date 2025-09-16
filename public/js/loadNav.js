fetch("./nav.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("nav").innerHTML = data;

    // Después de cargar el header, ejecutamos la lógica de sesión
    const user = sessionStorage.getItem("currentUser");
    if (user) {
      const parsed = JSON.parse(user);

      const userTextEl = document.getElementById("userText");
      if (userTextEl) userTextEl.textContent = parsed.nombre;

      const userLink = document.querySelector("#userNav a.login-link");
      if (userLink) userLink.href = "profile.html";
    }
  })
  .catch((err) => console.error("No se pudo cargar el header:", err));
