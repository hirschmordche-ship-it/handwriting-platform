// public/Admin/admin.js

let users = [];
let filteredUsers = [];
let selectedUserId = null;
let currentLang = "en"; // "en" or "he"
let currentTab = "users"; // "users" | "glyphs"

const userListEl = document.getElementById("user-list");
const userEmailEl = document.getElementById("user-email");
const userRoleEl = document.getElementById("user-role");
const userStatusEl = document.getElementById("user-status");
const glyphsContainerEl = document.getElementById("glyphs-container");
const tabUsersEl = document.getElementById("tab-users");
const tabGlyphsEl = document.getElementById("tab-glyphs");
const langToggleEnEl = document.getElementById("lang-toggle-en");
const langToggleHeEl = document.getElementById("lang-toggle-he");
const searchInputEl = document.getElementById("user-search");

// ---------- INIT ----------

document.addEventListener("DOMContentLoaded", () => {
  setupTabHandlers();
  setupLangToggle();
  setupSearch();
  loadUsers();
});

// ---------- TABS ----------

function setupTabHandlers() {
  tabUsersEl.addEventListener("click", () => {
    currentTab = "users";
    tabUsersEl.classList.add("active");
    tabGlyphsEl.classList.remove("active");
    document.getElementById("users-panel").style.display = "block";
    document.getElementById("glyphs-panel").style.display = "none";
  });

  tabGlyphsEl.addEventListener("click", () => {
    currentTab = "glyphs";
    tabGlyphsEl.classList.add("active");
    tabUsersEl.classList.remove("active");
    document.getElementById("users-panel").style.display = "none";
    document.getElementById("glyphs-panel").style.display = "block";
    if (selectedUserId) {
      loadUserDetails(selectedUserId);
    }
  });
}

// ---------- LANGUAGE TOGGLE ----------

function setupLangToggle() {
  langToggleEnEl.addEventListener("click", () => {
    currentLang = "en";
    langToggleEnEl.classList.add("active");
    langToggleHeEl.classList.remove("active");
    if (selectedUserId) loadUserDetails(selectedUserId);
  });

  langToggleHeEl.addEventListener("click", () => {
    currentLang = "he";
    langToggleHeEl.classList.add("active");
    langToggleEnEl.classList.remove("active");
    if (selectedUserId) loadUserDetails(selectedUserId);
  });
}

// ---------- SEARCH ----------

function setupSearch() {
  searchInputEl.addEventListener("input", () => {
    const q = searchInputEl.value.toLowerCase();
    filteredUsers = users.filter((u) =>
      (u.email || "").toLowerCase().includes(q)
    );
    renderUserList();
  });
}

// ---------- LOAD USERS ----------

async function loadUsers() {
  try {
    const res = await fetch("/api/admin/get-users");
    const data = await res.json();
    if (!data.success) {
      userListEl.innerHTML = `<li class="user-list-item">Failed to load users</li>`;
      return;
    }

    users = data.users || [];
    filteredUsers = [...users];

    renderUserList();

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
