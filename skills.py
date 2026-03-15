# -*- coding: utf-8 -*-
"""
skills.py -- Comprehensive skill database + weighted extraction
Covers every career path in SmartEduCare:
CSE/Software, ECE/Hardware, Mechanical, Business/Design
"""

import re

TECH_SKILLS = [
    # Python Ecosystem
    "python", "django", "flask", "fastapi", "pandas", "numpy",
    "scipy", "matplotlib", "seaborn", "plotly", "jupyter",
    # Machine Learning / AI
    "machine learning", "deep learning", "neural networks",
    "natural language processing", "nlp", "computer vision",
    "tensorflow", "pytorch", "keras", "scikit-learn", "xgboost",
    "lightgbm", "hugging face", "transformers", "bert",
    "reinforcement learning", "mlops", "model deployment",
    "feature engineering", "transfer learning",
    # Data Science / Analytics
    "data science", "data analysis", "data visualization",
    "data engineering", "data warehousing", "data pipelines",
    "etl", "statistics", "probability", "linear algebra",
    "tableau", "power bi", "looker", "excel", "spark",
    "hadoop", "hive", "kafka", "airflow", "dbt",
    # Web / Frontend
    "html", "css", "javascript", "typescript", "react",
    "angular", "vue", "next.js", "gatsby", "svelte",
    "tailwind", "bootstrap", "sass", "webpack", "vite",
    "graphql", "rest api", "websocket",
    # Backend
    "node.js", "express", "spring boot", "spring", "java",
    "c#", "asp.net", ".net", "php", "laravel", "ruby",
    "go", "golang", "rust", "scala", "microservices",
    "rabbitmq", "grpc",
    # Databases
    "sql", "mysql", "postgresql", "sqlite", "oracle",
    "mongodb", "redis", "cassandra", "dynamodb", "firebase",
    "elasticsearch", "neo4j",
    # Cloud / DevOps
    "aws", "azure", "gcp", "google cloud", "cloud",
    "docker", "kubernetes", "terraform", "ansible", "jenkins",
    "ci/cd", "github actions", "devops",
    "linux", "bash", "shell scripting", "nginx",
    "prometheus", "grafana",
    # Cybersecurity
    "cybersecurity", "penetration testing", "ethical hacking",
    "network security", "siem", "wireshark", "metasploit",
    "kali linux", "owasp", "vulnerability assessment",
    "cryptography", "firewall",
    # Mobile
    "android", "ios", "swift", "kotlin", "react native",
    "flutter", "dart", "xcode", "android studio",
    # Version Control / Collaboration
    "git", "github", "gitlab", "bitbucket", "jira",
    "agile", "scrum", "kanban", "tdd",
    # ECE / Embedded / Hardware
    "verilog", "vhdl", "system verilog", "vlsi", "asic",
    "fpga", "eda tools", "cadence", "synopsys", "dft",
    "timing analysis",
    "embedded c", "c programming", "c++",
    "microcontrollers", "arduino", "raspberry pi",
    "rtos", "freertos", "embedded linux",
    "i2c", "spi", "uart", "can bus", "modbus", "mqtt",
    "iot", "sensors", "actuators", "pcb design", "kicad",
    "altium", "electronics", "circuit design",
    "rf engineering", "antenna design", "signal processing",
    "dsp", "microwave engineering", "4g", "5g", "wireless",
    "semiconductor", "ic design", "chip design",
    "power electronics", "control systems", "plc", "scada",
    "matlab", "simulink",
    # Mechanical / Aerospace / Automotive
    "solidworks", "catia", "autocad", "ansys", "fusion 360",
    "cad", "cae", "cam", "fea", "fem", "cfd",
    "fluid mechanics", "thermodynamics", "heat transfer",
    "aerodynamics", "propulsion", "materials science",
    "manufacturing", "lean manufacturing", "six sigma",
    "robotics", "ros", "ros2", "kinematics", "dynamics",
    "pid control", "motion planning", "slam",
    "electric vehicles", "ev", "adas", "vehicle dynamics",
    "quality control", "inspection",
    "3d printing", "additive manufacturing",
    # Business / Product / Design
    "figma", "adobe xd", "sketch", "invision",
    "ui design", "ux design", "user research", "wireframing",
    "prototyping", "usability testing", "design systems",
    "interaction design",
    "product management", "product roadmap", "okrs",
    "a/b testing", "user stories",
    "market research", "competitive analysis",
    "business analysis", "requirements gathering",
    "brd", "frd", "documentation", "process modeling",
    "digital marketing", "seo", "sem", "google analytics",
    "social media", "email marketing", "content marketing",
    "game development", "unity", "unreal engine",
    "game design", "blender",
    "blockchain", "solidity", "ethereum", "smart contracts",
    "web3",
    "content creation", "video editing", "premiere pro",
    "after effects", "storytelling",
]

