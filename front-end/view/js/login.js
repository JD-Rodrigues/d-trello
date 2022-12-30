
// window.onload = () => checkLogin();

const checkUser = async (userCode) => {
  const user = await readData('users', userCode)
  return user[0]
}

async function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential)
  console.log(data)
  this.setUser = async () => {
    const userInDatabase = await checkUser(data.sub)
    if(userInDatabase !== undefined) {
      localStorage.setItem('credential', JSON.stringify(userInDatabase))
      checkLogin()
    } else {
      await createData('users', {name: data.name, email:data.email, user_code: data.sub, picture: data.picture})
      await createData('boards', {title: 'A fazer<i class="ph-pencil-fill">', board_order: 1, class: 'info, good', user_code:data.sub})
      await createData('boards', {title: 'Fazendo<i class="ph-pencil-fill">', board_order: 2, class: 'warning', user_code:data.sub})
      await createData('boards', {title: 'Feito<i class="ph-pencil-fill">', board_order: 3, class: 'success', user_code:data.sub})
      await this.setUser()
    }
  }

  this.setUser()
  
  
  
  // console.log(userInDatabase)
}

const showHome = async () => {
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
  
  await getData()

  var addBoard = document.getElementById("addNewBoard");
  addBoard.addEventListener("click", nameNewBoard);
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
  const credential = localStorage.getItem('credential')  
  credential === null ? showLoginScreen() : showHome()
}

const logout = () => {
  localStorage.removeItem('credential')
  checkLogin()
}

