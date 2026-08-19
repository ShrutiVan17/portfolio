const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");

window.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
});

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const projectCategories = [
  {
    id: "ai",
    label: "AI / GenAI",
    title: "AI Agent / Chatbot / GenAI Projects",
    description: "Projects that show chatbot workflows, AI decision support, cloud prototypes, prompt flows, and automation use cases.",
    image: "assets/project-parksafe-ai.webp",
    projects: [
      {
        name: "ParkSafe AI",
        meta: "AI parking decision agent",
        image: "assets/project-parksafe-ai.webp",
        description: "Built an AI parking decision agent using live parking data, Elastic search, Google Routes walking time, and Gemini AI. It recommends parking based on occupancy, distance, walking time, ticket risk, and parking score.",
        tags: ["Gemini AI", "Elastic search", "Google Routes", "Decision scoring"],
      },
      {
        name: "Healthcare Dental Clinic AI Agent Prototype",
        meta: "Healthcare AI support workflow",
        image: "assets/project-dental-ai-real.webp",
        description: "Designed an AI agent for dental clinic FAQs, appointment intent handling, reminders, marketing messages, and human escalation with privacy-aware prompt flows.",
        tags: ["AI agent", "Prompt flows", "Privacy", "Escalation logic"],
      },
      {
        name: "Vertex AI Salon Service Chatbot",
        meta: "Customer-service automation",
        image: "assets/project-salon-chatbot-real.webp",
        description: "Built a Vertex AI chatbot prototype for service, pricing, availability, and booking questions in a customer-service workflow, then refined prompts using customer interaction analysis.",
        tags: ["Vertex AI", "Chatbot", "Prompt improvement", "Customer analytics"],
      },
      {
        name: "AWS Lambda University Course Assistant",
        meta: "Serverless chatbot",
        image: "assets/project-course-assistant-real.webp",
        description: "Built a serverless chatbot during a hackathon to answer course questions and guide students to academic information using AWS Lambda request handling and troubleshooting.",
        tags: ["AWS Lambda", "Serverless", "Hackathon", "Request handling"],
      },
    ],
  },
  {
    id: "ml",
    label: "ML / Predictive",
    title: "Machine Learning / Predictive Analytics Projects",
    description: "Projects focused on prediction, anomaly detection, model comparison, imbalanced data, healthcare risk, and operational forecasting.",
    image: "assets/project-credit-fraud-dashboard.webp",
    projects: [
      {
        name: "Credit Card Fraud Detection",
        meta: "Financial anomaly detection",
        image: "assets/project-credit-fraud-dashboard.webp",
        description: "Developed a fraud detection system using SQL preprocessing, Python/R, SMOTE, KNN, Isolation Forest, and Power BI dashboards to explain fraud risk visually.",
        tags: ["SMOTE", "KNN", "Isolation Forest", "Power BI"],
      },
      {
        name: "Diabetes Prediction Model Comparison",
        meta: "Healthcare ML comparison",
        image: "assets/project-diabetes-prediction.webp",
        description: "Compared XGBoost, KNN, TensorFlow, and PyTorch models to predict diabetes risk with accuracy, AUC, and performance comparison.",
        tags: ["XGBoost", "TensorFlow", "PyTorch", "AUC"],
      },
      {
        name: "Cervical Cancer Prediction",
        meta: "Healthcare risk analytics",
        image: "assets/project-cervical-cancer.webp",
        description: "Researched a healthcare risk prediction project using lifestyle, behavioral, and medical factors to support prevention and data-driven screening awareness.",
        tags: ["Healthcare analytics", "Risk prediction", "Screening support"],
      },
      {
        name: "Utility Bill Anomaly Detection Automation",
        meta: "Operational cost control",
        image: "assets/project-utility-bill-real.webp",
        description: "Built an automated pipeline to process utility bill data, normalize costs by occupancy, flag unusual usage, and generate CSV summaries.",
        tags: ["Anomaly detection", "Automation", "CSV pipeline", "Cost control"],
      },
    ],
  },
  {
    id: "sql",
    label: "SQL / Database",
    title: "SQL / Database / Data Modeling Projects",
    description: "Projects that show the data preparation layer: database modeling, SQL pipelines, normalization, and analysis-ready structures.",
    image: "assets/project-hr-attrition.webp",
    projects: [
      {
        name: "IBM HR Attrition Analytics Database",
        meta: "MySQL data modeling",
        image: "assets/project-hr-attrition.webp",
        description: "Designed a normalized HR analytics database using ERD/EER modeling, 3NF normalization, foreign keys, lookup tables, and SQL queries for attrition analysis.",
        tags: ["MySQL", "3NF", "ERD/EER", "Attrition analytics"],
      },
      {
        name: "Credit Card Fraud SQL Pipeline",
        meta: "ML data preparation",
        image: "assets/project-credit-card-ui.webp",
        description: "Created a SQL preprocessing pipeline to clean, structure, and prepare transaction data before applying machine learning models.",
        tags: ["SQL", "Preprocessing", "Transaction data", "Fraud analytics"],
      },
    ],
  },
  {
    id: "nlp",
    label: "NLP / Sentiment",
    title: "NLP / Sentiment Analysis Projects",
    description: "Projects that convert unstructured customer or review text into business insight, sentiment categories, and product feedback themes.",
    image: "assets/project-salon-chatbot.webp",
    projects: [
      {
        name: "Movie Review Sentiment Analysis",
        meta: "Text classification",
        image: "assets/project-salon-chatbot.webp",
        description: "Built an NLP sentiment analysis project using tokenization, lemmatization, stop-word removal, SpaCy, NLTK, and scikit-learn.",
        tags: ["SpaCy", "NLTK", "scikit-learn", "Text mining"],
      },
      {
        name: "Amazon Product Review Sentiment Analysis",
        meta: "Customer feedback analytics",
        image: "assets/project-utility-anomaly.webp",
        description: "Analyzed Amazon product reviews to identify customer sentiment, product feedback patterns, positive and negative opinions, and pain points.",
        tags: ["Sentiment", "Product analytics", "Customer pain points"],
      },
    ],
  },
  {
    id: "viz",
    label: "Dashboards / PPT",
    title: "Data Visualization / Dashboard / PPT Projects",
    description: "Projects that show analytics storytelling, dashboard structure, visual communication, and executive-ready explanation.",
    image: "assets/project-utility-anomaly.webp",
    projects: [
      {
        name: "Apple / Movado / Fossil Stock Analysis PPT",
        meta: "Financial storytelling",
        image: "assets/project-credit-card-ui.webp",
        description: "Created a stock analysis presentation comparing company performance, stock movement, and business trends.",
        tags: ["Stock analysis", "Presentation", "Trend comparison"],
      },
      {
        name: "AI & ML Good vs Bad Visualization PPT",
        meta: "Explainability visuals",
        image: "assets/project-hr-attrition.webp",
        description: "Created a presentation comparing poor ML visuals with better alternatives, including heatmaps, confusion matrices, feature charts, decision trees, and explainability visuals.",
        tags: ["ML visuals", "Explainability", "Presentation design"],
      },
      {
        name: "Time-Series Dashboard Assignment",
        meta: "Trend and seasonality dashboard",
        image: "assets/project-credit-fraud-dashboard.webp",
        description: "Built a time-series dashboard concept with trend charts, comparison views, seasonal analysis, summary panels, and controls.",
        tags: ["Time series", "Dashboard", "Seasonality", "Controls"],
      },
      {
        name: "Amazon Product Review Sentiment Visualization",
        meta: "NLP dashboard storytelling",
        image: "assets/project-salon-chatbot-real.webp",
        description: "Created visual insights from Amazon reviews, including positive vs negative sentiment, ratings, and customer feedback themes.",
        tags: ["Sentiment visuals", "Ratings", "Customer themes"],
      },
    ],
  },
  {
    id: "web3",
    label: "Blockchain / Web3",
    title: "Blockchain / Web3 Project",
    description: "A supply-chain trust project that shows product authenticity verification and smart-contract thinking.",
    image: "assets/project-course-assistant.webp",
    projects: [
      {
        name: "Fake Product Identification Using Blockchain",
        meta: "Anti-counterfeit verification",
        image: "assets/project-course-assistant.webp",
        description: "Built a product authenticity tracking system using Solidity, Ethereum smart contracts, MetaMask, and web modules to solve a supply-chain trust problem.",
        tags: ["Solidity", "Ethereum", "MetaMask", "Supply chain"],
      },
    ],
  },
  {
    id: "bigdata",
    label: "Big Data / NoSQL",
    title: "Big Data / NoSQL Project",
    description: "A scalable data handling project with NoSQL storage and faster processing for large marketplace-style datasets.",
    image: "assets/project-salon-chatbot.webp",
    projects: [
      {
        name: "Big Data Analysis of eBay",
        meta: "NoSQL marketplace analytics",
        image: "assets/project-hr-attrition.webp",
        description: "Worked on an eBay-style big data project using Apache Cassandra for scalable storage, faster data processing, fault tolerance, and recommendation-style analytics.",
        tags: ["Apache Cassandra", "NoSQL", "Scalability", "Big data"],
      },
    ],
  },
  {
    id: "industry",
    label: "Industry Analytics",
    title: "Industry Analytics / Business Analytics Projects",
    description: "Business-facing analytics projects for energy, healthcare, operations, cost trends, quality issues, and decision support.",
    image: "assets/project-utility-anomaly.webp",
    projects: [
      {
        name: "Energy Forecasting / Data Center Energy Analytics",
        meta: "Energy and operations analytics",
        image: "assets/project-utility-bill-real.webp",
        description: "Researched energy usage, cost forecasting, and demand analysis for AI/data center operations with attention to abnormal consumption and cost control.",
        tags: ["Forecasting", "Energy analytics", "Operations", "Cost analysis"],
      },
      {
        name: "Healthcare Claims / EOB Analytics",
        meta: "Healthcare operations analytics",
        image: "assets/project-dental-ai-real.webp",
        description: "Researched healthcare claims and Explanation of Benefits data to identify errors, cost trends, claim patterns, data quality issues, and operational decision opportunities.",
        tags: ["Claims data", "EOB", "Data quality", "Healthcare analytics"],
      },
    ],
  },
];

