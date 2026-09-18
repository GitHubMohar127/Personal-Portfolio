/* ==========================================================================
   MOHAR MUKHERJEE — AI/ML ENGINEER PORTFOLIO
   script.js
   Sections:
   1. Navigation (active link + navbar shrink)
   2. Mobile menu
   3. Scroll behavior (smooth anchor offset handled via CSS)
   4. Scroll reveal (IntersectionObserver)
   5. Project filtering
   6. Project modal (case studies)
   7. Contact handling (mailto)
   8. GitHub repositories fetch
   9. Utility functions
   ========================================================================== */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     1. Navigation — navbar shrink on scroll + active section indicator
     ------------------------------------------------------------------ */
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav a");
  const sections = document.querySelectorAll("main section[id], section[id]");

  function handleNavbarScroll() {
    if (window.scrollY > 24) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  }

  function setActiveLink() {
    let currentId = "";
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      if (!section.id) return;
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", href === currentId);
    });
  }

  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        handleNavbarScroll();
        setActiveLink();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  handleNavbarScroll();
  setActiveLink();

  /* ------------------------------------------------------------------
     2. Mobile menu
     ------------------------------------------------------------------ */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
    document.body.classList.remove("modal-open");
  }

  function toggleMobileNav() {
    const isOpen = mobileNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("modal-open", isOpen);
  }

  navToggle.addEventListener("click", toggleMobileNav);

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
      closeMobileNav();
    }
  });

  /* ------------------------------------------------------------------
     4. Scroll reveal
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------
     5. Project filtering
     ------------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      projectCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  });

  /* ------------------------------------------------------------------
     6. Project modal — case study data + open/close logic
     ------------------------------------------------------------------ */
  const caseStudies = {
    instamed: {
      category: "Web Application",
      title: "InstaMed",
      problem:
        "Medicine information online is scattered and often unverified, and manual drug lookups cost users time they shouldn't have to spend.",
      approach:
        "Built a Flask application with user login and SQLite-backed medicine data retrieval, letting users search medicines, view details, and bookmark the ones they reference often.",
      stack: ["Flask", "SQLite", "Python", "User Auth"],
      live: "https://instamed-15.onrender.com",
      github: null,
    },
    faceframe: {
      category: "Machine Learning / Computer Vision",
      title: "FaceFrame",
      problem:
        "Manual attendance tracking is slow and easy to falsify, and existing systems often lack real-time feedback or easy record management.",
      approach:
        "Built a real-time face recognition attendance system using OpenCV and Haar cascades for detection and a KNN classifier for recognition, with Windows SAPI voice feedback and automatic CSV logging. A Streamlit interface handles daily record viewing and visualization.",
      stack: ["OpenCV", "Haar Cascades", "KNN", "Streamlit", "Python"],
      live: null,
      github: "https://github.com/GitHubMohar127/FaceFrame",
    },
    spam: {
      category: "NLP / Machine Learning",
      title: "Email Spam Classifier",
      problem:
        "Unfiltered spam reduces email usability and creates security risk, and simple keyword filters miss evolving spam patterns.",
      approach:
        "Preprocessed email text and extracted features with TF-IDF, then trained and evaluated Naïve Bayes and SVM models to classify messages as spam or non-spam, improving filtering accuracy over rule-based approaches.",
      stack: ["TF-IDF", "Naïve Bayes", "SVM", "Python"],
      live: "https://spam-detector-13.onrender.com",
      github: null,
    },
    movie: {
      category: "Machine Learning",
      title: "Movie Recommendation System",
      problem:
        "Viewers face too many choices and want suggestions that actually match their taste rather than generic popularity rankings.",
      approach:
        "Implemented content-based filtering with TF-IDF vectorization of movie metadata and cosine similarity. A user enters a movie title and receives five similar recommendations, with a focus on the comedy genre.",
      stack: ["TF-IDF", "Cosine Similarity", "Python"],
      live: null,
      github: null,
    },
    carprice: {
      category: "Machine Learning",
      title: "Car Price Prediction",
      problem:
        "Buyers and sellers often lack a reliable, data-driven reference point for pricing a used car fairly.",
      approach:
        "Trained regression models — including linear regression, decision trees, and random forests — on features like brand, model, fuel type, mileage, and condition to estimate fair market price.",
      stack: ["Linear Regression", "Decision Trees", "Random Forest"],
      live: null,
      github: null,
    },
    twitter: {
      category: "Data Analytics",
      title: "Twitter Dashboard",
      problem:
        "Raw social media data is hard to interpret without a structured way to track sentiment and engagement trends over time.",
      approach:
        "Built an interactive Power BI dashboard covering sentiment analysis, trending hashtags, and engagement metrics, using Power Query for transformation and DAX for calculated insights.",
      stack: ["Power BI", "DAX", "Power Query"],
      live: null,
      github: null,
    },
    amazon: {
      category: "Data Analytics",
      title: "Amazon Dashboard",
      problem:
        "E-commerce sales data spans many dimensions — product, region, customer — that are hard to track without a consolidated view.",
      approach:
        "Built a Power BI dashboard visualizing revenue trends, top-selling products, customer demographics, and regional sales distribution to support performance tracking.",
      stack: ["Power BI", "DAX", "Power Query"],
      live: null,
      github: null,
    },
  };

  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.getElementById("modalClose");
  const modalCategory = document.getElementById("modalCategory");
  const modalTitle = document.getElementById("modalTitle");
  const modalProblem = document.getElementById("modalProblem");
  const modalApproach = document.getElementById("modalApproach");
  const modalStack = document.getElementById("modalStack");
  const modalActions = document.getElementById("modalActions");

  let lastFocusedEl = null;

  function openModal(key) {
    const data = caseStudies[key];
    if (!data) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalProblem.textContent = data.problem;
    modalApproach.textContent = data.approach;

    modalStack.innerHTML = "";
    data.stack.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "stack-chip";
      chip.textContent = item;
      modalStack.appendChild(chip);
    });

    modalActions.innerHTML = "";
    if (data.live) {
      const liveBtn = document.createElement("a");
      liveBtn.href = data.live;
      liveBtn.target = "_blank";
      liveBtn.rel = "noopener";
      liveBtn.className = "btn btn-primary btn-sm";
      liveBtn.textContent = "Live Demo";
      modalActions.appendChild(liveBtn);
    }
    if (data.github) {
      const ghBtn = document.createElement("a");
      ghBtn.href = data.github;
      ghBtn.target = "_blank";
      ghBtn.rel = "noopener";
      ghBtn.className = "btn btn-secondary btn-sm";
      ghBtn.textContent = "GitHub";
      modalActions.appendChild(ghBtn);
    }
    if (!data.live && !data.github) {
      const note = document.createElement("p");
      note.className = "form-note";
      note.textContent = "No public demo or repository linked for this project yet.";
      modalActions.appendChild(note);
    }

    lastFocusedEl = document.activeElement;
    modalOverlay.classList.add("is-open");
    document.body.classList.add("modal-open");
    modalClose.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  document.querySelectorAll(".view-case-study").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.project));
  });

  modalClose.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("is-open")) {
      closeModal();
    }
  });

  /* ------------------------------------------------------------------
     7. Contact handling — safe mailto submission (no backend)
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("cfName").value.trim();
      const email = document.getElementById("cfEmail").value.trim();
      const message = document.getElementById("cfMessage").value.trim();

      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

      window.location.href = `mailto:moharmukherjee2004@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* ------------------------------------------------------------------
     8. GitHub repositories — live fetch with static fallback
     ------------------------------------------------------------------ */
  const repoGrid = document.getElementById("repoGrid");
  const GITHUB_USER = "GitHubMohar127";

  function renderRepoFallback() {
    repoGrid.innerHTML = "";
    const note = document.createElement("p");
    note.className = "repo-status";
    note.innerHTML = `Couldn't load live repository data right now — visit <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener" style="color:var(--accent)">github.com/${GITHUB_USER}</a> directly.`;
    repoGrid.appendChild(note);
  }

  function renderRepos(repos) {
    if (!repos || repos.length === 0) {
      renderRepoFallback();
      return;
    }

    repoGrid.innerHTML = "";
    repos.slice(0, 6).forEach((repo) => {
      const card = document.createElement("a");
      card.href = repo.html_url;
      card.target = "_blank";
      card.rel = "noopener";
      card.className = "repo-card";
      card.style.display = "block";

      const name = document.createElement("span");
      name.className = "repo-name";
      name.textContent = repo.name;

      const desc = document.createElement("p");
      desc.className = "repo-desc";
      desc.textContent = repo.description || "No description provided.";

      const meta = document.createElement("div");
      meta.className = "repo-meta";
      meta.innerHTML = `
        <span><i class="fa-regular fa-star" aria-hidden="true"></i> ${repo.stargazers_count}</span>
        <span>${repo.language || "—"}</span>
      `;

      card.appendChild(name);
      card.appendChild(desc);
      card.appendChild(meta);
      repoGrid.appendChild(card);
    });
  }

  if (repoGrid) {
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6`)
      .then((res) => {
        if (!res.ok) throw new Error("GitHub API request failed");
        return res.json();
      })
      .then((repos) => renderRepos(repos))
      .catch(() => renderRepoFallback());
  }

  /* ------------------------------------------------------------------
     9. Utility — pipeline pulse pause when off-screen (perf)
     ------------------------------------------------------------------ */
  const pipelineFlow = document.getElementById("pipelineFlow");

  if (pipelineFlow && "IntersectionObserver" in window && !prefersReducedMotion) {
    const flowDots = pipelineFlow.querySelectorAll(".flow-dot");
    const pipelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        flowDots.forEach((dot) => {
          dot.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
        });
      });
    });
    pipelineObserver.observe(pipelineFlow);
  }
})();