# De-duplicate preserving order
_seen = set()
_deduped = []
for _s in TECH_SKILLS:
    if _s not in _seen:
        _seen.add(_s)
        _deduped.append(_s)
TECH_SKILLS = _deduped

SKILL_TO_ROLES = {
    "python":               ["ML Engineer", "Data Scientist", "Backend Developer", "Data Engineer"],
    "machine learning":     ["ML Engineer", "Data Scientist", "AI Engineer"],
    "deep learning":        ["ML Engineer", "AI Engineer", "Research Engineer"],
    "tensorflow":           ["ML Engineer", "AI Engineer"],
    "pytorch":              ["ML Engineer", "AI Engineer", "Research Engineer"],
    "mlops":                ["ML Engineer", "MLOps Engineer"],
    "data science":         ["Data Scientist", "Data Analyst"],
    "pandas":               ["Data Scientist", "Data Analyst", "Data Engineer"],
    "spark":                ["Data Engineer", "Big Data Engineer"],
    "kafka":                ["Data Engineer", "Backend Developer"],
    "airflow":              ["Data Engineer"],
    "aws":                  ["Cloud Engineer", "DevOps Engineer", "Solutions Architect"],
    "azure":                ["Cloud Engineer", "DevOps Engineer"],
    "gcp":                  ["Cloud Engineer", "Data Engineer"],
    "docker":               ["DevOps Engineer", "Cloud Engineer"],
    "kubernetes":           ["DevOps Engineer", "Platform Engineer"],
    "terraform":            ["DevOps Engineer", "Cloud Engineer"],
    "ci/cd":                ["DevOps Engineer", "Software Engineer"],
    "cybersecurity":        ["Security Analyst", "Security Engineer"],
    "penetration testing":  ["Penetration Tester", "Security Engineer"],
    "siem":                 ["Security Analyst", "SOC Analyst"],
    "react":                ["Frontend Developer", "Full Stack Developer"],
    "javascript":           ["Frontend Developer", "Full Stack Developer", "Web Developer"],
    "typescript":           ["Frontend Developer", "Full Stack Developer"],
    "node.js":              ["Full Stack Developer", "Backend Developer"],
    "sql":                  ["Database Administrator", "Data Analyst", "Backend Developer"],
    "java":                 ["Java Developer", "Backend Developer", "Software Engineer"],
    "kotlin":               ["Android Developer", "Mobile Developer"],
    "swift":                ["iOS Developer", "Mobile Developer"],
    "react native":         ["Mobile Developer"],
    "flutter":              ["Mobile Developer"],
    "verilog":              ["VLSI Engineer", "FPGA Engineer", "Chip Design Engineer"],
    "vhdl":                 ["VLSI Engineer", "FPGA Engineer"],
    "asic":                 ["VLSI Engineer", "Chip Design Engineer"],
    "fpga":                 ["FPGA Engineer", "Hardware Engineer"],
    "embedded c":           ["Embedded Engineer", "IoT Engineer"],
    "microcontrollers":     ["Embedded Engineer", "IoT Engineer"],
    "rtos":                 ["Embedded Engineer"],
    "iot":                  ["IoT Engineer", "Embedded Engineer"],
    "ros":                  ["Robotics Engineer"],
    "signal processing":    ["RF Engineer", "DSP Engineer"],
    "matlab":               ["Control Systems Engineer", "Robotics Engineer"],
    "solidworks":           ["Mechanical Design Engineer", "CAD Engineer"],
    "catia":                ["Aerospace Engineer", "Automotive Engineer"],
    "ansys":                ["Mechanical Engineer", "FEA Engineer"],
    "cfd":                  ["Aerospace Engineer", "Thermal Engineer"],
    "fea":                  ["Mechanical Engineer", "Structural Engineer"],
    "robotics":             ["Robotics Engineer"],
    "aerodynamics":         ["Aerospace Engineer"],
    "ev":                   ["Automotive Engineer"],
    "adas":                 ["Automotive Engineer"],
    "figma":                ["UI/UX Designer", "Product Designer"],
    "ux design":            ["UI/UX Designer"],
    "user research":        ["UX Researcher", "UI/UX Designer"],
    "product management":   ["Product Manager"],
    "product roadmap":      ["Product Manager"],
    "business analysis":    ["Business Analyst"],
    "requirements gathering": ["Business Analyst", "Product Manager"],
    "unity":                ["Game Developer"],
    "unreal engine":        ["Game Developer"],
    "solidity":             ["Blockchain Developer"],
    "smart contracts":      ["Blockchain Developer", "Web3 Developer"],
    "digital marketing":    ["Digital Marketing Specialist"],
    "seo":                  ["SEO Specialist", "Digital Marketing Specialist"],
    "content creation":     ["Content Creator"],
    "video editing":        ["Content Creator", "Video Editor"],
}

