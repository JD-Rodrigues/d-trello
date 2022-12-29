


function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential)
  console.log(data)
  localStorage.setItem('authenticated', 'true')
  checkLogin()
}
window.onload = () => checkLogin();

const showHome = () => {
  const body = document.querySelector('body')
  const homepage = `
    <header>
      <input type="search" name="" id="search" oninput=filterCards() />
      <button id="logout" onclick="logout()">Logout</button>
    </header>
    <div id="dTrello"></div>
    <button id="addNewBoard">Adicionar novo quadro</button>
  `
  body.innerHTML = `${homepage}`

}

const showLoginScreen = () => {
  const body = document.querySelector('body')
  body.innerHTML = `
  <div  class="login__modal">
  <form  class="login__form">
    <h2 class="login__form__title">Login</h2>
    <div id="buttonLogin"></div>
  </form>
  </div>
`

  google.accounts.id.initialize({
    client_id: "441397660499-jckg2d72sbhi88882vjh8v9n9djhjmg0.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById("buttonLogin"),
    { theme: "outline", size: "large", shape: "pill" }  // customization attributes
  );
  google.accounts.id.prompt(); // also display the One Tap dialog
}

const checkLogin = () => {
  const authenticated = localStorage.getItem('authenticated')  
  authenticated === null ? showLoginScreen() : showHome()
}

const logout = () => {
  localStorage.removeItem('authenticated')
  checkLogin()
}