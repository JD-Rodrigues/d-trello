

function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential)
  console.log(data)
}
window.onload = function () {
  checkLogin()
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
  const loginScreen = `
      <div  class="login__modal">
      <form  class="login__form">
        <h2 class="login__form__title">Login</h2>
        <div id="buttonLogin"></div>
      </form>
      </div>
    `
  const homepage = `
    <header>
      <input type="search" name="" id="search" oninput=filterCards() />
    </header>
    <div id="dTrello"></div>
    <button id="addNewBoard">Adicionar novo quadro</button>
  `
  const body = document.querySelector('body')
  const credential = localStorage.getItem('credential')
  // localStorage.removeItem('credential')
  // localStorage.setItem('credential', JSON.stringify({user: 'JD'}))

  credential === null ? body.innerHTML = `${loginScreen}` : body.innerHTML = `${homepage}`
}