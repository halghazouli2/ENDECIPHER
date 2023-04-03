const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-submit");
let userNameError = document.getElementById("user-name-error");
let passwordError = document.getElementById("password-error");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let emailValue = loginEmail.value;
  let passwordValue = loginPassword.value;
  
  let user = {
    userName : emailValue,
    password: passwordValue
  }

  const response = await fetch("https://endecipherapi.onrender.com/login", {
    method: "POST",
     headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
  const userRes = await response.json();
  if(userRes.status === "ok"){
    console.log(userRes.user)

    alert("login successfully");
    window.location.href = "EnDeCipherFile.html"
    window.localStorage.setItem("user", JSON.stringify(userRes.user))

  }else{

    if(userRes.error === "invalid password"){
      passwordError.innerHTML = userRes.error
      passwordError.style.display = "block"
      userNameError.style.display = "none"

    }else if(userRes.error === "this userName does not exist, Please Signup."){

      userNameError.innerHTML = userRes.error
      userNameError.style.display = "block"
      passwordError.style.display = "none"

    }

  }


})