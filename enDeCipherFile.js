let user = document.getElementById("user");
let logout = document.getElementById("logout");
let userInfo = JSON.parse(window.localStorage.getItem("user"));

console.log(user)
user.innerHTML = userInfo.firstName


logout.addEventListener("click", e => {
    e.preventDefault();
    console.log("click")
    window.localStorage.removeItem("user");
    window.location.replace("LoginPage.html");
    
    
})