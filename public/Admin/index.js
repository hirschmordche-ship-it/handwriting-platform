let currentLang = "en";
let currentView = "letters";
let allGlyphs = [];
let visibleGlyphs = [];
let selected = new Set();
let undoStack = [];

const byLetterEl = document.getElementById("glyphsByLetter");
const allEl = document.getElementById("glyphsAll");

/* ---------- LANGUAGE ---------- */
document.querySelectorAll(".admin-tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".admin-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentLang = btn.dataset.lang;
    loadGlyphs();
  };
});

/* ---------- VIEW ---------- */
document.querySelectorAll(".view-toggle").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".view-toggle").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentView = btn.dataset.view;
    render();
  };
});

/* ---------- LOAD ---------- */
async function loadGlyphs() {
  const res = await fetch(`/api/admin/admin?action=get-glyphs&userId=demo&language=${currentLang}`);
  const data = await res.json();
  allGlyphs = data.glyphs || [];
  visibleGlyphs = allGlyphs;
  selected.clear();
  render();
}

/* ---------- RENDER ---------- */
function render() {
  byLetterEl.innerHTML = "";
  allEl.innerHTML = "";

  if (currentView === "letters") renderLetters();
  else renderAll();
}

function renderLetters() {
  const map = {};
  allGlyphs.forEach(g => {
    map[g.letter] = map[g.letter] || [];
    map[g.letter].push(g);
  });

  const grid = document.createElement("div");
  grid.className = "glyph-grid";

  Object.entries(map).forEach(([letter, list]) => {
    const card = document.createElement("div");
    card.className = "glyph-card";
    card.innerHTML = `<div class="${currentLang==='he'?'rtl':''}">${letter}</div><small>${list.length}</small>`;
    card.onclick = () => {
      visibleGlyphs = list;
      currentView = "all";
      document.querySelector('[data-view="all"]').click();
    };
    grid.appendChild(card);
  });

  byLetterEl.appendChild(grid);
  byLetterEl.classList.remove("hidden");
  allEl.classList.add("hidden");
}

function renderAll() {
  visibleGlyphs.forEach(g => {
    const row = document.createElement("div");
    row.className = "glyph-row";
    if (selected.has(g.id)) row.classList.add("selected");

    row.onclick = e => {
      if (e.ctrlKey || e.metaKey) toggleSelect(g.id, row);
    };

    const c = document.createElement("canvas");
    c.width = 42; c.height = 42;
    c.className = "preview";
    draw(c);
    c.onclick = e => { e.stopPropagation(); zoom(c); };

    const l = document.createElement("div");
    l.className = currentLang==="he"?"rtl":"";
    l.textContent = g.letter;

    row.append(c,l);
    allEl.appendChild(row);
  });

  allEl.classList.remove("hidden");
  byLetterEl.classList.add("hidden");
}

/* ---------- SELECT ---------- */
function toggleSelect(id,row){
  selected.has(id) ? selected.delete(id) : selected.add(id);
  row.classList.toggle("selected");
}

/* ---------- DELETE + UNDO ---------- */
document.addEventListener("keydown", e => {
  if (e.key === "Delete" && selected.size) bulkDelete();
});

async function bulkDelete(){
  if(!confirm(`Delete ${selected.size} glyphs?`)) return;
  undoStack.push([...selected]);
  for(const id of selected){
    await fetch("/api/admin/admin?action=delete-glyph",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({glyphId:id})
    });
  }
  selected.clear();
  loadGlyphs();
}

/* ---------- ZOOM ---------- */
function zoom(src){
  const m=document.createElement("div");
  m.className="modal";
  const b=document.createElement("canvas");
  b.width=300;b.height=300;
  b.getContext("2d").drawImage(src,0,0,300,300);
  m.appendChild(b);
  m.onclick=()=>m.remove();
  document.body.appendChild(m);
}

/* ---------- PREVIEW ---------- */
function draw(c){
  const x=c.getContext("2d");
  x.strokeRect(6,6,30,30);
}

    if (users.length > 0) {
      selectedUserId = users[0].id;
      document
        .querySelectorAll(".user-list-item")
        .forEach((item) => item.classList.remove("active"));
      const firstItem = document.querySelector(
        `.user-list-item[data-user-id="${selectedUserId}"]`
      );
      if (firstItem) firstItem.classList.add("active");
      loadUserDetails(selectedUserId);
    }
  } catch (err) {
    console.error("Error loading users:", err);
    userListEl.innerHTML = `<li class="user-list-item">Error loading users</li>`;
  }
}

// ---------- RENDER USER LIST (WITH COUNTS) ----------

