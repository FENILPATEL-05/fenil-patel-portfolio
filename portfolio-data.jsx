// Portfolio content extracted from Fenil Patel's resume + brief

const PROFILE = {
  name: "Fenil Patel",
  role: "Edge AI Engineer",
  subroles: ["Computer Vision", "NPU Deployment", "Embedded Inference"],
  location: "Ahmedabad, IN",
  email: "fenilpatel5211@gmail.com",
  phone: "+91 92651 20982",
  github: "github.com/FENILPATEL-05",
  linkedin: "www.linkedin.com/in/fenil-patel-32310b2a9",

  taglines: [
    "Building intelligent systems at the edge.",
    "Optimizing AI for real-time embedded inference.",
    "Engineering low-latency neural architectures.",
    "Compressing models. Maximizing NPU utilization.",
  ],

  summary: "AI/ML Engineer specialising in real-time surveillance AI, video analytics, and on-device deep learning. Production deployments on Augentix, Kneron and DeepX NPU SoCs with INT8/INT16 quantization and operator-level graph optimization — eliminating cloud dependency and hitting sub-100ms per-frame latency.",

  heroStats: [
    { val: "<100", unit: "ms", lbl: "Frame latency" },
    { val: "15", unit: "+", lbl: "Event types" },
    { val: "35", unit: "%", lbl: "Overhead cut" },
    { val: "3", unit: "", lbl: "NPU SoCs" },
  ],
};

const PRINCIPLES = [
  {
    n: "01",
    title: "Edge over cloud, always.",
    body: "On-device inference eliminates network latency, privacy risk and cloud cost. The right model on the right silicon beats a bigger model in a datacenter."
  },
  {
    n: "02",
    title: "Model-graph aware engineering.",
    body: "Treat the NPU as a first-class citizen. DMA scheduling, memory bandwidth, operator fusion — restructure the graph to the chip, not the other way around."
  },
  {
    n: "03",
    title: "Quantize without compromise.",
    body: "INT8 / INT16 calibration, layer fusion, and post-training compression preserve mAP while collapsing memory and energy budgets."
  },
  {
    n: "04",
    title: "Production = pipelines, not notebooks.",
    body: "C++ video processing fused with Python inference, REST event streaming, multi-camera concurrency. Research code is only the first 10%."
  },
];

const SKILLS = [
  {
    cat: "AI / ML", icon: "AI",
    items: [
      { n: "TensorFlow",  p: 92 },
      { n: "PyTorch",     p: 94 },
      { n: "OpenCV",      p: 96 },
      { n: "YOLO / CLIP", p: 90 },
      { n: "ONNX",        p: 84 },
    ]
  },
  {
    cat: "Edge AI / NPU", icon: "EX",
    items: [
      { n: "Augentix",     p: 90 },
      { n: "Kneron",       p: 86 },
      { n: "DeepX",        p: 82 },
      { n: "INT8 / INT16", p: 92 },
      { n: "Layer Fusion", p: 88 },
    ]
  },
  {
    cat: "Embedded", icon: "EM",
    items: [
      { n: "Raspberry Pi", p: 84 },
      { n: "Arduino",      p: 80 },
      { n: "ISP Pipeline", p: 78 },
      { n: "Linux / GStreamer", p: 82 },
      { n: "REST APIs",    p: 92 },
    ]
  },
  {
    cat: "Languages", icon: "LX",
    items: [
      { n: "Python",     p: 96 },
      { n: "C++",        p: 88 },
      { n: "C",          p: 80 },
      { n: "TypeScript", p: 82 },
      { n: "SQL",        p: 86 },
    ]
  },
  {
    cat: "Data / Cloud", icon: "CL",
    items: [
      { n: "AWS (S3/EC2/IoT)", p: 80 },
      { n: "Apache Spark",     p: 76 },
      { n: "Qdrant Vector DB", p: 84 },
      { n: "PostgreSQL",       p: 86 },
      { n: "MongoDB",          p: 78 },
    ]
  },
  {
    cat: "Tools", icon: "DT",
    items: [
      { n: "FastAPI",  p: 90 },
      { n: "Next.js",  p: 82 },
      { n: "Docker",   p: 80 },
      { n: "Git",      p: 94 },
      { n: "Streamlit",p: 84 },
    ]
  },
];

