// Get the email input field and password input field elements from the HTML document
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

// Get the login button element from the HTML document
const loginBtn = document.getElementById("login-submit");

// Get the error message elements for username and password fields from the HTML document
let userNameError = document.getElementById("user-name-error");
let passwordError = document.getElementById("password-error");

// Add an event listener to the login button element that listens for a click
loginBtn.addEventListener("click", async (e) => {
  // Prevent the default behavior of the click event (submitting a form)
  e.preventDefault();

  // Get the values entered in the email and password input fields
  let emailValue = loginEmail.value;
  let passwordValue = loginPassword.value;

  // Create an object with the email and password values
  let user = {
    userName : emailValue,
    password: passwordValue
  }

  // Send a POST request to the specified endpoint with the user object as the request body
  const response = await fetch("https://endecipherapi.onrender.com/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })

  // Wait for the response from the server and parse the response body as JSON
  const userRes = await response.json();

  // If the server response status is "ok", log the user object to the console, alert the user that they have logged in, redirect them to another page, and save the user object to local storage
  if(userRes.status === "ok"){
    console.log(userRes.user)
    alert("login successfully");
    window.location.href = "EnDeCipherFile.html"
    window.localStorage.setItem("user", JSON.stringify(userRes.user))

  // If the server response status is not "ok", check the error message in the response and display the appropriate error message on the page
  }else{
    // If the error message is "invalid password", display an error message for the password field and hide the error message for the username field
    if(userRes.error === "invalid password"){
      passwordError.innerHTML = userRes.error
      passwordError.style.display = "block"
      userNameError.style.display = "none"

    // If the error message is "this userName does not exist, Please Signup.", display an error message for the username field and hide the error message for the password field
    }else if(userRes.error === "this userName does not exist, Please Signup."){
      userNameError.innerHTML = userRes.error
      userNameError.style.display = "block"
      passwordError.style.display = "none"
    }
  }
})