async function renderUserList() {
  userListEl.innerHTML = "";

  if (!filteredUsers.length) {
    userListEl.innerHTML = `<li class="user-list-item">No users found</li>`;
    return;
  }

  for (const user of filteredUsers) {
    const li = document.createElement("li");
    li.className = "user-list-item";
    li.dataset.userId = user.id;

    if (user.id === selectedUserId) {
      li.classList.add("active");
    }

    const emailDiv = document.createElement("div");
    emailDiv.className = "user-list-email";
    emailDiv.textContent = user.email || "(no email)";

    const metaDiv = document.createElement("div");
    metaDiv.className = "user-list-meta";
    metaDiv.textContent = "Loading counts...";

    li.appendChild(emailDiv);
    li.appendChild(metaDiv);

    li.addEventListener("click", () => {
      selectedUserId = user.id;
      document
        .querySelectorAll(".user-list-item")
        .forEach((item) => item.classList.remove("active"));
      li.classList.add("active");
      loadUserDetails(user.id);
    });

    userListEl.appendChild(li);

    // Fetch glyph counts per user
    try {
      const res = await fetch(`/api/admin/get-glyph-counts?userId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        metaDiv.textContent = `EN: ${data.counts.en} | HE: ${data.counts.he}`;
      } else {
        metaDiv.textContent = "EN: ? | HE: ?";
      }
    } catch {
      metaDiv.textContent = "EN: ? | HE: ?";
    }
  }
}

// ---------- LOAD USER DETAILS (GLYPHS + STATUS) ----------

async function loadUserDetails(userId) {
  try {
    glyphsContainerEl.innerHTML = "Loading glyphs...";

    const res = await fetch(
      `/api/admin/get-glyphs?userId=${userId}&language=${currentLang}`
    );
    const data = await res.json();

    if (!data.success) {
      glyphsContainerEl.textContent = "Failed to load glyphs";
      return;
    }

    const glyphs = data.glyphs || [];
    const user = users.find((u) => u.id === userId);

    userEmailEl.textContent = user?.email || "(no email)";
    userRoleEl.textContent = user?.role || "(no role)";

    // Status + last login
    await updateUserStatus(userId, glyphs.length);

    // Render glyphs in current tab
    if (currentTab === "glyphs") {
      renderGlyphsAll(glyphs);
    }
  } catch (err) {
    console.error("Error loading user details:", err);
    glyphsContainerEl.textContent = "Error loading glyphs";
  }
}

// ---------- USER STATUS (ONLINE/OFFLINE + GLYPH COUNT) ----------

async function updateUserStatus(userId, glyphCount) {
  try {
    const statusRes = await fetch(`/api/admin/get-user-status?userId=${userId}`);
    const statusData = await statusRes.json();

    let statusText = "";
    if (statusData.success) {
      const status = statusData.online ? "🟢 Online" : "⚪ Offline";
      const lastLogin = statusData.lastLogin
        ? new Date(statusData.lastLogin).toLocaleString()
        : "Unknown";
      statusText = `${status} — Last login: ${lastLogin}`;
    } else {
      statusText = "Status unknown";
    }

    const langLabel = currentLang === "en" ? "English" : "Hebrew";
    statusText += `\n${glyphCount} ${langLabel} glyphs`;

    userStatusEl.textContent = statusText;
  } catch (err) {
    console.error("Error fetching user status:", err);
    userStatusEl.textContent = "Status error";
  }
}

// ---------- RENDER ALL GLYPHS (FLAT LIST + DELETE) ----------

function renderGlyphsAll(glyphs) {
  if (!glyphs.length) {
    glyphsContainerEl.textContent = "No glyphs for this user in this language.";
    return;
  }

  glyphsContainerEl.innerHTML = "";

  glyphs.forEach((g) => {
    const row = document.createElement("div");
    row.className = "glyph-row";

    const info = document.createElement("div");
    info.className = "glyph-info";
    const created = g.created_at
      ? new Date(g.created_at).toLocaleString()
      : "";
    info.textContent = `Letter: ${g.letter || "?"} — Created: ${created}`;

    const actions = document.createElement("div");
    actions.className = "glyph-actions";

    const preview = document.createElement("div");
    preview.className = "glyph-preview-placeholder";
    preview.textContent = "Preview"; // Phase 3: canvas rendering

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "glyph-delete-btn";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", async () => {
      const confirmed = confirm("Delete this glyph?");
      if (!confirmed) return;

      try {
        const res = await fetch("/api/admin/delete-glyph", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ glyphId: g.id })
        });

        const result = await res.json();
        if (result.success) {
          alert("Glyph deleted");
          loadUserDetails(selectedUserId);
          loadUsers(); // refresh counts in list
        } else {
          alert("Failed to delete glyph");
        }
      } catch {
        alert("Error deleting glyph");
      }
    });

    actions.appendChild(preview);
    actions.appendChild(deleteBtn);

    row.appendChild(info);
    row.appendChild(actions);

    glyphsContainerEl.appendChild(row);
  });
}