const PROJECTS = [
  {
    id: "cctv",
    name: "AI-Powered CCTV Event Detection",
    sub: "Production // NXON AI",
    github: null, // proprietary / NDA — no public repo
    tags: ["FLAGSHIP", "ON-DEVICE", "MULTI-CAMERA"],
    desc: "End-to-end surveillance intelligence detecting 15+ event types across simultaneous live CCTV feeds. Models deployed fully on-chip across three NPU SoC families.",
    bullets: [
      "Line crossing, region intrusion, loitering, abandoned/missing object, person detection, ALPR + OCR",
      "Fine-tuned YOLO family — 28% mAP gain over baseline under occlusion and varied lighting",
      "INT8 quantization + layer fusion eliminates GPU/cloud dependency",
      "C++ video layer fused with Python inference — 35% per-frame overhead reduction",
    ],
    metrics: [
      { lbl: "Per-frame latency", val: "<100", unit: "ms" },
      { lbl: "Detection mAP gain", val: "+28", unit: "%" },
      { lbl: "Event classes",     val: "15", unit: "+" },
      { lbl: "Streams concurrent", val: "8", unit: "" },
    ],
    tech: ["OpenCV", "PyTorch", "TensorFlow", "C++", "YOLO", "Augentix", "Kneron", "DeepX", "REST"]
  },
  {
    id: "deeplense",
    name: "Deeplense — Semantic Image Search",
    sub: "Personal // Production-ready",
    github: "https://github.com/FENILPATEL-05/deeplense-ai---Shows-it-s-an-AI-powered-project",
    tags: ["VECTOR DB", "CLIP", "HYBRID RANK"],
    desc: "Natural-language image retrieval engine fusing CLIP embeddings, BM25 keyword scoring and metadata boosting for 40–60% accuracy gain over keyword-only search.",
    bullets: [
      "512-D CLIP embeddings stored in Qdrant — 50–100 ms search over 5,000+ images",
      "Hybrid ranking: 60% semantic, 25% BM25, 15% metadata",
      "FastAPI backend, Next.js frontend, PostgreSQL metadata layer",
      "GPU indexing throughput of 20–30 images/sec",
    ],
    metrics: [
      { lbl: "Search latency",  val: "50–100", unit: "ms" },
      { lbl: "Index throughput",val: "30", unit: "/s" },
      { lbl: "Accuracy lift",   val: "+60", unit: "%" },
      { lbl: "Embedding dim",   val: "512", unit: "D" },
    ],
    tech: ["Python", "CLIP", "FastAPI", "Next.js", "Qdrant", "PostgreSQL", "BM25"]
  },
  {
    id: "nars",
    name: "Human Decision Simulator",
    sub: "Research // NARS Cognitive Agent",
    github: "https://github.com/FENILPATEL-05/human-decision-simulator",
    tags: ["COGNITIVE", "REASONING"],
    desc: "Cognitive simulation engine using a Non-Axiomatic Reasoning System for bounded-rationality multi-goal arbitration with multi-hop deductive inference.",
    bullets: [
      "Action confidence scores exceeding 0.84 across deductive chains",
      "Layered architecture: domain → application → infrastructure → interface",
      "Real-time Streamlit GUI + rich CLI + full unit/integration coverage",
    ],
    metrics: [
      { lbl: "Confidence",     val: "0.84", unit: "+" },
      { lbl: "Inference depth",val: "multi", unit: "-hop" },
      { lbl: "Coverage",       val: "100", unit: "%" },
      { lbl: "Arch layers",    val: "4", unit: "" },
    ],
    tech: ["Python", "NARS", "Streamlit", "Pytest"]
  },
  {
    id: "poliscan",
    name: "POLISCAN — Election Analytics",
    sub: "Data Engineering",
    github: "https://github.com/FENILPATEL-05/POLISCAN",
    tags: ["BIG DATA", "ETL"],
    desc: "U.S. election financial-contribution analytics — integrating individuals, candidates and committees to surface donor behavior, party comparisons and regional patterns.",
    bullets: [
      "Interactive Power BI dashboard exposing donation flow dynamics",
      "AWS-backed pipeline with cloud storage and orchestration",
      "Pandas + SQL for behavioural ETL across multi-source feeds",
    ],
    metrics: [
      { lbl: "Datasets",   val: "3+", unit: "" },
      { lbl: "Dashboards", val: "1", unit: "" },
      { lbl: "Sources",    val: "fed.", unit: "" },
      { lbl: "Pipeline",   val: "ETL", unit: "" },
    ],
    tech: ["AWS", "Python", "Pandas", "Power BI", "Jira"]
  },
  {
    id: "yoga",
    name: "Yoga Pose Detection",
    sub: "Personal // Computer Vision",
    github: "https://github.com/FENILPATEL-05/Yoga-Pose-Detection",
    tags: ["CUSTOM CNN", "8 ASANAS", "WEB UI"],
    desc: "AI-powered yoga pose classifier identifying 8 fundamental asanas in real-time using a custom CNN trained from scratch, with a softmax confidence distribution and an interactive web interface.",
    bullets: [
      "Custom CNN architecture trained from scratch — classifies 8 asanas: Downward Dog, Warrior I & II, Tree, Cobra, Child's Pose, Staff, Low Plank",
      "Softmax probability output for per-class confidence scoring across all pose categories",
      "Pre-trained .pth weights shipped for instant inference without re-training",
      "Interactive web UI (yogalens.html) + REST API endpoint via Jupyter notebook",
    ],
    metrics: [
      { lbl: "Asana classes",  val: "8",      unit: "" },
      { lbl: "Architecture",   val: "CNN",     unit: "" },
      { lbl: "Framework",      val: "PyTorch", unit: "" },
      { lbl: "Interface",      val: "Web",     unit: "+" },
    ],
    tech: ["PyTorch", "Python", "CNN", "Jupyter", "HTML"]
  },
];

