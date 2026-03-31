import axios from "axios";

const SKILLS_DATABASE = [
	"React.js",
	"Vue.js",
	"Angular",
	"Next.js",
	"Nuxt.js",
	"Svelte",
	"HTML5",
	"CSS3",
	"Tailwind CSS",
	"Bootstrap",
	"SCSS",
	"Sass",
	"JavaScript",
	"TypeScript",
	"jQuery",
	"Redux",
	"Zustand",
	"MobX",
	"Webpack",
	"Vite",
	"Babel",
	"ESLint",
	"Prettier",
	"Node.js",
	"Express.js",
	"Nest.js",
	"Django",
	"Flask",
	"FastAPI",
	"Spring Boot",
	"Laravel",
	"Ruby on Rails",
	"ASP.NET",
	"PHP",
	"Python",
	"Java",
	"C#",
	"C++",
	"C",
	"Go",
	"Rust",
	"Ruby",
	"Kotlin",
	"Swift",
	"MongoDB",
	"PostgreSQL",
	"MySQL",
	"SQLite",
	"Redis",
	"Firebase",
	"Elasticsearch",
	"Cassandra",
	"DynamoDB",
	"Supabase",
	"PlanetScale",
	"AWS",
	"Google Cloud",
	"Azure",
	"Docker",
	"Kubernetes",
	"Terraform",
	"CI/CD",
	"GitHub Actions",
	"Jenkins",
	"Linux",
	"Nginx",
	"Apache",
	"Vercel",
	"Netlify",
	"Heroku",
	"Render",
	"Railway",
	"Machine Learning",
	"Deep Learning",
	"TensorFlow",
	"PyTorch",
	"Keras",
	"Scikit-learn",
	"Pandas",
	"NumPy",
	"OpenCV",
	"LangChain",
	"OpenAI API",
	"Anthropic Claude",
	"NLP",
	"Computer Vision",
	"Data Science",
	"Tableau",
	"Power BI",
	"Excel",
	"R",
	"MATLAB",
	"React Native",
	"Flutter",
	"Android",
	"iOS",
	"Expo",
	"Ionic",
	"REST APIs",
	"GraphQL",
	"WebSockets",
	"gRPC",
	"Postman",
	"Git",
	"GitHub",
	"GitLab",
	"Bitbucket",
	"Jira",
	"Notion",
	"JWT",
	"OAuth",
	"Stripe",
	"Twilio",
	"SendGrid",
	"Socket.io",
	"Jest",
	"Cypress",
	"Selenium",
	"Playwright",
	"Vitest",
	"Mocha",
	"Figma",
	"Adobe XD",
	"Photoshop",
	"Illustrator",
	"UI/UX Design",
	"Responsive Design",
	"Accessibility",
	"Material UI",
	"Ant Design",
	"Solidity",
	"Web3.js",
	"Ethers.js",
	"Hardhat",
	"Smart Contracts",
	"Agile",
	"Scrum",
	"Team Leadership",
	"Project Management",
	"Communication",
	"Problem Solving",
	"System Design",
	"Microservices",
];

// Functions for hitting 3rd-party APIs (or our local skill DB).
export const externalApiServices = {
	/**
	 * Filters the local SKILLS_DATABASE for autocomplete.
	 * @param {string} query - The search term.
	 * @returns {Array<object>} - [{ id, name }]
	 */
	searchSkills: (query) => {
		if (!query?.trim()) return [];

		const searchTerm = query.toLowerCase().trim();
		return SKILLS_DATABASE.filter((skill) =>
			skill.toLowerCase().includes(searchTerm),
		)
			.slice(0, 8)
			.map((name, i) => ({ id: `skill-${i}`, name })); // More robust ID
	},

	/**
	 * Fetches company names from Clearbit for autocomplete.
	 * @param {string} query
	 * @returns {Promise<Array<object>>}
	 */
	searchCompanies: async (query) => {
		if (!query?.trim()) return [];
		try {
			const res = await axios.get(
				`https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`,
			);
			return res.data;
		} catch (err) {
			console.error("Clearbit API failed:", err.message);
			return [];
		}
	},

	/**
	 * Fetches university names from hipolabs for autocomplete.
	 * @param {string} query
	 * @returns {Promise<Array<object>>}
	 */
	searchUniversities: async (query) => {
		if (!query?.trim()) return [];
		try {
			const res = await axios.get(
				`http://universities.hipolabs.com/search?name=${query}`,
			);
			return res.data;
		} catch (err) {
			console.error("Universities API failed:", err.message);
			return [];
		}
	},
};
