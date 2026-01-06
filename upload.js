/* -------------------------------
   Supabase Initialization
--------------------------------*/
const SUPABASE_URL = "https://fohzmnvqgtbwglapojuo.supabase.co";
const SUPABASE_KEY = "sb_publishable_ooSqDRIkzjzbm_4lIyYmuQ_ylutHG77";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* -------------------------------
   Authentication Check
--------------------------------*/
async function checkAuth() {
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) {
    window.location.href = "login.html";
  }
}
checkAuth();

/* -------------------------------
   DOM Elements
--------------------------------*/
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const previewContainer = document.getElementById("previewContainer");
const proceedBtn = document.getElementById("proceedBtn");
const progressContainer = document.getElementById("uploadProgressContainer");
const progressBar = document.getElementById("uploadProgressBar");
const progressMessage = document.getElementById("progressMessage");

let filesData = [];
let selectedLanguage = "english";

/* -------------------------------
   Language Selection
--------------------------------*/
document.querySelectorAll("input[name='lang']").forEach(radio => {
  radio.addEventListener("change", e => {
    selectedLanguage = e.target.value;
    validateAllCaptions();
  });
});

/* -------------------------------
   Drop Zone Events
--------------------------------*/
dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("dragover", e => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
dropZone.addEventListener("drop", e => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  handleFiles(e.dataTransfer.files);
});
fileInput.addEventListener("change", () => handleFiles(fileInput.files));

/* -------------------------------
   Handle File Uploads
--------------------------------*/
function handleFiles(fileList) {
  [...fileList].forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const id = crypto.randomUUID();
      filesData.push({
        id,
        file,
        preview: e.target.result,
        caption: ""
      });
      renderPreview(id);
      validateAllCaptions();
    };
    reader.readAsDataURL(file);
  });
}

/* -------------------------------
   Render Preview Box
--------------------------------*/
function renderPreview(id) {
  const item = filesData.find(f => f.id === id);
  const box = document.createElement("div");
  box.className = "previewBox";
  box.id = `box-${id}`;

  box.innerHTML = `
    <div class="thumb"><img src="${item.preview}"></div>
    <div class="meta">${item.file.name}</div>
    <div class="fileSize">${(item.file.size / 1024).toFixed(1)} KB</div>

    <input class="userText" id="cap-${id}" placeholder="Enter caption">

    <div class="preview-actions">
      <button class="toggle-rtl">RTL</button>
      <button class="removeBtn">Remove</button>
    </div>
  `;

  previewContainer.appendChild(box);

  document.getElementById(`cap-${id}`).addEventListener("input", e => {
    item.caption = e.target.value.trim();
    validateAllCaptions();
  });

  box.querySelector(".toggle-rtl").addEventListener("click", () => {
    const input = document.getElementById(`cap-${id}`);
    input.style.direction = input.style.direction === "rtl" ? "ltr" : "rtl";
  });

  box.querySelector(".removeBtn").addEventListener("click", () => {
    filesData = filesData.filter(f => f.id !== id);
    box.remove();
    validateAllCaptions();
  });
}

/* -------------------------------
   Caption Validation
--------------------------------*/
function validateCaption(text, lang) {
  if (!text) return false;

  if (lang === "english") {
    return /^[A-Za-z0-9 ,.'"!?-]+$/.test(text);
  }

  if (lang === "hebrew") {
    return /^[\u0590-\u05FF0-9 ,.'"!?-]+$/.test(text);
  }

  return false;
}

function validateAllCaptions() {
  if (filesData.length === 0) {
    proceedBtn.style.display = "none";
    return;
  }

  for (const f of filesData) {
    if (!validateCaption(f.caption, selectedLanguage)) {
      proceedBtn.style.display = "none";
      return;
    }
  }

  proceedBtn.style.display = "block";
}

/* -------------------------------
   Proceed Button
--------------------------------*/
proceedBtn.addEventListener("click", async () => {
  progressContainer.style.display = "block";
  progressMessage.textContent = "Uploading files...";

  const uploadedPaths = [];

  for (let i = 0; i < filesData.length; i++) {
    const f = filesData[i];
    const ext = f.file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabaseClient.storage
      .from("documents")
      .upload(filePath, f.file);

    if (error) {
      progressMessage.textContent = "Upload failed.";
      return;
    }

    uploadedPaths.push({
      path: filePath,
      caption: f.caption
    });

    progressBar.style.width = `${((i + 1) / filesData.length) * 100}%`;
  }

  progressMessage.textContent = "Saving metadata...";

  const { data: sessionData } = await supabaseClient.auth.getSession();
  const userId = sessionData.session.user.id;

  await supabaseClient.from("uploads").insert({
    user_id: userId,
    language: selectedLanguage,
    files: uploadedPaths,
    created_at: new Date().toISOString()
  });

  sessionStorage.setItem("uploadData", JSON.stringify({
    language: selectedLanguage,
    files: uploadedPaths
  }));

  progressMessage.textContent = "Redirecting...";

  if (selectedLanguage === "english") {
    window.location.href = "process.html";
  } (selectedLanguage === "hebrew") {
    window.location.href = "hebrewprocess.html";
  }
});
