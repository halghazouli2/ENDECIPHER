
    
    // Declare variables 'mode' and 'objFile' and initialize them to null
    var mode=null;
    var objFile=null;

    // Call the 'switchdiv()' function with an argument 'encrypt' to set the default div to be shown
    switchdiv('encrypt');

    // Define the 'switchdiv()' function to switch between encrypt and decrypt divs
    function switchdiv(t) {
        // If the argument is 'encrypt'
        if(t=='encrypt') {
            // Show the div for encrypt file and hide the div for decrypt file
            divEncryptfile.style.display='block';
            divDecryptfile.style.display='none';
            // Disable the encrypt button and enable the decrypt button
            btnDivEncrypt.disabled=true;
            btnDivDecrypt.disabled=false;
              // Set the mode variable to 'encrypt'
            mode='encrypt';

             // If the argument is 'decrypt'
        } else if(t=='decrypt') {

            // Show the div for decrypt file and hide the div for encrypt file
            divEncryptfile.style.display='none';
            divDecryptfile.style.display='block';
            // Enable the encrypt button and disable the decrypt button
            btnDivEncrypt.disabled=false;
            btnDivDecrypt.disabled=true;
            // Set the mode variable to 'decrypt'
            mode='decrypt';
        }
    }
    // This function performs validation for encryption process.
    function encvalidate() {
        if (txtEncpassphrase.value.length >= 16 && txtEncpassphrase.value == txtEncpassphraseretype.value) { 
          spnCheckretype.classList.add("greenspan");
          spnCheckretype.classList.remove("redspan");
          spnCheckretype.innerHTML='&#10004;';
        } else { 
          spnCheckretype.classList.remove("greenspan");
          spnCheckretype.classList.add("redspan");
          spnCheckretype.innerHTML='&#10006;';
        }
      
        if (txtEncpassphrase.value.length >= 16 && txtEncpassphrase.value == txtEncpassphraseretype.value && objFile) { 
          btnEncrypt.disabled = false; 
        } else { 
          btnEncrypt.disabled = true; 
        }
      }
      
      txtEncpassphrase.onblur = function() {
        if (txtEncpassphrase.value.length < 16) {
          alert("Oops! Password should be at least 16 characters long!");
        }
      }


    function decvalidate() {
        if( txtDecpassphrase.value.length>0 && objFile ) { btnDecrypt.disabled=false; } else { btnDecrypt.disabled=true; }
    }

    //This function is an event handler for the "drop" event. When a file is dropped onto a designated drop zone, this function is called. The function first prevents the default behavior of the event 
    function drop_handler(ev) {
        console.log("Drop");
        ev.preventDefault();

        var dt = ev.dataTransfer;
        if (dt.items) {

            for (var i=0; i < dt.items.length; i++) {
                if (dt.items[i].kind == "file") {
                    var f = dt.items[i].getAsFile();
                    console.log("... file[" + i + "].name = " + f.name);
                    objFile=f;
                }
            }
        } else {

            for (var i=0; i < dt.files.length; i++) {
                console.log("... file[" + i + "].name = " + dt.files[i].name);
            }  
            objFile=file[0];
        }        
        displayfile()
        if(mode=='encrypt') { encvalidate(); } else if(mode=='decrypt') { decvalidate(); }
    }

    function dragover_handler(ev) {
        console.log("dragOver");

        ev.preventDefault(); // Prevents the default action of the dragged item
    }

    function dragend_handler(ev) {
        console.log("dragEnd");

        var dt = ev.dataTransfer;
        if (dt.items) { // If the dataTransfer object contains items

            for (var i = 0; i < dt.items.length; i++) { // Loop through the items
                dt.items.remove(i); // Remove the item at the specified index from the items list
            }
        } else { // If the dataTransfer object does not contain items

            ev.dataTransfer.clearData(); // Clears the data associated with the dragged item from the dataTransfer object
        }
    }
