let pin = "";
let currentLang = "en-US";
let prompts = {};
let balance = 5000;

// Text-to-speech
function speak(text, lang = currentLang) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = lang;
  speech.rate = 0.7;
  speech.pitch = 1.1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

// Hover voice helper
function addVoiceHover(button, messageFunc) {
  button.addEventListener("mouseover", () => {
    messageFunc();
  });
}

// Start button
window.onload = () => {
  const startBtn = document.getElementById("startBtn");
  addVoiceHover(startBtn, () => speak("This is the Start Button. Click to begin."));
  startBtn.addEventListener("click", showLanguageScreen);
};

// Language Selection
function showLanguageScreen() {
  document.getElementById("screenText").innerText = "Select Your Preferred Language";
  document.getElementById("buttonsArea").innerHTML = `
    <button id="langEng">English</button>
    <button id="langYoruba">Yoruba</button>
    <button id="langHausa">Hausa</button>
    <button id="langIgbo">Igbo</button>
    <button id="backBtn" style="margin-top: 10px;">Back</button>
  `;
  speak("Please select your preferred language.", currentLang);

  addVoiceHover(document.getElementById("langEng"), () => speak("This is the English button.", "en-US"));
  addVoiceHover(document.getElementById("langYoruba"), () => speak("Eleyi ni bọtini Yoruba.", "yo-NG"));
  addVoiceHover(document.getElementById("langHausa"), () => speak("Wannan shi ne maɓallin Hausa.", "ha-NG"));
  addVoiceHover(document.getElementById("langIgbo"), () => speak("Nke a bụ bọtịnụ Igbo.", "ig-NG"));

  document.getElementById("langEng").addEventListener("click", () => selectLanguage("English"));
  document.getElementById("langYoruba").addEventListener("click", () => selectLanguage("Yoruba"));
  document.getElementById("langHausa").addEventListener("click", () => selectLanguage("Hausa"));
  document.getElementById("langIgbo").addEventListener("click", () => selectLanguage("Igbo"));

  const backBtn = document.getElementById("backBtn");
  addVoiceHover(backBtn, () => speak("Go back to Start screen.", "en-US"));
  backBtn.addEventListener("click", () => {
    document.getElementById("screenText").innerText = "Welcome to VisionAssist ATM";
    document.getElementById("buttonsArea").innerHTML = `<button id="startBtn">Start</button>`;
    window.onload();
  });
}

// Language selection logic
function selectLanguage(language) {
  switch(language) {
    case "English":
      currentLang = "en-US";
      prompts = {
        welcome: "Welcome to VisionAssist ATM.",
        pinInstruction: "Please enter your four-digit PIN. Select a number and it will be confirmed by voice.",
        pinSelected: "You selected",
        pinCleared: "PIN cleared",
        pinAccepted: "PIN accepted. Processing.",
        incompletePin: "Incomplete PIN. Please enter four digits.",
        clear: "This is the Clear button.",
        enter: "This is the Enter button.",
        number: (n) => `This is the ${n} button.`,
        mainMenu: ["Withdraw", "Check Balance", "Transfer", "Exit"],
        mainMenuPrompt: "Please select a menu option."
      };
      break;
    case "Yoruba":
      currentLang = "yo-NG";
      prompts = {
        welcome: "Kaabo si VisionAssist ATM.",
        pinInstruction: "Jowo tẹ koodu PIN rẹ ti o ni awọn nọmba mẹrin. Nọmba ti o yan yoo jẹrisi nipasẹ ohùn.",
        pinSelected: "O ti yan",
        pinCleared: "PIN ti nu",
        pinAccepted: "PIN ti gba. Nṣiṣẹ.",
        incompletePin: "PIN ko pe. Jowo tẹ awọn nọmba mẹrin.",
        clear: "Eleyi ni bọtini Nu.",
        enter: "Eleyi ni bọtini Tẹ",
        number: (n) => `Eleyi ni bọtini ${n}.`,
        mainMenu: ["Yọ owo", "Ṣayẹwo Iṣiro", "Gbe owo", "Jade"],
        mainMenuPrompt: "Jowo yan aṣayan akojọ."
      };
      break;
    case "Hausa":
      currentLang = "ha-NG";
      prompts = {
        welcome: "Barka da zuwa VisionAssist ATM.",
        pinInstruction: "Da fatan shigar da lambar PIN ɗinku mai lambobi huɗu. Lambar da kuka zaɓa za a tabbatar da murya.",
        pinSelected: "Kun zaɓi",
        pinCleared: "An share PIN",
        pinAccepted: "An karɓi PIN. Ana sarrafawa.",
        incompletePin: "PIN bai cika ba. Da fatan shigar da lambobi huɗu.",
        clear: "Wannan shi ne maɓallin Share.",
        enter: "Wannan shi ne maɓallin Shigar",
        number: (n) => `Wannan shi ne maɓallin ${n}.`,
        mainMenu: ["Cire Kudi", "Duba Ma'auni", "Canja Kudi", "Fita"],
        mainMenuPrompt: "Da fatan zaɓi zaɓin menu."
      };
      break;
    case "Igbo":
      currentLang = "ig-NG";
      prompts = {
        welcome: "Nnọọ na VisionAssist ATM.",
        pinInstruction: "Biko tinye koodu PIN gị nke nwere ọnụọgụ anọ. A ga-ekwupụta nọmba ị họọrọ site na olu.",
        pinSelected: "Ị họọrọ",
        pinCleared: "A hichapụla PIN",
        pinAccepted: "A nabatara PIN. Na-arụ ọrụ.",
        incompletePin: "PIN ezughị oke. Biko tinye ọnụọgụ anọ.",
        clear: "Nke a bụ bọtịnụ Hichapụ.",
        enter: "Nke a bụ bọtịnụ Tinye",
        number: (n) => `Nke a bụ bọtịnụ ${n}.`,
        mainMenu: ["Wepu Ego", "Lelee Akaụntụ", "Nyefee Ego", "Pụọ"],
        mainMenuPrompt: "Biko họrọ nhọrọ menu."
      };
      break;
  }

  speak(language + " selected.", currentLang);
  showPinScreen();
}

