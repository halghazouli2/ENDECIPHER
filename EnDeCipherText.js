
// Declare the alphabet and its length
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const alphabetLength = alphabet.length;

// Get the input elements and output elements
const textInput = document.getElementById("text");
const passwordInput = document.getElementById("password");
const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const encryptedOutput = document.getElementById("encrypted");
const decryptedOutput = document.getElementById("decrypted");

// Declare variables to store the ciphertext bytes and IV
let ciphertextBytes, iv;

// Function to encrypt the plaintext
async function encrypt() {

  // Get the plaintext and password inputs
  const plaintext = textInput.value;
  const password = passwordInput.value;
  if (password.length < 16) {
    alert("Password should be at least 16 characters long!");
    return;
  }

  // Convert the plaintext and password to bytes
  const plaintextBytes = new TextEncoder().encode(plaintext);
  const passwordBytes = new TextEncoder().encode(password);

  // Import the password bytes as a key and derive a new key
  const key = await crypto.subtle.importKey("raw", passwordBytes, "PBKDF2", false, ["deriveKey"]);
  const derivedKey = await crypto.subtle.deriveKey({
    name: "PBKDF2",
    salt: passwordBytes,
    iterations: 100000,
    hash: "SHA-256"
  }, key, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);

  // Generate a random IV
  iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the plaintext using the derived key and IV
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, derivedKey, plaintextBytes);

  // Convert the ciphertext bytes to a hexadecimal string
  ciphertextBytes = new Uint8Array(ciphertext);
  const ciphertextHex = Array.from(ciphertextBytes).map(b => b.toString(16).padStart(2, "0")).join("");

  // Set the encrypted output value to the ciphertext hexadecimal string
  encryptedOutput.value = ciphertextHex;
}

// Function to decrypt the ciphertext
async function decrypt() {
  // Import the password bytes as a key and derive the same key as used in encryption
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(passwordInput.value), "PBKDF2", false, ["deriveKey"]);
  const derivedKey = await crypto.subtle.deriveKey({
    name: "PBKDF2",
    salt: new TextEncoder().encode(passwordInput.value),
    iterations: 100000,
    hash: "SHA-256"
  }, key, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);

  // Decrypt the ciphertext using the derived key and IV
  const decryptedBytes = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, derivedKey, ciphertextBytes);
  const decryptedPlaintext = new TextDecoder().decode(decryptedBytes);

  // Set the decrypted output value to the decrypted plaintext
  decryptedOutput.value = decryptedPlaintext;
}

// Add event listeners to the encrypt and decrypt buttons
encryptBtn.addEventListener("click", encrypt);
decryptBtn.addEventListener("click", decrypt);

// Get the user element and display the user's first name
let user = document.getElementById('userr')
let userInfo = JSON.parse(window.localStorage.getItem("user"));
console.log(userInfo)
user.innerHTML = userInfo.firstName
  let logout = document.getElementById("logoutt");
  
  // Get the logout button and remove the user from local storage 
  logout.addEventListener("click", e => {
    e.preventDefault();
    console.log("click");
    window.localStorage.removeItem("user");
    window.location.replace("LoginPage.html");
  });


 