//selectfile function is called when the user selects a file. It assigns the first file in the Files array to the objFile variable and calls the displayfile function to display information about the selected file.
    function selectfile(Files) {
        objFile=Files[0];
        displayfile()
        if(mode=='encrypt') { encvalidate(); } else if(mode=='decrypt') { decvalidate(); }
    }
//displayfile function displays the name and size of the selected file, along with a unit (bytes, KB, MB, etc.). It checks the value of the mode variable to determine whether to display the information for encryption or decryption.
    function displayfile() {
        var s;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        var bytes=objFile.size;
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if(i==0) { s=bytes + ' ' + sizes[i]; } else { s=(bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]; }

        if(mode=='encrypt') { 
            spnencfilename.textContent=objFile.name + ' (' + s + ')'; 
        } else if(mode=='decrypt') {  
            spndecfilename.textContent=objFile.name + ' (' + s + ')'; 
        } 
    }
//readfile function returns a Promise that reads the contents of a file as an array buffer. It creates a new FileReader object and sets its onload property to a function that resolves the Promise with the result property of the FileReader object, which contains the contents of the file. The FileReader object then reads the file as an array buffer.
    function readfile(file){
        return new Promise((resolve, reject) => {
            var fr = new FileReader();  
            fr.onload = () => {
                resolve(fr.result )
            };
            fr.readAsArrayBuffer(file);
        });
    

    }

    async function encryptfile() {
        btnEncrypt.disabled=true; // Disable the encrypt button while encryption is in progress

        // Read the selected file and store its contents as an array of bytes
        var plaintextbytes=await readfile(objFile)
        .catch(function(err){
            console.error(err);
        }); 
        var plaintextbytes=new Uint8Array(plaintextbytes);
        // Set up parameters for the PBKDF2 key derivation function
        var pbkdf2iterations=10000;
        var passphrasebytes=new TextEncoder("utf-8").encode(txtEncpassphrase.value);
        var pbkdf2salt=window.crypto.getRandomValues(new Uint8Array(8));

        // Import the passphrase as a raw key, then use it to derive a PBKDF2 key
        var passphrasekey=await window.crypto.subtle.importKey('raw', passphrasebytes, {name: 'PBKDF2'}, false, ['deriveBits'])
        .catch(function(err){
            console.error(err);
        });
        console.log('passphrasekey imported');

        var pbkdf2bytes=await window.crypto.subtle.deriveBits({"name": 'PBKDF2', "salt": pbkdf2salt, "iterations": pbkdf2iterations, "hash": 'SHA-256'}, passphrasekey, 384)        
        .catch(function(err){
            console.error(err);
        });
        console.log('pbkdf2bytes derived');
        pbkdf2bytes=new Uint8Array(pbkdf2bytes);

        // Extract the first 32 bytes of the derived key as the encryption key,
        // and the remaining bytes as the initialization vector (IV)
        keybytes=pbkdf2bytes.slice(0,32);
        ivbytes=pbkdf2bytes.slice(32);

        //This code is responsible for encrypting a file using the AES-CBC encryption algorithm.
        var key=await window.crypto.subtle.importKey('raw', keybytes, {name: 'AES-CBC', length: 256}, false, ['encrypt']) 
        .catch(function(err){
            console.error(err);
        });
        console.log('key imported');        
        // Encrypt the plaintext file data using the imported key and IV
        var cipherbytes=await window.crypto.subtle.encrypt({name: "AES-CBC", iv: ivbytes}, key, plaintextbytes)
        .catch(function(err){
            console.error(err);
        });
        // If encryption fails, display an error message and return
        if(!cipherbytes) {
            spnEncstatus.classList.add("redspan");
            spnEncstatus.innerHTML='<p>Error encrypting file.  See console log.</p>';
            return;
        }

        console.log('plaintext encrypted');
        cipherbytes=new Uint8Array(cipherbytes);
        // Save the encrypted data and salt in a new byte array
        var resultbytes=new Uint8Array(cipherbytes.length+16)
        resultbytes.set(new TextEncoder("utf-8").encode('Salted__'));
        resultbytes.set(pbkdf2salt, 8);
        resultbytes.set(cipherbytes, 16);

        // Create a new Blob object representing the encrypted file
        var blob=new Blob([resultbytes], {type: 'application/download'});
        var blobUrl=URL.createObjectURL(blob);
        aEncsavefile.href=blobUrl;
        aEncsavefile.download=objFile.name + '.enc';

        // Update the HTML to display a success message and provide a download link
        spnEncstatus.classList.add("greenspan");
        spnEncstatus.innerHTML='<p>File encrypted.</p>';
        aEncsavefile.hidden=false;
    }

    async function decryptfile() {
        btnDecrypt.disabled=true; // Disable the "Decrypt" button.

        var cipherbytes=await readfile(objFile) // Read the selected file as an array of bytes.
        .catch(function(err){
            console.error(err);
        }); 
        var cipherbytes=new Uint8Array(cipherbytes); // Convert the array buffer to a Uint8Array.

        var pbkdf2iterations=10000; // The number of iterations for PBKDF2.
        var passphrasebytes=new TextEncoder("utf-8").encode(txtDecpassphrase.value); // Convert the passphrase to a byte array.
        var pbkdf2salt=cipherbytes.slice(8,16); // Extract the salt from the cipher bytes.


        var passphrasekey=await window.crypto.subtle.importKey('raw', passphrasebytes, {name: 'PBKDF2'}, false, ['deriveBits']) // Import the passphrase as a key using PBKDF2.
        .catch(function(err){
            console.error(err);

        });
        console.log('passphrasekey imported');

        var pbkdf2bytes=await window.crypto.subtle.deriveBits({"name": 'PBKDF2', "salt": pbkdf2salt, "iterations": pbkdf2iterations, "hash": 'SHA-256'}, passphrasekey, 384) // Derive a key using PBKDF2.       
        .catch(function(err){
            console.error(err);
        });
        console.log('pbkdf2bytes derived');
        pbkdf2bytes=new Uint8Array(pbkdf2bytes); // Convert the derived key to a Uint8Array.

        keybytes=pbkdf2bytes.slice(0,32); // Extract the first 32 bytes of the derived key as the encryption key.
        ivbytes=pbkdf2bytes.slice(32); // Extract the remaining bytes of the derived key as the initialization vector.
        cipherbytes=cipherbytes.slice(16); // Remove the salt from the cipher bytes.

        var key=await window.crypto.subtle.importKey('raw', keybytes, {name: 'AES-CBC', length: 256}, false, ['decrypt']) // Decrypt the cipher bytes. 
        .catch(function(err){
            console.error(err);
        });
        console.log('key imported');        

        var plaintextbytes=await window.crypto.subtle.decrypt({name: "AES-CBC", iv: ivbytes}, key, cipherbytes)
        .catch(function(err){
            console.error(err);
        });

        if(!plaintextbytes) {
            spnDecstatus.classList.add("redspan");
            spnDecstatus.innerHTML='<p>Error decrypting file.  Password may be incorrect.</p>';
            return;
        }

        console.log('ciphertext decrypted');
        // Convert the decrypted bytes to a Uint8Array.
        plaintextbytes=new Uint8Array(plaintextbytes); 
        // Create a new Blob object with the decrypted bytes.
        var blob=new Blob([plaintextbytes], {type: 'application/download'});
        // Create a URL for the Blob.
        var blobUrl=URL.createObjectURL(blob);
        // Set the download link's href attribute to the URL.
        aDecsavefile.href=blobUrl;
        aDecsavefile.download=objFile.name + '.dec';
        // Add the "greenspan" class to the status span to make it green.
        spnDecstatus.classList.add("greenspan");
        spnDecstatus.innerHTML='<p>File decrypted!</p>';
        aDecsavefile.hidden=false;
    }

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