// PIN Entry
function showPinScreen() {
  pin = "";
  document.getElementById("screenText").innerText = "Enter Your PIN";
  document.getElementById("buttonsArea").innerHTML = `
    <h2 id="pinDisplay">----</h2>
    <div class="keypad">
      <button onclick="confirmPinDigit(1)">1</button>
      <button onclick="confirmPinDigit(2)">2</button>
      <button onclick="confirmPinDigit(3)">3</button>
      <button onclick="confirmPinDigit(4)">4</button>
      <button onclick="confirmPinDigit(5)">5</button>
      <button onclick="confirmPinDigit(6)">6</button>
      <button onclick="confirmPinDigit(7)">7</button>
      <button onclick="confirmPinDigit(8)">8</button>
      <button onclick="confirmPinDigit(9)">9</button>
      <button onclick="confirmPinDigit(0)">0</button>
      <button onclick="clearPin()" style="grid-column: span 5;">Clear</button>
      <button onclick="submitPin()" style="grid-column: span 5;">Enter</button>
      <button id="backBtn" style="grid-column: span 5; margin-top: 10px;">Back</button>
    </div>
  `;
  speak(prompts.pinInstruction, currentLang);

  [1,2,3,4,5,6,7,8,9,0].forEach(num => {
    const btn = document.querySelector(`button[onclick="confirmPinDigit(${num})"]`);
    addVoiceHover(btn, () => speak(prompts.number(num), currentLang));
  });
  addVoiceHover(document.querySelector('button[onclick="clearPin()"]'), () => speak(prompts.clear, currentLang));
  addVoiceHover(document.querySelector('button[onclick="submitPin()"]'), () => speak(prompts.enter, currentLang));
  const backBtn = document.getElementById("backBtn");
  addVoiceHover(backBtn, () => speak("Go back to Language Selection.", currentLang));
  backBtn.addEventListener("click", showLanguageScreen);
}

function confirmPinDigit(number) {
  speak(`${prompts.pinSelected} ${number}`, currentLang);
  setTimeout(() => enterPin(number), 1000);
}
function enterPin(number) {
  if (pin.length < 4) { pin += number; updatePinDisplay(); }
}
function updatePinDisplay() {
  document.getElementById("pinDisplay").innerText = "*".repeat(pin.length) + "-".repeat(4 - pin.length);
}
function clearPin() { pin = ""; updatePinDisplay(); speak(prompts.pinCleared, currentLang); }
function submitPin() {
  if(pin.length===4){ speak(prompts.pinAccepted, currentLang); showMainMenu(); }
  else speak(prompts.incompletePin, currentLang);
}

