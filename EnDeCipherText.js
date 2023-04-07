const alphabet = "abcdefghijklmnopqrstuvwxyz";
const alphabetLength = alphabet.length;

const textInput = document.getElementById("text");
const passwordInput = document.getElementById("password");
const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const encryptedOutput = document.getElementById("encrypted");
const decryptedOutput = document.getElementById("decrypted");

let ciphertextBytes, iv;

async function encrypt() {
  const plaintext = textInput.value;
  const password = passwordInput.value;
  if (password.length < 16) {
    alert("Password should be at least 16 characters long!");
    return;
  }

  const plaintextBytes = new TextEncoder().encode(plaintext);
  const passwordBytes = new TextEncoder().encode(password);

  const key = await crypto.subtle.importKey("raw", passwordBytes, "PBKDF2", false, ["deriveKey"]);
  const derivedKey = await crypto.subtle.deriveKey({
    name: "PBKDF2",
    salt: passwordBytes,
    iterations: 100000,
    hash: "SHA-256"
  }, key, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);

  iv = crypto.getRandomValues(new Uint8Array(12));

  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, derivedKey, plaintextBytes);

  ciphertextBytes = new Uint8Array(ciphertext);
  const ciphertextHex = Array.from(ciphertextBytes).map(b => b.toString(16).padStart(2, "0")).join("");

  encryptedOutput.value = ciphertextHex;
}

async function decrypt() {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(passwordInput.value), "PBKDF2", false, ["deriveKey"]);
  const derivedKey = await crypto.subtle.deriveKey({
    name: "PBKDF2",
    salt: new TextEncoder().encode(passwordInput.value),
    iterations: 100000,
    hash: "SHA-256"
  }, key, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);

  const decryptedBytes = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, derivedKey, ciphertextBytes);
  const decryptedPlaintext = new TextDecoder().decode(decryptedBytes);

  decryptedOutput.value = decryptedPlaintext;
}

encryptBtn.addEventListener("click", encrypt);
decryptBtn.addEventListener("click", decrypt);
////
////
////
////
// window.onload = function() {
//   let user = document.getElementById("userr");
//   if (user) {
//       let userInfo = JSON.parse(window.localStorage.getItem("user"));
//       user.innerHTML = userInfo.firstName;
//   }
// };
let user = document.getElementById('userr')
let userInfo = JSON.parse(window.localStorage.getItem("user"));
console.log(userInfo)
user.innerHTML = userInfo.firstName
  let logout = document.getElementById("logoutt");
  
  logout.addEventListener("click", e => {
    e.preventDefault();
    console.log("click");
    window.localStorage.removeItem("user");
    window.location.replace("LoginPage.html");
  });


 





