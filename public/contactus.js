const form = document.getElementById("contactForm");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

// Change this to your actual Supabase project URL
const CONTACT_FUNCTION_URL = "/api/contact";

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = "status";
  if (type === "success") statusEl.classList.add("status--success");
  if (type === "error") statusEl.classList.add("status--error");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("");
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!email || !message) {
    setStatus("Please fill in both fields.", "error");
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
    return;
  }

  try {
    const res = await fetch(CONTACT_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, message })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Contact function error:", res.status, text);
      throw new Error("Request failed");
    }

    setStatus(
      "Thank you! Your message has been sent. Please check your email for confirmation.",
      "success"
    );
    form.reset();
  } catch (err) {
    console.error(err);
    setStatus(
      "Something went wrong while sending your message. Please try again in a moment.",
      "error"
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  }
});
