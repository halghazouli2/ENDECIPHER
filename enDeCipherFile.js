let user = document.getElementById("user");
let userInfo = JSON.parse(window.localStorage.getItem("user"));

user.innerHTML = userInfo.firstName