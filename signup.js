const fn = document.getElementById("fn");
const ln = document.getElementById("ln");
const un = document.getElementById("un");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("btn");
let fnError = document.getElementById("first-name-error");
let lnError = document.getElementById("last-name-error");
let unError = document.getElementById("user-name-error");
let emailError = document.getElementById("email-error");
let passwordError = document.getElementById("password-error");

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  let fnValue = fn.value;
  let lnValue = ln.value;
  let unValue = un.value;
  let emailValue = email.value;
  let passwordValue = password.value;

  let user = {
    firstName: fnValue,
    lastName: lnValue,
    userName: unValue,
    email: emailValue,
    password: passwordValue
  }

  const response = await fetch("https://endecipherapi.onrender.com/signup", {
    method: "POST",
     headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
  const userRes = await response.json()
  console.log(userRes)
  if(userRes.status === "ok"){
    alert("signup a new user");
    window.location.href = "EnDeCipherFile.html";
    window.localStorage.setItem("user", JSON.stringify(userRes.user))
  }else {
    if(userRes.error.email !== ""){
      emailError.innerHTML = userRes.error.email;
      emailError.style.display = "block";
      lnError.style.display = "none";
      fnError.style.display = "none";
      unError.style.display = "none";
      passwordError.style.display = "none";

    }else if(userRes.error.userName !== ""){
      unError.innerHTML = userRes.error.userName;
      unError.style.display = "block";
      lnError.style.display = "none";
      fnError.style.display = "none";
      emailError.style.display = "none";
      passwordError.style.display = "none";

    }else if(userRes.error.password !== ""){
      passwordError.innerHTML = userRes.error.password;
      passwordError.style.display = "block";
      lnError.style.display = "none";
      fnError.style.display = "none";
      unError.style.display = "none";
      emailError.style.display = "none";

    }else if(userRes.error.firstName !== ""){
      fnError.innerHTML = userRes.error.firstName;
      fnError.style.display = "block";
      lnError.style.display = "none";
      emailError.style.display = "none";
      unError.style.display = "none";
      passwordError.style.display = "none";
      
    }else if(userRes.error.lastName !== ""){
      lnError.innerHTML = userRes.error.lastName;
      lnError.style.display = "block";
      emailError.style.display = "none";
      fnError.style.display = "none";
      unError.style.display = "none";
      passwordError.style.display = "none";

    }
  }
})