LEARNING_PATHS = {
    "machine learning":     ["Complete Andrew Ng ML Course on Coursera",
                             "Practice on Kaggle competitions",
                             "Build end-to-end ML projects with real datasets"],
    "deep learning":        ["Study CNNs, RNNs, and Transformer architectures",
                             "Complete Deep Learning Specialization on Coursera",
                             "Implement research papers on GitHub"],
    "tensorflow":           ["Follow official TensorFlow tutorials",
                             "Build and deploy a neural network model"],
    "pytorch":              ["Complete PyTorch official 60-minute blitz",
                             "Build a custom training loop from scratch"],
    "mlops":                ["Learn MLflow for experiment tracking",
                             "Practice deploying models with FastAPI and Docker"],
    "python":               ["Master Python OOP and design patterns",
                             "Learn advanced Python: generators, decorators, async"],
    "data science":         ["Learn Pandas, NumPy, and Matplotlib in depth",
                             "Study statistical inference and A/B testing"],
    "sql":                  ["Practice window functions and CTEs on LeetCode",
                             "Study query optimisation and indexing strategies"],
    "aws":                  ["Complete AWS Solutions Architect Associate",
                             "Build a serverless app with Lambda and API Gateway"],
    "docker":               ["Learn Docker Compose for multi-container apps",
                             "Containerise an existing project end-to-end"],
    "kubernetes":           ["Complete Kubernetes for Developers course",
                             "Deploy a multi-service app on Minikube"],
    "terraform":            ["Build cloud infrastructure using Terraform",
                             "Study state management and remote backends"],
    "ci/cd":                ["Set up a GitHub Actions pipeline for a real project",
                             "Learn blue/green and canary deployment strategies"],
    "react":                ["Build 3 portfolio projects with React and Hooks",
                             "Learn React Query and state management"],
    "javascript":           ["Master ES6+: Promises, async/await, modules",
                             "Learn TypeScript to add type safety"],
    "node.js":              ["Build a REST API with Express and PostgreSQL",
                             "Learn authentication: JWT and OAuth2"],
    "cybersecurity":        ["Complete TryHackMe or HackTheBox beginner paths",
                             "Study OWASP Top 10 and practice on DVWA"],
    "verilog":              ["Practice RTL design on HDLBITS.com",
                             "Implement a simple processor in Verilog"],
    "fpga":                 ["Build a project on Nexys or Basys FPGA board",
                             "Study constraint files and timing closure"],
    "embedded c":           ["Build 5 sensor projects on STM32 or Arduino",
                             "Study bare-metal programming without HAL"],
    "rtos":                 ["Implement producer-consumer with FreeRTOS",
                             "Study priority inversion and inter-task communication"],
    "iot":                  ["Build an end-to-end IoT project with cloud dashboard",
                             "Learn MQTT and CoAP protocols"],
    "ros":                  ["Complete ROS2 official tutorials",
                             "Build a robot simulation in Gazebo"],
    "matlab":               ["Model a PID controller in Simulink",
                             "Simulate a control system end-to-end"],
    "solidworks":           ["Complete CSWP certification",
                             "Design and 3D-print a mechanical assembly"],
    "figma":                ["Complete Google UX Design Certificate",
                             "Redesign 3 popular apps as portfolio projects"],
    "product management":   ["Read Inspired by Marty Cagan",
                             "Build a product case study with user research and metrics"],
    "unity":                ["Complete Unity Junior Programmer pathway",
                             "Publish a simple 2D game on itch.io"],
    "solidity":             ["Complete CryptoZombies Solidity course",
                             "Deploy a token contract on Ethereum Testnet"],
    "digital marketing":    ["Get Google Ads and Analytics certifications",
                             "Run a live campaign with a small budget and document results"],
}

