//getting all the elements needed from the HTML 
const fn = document.getElementById("fn");
const ln = document.getElementById("ln");
const un = document.getElementById("un");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("btn");
//getting the error elements needed from the HTML 
let fnError = document.getElementById("first-name-error");
let lnError = document.getElementById("last-name-error");
let unError = document.getElementById("user-name-error");
let emailError = document.getElementById("email-error");
let passwordError = document.getElementById("password-error");
//adding an event listener to the button, which will execute when it is clicked
btn.addEventListener("click", async (e) => {
  e.preventDefault();
  let fnValue = fn.value;
  let lnValue = ln.value;
  let unValue = un.value;
  let emailValue = email.value;
  let passwordValue = password.value;
//creating a user object with the values obtained from the input fields
  let user = {
    firstName: fnValue,
    lastName: lnValue,
    userName: unValue,
    email: emailValue,
    password: passwordValue
  }

  //sending a POST request to the server with the user object as the request body
  const response = await fetch("https://endecipherapi.onrender.com/signup", {
    method: "POST",
     headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
  const userRes = await response.json()
  console.log(userRes)
  //checking the response from the server
  if(userRes.status === "ok"){
    // If the status is ok, we are alerting the user that a new user has been signed up successfully
    alert("signup a new user");
    window.location.href = "EnDeCipherFile.html";
    window.localStorage.setItem("user", JSON.stringify(userRes.user))
  }else {
    // If there was an error, we are displaying the appropriate error message on the webpage
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

