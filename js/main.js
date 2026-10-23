// shared script (Interactions 1-3 + service worker registration)
const $ = (s) => document.querySelector(s);
const root = document.documentElement;

/* Interaction 1a: slide switch for light/dark theme */
const sw = $("#theme-switch");
function setTheme(t) {
  root.dataset.theme = t;
  sw.setAttribute("aria-checked", t === "dark");
  try {
    localStorage.setItem("theme", t);
  } catch (e) {}
}
let saved = null;
try {
  saved = localStorage.getItem("theme");
} catch (e) {}
setTheme(
  saved ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
);
let startX = null,
  dragged = false;
sw.addEventListener("pointerdown", (e) => {
  startX = e.clientX;
  dragged = false;
});
sw.addEventListener("pointerup", (e) => {
  if (startX === null) return;
  const dx = e.clientX - startX;
  startX = null;
  if (Math.abs(dx) > 8) {
    dragged = true;
    setTheme(dx > 0 ? "dark" : "light");
  }
});
sw.addEventListener("click", () => {
  if (dragged) {
    dragged = false;
    return;
  }
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

/* Interaction 1b: open/close menu on small screens */
const menuBtn = $("#menu-btn"),
  nav = $("#site-nav");
menuBtn.addEventListener("click", () => {
  menuBtn.setAttribute("aria-expanded", nav.classList.toggle("open"));
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

/* Show a placeholder frame if photo.jpg is missing */
document.querySelectorAll(".photo img").forEach((img) => {
  const miss = () => img.parentElement.classList.add("no-photo");
  img.addEventListener("error", miss);
  if (img.complete && img.naturalWidth === 0) miss();
});

/* Interaction 3: fetch data.json, render tabs + items with DOM manipulation */
async function loadHobbies() {
  const tablist = $("#hobby-tabs"),
    panel = $("#hobby-panel");
  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const show = (key) => {
      tablist
        .querySelectorAll("[role=tab]")
        .forEach((t) => t.setAttribute("aria-selected", t.dataset.key === key));
      panel.setAttribute("aria-labelledby", "tab-" + key);
      panel.replaceChildren(
        ...data[key].map((entry) => {
          const art = document.createElement("article");
          art.className = "item";
          const h = document.createElement("h3");
          h.textContent = entry.title;
          const by = document.createElement("p");
          by.className = "by";
          by.textContent = entry.by;
          const note = document.createElement("p");
          note.textContent = entry.note;
          art.append(h, by, note);
          return art;
        }),
      );
    };
    [
      ["books", "Books"],
      ["films", "Films"],
      ["music", "Music"],
    ].forEach(([key, label]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tab";
      b.id = "tab-" + key;
      b.dataset.key = key;
      b.setAttribute("role", "tab");
      b.textContent = label;
      b.addEventListener("click", () => show(key));
      tablist.append(b);
    });
    show("books");
  } catch (err) {
    panel.textContent =
      "Could not load the list. Check your connection and reload the page.";
  }
}
if ($("#hobby-panel")) loadHobbies();

/* Interaction 2: client-side form validation */
const form = $("#contact-form");
if (form) {
  const rules = {
    name: (v) => (v.trim() ? "" : "Enter your name."),
    email: (v) =>
      !v.trim()
        ? "Enter your email address."
        : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
          ? ""
          : "Check the email format, for example name@example.com.",
    message: (v) =>
      v.trim().length >= 10
        ? ""
        : "Write at least 10 characters so I know what you mean.",
  };
  const fields = [...form.querySelectorAll("input, textarea")];
  const check = (f) => {
    const msg = rules[f.name](f.value);
    $("#" + f.id + "-error").textContent = msg;
    f.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  };
  fields.forEach((f) => {
    f.addEventListener("blur", () => check(f));
    f.addEventListener(
      "input",
      () => f.getAttribute("aria-invalid") === "true" && check(f),
    );
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = $("#form-status");
    const ok = fields.map(check).every(Boolean);
    if (!ok) {
      status.textContent = "";
      fields.find((f) => f.getAttribute("aria-invalid") === "true").focus();
      return;
    }
    status.textContent =
      "Thank you, " +
      form.name.value.trim() +
      "! Your message is ready. (Demo form: nothing is sent to a server.)";
    form.reset();
  });
}

/* PWA: register the service worker */
if ("serviceWorker" in navigator) {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js"));
}