PROJECT_IDEAS = {
    "machine learning":     ["Resume-Job Matching AI with skill gap analysis",
                             "Real-time stock price predictor with LSTM",
                             "Medical image classification with CNN"],
    "deep learning":        ["Image captioning system with attention mechanism",
                             "Speech-to-text transcriber using Whisper"],
    "python":               ["Personal finance tracker with Flask and SQLite",
                             "Web scraper and data analysis pipeline"],
    "data science":         ["COVID-19 global trends dashboard in Plotly",
                             "Customer churn predictor with explainability"],
    "aws":                  ["Serverless image resizer using S3 and Lambda",
                             "Auto-scaling web app with EC2 and RDS"],
    "docker":               ["Dockerised microservices app with Compose",
                             "CI/CD pipeline that builds and pushes Docker images"],
    "react":                ["Personal portfolio with dark mode and animations",
                             "Real-time chat app with WebSocket and Node.js"],
    "javascript":           ["Drag-and-drop Kanban board",
                             "Browser extension that summarises articles"],
    "cybersecurity":        ["Home lab: detect and log attacks with Snort",
                             "Build a simple vulnerability scanner script"],
    "verilog":              ["4-bit ALU implementation and testbench",
                             "UART controller from scratch in Verilog"],
    "fpga":                 ["VGA signal generator on FPGA",
                             "Hardware accelerated FIR filter on FPGA"],
    "embedded c":           ["Smart home sensor hub with temperature and humidity",
                             "RTOS-based data logger to SD card"],
    "iot":                  ["Smart plant watering system with MQTT dashboard",
                             "GPS asset tracker with map visualisation"],
    "ros":                  ["Line-following robot with PID in ROS2",
                             "2D SLAM implementation with ROS2 Nav2"],
    "solidworks":           ["Parametric bracket family with configurations",
                             "Robotic arm assembly with motion study"],
    "figma":                ["End-to-end redesign of a mobile banking app",
                             "Component library and design system in Figma"],
    "unity":                ["Infinite runner mobile game",
                             "3D puzzle game with custom physics"],
    "solidity":             ["Decentralised voting smart contract",
                             "NFT minting dApp with MetaMask integration"],
}

SKILL_WEIGHTS = {
    "machine learning": 2.0, "deep learning": 2.0, "mlops": 1.8,
    "tensorflow": 1.5, "pytorch": 1.5, "kubernetes": 1.8,
    "terraform": 1.6, "verilog": 1.8, "asic": 1.8, "fpga": 1.7,
    "ros": 1.7, "solidworks": 1.6, "figma": 1.5,
    "product management": 1.6, "solidity": 1.8,
}

DEFAULT_WEIGHT = 1.0

GENERIC_CAREER_TIPS = [
    "Build a portfolio website showcasing your best projects",
    "Upload all projects to GitHub with clear READMEs",
    "Practice problem-solving on LeetCode or HackerRank daily",
    "Contribute to open-source projects in your domain",
    "Write technical blog posts to demonstrate expertise",
    "Network actively on LinkedIn and connect with 5 new people weekly",
    "Get at least one industry certification relevant to your role",
    "Participate in hackathons or domain-specific competitions",
]


def get_skill_weight(skill):
    return SKILL_WEIGHTS.get(skill, DEFAULT_WEIGHT)


def extract_skills(text):
    text_lower = " " + text.lower() + " "
    sorted_skills = sorted(TECH_SKILLS, key=len, reverse=True)
    found = set()
    for skill in sorted_skills:
        if " " in skill:
            pattern = r"(?<![a-z])" + re.escape(skill) + r"(?![a-z])"
        else:
            pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text_lower):
            found.add(skill)
    return sorted(found)