// Main Menu
function showMainMenu() {
  document.getElementById("screenText").innerText = "Main Menu";
  document.getElementById("buttonsArea").innerHTML = "";
  prompts.mainMenu.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.style.display = "block"; btn.style.margin = "5px 0";
    document.getElementById("buttonsArea").appendChild(btn);
    addVoiceHover(btn, () => speak(option, currentLang));
    btn.addEventListener("click", () => {
      speak(`You selected ${option}`, currentLang);
      if(option===prompts.mainMenu[0]) withdraw();
      if(option===prompts.mainMenu[1]) checkBalance();
      if(option===prompts.mainMenu[2]) transfer();
      if(option===prompts.mainMenu[3]) exitATM();
    });
  });

  const backBtn = document.createElement("button");
  backBtn.innerText="Back"; backBtn.style.display="block"; backBtn.style.marginTop="10px";
  document.getElementById("buttonsArea").appendChild(backBtn);
  addVoiceHover(backBtn, () => speak("Go back to PIN screen.", currentLang));
  backBtn.addEventListener("click", showPinScreen);
  speak(prompts.mainMenuPrompt, currentLang);
}

// Withdraw
function withdraw() {
  amountEntry("Withdraw");
}

// Amount Entry (Withdraw)
function amountEntry(action) {
  let amount = "";
  document.getElementById("screenText").innerText = `${action} Amount`;
  document.getElementById("buttonsArea").innerHTML = `
    <h2 id="amountDisplay">0</h2>
    <div class="keypad">
      <button onclick="confirmAmountDigit(1)">1</button>
      <button onclick="confirmAmountDigit(2)">2</button>
      <button onclick="confirmAmountDigit(3)">3</button>
      <button onclick="confirmAmountDigit(4)">4</button>
      <button onclick="confirmAmountDigit(5)">5</button>
      <button onclick="confirmAmountDigit(6)">6</button>
      <button onclick="confirmAmountDigit(7)">7</button>
      <button onclick="confirmAmountDigit(8)">8</button>
      <button onclick="confirmAmountDigit(9)">9</button>
      <button onclick="confirmAmountDigit(0)">0</button>
      <button onclick="clearAmount()" style="grid-column: span 5;">Clear</button>
      <button onclick="submitAmount()" style="grid-column: span 5;">Enter</button>
      <button id="backBtn" style="grid-column: span 5; margin-top: 10px;">Back</button>
    </div>
  `;

  speak(`Enter the amount to ${action.toLowerCase()}.`, currentLang);

  [1,2,3,4,5,6,7,8,9,0].forEach(num => {
    const btn = document.querySelector(`button[onclick="confirmAmountDigit(${num})"]`);
    addVoiceHover(btn, () => speak(prompts.number(num), currentLang));
  });
  addVoiceHover(document.querySelector('button[onclick="clearAmount()"]'), () => speak(prompts.clear, currentLang));
  addVoiceHover(document.querySelector('button[onclick="submitAmount()"]'), () => speak(prompts.enter, currentLang));
  const backBtn = document.getElementById("backBtn");
  addVoiceHover(backBtn, () => speak("Go back to Main Menu.", currentLang));
  backBtn.addEventListener("click", showMainMenu);

  window.confirmAmountDigit = function(num){
    speak(`${prompts.pinSelected} ${num}`, currentLang);
    setTimeout(() => { if(amount.length<7){ amount+=num; document.getElementById("amountDisplay").innerText=amount; } }, 500);
  }
  window.clearAmount = function(){ amount=""; document.getElementById("amountDisplay").innerText="0"; speak(prompts.pinCleared, currentLang);}
  window.submitAmount = function(){
    const amt=parseInt(amount);
    if(!amt||amt<=0){ speak("Invalid amount.", currentLang);}
    else if(amt>balance){ speak("Insufficient balance.", currentLang);}
    else{
      balance-=amt;
      speak(`${action} of ${amt} successful. Your new balance is ${balance}.`, currentLang);
      showMainMenu();
    }
  }
}

// Transfer functions: account + amount
function transfer() {
  enterAccountNumber();
}

