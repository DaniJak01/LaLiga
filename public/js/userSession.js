const currentUser = sessionStorage.getItem("currentUser");

// Función que valida si hay usuario logueado
function checkAuth() {
  if (!currentUser) {
    // Reemplazamos todo el <main> por un aviso de login
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `
        <p>Debes <a href="login.html">iniciar sesión</a> para ver los videos, noticias y comentarios de la jornada.</p>
      `;
    }
    return false;
  }
  return true;
}

// Mostrar nombre del usuario en la nav si está logueado
if (currentUser) {
  const parsed = JSON.parse(currentUser);
  const userText = document.getElementById("userText");
  const loginLink = document.querySelector(".nav-side-left a.login-link");

  if (userText) userText.textContent = parsed.nombre;
  if (loginLink) loginLink.href = "profile.html";
}
