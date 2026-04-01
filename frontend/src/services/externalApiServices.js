import axios from "axios";

// Local skill database for autocomplete, not from an API.
const SKILLS_DATABASE = [
  "React.js", "Vue.js", "Angular", "Next.js", "Nuxt.js", "Svelte",
  "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "SCSS", "Sass",
  "JavaScript", "TypeScript", "jQuery", "Redux", "Zustand", "MobX",
  "Webpack", "Vite", "Babel", "ESLint", "Prettier",
  "Node.js", "Express.js", "Nest.js", "Django", "Flask", "FastAPI",
  "Spring Boot", "Laravel", "Ruby on Rails", "ASP.NET", "PHP",
  "Python", "Java", "C#", "C++", "C", "Go", "Rust", "Ruby", "Kotlin", "Swift",
  "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Firebase",
  "Elasticsearch", "Cassandra", "DynamoDB", "Supabase", "PlanetScale",
  "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform",
  "CI/CD", "GitHub Actions", "Jenkins", "Linux", "Nginx", "Apache",
  "Vercel", "Netlify", "Heroku", "Render", "Railway",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras",
  "Scikit-learn", "Pandas", "NumPy", "OpenCV", "LangChain", "OpenAI API",
  "Anthropic Claude", "NLP", "Computer Vision", "Data Science",
  "Tableau", "Power BI", "Excel", "R", "MATLAB",
  "React Native", "Flutter", "Android", "iOS", "Expo", "Ionic",
  "REST APIs", "GraphQL", "WebSockets", "gRPC", "Postman",
  "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Notion",
  "JWT", "OAuth", "Stripe", "Twilio", "SendGrid", "Socket.io",
  "Jest", "Cypress", "Selenium", "Playwright", "Vitest", "Mocha",
  "Figma", "Adobe XD", "Photoshop", "Illustrator", "UI/UX Design",
  "Responsive Design", "Accessibility", "Material UI", "Ant Design",
  "Solidity", "Web3.js", "Ethers.js", "Hardhat", "Smart Contracts",
  "Agile", "Scrum", "Team Leadership", "Project Management",
  "Communication", "Problem Solving", "System Design", "Microservices",
];

export const externalApiServices = {
  // Filters against our local skills list
  searchSkills: (query) => {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    return SKILLS_DATABASE
      .filter((skill) => skill.toLowerCase().includes(q))
      .slice(0, 8)
      .map((name, i) => ({ id: i, name }));
  },

  // Clearbit company autocomplete
  searchCompanies: async (query) => {
    try {
      const res = await axios.get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`);
      return res.data;
    } catch {
      return [];
    }
  },

  // University name autocomplete
  searchUniversities: async (query) => {
    try {
      const res = await axios.get(`http://universities.hipolabs.com/search?name=${query}`);
      return res.data;
    } catch {
      return [];
    }
  },
};