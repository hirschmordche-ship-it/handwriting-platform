// Phase 1: structure + basic behavior

// Simple theme toggle hook – wire this into your real theme logic
const themeToggleBtn = document.getElementById("themeToggle");
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("theme-dark");
    document.body.classList.toggle("theme-light");
  });
}

// Elements
const tabs = document.querySelectorAll(".admin-tab");
const userListEl = document.getElementById("userList");
const userSearchEl = document.getElementById("userSearch");
const userSummaryEl = document.getElementById("userSummary");
const userDetailsSectionsEl = document.getElementById("userDetailsSections");
const userEmailEl = document.getElementById("userEmail");
const userRoleEl = document.getElementById("userRole");
const userStatusEl = document.getElementById("userStatus");
const glyphViewToggles = document.querySelectorAll(".glyph-view-toggle");
const glyphsByLetterEl = document.getElementById("glyphsByLetter");
const glyphsAllEl = document.getElementById("glyphsAll");

let currentLang = "en";
let allUsers = [];
let filteredUsers = [];
let selectedUserId = null;
let currentGlyphViewMode = "letters"; // "letters" | "all"

// FRONTEND GUARD (Phase 1: placeholder – real check is via backend routes)
// You already protect admin via backend; later we can add a real session check here if needed.

init();

async function init() {
  await loadUsers();
  setupTabSwitching();
  setupUserSearch();
  setupGlyphViewToggle();
}

function setupTabSwitching() {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentLang = tab.dataset.lang; // "en" or "he"
      if (selectedUserId) {
        loadUserDetails(selectedUserId);
      }
    });
  });
}

function setupUserSearch() {
  userSearchEl.addEventListener("input", () => {
    const q = userSearchEl.value.toLowerCase().trim();
    filteredUsers = allUsers.filter((u) =>
      (u.email || "").toLowerCase().includes(q)
    );
    renderUserList();
  });
}

function setupGlyphViewToggle() {
  glyphViewToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      glyphViewToggles.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentGlyphViewMode = btn.dataset.mode; // "letters" or "all"
      if (selectedUserId) {
        loadUserDetails(selectedUserId);
      }
    });
  });
}

async function loadUsers() {
  try {
    const res = await fetch("/api/admin/list-users", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (!data.success) {
      userListEl.innerHTML = `<li class="user-list-item">Failed to load users</li>`;
      return;
    }

    allUsers = data.users || [];
    filteredUsers = allUsers;
    renderUserList();
  } catch (err) {
    userListEl.innerHTML = `<li class="user-list-item">Error loading users</li>`;
  }
}

function renderUserList() {
  userListEl.innerHTML = "";

  if (!filteredUsers.length) {
    userListEl.innerHTML = `<li class="user-list-item">No users found</li>`;
    return;
  }

  filteredUsers.forEach((user) => {
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
    metaDiv.innerHTML = `
      <span>${user.role || "user"}</span>
      <span>EN: ? | HE: ?</span>
    `; // counts will be filled in Phase 2

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
  });
}

async function loadUserDetails(userId) {
  try {
    userSummaryEl.classList.add("hidden");
    userDetailsSectionsEl.classList.remove("hidden");

    const res = await fetch("/api/admin/get-user-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        language: currentLang
      })
    });

    const data = await res.json();
    if (!data.success) {
      userEmailEl.textContent = "Failed to load user";
      userRoleEl.textContent = "";
      userStatusEl.textContent = "";
      glyphsByLetterEl.innerHTML = "";
      glyphsAllEl.innerHTML = "";
      return;
    }

    const user = data.user;
    const glyphs = data.glyphs || [];

    userEmailEl.textContent = user.email || "(no email)";
    userRoleEl.textContent = `Role: ${user.role || "user"}`;
    userStatusEl.textContent = ""; // Phase 2: online/offline, last login, etc.

    if (currentGlyphViewMode === "letters") {
      renderGlyphsByLetter(glyphs);
      glyphsByLetterEl.classList.remove("hidden");
      glyphsAllEl.classList.add("hidden");
    } else {
      renderGlyphsAll(glyphs);
      glyphsByLetterEl.classList.add("hidden");
      glyphsAllEl.classList.remove("hidden");
    }
  } catch (err) {
    userEmailEl.textContent = "Error loading user";
    userRoleEl.textContent = "";
    userStatusEl.textContent = "";
    glyphsByLetterEl.innerHTML = "";
    glyphsAllEl.innerHTML = "";
  }
}

function renderGlyphsByLetter(glyphs) {
  if (!glyphs.length) {
    glyphsByLetterEl.innerHTML = `<p>No glyphs for this user in this language.</p>`;
    return;
  }

  const byLetter = {};
  glyphs.forEach((g) => {
    const letter = g.letter || "?"; // adjust field name if needed
    if (!byLetter[letter]) byLetter[letter] = [];
    byLetter[letter].push(g);
  });

  const letters = Object.keys(byLetter).sort();
  const grid = document.createElement("div");
  grid.className = "glyphs-by-letter-grid";

  letters.forEach((letter) => {
    const card = document.createElement("div");
    card.className = "glyph-letter-card";

    const letterSpan = document.createElement("span");
    letterSpan.className = "glyph-letter";
    letterSpan.textContent = letter;

    const countSpan = document.createElement("span");
    countSpan.className = "glyph-count";
    countSpan.textContent = `${byLetter[letter].length} glyphs`;

    card.appendChild(letterSpan);
    card.appendChild(countSpan);

    card.addEventListener("click", () => {
      // Phase 2: show glyphs for this letter in a modal or detail view
    });

    grid.appendChild(card);
  });

  glyphsByLetterEl.innerHTML = "";
  glyphsByLetterEl.appendChild(grid);
}

function renderGlyphsAll(glyphs) {
  if (!glyphs.length) {
    glyphsAllEl.innerHTML = `<p>No glyphs for this user in this language.</p>`;
    return;
  }

  glyphsAllEl.innerHTML = "";
  glyphs.forEach((g) => {
    const item = document.createElement("div");
    item.className = "glyph-item";

    const main = document.createElement("div");
    main.className = "glyph-item-main";

    const title = document.createElement("div");
    title.textContent = g.letter || "(no letter)";

    const meta = document.createElement("div");
    meta.className = "glyph-item-meta";
    meta.textContent = `Created: ${g.created_at || ""}`;

    main.appendChild(title);
    main.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "glyph-item-actions";

    const viewBtn = document.createElement("button");
    viewBtn.textContent = "View";
    // Phase 2: open glyph preview / details

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    // Phase 2: call delete glyph route

    actions.appendChild(viewBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(main);
    item.appendChild(actions);

    glyphsAllEl.appendChild(item);
  });
}