const categoryTabs = document.getElementById("categoryTabs");
const projectGrid = document.getElementById("projectGrid");
const categoryTitle = document.getElementById("categoryTitle");
const categoryDescription = document.getElementById("categoryDescription");
const categoryCount = document.getElementById("categoryCount");
const categoryPanel = document.querySelector(".category-panel");

function renderCategoryTabs(activeId) {
  categoryTabs.innerHTML = projectCategories.map((category) => `
    <button class="category-tab ${category.id === activeId ? "active" : ""}" type="button" data-category="${category.id}">
      <span>${category.projects.length}</span>
      ${category.label}
    </button>
  `).join("");
}

function renderProjects(categoryId = "ai") {
  const category = projectCategories.find((item) => item.id === categoryId) || projectCategories[0];
  categoryTitle.textContent = category.title;
  categoryDescription.textContent = category.description;
  categoryCount.textContent = `${category.projects.length} ${category.projects.length === 1 ? "project" : "projects"}`;
  renderCategoryTabs(category.id);

  projectGrid.innerHTML = category.projects.map((project, index) => `
    <article class="project-card dynamic-card ${index === 0 && category.projects.length > 2 ? "featured" : ""}" style="--card-index: ${index}">
      <div class="project-visual">
        <img src="${project.image || category.image}" alt="${project.name} visual concept" loading="lazy">
      </div>
      <div class="project-body">
        <span>${project.meta}</span>
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <div class="tag-row">
          ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
      </div>
    </article>
  `).join("");
}

categoryTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  categoryPanel.classList.add("switching");
  window.setTimeout(() => {
    renderProjects(button.dataset.category);
    categoryPanel.classList.remove("switching");
  }, 160);
});

renderProjects("ai");

const revealTargets = document.querySelectorAll(
  ".logo-strip, .about-grid, #experience, .projects-section, .capabilities, .education-grid, .contact-section"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("visible"));
}

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("senderName").value.trim();
  const email = document.getElementById("senderEmail").value.trim();
  const message = document.getElementById("senderMessage").value.trim();

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Hi Shruti,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`);

  window.location.href = `mailto:shrutivanparia171@gmail.com?subject=${subject}&body=${body}`;
});
