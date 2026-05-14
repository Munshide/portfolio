const root = document.documentElement;
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const filterButtons = document.querySelectorAll(".filter-button");
const skillCards = document.querySelectorAll(".skill-card");
const projectButtons = document.querySelectorAll(".project-card");
const projectPreview = document.querySelector(".project-preview");
const projectTitle = document.querySelector("#projectTitle");
const projectStack = document.querySelector("#projectStack");
const projectDescription = document.querySelector("#projectDescription");
const projectImage = document.querySelector("#projectImage");
const projectLink = document.querySelector("#projectLink");
const contactForm = document.querySelector("#contactForm");
const formNote = document.querySelector("#formNote");
const gameMessage = document.querySelector("#gameMessage");
const statusSteps = document.querySelectorAll(".status-strip span");
const canvas = document.querySelector("#heroCanvas");
const ctx = canvas.getContext("2d");

const projects = {
  coffee: {
    title: "Coffee Website",
    stack: "HTML, CSS, JavaScript, Bootstrap",
    description:
      "A simple responsive website that shares information about coffee and presents a clean small-project layout.",
    theme: "coffee",
    link: "https://coffeeweb256.netlify.app/",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Coffee Website preview",
  },
  commerce: {
    title: "Store Admin Panel",
    stack: "Node.js, database, authentication",
    description:
      "An admin workspace for managing products, orders, customer records, and role-based access with a clean operational UI.",
    theme: "commerce",
    link: "#",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Store Admin Panel preview",
  },
  notes: {
    title: "Smart Notes App",
    stack: "JavaScript, local storage, search",
    description:
      "A productivity app with tagged notes, instant search, saved drafts, and a distraction-free interface for everyday use.",
    theme: "notes",
    link: "#",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Smart Notes App preview",
  },
};

const nodes = [
  { label: "UI", x: 0.18, y: 0.28, color: "#58d6b3" },
  { label: "API", x: 0.58, y: 0.2, color: "#f6c85f" },
  { label: "DB", x: 0.78, y: 0.58, color: "#66a8ff" },
  { label: "Deploy", x: 0.34, y: 0.72, color: "#ff6b7a" },
];

let pointer = { x: 0.5, y: 0.5 };
let currentStep = 0;
let mappedNodes = [];

function updateGameStatus(message) {
  gameMessage.textContent = message;
  statusSteps.forEach((step, index) => {
    step.classList.toggle("done", index < currentStep);
    step.classList.toggle("active", index === currentStep && currentStep < nodes.length);
  });
}

document.addEventListener("pointermove", (event) => {
  const x = Math.round((event.clientX / window.innerWidth) * 100);
  const y = Math.round((event.clientY / window.innerHeight) * 100);
  root.style.setProperty("--spot-x", `${x}%`);
  root.style.setProperty("--spot-y", `${y}%`);
  pointer = { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight };
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clickX = (event.clientX - rect.left) * scaleX;
  const clickY = (event.clientY - rect.top) * scaleY;
  const targetNode = mappedNodes[currentStep];

  if (!targetNode) {
    currentStep = 0;
    updateGameStatus("Click UI to start the deployment path.");
    return;
  }

  const distance = Math.hypot(clickX - targetNode.px, clickY - targetNode.py);
  if (distance > 48) {
    updateGameStatus(`Find and click ${targetNode.label}.`);
    return;
  }

  currentStep += 1;
  if (currentStep >= nodes.length) {
    updateGameStatus("Deployment complete. Click the canvas to play again.");
    statusSteps.forEach((step) => step.classList.add("done"));
    return;
  }

  updateGameStatus(`${targetNode.label} connected. Next: ${nodes[currentStep].label}.`);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px" },
);

sections.forEach((section) => observer.observe(section));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    skillCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !visible);
    });
  });
});

function updateProject(projectId) {
  const project = projects[projectId];
  projectTitle.textContent = project.title;
  projectStack.textContent = project.stack;
  projectDescription.textContent = project.description;
  projectImage.src = project.image;
  projectImage.alt = project.imageAlt;
  projectPreview.dataset.theme = project.theme;
  projectLink.href = project.link;
  projectLink.target = project.link === "#" ? "" : "_blank";
  projectLink.rel = project.link === "#" ? "" : "noreferrer";
  projectLink.textContent = project.link === "#" ? "View Case Study" : "View Project";
  projectLink.setAttribute("aria-label", `Open ${project.title} case study`);
}

projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    projectButtons.forEach((item) => item.classList.toggle("active", item === button));
    updateProject(button.dataset.project);
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const emailEndpoint = "https://formsubmit.co/ajax/munshidmd@gmail.com";
  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const message = formData.get("message").trim();
  const submitButton = contactForm.querySelector("button[type='submit']");

  if (!name || !message) {
    formNote.textContent = "Please add your name and message.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  formNote.textContent = "";

  fetch(emailEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      message,
      _subject: `Portfolio message from ${name}`,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Message failed");
      }
      contactForm.reset();
      formNote.textContent = "Message sent. Thank you.";
    })
    .catch(() => {
      formNote.textContent = "Message could not be sent. Please try again.";
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = "Send";
    });
});

function drawHero(time = 0) {
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#101720";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(245,247,251,0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  mappedNodes = nodes.map((node, index) => {
    const drift = Math.sin(time / 800 + index) * 12;
    return {
      ...node,
      px: node.x * width + (pointer.x - 0.5) * 24,
      py: node.y * height + drift + (pointer.y - 0.5) * 18,
    };
  });

  ctx.lineWidth = 3;
  mappedNodes.forEach((node, index) => {
    const next = mappedNodes[(index + 1) % mappedNodes.length];
    const isConnected = index < currentStep - 1;
    ctx.strokeStyle = isConnected ? "rgba(88,214,179,0.8)" : "rgba(88,214,179,0.24)";
    ctx.beginPath();
    ctx.moveTo(node.px, node.py);
    ctx.lineTo(next.px, next.py);
    ctx.stroke();
  });

  mappedNodes.forEach((node, index) => {
    const isActive = index === currentStep;
    const isDone = index < currentStep;
    const size = isActive ? 78 : 68;
    ctx.fillStyle = node.color;
    ctx.shadowColor = node.color;
    ctx.shadowBlur = isActive ? 34 : 18;
    ctx.fillRect(node.px - size / 2, node.py - size / 2, size, size);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#080b0f";
    ctx.font = "900 18px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, node.px, node.py);

    if (isActive || isDone) {
      ctx.strokeStyle = isDone ? "#58d6b3" : "#f6c85f";
      ctx.lineWidth = 4;
      ctx.strokeRect(node.px - size / 2 - 5, node.py - size / 2 - 5, size + 10, size + 10);
    }
  });

  ctx.fillStyle = "rgba(245,247,251,0.88)";
  ctx.font = "800 16px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("click nodes: UI -> API -> DB -> Deploy", 34, 88);

  requestAnimationFrame(drawHero);
}

updateProject("coffee");
updateGameStatus("Click UI to start the deployment path.");
drawHero();