const TIMELINE = [
  {
    time: "SEP 2024 — PRESENT",
    role: "AI/ML Developer",
    org: "NXON AI Private Limited · Ahmedabad",
    items: [
      "Architected production AI-powered CCTV event-detection engine — 15+ real-time security events across multi-camera feeds, sub-100ms latency.",
      "Deployed full-precision and quantized models on Augentix, Kneron and DeepX NPU SoCs with INT8/INT16 quantization and layer fusion.",
      "Engineered C++ video-processing modules fused with Python deep-learning pipelines — 35% overhead reduction.",
      "ALPR + OCR pipeline shipped end-to-end across multiple vehicle types and camera angles.",
    ]
  },
  {
    time: "FEB 2025 — JUL 2025",
    role: "Post Graduate Diploma · Big Data Analytics",
    org: "C-DAC, SMVITA",
    items: [
      "Specialised coursework in distributed processing, large-scale ML pipelines and cloud data engineering.",
    ]
  },
  {
    time: "JUL 2024 — SEP 2024",
    role: "Full-Stack Developer",
    org: "NXON AI Private Limited · Ahmedabad",
    items: [
      "Applied DSA, Algorithms, Java, Python and React.js to real-world engineering problems.",
      "Improved web application stability by 40% via PHP debugging and real-time monitoring; resolved 15+ weekly defects.",
      "MySQL optimisation: query restructuring and indexing reduced data fetching time.",
    ]
  },
  {
    time: "JAN 2024 — APR 2024",
    role: "Laravel Developer Intern",
    org: "CodeAlpha Infotech · Surat",
    items: [
      "Built and maintained Laravel + PHP web applications; optimised MySQL schemas and Blade-template frontends.",
      "Code reviews, Git-based version control, testing/debugging, module documentation.",
    ]
  },
  {
    time: "SEP 2020 — MAY 2024",
    role: "B.E. Computer Engineering",
    org: "C.K. Pithawala College of Engineering & Technology, Surat · CGPA 7.32",
    items: [
      "Student Coordinator, Dept. of Student Affairs — led campus orientations, delivered workshop on Arduino, organised dept. sports fest for ~400 students.",
    ]
  },
];

const LANG_USAGE = [
  { n: "Python",     p: 48, c: "#3776AB" },
  { n: "C++",        p: 22, c: "#00599C" },
  { n: "TypeScript", p: 12, c: "#3178C6" },
  { n: "C",          p: 9,  c: "#A8B9CC" },
  { n: "SQL",        p: 6,  c: "#E48E00" },
  { n: "Other",      p: 3,  c: "#64748b" },
];

const REPO_HIGHLIGHTS = [
  { n: "deeplense-ai", url: "https://github.com/FENILPATEL-05/deeplense-ai---Shows-it-s-an-AI-powered-project", desc: "Hybrid CLIP + BM25 semantic image search", lang: "Python" },
  { n: "human-decision-simulator", url: "https://github.com/FENILPATEL-05/human-decision-simulator", desc: "Bounded-rationality cognitive simulator (NARS)", lang: "Python" },
  { n: "Yoga-Pose-Detection", url: "https://github.com/FENILPATEL-05/Yoga-Pose-Detection", desc: "Custom CNN classifying 8 yoga asanas with softmax confidence scoring and web UI", lang: "Python" },
  { n: "Workday-Punch-Automation", url: "https://github.com/FENILPATEL-05/Workday-Punch-Automation-Agent", desc: "Playwright + Telegram automation agent for Workday punch scheduling", lang: "Python" },
  { n: "POLISCAN", url: "https://github.com/FENILPATEL-05/POLISCAN", desc: "U.S. election financial-contribution analytics — donor behavior, party comparisons, regional patterns", lang: "Python" },
];

// Make available to the next babel script
Object.assign(window, { PROFILE, PRINCIPLES, SKILLS, PROJECTS, TIMELINE, LANG_USAGE, REPO_HIGHLIGHTS });