// Step 1: Account Number
function enterAccountNumber() {
  let accountNumber = "";
  document.getElementById("screenText").innerText = "Enter Recipient Account Number";
  document.getElementById("buttonsArea").innerHTML = `
    <h2 id="accountDisplay">----</h2>
    <div class="keypad">
      <button onclick="confirmAccountDigit(1)">1</button>
      <button onclick="confirmAccountDigit(2)">2</button>
      <button onclick="confirmAccountDigit(3)">3</button>
      <button onclick="confirmAccountDigit(4)">4</button>
      <button onclick="confirmAccountDigit(5)">5</button>
      <button onclick="confirmAccountDigit(6)">6</button>
      <button onclick="confirmAccountDigit(7)">7</button>
      <button onclick="confirmAccountDigit(8)">8</button>
      <button onclick="confirmAccountDigit(9)">9</button>
      <button onclick="confirmAccountDigit(0)">0</button>
      <button onclick="clearAccount()" style="grid-column: span 5;">Clear</button>
      <button onclick="submitAccount()" style="grid-column: span 5;">Enter</button>
      <button id="backBtn" style="grid-column: span 5; margin-top:10px;">Back</button>
    </div>
  `;

  speak("Enter the recipient's account number.", currentLang);

  [0,1,2,3,4,5,6,7,8,9].forEach(num => {
    const btn = document.querySelector(`button[onclick="confirmAccountDigit(${num})"]`);
    addVoiceHover(btn, () => speak(prompts.number(num), currentLang));
  });
  addVoiceHover(document.querySelector('button[onclick="clearAccount()"]'), () => speak(prompts.clear, currentLang));
  addVoiceHover(document.querySelector('button[onclick="submitAccount()"]'), () => speak(prompts.enter, currentLang));
  const backBtn = document.getElementById("backBtn");
  addVoiceHover(backBtn, () => speak("Go back to Main Menu.", currentLang));
  backBtn.addEventListener("click", showMainMenu);

  window.confirmAccountDigit = function(num) {
    speak(`${prompts.pinSelected} ${num}`, currentLang);
    setTimeout(() => {
      if(accountNumber.length < 10) { accountNumber += num; document.getElementById("accountDisplay").innerText = accountNumber; }
    }, 500);
  }
  window.clearAccount = function() { accountNumber = ""; document.getElementById("accountDisplay").innerText = "----"; speak(prompts.pinCleared, currentLang); }
  window.submitAccount = function() {
    if(accountNumber.length < 5) speak("Invalid account number.", currentLang);
    else { speak(`Account number ${accountNumber} confirmed. Now enter amount to transfer.`, currentLang); enterTransferAmount(accountNumber); }
  }
}

// Step 2: Transfer Amount
function enterTransferAmount(accountNumber) {
  let amount = "";
  document.getElementById("screenText").innerText = "Enter Transfer Amount";
  document.getElementById("buttonsArea").innerHTML = `
    <h2 id="amountDisplay">0</h2>
    <div class="keypad">
      <button onclick="confirmTransferDigit(1)">1</button>
      <button onclick="confirmTransferDigit(2)">2</button>
      <button onclick="confirmTransferDigit(3)">3</button>
      <button onclick="confirmTransferDigit(4)">4</button>
      <button onclick="confirmTransferDigit(5)">5</button>
      <button onclick="confirmTransferDigit(6)">6</button>
      <button onclick="confirmTransferDigit(7)">7</button>
      <button onclick="confirmTransferDigit(8)">8</button>
      <button onclick="confirmTransferDigit(9)">9</button>
      <button onclick="confirmTransferDigit(0)">0</button>
      <button onclick="clearTransfer()" style="grid-column: span 5;">Clear</button>
      <button onclick="submitTransferAmount()" style="grid-column: span 5;">Enter</button>
      <button id="backBtn" style="grid-column: span 5; margin-top:10px;">Back</button>
    </div>
  `;

  speak("Enter the amount to transfer.", currentLang);

  [0,1,2,3,4,5,6,7,8,9].forEach(num => {
    const btn = document.querySelector(`button[onclick="confirmTransferDigit(${num})"]`);
    addVoiceHover(btn, () => speak(prompts.number(num), currentLang));
  });
  addVoiceHover(document.querySelector('button[onclick="clearTransfer()"]'), () => speak(prompts.clear, currentLang));
  addVoiceHover(document.querySelector('button[onclick="submitTransferAmount()"]'), () => speak(prompts.enter, currentLang));
  const backBtn = document.getElementById("backBtn");
  addVoiceHover(backBtn, () => speak("Go back to Account Number entry.", currentLang));
  backBtn.addEventListener("click", () => enterAccountNumber());

  window.confirmTransferDigit = function(num) {
    speak(`${prompts.pinSelected} ${num}`, currentLang);
    setTimeout(() => { if(amount.length<7){ amount+=num; document.getElementById("amountDisplay").innerText=amount; } }, 500);
  }
  window.clearTransfer = function() { amount=""; document.getElementById("amountDisplay").innerText="0"; speak(prompts.pinCleared, currentLang);}
  window.submitTransferAmount = function() {
    const amt=parseInt(amount);
    if(!amt||amt<=0){ speak("Invalid amount.", currentLang);}
    else if(amt>balance){ speak("Insufficient balance.", currentLang);}
    else{
      balance-=amt;
      speak(`Successfully transferred ${amt} to account ${accountNumber}. New balance is ${balance}.`, currentLang);
      showMainMenu();
    }
  }
}

// Exit
function exitATM(){ speak("Thank you for using VisionAssist ATM.", currentLang); document.getElementById("buttonsArea").innerHTML=""; }
