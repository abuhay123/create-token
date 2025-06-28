const walletDiv = document.getElementById("walletData");
let connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));
let wallet = null;

// יצירת ארנק חדש
async function createWallet() {
  const mnemonic = bip39.generateMnemonic();
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const keypair = solanaWeb3.Keypair.fromSeed(seed.slice(0, 32));
  wallet = keypair;
  displayWallet(mnemonic);
}

// ייבוא ארנק קיים
async function importWallet() {
  const mnemonic = prompt("Enter your 12-word mnemonic:");
  if (!bip39.validateMnemonic(mnemonic)) return alert("Invalid mnemonic");

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const keypair = solanaWeb3.Keypair.fromSeed(seed.slice(0, 32));
  wallet = keypair;
  displayWallet(mnemonic);
}

// הצגת פרטי הארנק + יתרות
async function displayWallet(mnemonic) {
  const pubKey = wallet.publicKey.toBase58();
  const solBalance = await connection.getBalance(wallet.publicKey);
  const usdcBalance = await getTokenBalance(wallet.publicKey, "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
  const usdtBalance = await getTokenBalance(wallet.publicKey, "Es9vMFrzaCER1zQh5jBvzr6KFh4zLKHMQ9ZH8ZujZwv8");

  walletDiv.innerHTML = `
    <b>Public Key:</b><br>${pubKey}<br><br>
    <b>Mnemonic:</b><br>${mnemonic}<br><br>
    <b>SOL:</b> ${(solBalance / 1e9).toFixed(4)}<br>
    <b>USDC:</b> ${usdcBalance}<br>
    <b>USDT:</b> ${usdtBalance}
  `;
  walletDiv.classList.remove("hidden");
}

// קבלת יתרת טוקן לפי Mint
async function getTokenBalance(pubKey, tokenMint) {
  try {
    const accounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
      mint: new solanaWeb3.PublicKey(tokenMint),
    });

    const amount = accounts.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;
    return amount.toFixed(2);
  } catch (e) {
    return "0.00";
  }
}

// עוזר AI
async function askAI() {
  const question = document.getElementById("aiInput").value;
  document.getElementById("aiResponse").innerText = "Thinking...";

  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await res.json();
  document.getElementById("aiResponse").innerText = data.answer || "No answer.";
}

function toggleAI() {
  document.getElementById("aiPopup").classList.toggle("hidden");
}

// תרגום ממשק
const translations = {
  en: {
    title: "Create your wallet",
    createBtn: "Create a new wallet",
    importBtn: "I already have a wallet",
    aiPlaceholder: "Ask the assistant...",
    aiSend: "Send"
  },
  he: {
    title: "צור את הארנק שלך",
    createBtn: "צור ארנק חדש",
    importBtn: "כבר יש לי ארנק",
    aiPlaceholder: "שאל את העוזר...",
    aiSend: "שלח"
  }
};

let currentLang = "en";

function toggleLanguage() {
  currentLang = currentLang === "en" ? "he" : "en";
  applyTranslations(currentLang);
}

function applyTranslations(lang) {
  const t = translations[lang];
  const $ = id => document.getElementById(id);
  if (!t) return;

  if ($("title")) $("title").innerText = t.title;
  if ($("createWalletBtn")) $("createWalletBtn").innerText = t.createBtn;
  if ($("existingWalletBtn")) $("existingWalletBtn").innerText = t.importBtn;
  if ($("aiInput")) $("aiInput").placeholder = t.aiPlaceholder;
  if ($("aiSendBtn")) $("aiSendBtn").innerText = t.aiSend;
}
