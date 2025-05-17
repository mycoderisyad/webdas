const frontendSkills = ["HTML", "CSS", "JavaScript"];
const backendSkills = ["Node.js", "Express", "Python", "PHP", "MySQL"];
const toolsSkills = ["Git", "GitHub", "VS Code", "Figma", "Docker"];
const projects = [
  {
    id: 1,
    title: "Diary Notes",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum condimentum diam nec erat volutpat.",
    image: "assets/img/project/web.png",
    category: "web",
    tags: ["Laravel 11", "PHP"],
    demo: "#",
    github: "https://github.com/mycoderisyad/diarynotes",
  },
  {
    id: 2,
    title: "Bot WA",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum condimentum diam nec erat volutpat.",
    image: "assets/img/project/bot.png",
    category: "mobile",
    tags: ["Bot", "Typescript", "AI"],
    demo: "#",
    github: "https://github.com/mycoderisyad/bot-WA",
  },
  {
    id: 3,
    title: "UI",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum condimentum diam nec erat volutpat.",
    image: "assets/img/project/design.png",
    category: "design",
    tags: ["UI Design"],
    demo: "#",
    github: "#",
  },
  {
    id: 4,
    title: "Lorem Ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum condimentum diam nec erat volutpat.",
    image: "assets/img/project/",
    category: "web",
    tags: ["Lorem Ipsum", "Lorem Ipsum dolor sit amet"],
    demo: "#",
    github: "#",
  },
  {
    id: 5,
    title: "Lorem Ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum condimentum diam nec erat volutpat.",
    image: "assets/img/project/",
    category: "design",
    tags: ["Lorem Ipsum", "Lorem Ipsum dolor sit amet"],
    demo: "#",
    github: "#",
  },
  {
    id: 6,
    title: "Lorem Ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum condimentum diam nec erat volutpat.",
    image: "assets/img/project/",
    category: "web",
    tags: ["Lorem Ipsum", " dolor sit amet"],
    demo: "#",
    github: "#",
  },
];

// DOM Elements
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectsGrid = document.getElementById("projects-grid");
const frontendSkillsList = document.getElementById("frontend-skills");
const backendSkillsList = document.getElementById("backend-skills");
const toolsSkillsList = document.getElementById("tools-skills");

// Mobile Menu Toggle
menuToggle.addEventListener("click", () => {
  menu.classList.toggle("active");
  menuToggle.querySelector("i").classList.toggle("fa-bars");
  menuToggle.querySelector("i").classList.toggle("fa-times");
});

// Close menu when clicking on a menu item
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
    menuToggle.querySelector("i").classList.add("fa-bars");
    menuToggle.querySelector("i").classList.remove("fa-times");
  });
});

function populateSkillsList(skills, element) {
  skills.forEach((skill) => {
    const li = document.createElement("li");
    li.textContent = skill;
    element.appendChild(li);
  });
}

populateSkillsList(frontendSkills, frontendSkillsList);
populateSkillsList(backendSkills, backendSkillsList);
populateSkillsList(toolsSkills, toolsSkillsList);

function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.dataset.category = project.category;

  card.innerHTML = `
    <div class="project-img">
      <img src="${project.image}" alt="${project.title}">
    </div>
    <div class="project-info">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-tags">
        ${project.tags
          .map((tag) => `<span class="project-tag">${tag}</span>`)
          .join("")}
      </div>
      <div class="project-links">
        <a href="${
          project.demo
        }" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>
        <a href="${
          project.github
        }" target="_blank"><i class="fab fa-github"></i> GitHub</a>
      </div>
    </div>
  `;

  return card;
}

// Display all projects initially
function displayProjects(category = "all") {
  projectsGrid.innerHTML = "";

  const filteredProjects =
    category === "all"
      ? projects
      : projects.filter((project) => project.category === category);

  filteredProjects.forEach((project) => {
    projectsGrid.appendChild(createProjectCard(project));
  });
}

displayProjects();

// Project Filtering
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.getAttribute("data-filter");
    displayProjects(category);
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: "smooth",
      });
    }
  });
});

// animation on scroll
window.addEventListener("DOMContentLoaded", () => {
  const fadeInElements = document.querySelectorAll(
    ".section-title, .project-card, .profile-card, .about-content"
  );

  fadeInElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  function checkFadeElements() {
    fadeInElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  }

  checkFadeElements();
  window.addEventListener("scroll", checkFadeElements);
});
