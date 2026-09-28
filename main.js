const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");

let dpr = window.devicePixelRatio || 1;

const lerpFactor = 0.05;

const camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
};

const mouse = {
    x: null,
    y: null,
    isDown: false,
    startX: 0,
    startY: 0,
    hasMoved: false
};

let isDraggingCamera = false;
let draggedNode = null;
let dragStartX = 0;
let dragStartY = 0;
const DRAG_THRESHOLD = 6;

const rootNode = {
    id: "root",
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    baseRadius: 70,
    radius: 70,
    label: "KAITO",
    fontSize: 18,
    color: "#ffffff",
    secondaryColor: "#94a3b8",
    pulseAngle: 0,
    isHovered: false,
    expanded: false
};

const categoryConfigs = [
    { id: "projects", label: "[01] PROJECTS", color: "#00f0ff" },
    { id: "about", label: "[02] BIO", color: "#b026ff" },
    { id: "experience", label: "[03] EXPERIENCE", color: "#00ff66" },
    { id: "skills", label: "[04] SKILLS", color: "#ffb703" }
];

const aboutConfigs = [
    { id: "about_bg", parentId: "about", label: "Background", color: "#a855f7" },
    { id: "about_contact", parentId: "about", label: "Contact", color: "#a855f7" }
];

const aboutNodes = aboutConfigs.map((cfg, index) => ({
    ...cfg,
    x: rootNode.x,
    y: rootNode.y,
    baseRadius: 34,
    radius: 34,
    fontSize: 11,
    index: index,
    total: aboutConfigs.length,
    isHovered: false,
    expanded: false,
    particles: [{ t: 0.2, speed: 0.007 }]
}));

const aboutBioCard = {
    x: rootNode.x,
    y: rootNode.y,
    width: 700,
    height: 700,
    title: "Eren Kaito Iwasawa",
    sections: [
        {
            heading: "ACADEMICS & FOCUS",
            text: "..."
        },
        {
            heading: "TECHNICAL DOMAINS",
            text: "..."
        },
        {
            heading: "...",
            text: ""
        }
    ]
};

const contactAnchor = {
    x: rootNode.x,
    y: rootNode.y,
    radius: 60,
    label: "CONNECT",
    color: "#a855f7"
};

const socialSatellites = [
    { id: "github", label: "Github", url: "https://github.com/kaito-kto", color: "#f8fafc", angle: 0, orbitRadius: 180, radius: 50, isHovered: false },
    { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/eren-kaito-i-234028234/", color: "#38bdf8", angle: (Math.PI * 2) / 3, orbitRadius: 180, radius: 50, isHovered: false },
    { id: "mail", label: "Email", url: "mailto:kaitoesen@gmail.com", color: "#ec4899", angle: (Math.PI * 4) / 3, orbitRadius: 180, radius: 50, isHovered: false }
];

const projectConfigs = [
    { 
        id: "proj_1", parentId: "projects", label: "Project 1", color: "#00f0ff",
        title: "Visual Information Engineering - Lowlight Enhancement Project",
        desc: "Enhancing low-light grayscale images using Histogram Equalization and Gamma Correction pipelines.",
        tags: ["Python", "OpenCV", "Algorithms"],
        imgSrc: "./images/img2.png" 
    },
    { 
        id: "proj_2", parentId: "projects", label: "Project 2", color: "#00f0ff",
        title: "Game Development with Processing & AI Agent With Python",
        desc: "Engineered an interactive game and autonomous playing agent using Processing, Python, and Gemini on Google AI Studio. Designed TCP/JSON socket messaging loops to connect independent game engines with Python control scripts.",
        tags: ["Python", "Processing", "Google AI Playground Studio", "Gemini"],
        imgSrc: ""
    },
    { 
        id: "proj_3", parentId: "projects", label: "Project 3", color: "#00f0ff",
        title: "Wardrobe Organizing App",
        desc: "Helps users catalog wardrobe items, visualize outfit combinations tailored to local weather, and track wardrobe utilization.",
        tags: ["React Native", "Javascript", "..."],
        imgSrc: ""
    },
    {
        id: "proj_4", parentId: "projects", label: "Project 4", color: "#00f0ff",
        title: "Raw Socket Reconnaissance & Port Scanner",
        desc: "Concurrent network scanner implemented from scratch in Python using raw sockets to perform TCP SYN stealth scans, banner grabbing, and subnet sweep operations.",
        tags: ["Python", "Sockets", "Networking", "Concurrency", "Offensive Sec"],
        imgSrc: ""
    },
    {
        id: "proj_5", parentId: "projects", label: "Project 5", color: "#00f0ff",
        title: "Enterprise SIEM & Detection Engineering Lab",
        desc: "Virtual detection lab integrating Wazuh, Sysmon, and Atomic Red Team to simulate adversary techniques, create Sigma detection rules, and triage alert pipelines.",
        tags: ["Wazuh", "Sysmon", "Blue Team", "Threat Detection", "Linux"],
        imgSrc: ""
    }
];

const projectNodes = projectConfigs.map((cfg, index) => {
    const img = new Image();
    img.src = cfg.imgSrc;
    return {
        ...cfg,
        x: rootNode.x,
        y: rootNode.y,
        baseRadius: 32,
        radius: 32,
        fontSize: 11,
        index: index,
        total: projectConfigs.length,
        isHovered: false,
        expanded: false,
        imageObj: img,
        cards: {
            textCard: { x: rootNode.x, y: rootNode.y, width: 380, height: 210 },
            imageCard: { x: rootNode.x, y: rootNode.y, width: 380, height: 215 }
        },
        particles: [{ t: 0.2, speed: 0.007 }]
    };
});

const categoryNodes = categoryConfigs.map((cfg, index) => ({
    ...cfg,
    x: rootNode.x,
    y: rootNode.y,
    baseRadius: 100,
    radius: 100,
    fontSize: 13,
    index: index,
    total: categoryConfigs.length,
    isHovered: false,
    expanded: false,
    particles: [
        { t: 0.1, speed: 0.005 },
        { t: 0.55, speed: 0.005 }
    ]
}));

const experienceConfigs = [
    {
        id: "exp_internship", parentId: "experience", label: "Internships", color: "#10b981",
        title: "ENGINEERING & SYSTEMS INTERNSHIPS",
        events: [
            {
                period: "2024", role: "IT & Systems Engineering Intern", org: "Alba Bilgi Teknoloji",
                bullets: [
                    "...",
                    "..."
                ]
            }
        ]
    },
    {
        id: "exp_leadership", parentId: "experience", label: "Leadership", color: "#10b981",
        title: "LEADERSHIP & COACHING",
        events: [
            {
                period: "2023 - 2024", role: "...", org: "...",
                bullets: [
                    "...",
                    "..."
                ]
            }
        ]
    },
    {
        id: "exp_volunteer", parentId: "experience", label: "Volunteer", color: "#10b981",
        title: "VOLUNTEER & COMMUNITY INITIATIVES",
        events: [
            {
                period: "2023 - Present", role: "...", org: "...",
                bullets: [
                    "...",
                    "..."
                ]
            }
        ]
    }
];

const experienceNodes = experienceConfigs.map((cfg, index) => ({
    ...cfg,
    x: rootNode.x,
    y: rootNode.y,
    baseRadius: 50,
    radius: 50,
    fontSize: 15,
    index: index,
    total: experienceConfigs.length,
    isHovered: false,
    expanded: false,
    particles: [{ t: 0.2, speed: 0.007 }]
}));

const experienceTimeLineCard = {
    x: rootNode.x,
    y: rootNode.y,
    width: 490,
    height: 310
};

const skillsBranchConfigs = [
    { id: "branch_skills", parentId: "skills", label: "Skills", color: "#f59e0b" },
    { 
        id: "branch_awards", parentId: "skills", label: "Awards", color: "#f59e0b",
        title: "HONORS, COMPETITIONS & CERTIFICATES",
        subtitle: "Academic & Technical Recognitions",
        awards: [
            {
                year: "2024", title: "...", issuer: "...",
                desc: "..."
            },
            {
                year: "2023", title: "...", issuer: "...",
                desc: "..."
            }
        ]
    }
];

const skillsBranchNodes = skillsBranchConfigs.map((cfg, index) => ({
    ...cfg,
    x: rootNode.x,
    y: rootNode.y,
    baseRadius: 48,
    radius: 48,
    fontSize: 14,
    index: index,
    total: skillsBranchConfigs.length,
    isHovered: false,
    expanded: false,
    particles: [{ t: 0.2, speed: 0.007 }]
}));

const skillSubConfigs = [
    {
        id: "sub_programming", parentId: "branch_skills", label: "Programming", color: "#f59e0b",
        title: "CORE LANGUAGES & ECOSYSTEMS",
        subtitle: "Production & Academic Implementation",
        items: [
            { badge: "SYSTEMS / AI", name: "Python", context: "Raw socket daemons, autonomous AI agent heuristics, OpenCV pipelines." },
            { badge: "CONCURRENCY", name: "Java", context: "Multi-threaded client-server loops, vector reflection physics, 2D geometry." },
            { badge: "FRONTEND / MOBILE", name: "JavaScript & React Native", context: "Cross-platform mobile apps, reactive state trees, HTML5 canvas engines." },
            { badge: "VISUAL COMPUTING", name: "Processing (Java)", context: "Interactive rendering pipelines, autonomous pathfinding simulations." },
            { badge: "LOW-LEVEL", name: "C / Assembly Basics", context: "Memory manipulation, pointer arithmetic, and stack/heap models." }
        ]
    },
    {
        id: "sub_cybersecurity", parentId: "branch_skills", label: "Cybersecurity", color: "#f59e0b",
        title: "OFFENSIVE RECON & DEFENSIVE TELEMETRY",
        subtitle: "Low-Level Sockets, Protocol Analysis & Detection Engineering",
        items: [
            { badge: "OFFENSIVE NETWORKING", name: "Raw Sockets & TCP Layer", context: "Custom TCP SYN stealth scans, banner grabs, and raw packet crafting." },
            { badge: "DETECTION ENGINEERING", name: "SIEM & Host Telemetry", context: "Wazuh + Sysmon integration, Atomic Red Team emulation, Sigma rules." },
            { badge: "TRAFFIC FORENSICS", name: "Protocol & Packet Triage", context: "Wireshark, tcpdump, TCP handshake analysis, payload reconstruction." },
            { badge: "SYSTEM INTERNALS", name: "Linux Hardening & Daemons", context: "Process monitoring, systemd management, POSIX permissions, Bash automation." }
        ]
    }
];

const skillSubNodes = skillSubConfigs.map((cfg, index) => ({
    ...cfg,
    x: rootNode.x,
    y: rootNode.y,
    baseRadius: 44,
    radius: 44,
    fontSize: 13,
    index: index,
    total: skillSubConfigs.length,
    isHovered: false,
    expanded: false,
    particles: [{ t: 0.2, speed: 0.007 }]
}));

const skillStageCard = {
    x: rootNode.x,
    y: rootNode.y,
    width: 520,
    height: 410
};

function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    if (rootNode) {
        rootNode.x = window.innerWidth / 2;
        rootNode.y = window.innerHeight / 2;
    }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

window.addEventListener("mousedown", (e) => {
    mouse.isDown = true;
    mouse.hasMoved = false;
    mouse.startX = e.clientX;
    mouse.startY = e.clientY;

    let clickedNode = null;
    const projectsCategory = categoryNodes.find(c => c.id === "projects");
    const aboutCategory = categoryNodes.find(c => c.id === "about");
    const contactSubNode = aboutNodes.find(n => n.id === "about_contact");
    const expCategory = categoryNodes.find(c => c.id === "experience");
    const skillsCategory = categoryNodes.find(c => c.id === "skills");
    const branchSkills = skillsBranchNodes.find(n => n.id === "branch_skills");

    if (skillsCategory && skillsCategory.expanded && branchSkills && branchSkills.expanded) {
        clickedNode = skillSubNodes.find(n => n.isHovered);
    }
    if (!clickedNode && skillsCategory && skillsCategory.expanded) {
        clickedNode = skillsBranchNodes.find(n => n.isHovered);
    }
    if (!clickedNode && aboutCategory && aboutCategory.expanded && contactSubNode && contactSubNode.expanded) {
        clickedNode = socialSatellites.find(n => n.isHovered);
    }
    if (!clickedNode && expCategory && expCategory.expanded) {
        clickedNode = experienceNodes.find(n => n.isHovered);
    }
    if (!clickedNode && projectsCategory && projectsCategory.expanded) {
        clickedNode = projectNodes.find(n => n.isHovered);
    }
    if (!clickedNode && aboutCategory && aboutCategory.expanded) {
        clickedNode = aboutNodes.find(n => n.isHovered);
    }
    if (!clickedNode && rootNode.expanded) {
        clickedNode = categoryNodes.find(n => n.isHovered);
    }
    if (!clickedNode && rootNode.isHovered) {
        clickedNode = rootNode;
    }

    if (clickedNode) {
        draggedNode = clickedNode;
    } else {
        isDraggingCamera = true;
        dragStartX = e.clientX - camera.targetX;
        dragStartY = e.clientY - camera.targetY;
    }
});

window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    mouse.x = screenX - camera.x;
    mouse.y = screenY - camera.y;

    if (mouse.isDown) {
        const moveDist = Math.hypot(e.clientX - mouse.startX, e.clientY - mouse.startY);
        if (moveDist > DRAG_THRESHOLD) {
            mouse.hasMoved = true;
        }
    }

    if (isDraggingCamera) {
        camera.targetX = screenX - dragStartX;
        camera.targetY = screenY - dragStartY;
    } else if (draggedNode && mouse.hasMoved) {
        draggedNode.x = mouse.x;
        draggedNode.y = mouse.y;
    }
});

window.addEventListener("mouseup", () => {
    if (!mouse.hasMoved && draggedNode) {
        if (socialSatellites.includes(draggedNode)) {
            if (draggedNode.url) {
                window.open(draggedNode.url, "_blank");
            }
        }
        else if (draggedNode === rootNode) {
            rootNode.expanded = !rootNode.expanded;
            if (!rootNode.expanded) {
                categoryNodes.forEach(c => c.expanded = false);
                projectNodes.forEach(p => p.expanded = false);
                aboutNodes.forEach(a => a.expanded = false);
                experienceNodes.forEach(e => e.expanded = false);
                skillsBranchNodes.forEach(b => b.expanded = false);
                skillSubNodes.forEach(s => s.expanded = false);
            }
            camera.targetX = 0;
            camera.targetY = 0;
        }
        else if (categoryNodes.includes(draggedNode)) {
            draggedNode.expanded = !draggedNode.expanded;
            if (!draggedNode.expanded) {
                if (draggedNode.id === "projects") projectNodes.forEach(p => p.expanded = false);
                if (draggedNode.id === "about") aboutNodes.forEach(a => a.expanded = false);
                if (draggedNode.id === "experience") experienceNodes.forEach(e => e.expanded = false);
                if (draggedNode.id === "skills") {
                    skillsBranchNodes.forEach(b => b.expanded = false);
                    skillSubNodes.forEach(s => s.expanded = false);
                }
            }
            if (draggedNode.expanded) {
                camera.targetX = -draggedNode.x + (window.innerWidth / 2);
                camera.targetY = -draggedNode.y + (window.innerHeight / 2);
            } else {
                camera.targetX = 0;
                camera.targetY = 0;
            }
        }
        else if (projectNodes.includes(draggedNode)) {
            const wasExpanded = draggedNode.expanded;
            projectNodes.forEach(p => p.expanded = false);
            draggedNode.expanded = !wasExpanded;

            const parent = categoryNodes.find(c => c.id === "projects");
            if (draggedNode.expanded && parent) {
                camera.targetX = -parent.x + (window.innerWidth / 2);
                camera.targetY = -parent.y + (window.innerHeight / 2) + 480;
            } else if (parent) {
                camera.targetX = -parent.x + (window.innerWidth / 2);
                camera.targetY = -parent.y + (window.innerHeight / 2);
            }
        }
        else if (aboutNodes.includes(draggedNode)) {
            const wasExpanded = draggedNode.expanded;
            aboutNodes.forEach(a => a.expanded = false);
            draggedNode.expanded = !wasExpanded;

            const parent = categoryNodes.find(c => c.id === "about");
            if (draggedNode.expanded && parent) {
                camera.targetX = -parent.x + (window.innerWidth / 2) - 240;
                camera.targetY = -parent.y + (window.innerHeight / 2);
            } else if (parent) {
                camera.targetX = -parent.x + (window.innerWidth / 2);
                camera.targetY = -parent.y + (window.innerHeight / 2);
            }
        }
        else if (experienceNodes.includes(draggedNode)) {
            const wasExpanded = draggedNode.expanded;
            experienceNodes.forEach(e => e.expanded = false);
            draggedNode.expanded = !wasExpanded;

            const parent = categoryNodes.find(c => c.id === "experience");
            if (draggedNode.expanded && parent) {
                camera.targetX = -parent.x + (window.innerWidth / 2);
                camera.targetY = -parent.y + (window.innerHeight / 2) - 260;
            } else if (parent) {
                camera.targetX = -parent.x + (window.innerWidth / 2);
                camera.targetY = -parent.y + (window.innerHeight / 2);
            }
        }
        else if (skillsBranchNodes.includes(draggedNode)) {
            const wasExpanded = draggedNode.expanded;
            skillsBranchNodes.forEach(b => b.expanded = false);
            skillSubNodes.forEach(s => s.expanded = false);
            draggedNode.expanded = !wasExpanded;

            const parent = categoryNodes.find(c => c.id === "skills");
            if (draggedNode.expanded && parent) {
                camera.targetX = -parent.x + (window.innerWidth / 2) + 260;
                camera.targetY = -parent.y + (window.innerHeight / 2);
            } else if (parent) {
                camera.targetX = -parent.x + (window.innerWidth / 2);
                camera.targetY = -parent.y + (window.innerHeight / 2);
            }
        }
        else if (skillSubNodes.includes(draggedNode)) {
            const wasExpanded = draggedNode.expanded;
            skillSubNodes.forEach(s => s.expanded = false);
            draggedNode.expanded = !wasExpanded;

            const branchParent = skillsBranchNodes.find(b => b.id === "branch_skills");
            if (draggedNode.expanded && branchParent) {
                camera.targetX = -branchParent.x + (window.innerWidth / 2) + 380;
                camera.targetY = -branchParent.y + (window.innerHeight / 2);
            }
        }
    }

    mouse.isDown = false;
    mouse.hasMoved = false;
    isDraggingCamera = false;
    draggedNode = null;
});

function checkHover(node) {
    if (mouse.x === null || mouse.y === null) {
        node.isHovered = false;
        return;
    }
    const dist = Math.hypot(mouse.x - node.x, mouse.y - node.y);
    node.isHovered = dist <= node.radius + 8;
}

function update() {
    camera.x += (camera.targetX - camera.x) * lerpFactor;
    camera.y += (camera.targetY - camera.y) * lerpFactor;

    rootNode.pulseAngle += 0.035;
    checkHover(rootNode);

    const targetBase = rootNode.isHovered ? 120 : 90;
    rootNode.baseRadius += (targetBase - rootNode.baseRadius) * lerpFactor;

    const pulse = Math.sin(rootNode.pulseAngle) * 3;
    rootNode.radius = rootNode.baseRadius + pulse;

    const targetFontSize = rootNode.isHovered ? 30 : 20;
    rootNode.fontSize += (targetFontSize - rootNode.fontSize) * lerpFactor;

    let anyChildHovered = false;
    const orbitDistance = 300;

    categoryNodes.forEach((node) => {
        if (rootNode.expanded) {
            const angle = (node.index / node.total) * (Math.PI * 2) - Math.PI / 2;
            const targetX = rootNode.x + Math.cos(angle) * orbitDistance;
            const targetY = rootNode.y + Math.sin(angle) * orbitDistance;

            node.x += (targetX - node.x) * lerpFactor;
            node.y += (targetY - node.y) * lerpFactor;

            checkHover(node);
            if (node.isHovered) anyChildHovered = true;

            node.particles.forEach((p) => {
                p.t += p.speed;
                if (p.t > 1) p.t = 0; 
            });
        } else {
            node.x += (rootNode.x - node.x) * (lerpFactor * 2);
            node.y += (rootNode.y - node.y) * (lerpFactor * 2);
            node.isHovered = false;
        }

        const targetRadius = node.isHovered ? 90 : 60;
        node.radius += (targetRadius - node.radius) * lerpFactor;
        
        const targetFont = node.isHovered ? 20 : 15;
        node.fontSize += (targetFont - node.fontSize) * lerpFactor;
    });

    const projectsParent = categoryNodes.find(c => c.id === "projects");
    const subOrbitDist = 300;
    const fanSpread = Math.PI * 0.65;

    projectNodes.forEach((pNode) => {
        if (rootNode.expanded && projectsParent && projectsParent.expanded) {
            const baseAngle = Math.atan2(projectsParent.y - rootNode.y, projectsParent.x - rootNode.x);
            const step = pNode.total > 1 ? fanSpread / (pNode.total - 1) : 0;
            const angle = baseAngle - (fanSpread / 2) + (pNode.index * step);

            const targetX = projectsParent.x + Math.cos(angle) * subOrbitDist;
            const targetY = projectsParent.y + Math.sin(angle) * subOrbitDist;

            if (pNode !== draggedNode) {
                pNode.x += (targetX - pNode.x) * lerpFactor;
                pNode.y += (targetY - pNode.y) * lerpFactor;
            }

            checkHover(pNode);
            if (pNode.isHovered) anyChildHovered = true;
            
            pNode.particles.forEach((p) => {
                p.t += p.speed;
                if (p.t > 1) p.t = 0;
            });
        } else {
            if (pNode !== draggedNode && projectsParent) {
                pNode.x += (projectsParent.x - pNode.x) * (lerpFactor * 2);
                pNode.y += (projectsParent.y - pNode.y) * (lerpFactor * 2);
            }
            pNode.isHovered = false;
        }

        const isSelected = pNode.isHovered || pNode.expanded;
        const targetRadius = isSelected ? 80 : 50;
        pNode.radius += (targetRadius - pNode.radius) * lerpFactor;

        const targetFont = isSelected ? 18 : 12;
        pNode.fontSize += (targetFont - pNode.fontSize) * lerpFactor;
    });

    if (projectsParent) {
        const outwardAngle = Math.atan2(projectsParent.y - rootNode.y, projectsParent.x - rootNode.x);
        const stageDist = subOrbitDist + 280;
        const fixedStageX = projectsParent.x + Math.cos(outwardAngle) * stageDist;
        const fixedStageY = projectsParent.y + Math.sin(outwardAngle) * stageDist;

        const imgStageX = fixedStageX + Math.cos(outwardAngle) * 235;
        const imgStageY = fixedStageY + Math.sin(outwardAngle) * 235;

        projectNodes.forEach((pNode) => {
            if (pNode.expanded && projectsParent.expanded && rootNode.expanded) {
                pNode.cards.textCard.x += (fixedStageX - pNode.cards.textCard.x) * lerpFactor;
                pNode.cards.textCard.y += (fixedStageY - pNode.cards.textCard.y) * lerpFactor;

                pNode.cards.imageCard.x += (imgStageX - pNode.cards.imageCard.x) * lerpFactor;
                pNode.cards.imageCard.y += (imgStageY - pNode.cards.imageCard.y) * lerpFactor;
            } else {
                pNode.cards.textCard.x += (pNode.x - pNode.cards.textCard.x) * (lerpFactor * 2);
                pNode.cards.textCard.y += (pNode.y - pNode.cards.textCard.y) * (lerpFactor * 2);

                pNode.cards.imageCard.x += (pNode.x - pNode.cards.imageCard.x) * (lerpFactor * 2);
                pNode.cards.imageCard.y += (pNode.y - pNode.cards.imageCard.y) * (lerpFactor * 2);
            }
        });
    }

    const aboutParent = categoryNodes.find(c => c.id === "about");
    const aboutOrbitDist = 250;
    const aboutFanSpread = Math.PI * 0.40;

    aboutNodes.forEach((aNode) => {
        if (rootNode.expanded && aboutParent && aboutParent.expanded) {
            const baseAngle = Math.atan2(aboutParent.y - rootNode.y, aboutParent.x - rootNode.x);
            const step = aNode.total > 1 ? aboutFanSpread / (aNode.total - 1) : 0;
            const angle = baseAngle - (aboutFanSpread / 2) + (aNode.index * step);

            const targetX = aboutParent.x + Math.cos(angle) * aboutOrbitDist;
            const targetY = aboutParent.y + Math.sin(angle) * aboutOrbitDist;

            if (aNode !== draggedNode) {
                aNode.x += (targetX - aNode.x) * lerpFactor;
                aNode.y += (targetY - aNode.y) * lerpFactor;
            }

            checkHover(aNode);
            if (aNode.isHovered) anyChildHovered = true;

            aNode.particles.forEach((p) => {
                p.t += p.speed;
                if (p.t > 1) p.t = 0;
            });
        } else {
            if (aNode !== draggedNode && aboutParent) {
                aNode.x += (aboutParent.x - aNode.x) * (lerpFactor * 2);
                aNode.y += (aboutParent.y - aNode.y) * (lerpFactor * 2);
            }
            aNode.isHovered = false;
            aNode.expanded = false;
        }

        const isSelected = aNode.isHovered || aNode.expanded;
        const targetRadius = isSelected ? 80 : 50;
        aNode.radius += (targetRadius - aNode.radius) * lerpFactor;

        const targetFont = isSelected ? 18 : 12;
        aNode.fontSize += (targetFont - aNode.fontSize) * lerpFactor;
    });

    if (aboutParent) {
        const outwardAngle = Math.atan2(aboutParent.y - rootNode.y, aboutParent.x - rootNode.x);
        const stageDist = aboutOrbitDist + 430;
        const stageX = aboutParent.x + Math.cos(outwardAngle) * stageDist;
        const stageY = aboutParent.y + Math.sin(outwardAngle) * stageDist;

        const bgNode = aboutNodes.find(n => n.id === "about_bg");
        const contactNode = aboutNodes.find(n => n.id === "about_contact");

        if (bgNode && bgNode.expanded && aboutParent.expanded && rootNode.expanded) {
            aboutBioCard.x += (stageX - aboutBioCard.x) * lerpFactor;
            aboutBioCard.y += (stageY - aboutBioCard.y) * lerpFactor;
        } else if (bgNode) {
            aboutBioCard.x += (bgNode.x - aboutBioCard.x) * (lerpFactor * 2);
            aboutBioCard.y += (bgNode.y - aboutBioCard.y) * (lerpFactor * 2);
        }

        if (contactNode && contactNode.expanded && aboutParent.expanded && rootNode.expanded) {
            contactAnchor.x += (stageX - contactAnchor.x) * lerpFactor;
            contactAnchor.y += (stageY - contactAnchor.y) * lerpFactor;

            socialSatellites.forEach((sat) => {
                sat.angle += 0.005;
                sat.x = contactAnchor.x + Math.cos(sat.angle) * sat.orbitRadius;
                sat.y = contactAnchor.y + Math.sin(sat.angle) * sat.orbitRadius;

                checkHover(sat);
                if (sat.isHovered) anyChildHovered = true;
            });
        } else if (contactNode) {
            contactAnchor.x += (contactNode.x - contactAnchor.x) * (lerpFactor * 2);
            contactAnchor.y += (contactNode.y - contactAnchor.y) * (lerpFactor * 2);
            socialSatellites.forEach(sat => {
                sat.x = contactAnchor.x;
                sat.y = contactAnchor.y;
                sat.isHovered = false;
            });
        }
    }

    const expParent = categoryNodes.find(c => c.id === "experience");
    const expOrbitDist = 240;
    const expFanSpread = Math.PI * 0.60;

    experienceNodes.forEach((eNode) => {
        if (rootNode.expanded && expParent && expParent.expanded) {
            const baseAngle = Math.atan2(expParent.y - rootNode.y, expParent.x - rootNode.x);
            const step = eNode.total > 1 ? expFanSpread / (eNode.total - 1) : 0;
            const angle = baseAngle - (expFanSpread / 2) + (eNode.index * step);

            const targetX = expParent.x + Math.cos(angle) * expOrbitDist;
            const targetY = expParent.y + Math.sin(angle) * expOrbitDist;

            if (eNode !== draggedNode) {
                eNode.x += (targetX - eNode.x) * lerpFactor;
                eNode.y += (targetY - eNode.y) * lerpFactor;
            }

            checkHover(eNode);
            if (eNode.isHovered) anyChildHovered = true;

            eNode.particles.forEach((p) => {
                p.t += p.speed;
                if (p.t > 1) p.t = 0;
            });
        } else {
            if (eNode !== draggedNode && expParent) {
                eNode.x += (expParent.x - eNode.x) * (lerpFactor * 2);
                eNode.y += (expParent.y - eNode.y) * (lerpFactor * 2);
            }
            eNode.isHovered = false;
            eNode.expanded = false;
        }

        const isSelected = eNode.isHovered || eNode.expanded;
        const targetRadius = isSelected ? 80 : 50;
        eNode.radius += (targetRadius - eNode.radius) * lerpFactor;

        const targetFont = isSelected ? 18 : 12;
        eNode.fontSize += (targetFont - eNode.fontSize) * lerpFactor;
    });

    if (expParent) {
        const outwardAngle = Math.atan2(expParent.y - rootNode.y, expParent.x - rootNode.x);
        const stageDist = expOrbitDist + 290;
        const stageX = expParent.x + Math.cos(outwardAngle) * stageDist;
        const stageY = expParent.y + Math.sin(outwardAngle) * stageDist;

        const activeExp = experienceNodes.find(n => n.expanded);
        if (activeExp && expParent.expanded && rootNode.expanded) {
            experienceTimeLineCard.x += (stageX - experienceTimeLineCard.x) * lerpFactor;
            experienceTimeLineCard.y += (stageY - experienceTimeLineCard.y) * lerpFactor;
        } else if (activeExp) {
            experienceTimeLineCard.x += (activeExp.x - experienceTimeLineCard.x) * (lerpFactor * 2);
            experienceTimeLineCard.y += (activeExp.y - experienceTimeLineCard.y) * (lerpFactor * 2);
        }
    }

    const skillsParent = categoryNodes.find(c => c.id === "skills");
    const branchOrbitDist = 200;
    const branchFanSpread = Math.PI * 0.38; 

    skillsBranchNodes.forEach((bNode) => {
        if (rootNode.expanded && skillsParent && skillsParent.expanded) {
            const baseAngle = Math.atan2(skillsParent.y - rootNode.y, skillsParent.x - rootNode.x);
            const step = bNode.total > 1 ? branchFanSpread / (bNode.total - 1) : 0;
            const angle = baseAngle - (branchFanSpread / 2) + (bNode.index * step);

            const targetX = skillsParent.x + Math.cos(angle) * branchOrbitDist;
            const targetY = skillsParent.y + Math.sin(angle) * branchOrbitDist;

            if (bNode !== draggedNode) {
                bNode.x += (targetX - bNode.x) * lerpFactor;
                bNode.y += (targetY - bNode.y) * lerpFactor;
            }

            checkHover(bNode);
            if (bNode.isHovered) anyChildHovered = true;

            bNode.particles.forEach((p) => {
                p.t += p.speed;
                if (p.t > 1) p.t = 0;
            });
        } else {
            if (bNode !== draggedNode && skillsParent) {
                bNode.x += (skillsParent.x - bNode.x) * (lerpFactor * 2);
                bNode.y += (skillsParent.y - bNode.y) * (lerpFactor * 2);
            }
            bNode.isHovered = false;
            bNode.expanded = false;
        }

        const isSelected = bNode.isHovered || bNode.expanded;
        const targetRadius = isSelected ? 65 : 44;
        bNode.radius += (targetRadius - bNode.radius) * lerpFactor;

        const targetFont = isSelected ? 16 : 13;
        bNode.fontSize += (targetFont - bNode.fontSize) * lerpFactor;
    });

    const branchSkillsNode = skillsBranchNodes.find(b => b.id === "branch_skills");
    const subOrbitDistLeft = 190;
    const subFanSpread = Math.PI * 0.44;

    skillSubNodes.forEach((sNode) => {
        if (rootNode.expanded && skillsParent && skillsParent.expanded && branchSkillsNode && branchSkillsNode.expanded) {
            const baseAngle = Math.PI;
            const step = sNode.total > 1 ? subFanSpread / (sNode.total - 1) : 0;
            const angle = baseAngle - (subFanSpread / 2) + (sNode.index * step);

            const targetX = branchSkillsNode.x + Math.cos(angle) * subOrbitDistLeft;
            const targetY = branchSkillsNode.y + Math.sin(angle) * subOrbitDistLeft;

            if (sNode !== draggedNode) {
                sNode.x += (targetX - sNode.x) * lerpFactor;
                sNode.y += (targetY - sNode.y) * lerpFactor;
            }

            checkHover(sNode);
            if (sNode.isHovered) anyChildHovered = true;

            sNode.particles.forEach((p) => {
                p.t += p.speed;
                if (p.t > 1) p.t = 0;
            });
        } else {
            if (sNode !== draggedNode && branchSkillsNode) {
                sNode.x += (branchSkillsNode.x - sNode.x) * (lerpFactor * 2);
                sNode.y += (branchSkillsNode.y - sNode.y) * (lerpFactor * 2);
            }
            sNode.isHovered = false;
            sNode.expanded = false;
        }

        const isSelected = sNode.isHovered || sNode.expanded;
        const targetRadius = isSelected ? 60 : 40;
        sNode.radius += (targetRadius - sNode.radius) * lerpFactor;

        const targetFont = isSelected ? 15 : 12;
        sNode.fontSize += (targetFont - sNode.fontSize) * lerpFactor;
    });

    if (skillsParent) {
        const outwardAngle = Math.atan2(skillsParent.y - rootNode.y, skillsParent.x - rootNode.x);
        const activeAward = skillsBranchNodes.find(b => b.id === "branch_awards" && b.expanded);
        const activeSubSkill = skillSubNodes.find(s => s.expanded);
        const activeTarget = activeSubSkill || activeAward;

        if (activeTarget && skillsParent.expanded && rootNode.expanded) {
            const stageDist = activeSubSkill ? (branchOrbitDist + subOrbitDistLeft + 320) : (branchOrbitDist + 320);
            const stageX = skillsParent.x + Math.cos(outwardAngle) * stageDist;
            const stageY = skillsParent.y + Math.sin(outwardAngle) * stageDist;

            skillStageCard.x += (stageX - skillStageCard.x) * lerpFactor;
            skillStageCard.y += (stageY - skillStageCard.y) * lerpFactor;
        } else if (activeTarget) {
            skillStageCard.x += (activeTarget.x - skillStageCard.x) * (lerpFactor * 2);
            skillStageCard.y += (activeTarget.y - skillStageCard.y) * (lerpFactor * 2);
        }
    }

    canvas.style.cursor = (rootNode.isHovered || anyChildHovered) ? "pointer" : (isDraggingCamera ? "grabbing" : "default");
}

function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    drawCyberBackground(ctx, camera);

    ctx.save();
    ctx.translate(camera.x, camera.y);

    const projectsParent = categoryNodes.find(c => c.id === "projects");
    if (projectsParent && projectsParent.expanded) {
        projectNodes.forEach((pNode) => {
            const dist = Math.hypot(pNode.x - projectsParent.x, pNode.y - projectsParent.y);
            const progress = Math.min(dist / 180, 1);

            if (progress > 0.15) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(projectsParent.x, projectsParent.y);
                ctx.lineTo(pNode.x, pNode.y);
                ctx.strokeStyle = pNode.color;
                ctx.globalAlpha = progress * 0.4;
                ctx.lineWidth = (pNode.isHovered || pNode.expanded) ? 6 : 2;
                if (pNode.isHovered || pNode.expanded) {
                    ctx.shadowColor = pNode.color;
                    ctx.shadowBlur = 12;
                }
                ctx.stroke();
                ctx.restore();

                pNode.particles.forEach((p) => {
                    const px = projectsParent.x + (pNode.x - projectsParent.x) * p.t;
                    const py = projectsParent.y + (pNode.y - projectsParent.y) * p.t;
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = "#ffffff";
                    ctx.shadowColor = pNode.color;
                    ctx.shadowBlur = 8;
                    ctx.globalAlpha = progress * 0.9;
                    ctx.fill();
                    ctx.restore();
                });
            }
        });

        projectNodes.forEach((pNode) => {
            const dist = Math.hypot(pNode.x - projectsParent.x, pNode.y - projectsParent.y);
            const progress = Math.min(dist / 180, 1);

            if (progress > 0.2) {
                ctx.save();
                ctx.globalAlpha = progress;

                const isSelected = pNode.isHovered || pNode.expanded;
                if (isSelected) {
                    ctx.beginPath();
                    ctx.arc(pNode.x, pNode.y, pNode.radius + 6, 0, Math.PI * 2);
                    ctx.strokeStyle = pNode.color;
                    ctx.lineWidth = 2;
                    ctx.shadowColor = pNode.color;
                    ctx.shadowBlur = 18;
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.arc(pNode.x, pNode.y, pNode.radius, 0, Math.PI * 2);
                ctx.fillStyle = isSelected ? "#1e293b" : "#0f172a";
                ctx.fill();
                ctx.strokeStyle = pNode.color;
                ctx.lineWidth = isSelected ? 3.5 : 2;
                ctx.stroke();

                ctx.fillStyle = "#f8fafc";
                ctx.font = `600 ${pNode.fontSize}px sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(pNode.label, pNode.x, pNode.y);

                ctx.restore();
            }
        });
    }

    projectNodes.forEach((pNode) => {
        if (pNode.expanded) {
            const textDist = Math.hypot(pNode.cards.textCard.x - pNode.x, pNode.cards.textCard.y - pNode.y);
            const cardProgress = Math.min(textDist / 120, 1);

            if (cardProgress > 0.2) {
                ctx.save();
                ctx.strokeStyle = pNode.color;
                ctx.globalAlpha = cardProgress * 0.5;
                ctx.lineWidth = 2.5;

                ctx.beginPath();
                ctx.moveTo(pNode.x, pNode.y - pNode.radius);
                ctx.lineTo(pNode.cards.textCard.x, pNode.cards.textCard.y + (pNode.cards.textCard.height / 2));
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(pNode.cards.textCard.x, pNode.cards.textCard.y - (pNode.cards.textCard.height / 2));
                ctx.lineTo(pNode.cards.imageCard.x, pNode.cards.imageCard.y + (pNode.cards.imageCard.height / 2));
                ctx.stroke();
                ctx.restore();

                drawGlassTextBox(pNode.cards.textCard, pNode, cardProgress);
                drawImageCard(pNode.cards.imageCard, pNode, cardProgress);
            }
        }
    });

    categoryNodes.forEach((node) => {
        const distFromRoot = Math.hypot(node.x - rootNode.x, node.y - rootNode.y);
        const progress = Math.min(distFromRoot / 280, 1);

        if (progress > 0.1) {
            const angle = Math.atan2(node.y - rootNode.y, node.x - rootNode.x);
            const startX = rootNode.x + Math.cos(angle) * rootNode.radius;
            const startY = rootNode.y + Math.sin(angle) * rootNode.radius;
            const endX = node.x - Math.cos(angle) * node.radius;
            const endY = node.y - Math.sin(angle) * node.radius;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = node.color;
            ctx.globalAlpha = progress * 0.4;
            ctx.lineWidth = (node.isHovered || node.expanded) ? 10 : 3;
            if (node.isHovered || node.expanded) {
                ctx.shadowColor = node.color;
                ctx.shadowBlur = 12;
            }
            ctx.stroke();
            ctx.restore();

            node.particles.forEach((p) => {
                const px = startX + (endX - startX) * p.t;
                const py = startY + (endY - startY) * p.t;
                ctx.save();
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fillStyle = "#ffffff";
                ctx.shadowColor = node.color;
                ctx.shadowBlur = 10;
                ctx.globalAlpha = progress * 0.85;
                ctx.fill();
                ctx.restore();
            });
        }
    });

    categoryNodes.forEach((node) => {
        const distFromRoot = Math.hypot(node.x - rootNode.x, node.y - rootNode.y);
        const progress = Math.min(distFromRoot / 280, 1);

        if (progress > 0.15) {
            ctx.save();
            ctx.globalAlpha = progress;

            if (node.isHovered || node.expanded) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
                ctx.strokeStyle = node.color;
                ctx.lineWidth = 2;
                ctx.shadowColor = node.color;
                ctx.shadowBlur = 20;
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = (node.isHovered || node.expanded) ? "#1e293b" : "#0f172a";
            ctx.fill();
            ctx.strokeStyle = node.color;
            ctx.lineWidth = (node.isHovered || node.expanded) ? 3.5 : 2;
            ctx.stroke();

            ctx.fillStyle = "#f8fafc";
            ctx.font = `600 ${node.fontSize}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(node.label, node.x, node.y);

            ctx.restore();
        }
    });

    const aboutParent = categoryNodes.find(c => c.id === "about");
    if (aboutParent && aboutParent.expanded) {
        aboutNodes.forEach((aNode) => {
            const dist = Math.hypot(aNode.x - aboutParent.x, aNode.y - aboutParent.y);
            const progress = Math.min(dist / 140, 1);

            if (progress > 0.15) {
                const angle = Math.atan2(aNode.y - aboutParent.y, aNode.x - aboutParent.x);
                const startX = aboutParent.x + Math.cos(angle) * aboutParent.radius;
                const startY = aboutParent.y + Math.sin(angle) * aboutParent.radius;

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(aNode.x, aNode.y);
                ctx.strokeStyle = aNode.color;
                ctx.globalAlpha = progress * 0.45;
                ctx.lineWidth = (aNode.isHovered || aNode.expanded) ? 6 : 2;
                if (aNode.isHovered || aNode.expanded) {
                    ctx.shadowColor = aNode.color;
                    ctx.shadowBlur = 14;
                }
                ctx.stroke();
                ctx.restore();

                aNode.particles.forEach((p) => {
                    const px = startX + (aNode.x - startX) * p.t;
                    const py = startY + (aNode.y - startY) * p.t;
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = "#ffffff";
                    ctx.shadowColor = aNode.color;
                    ctx.shadowBlur = 8;
                    ctx.globalAlpha = progress * 0.9;
                    ctx.fill();
                    ctx.restore();
                });
            }
        });

        aboutNodes.forEach((aNode) => {
            const dist = Math.hypot(aNode.x - aboutParent.x, aNode.y - aboutParent.y);
            const progress = Math.min(dist / 140, 1);
            
            if (progress > 0.2) {
                ctx.save();
                ctx.globalAlpha = progress;

                const isSelected = aNode.isHovered || aNode.expanded;
                if (isSelected) {
                    ctx.beginPath();
                    ctx.arc(aNode.x, aNode.y, aNode.radius + 6, 0, Math.PI * 2);
                    ctx.strokeStyle = aNode.color;
                    ctx.lineWidth = 2;
                    ctx.shadowColor = aNode.color;
                    ctx.shadowBlur = 18;
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.arc(aNode.x, aNode.y, aNode.radius, 0, Math.PI * 2);
                ctx.fillStyle = isSelected ? "#1e293b" : "#0f172a";
                ctx.fill();
                ctx.strokeStyle = aNode.color;
                ctx.lineWidth = isSelected ? 3.5 : 2;
                ctx.stroke();

                ctx.fillStyle = "#f8fafc";
                ctx.font = `600 ${aNode.fontSize}px sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(aNode.label, aNode.x, aNode.y);

                ctx.restore();
            }
        });
    }

    const bgNode = aboutNodes.find(n => n.id === "about_bg");
    if (bgNode && bgNode.expanded) {
        const dist = Math.hypot(aboutBioCard.x - bgNode.x, aboutBioCard.y - bgNode.y);
        const progress = Math.min(dist / 140, 1);

        if (progress > 0.2) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(bgNode.x, bgNode.y);
            ctx.lineTo(aboutBioCard.x - (aboutBioCard.width / 2), aboutBioCard.y);
            ctx.strokeStyle = bgNode.color;
            ctx.globalAlpha = progress * 0.5;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = bgNode.color;
            ctx.shadowBlur = 12;
            ctx.stroke();
            ctx.restore();

            drawHugeBioCard(aboutBioCard, progress);
        }
    }

    const contactNode = aboutNodes.find(n => n.id === "about_contact");
    if (contactNode && contactNode.expanded) {
        const dist = Math.hypot(contactAnchor.x - contactNode.x, contactAnchor.y - contactNode.y);
        const progress = Math.min(dist / 140, 1);

        if (progress > 0.2) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(contactNode.x, contactNode.y);
            ctx.lineTo(contactAnchor.x, contactAnchor.y);
            ctx.strokeStyle = contactNode.color;
            ctx.globalAlpha = progress * 0.5;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = contactNode.color;
            ctx.shadowBlur = 12;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(contactAnchor.x, contactAnchor.y, contactAnchor.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#1e293b";
            ctx.fill();
            ctx.strokeStyle = contactAnchor.color;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fillStyle = "#f8fafc";
            ctx.font = "bold 9px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(contactAnchor.label, contactAnchor.x, contactAnchor.y);

            socialSatellites.forEach((sat) => {
                ctx.beginPath();
                ctx.arc(sat.x, sat.y, sat.radius, 0, Math.PI * 2);
                ctx.fillStyle = sat.isHovered ? "#334155" : "#0f172a";
                ctx.fill();
                ctx.strokeStyle = sat.color;
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = "#f8fafc";
                ctx.font = "bold 9.5px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(sat.label, sat.x, sat.y);
            });

            ctx.restore();
        }
    }

    const expParent = categoryNodes.find(c => c.id === "experience");
    if (expParent && expParent.expanded) {
        experienceNodes.forEach((eNode) => {
            const dist = Math.hypot(eNode.x - expParent.x, eNode.y - expParent.y);
            const progress = Math.min(dist / 140, 1);

            if (progress > 0.15) {
                const angle = Math.atan2(eNode.y - expParent.y, eNode.x - expParent.x);
                const startX = expParent.x + Math.cos(angle) * expParent.radius;
                const startY = expParent.y + Math.sin(angle) * expParent.radius;

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(eNode.x, eNode.y);
                ctx.strokeStyle = eNode.color;
                ctx.globalAlpha = progress * 0.45;
                ctx.lineWidth = (eNode.isHovered || eNode.expanded) ? 6 : 2;
                if (eNode.isHovered || eNode.expanded) {
                    ctx.shadowColor = eNode.color;
                    ctx.shadowBlur = 14;
                }
                ctx.stroke();
                ctx.restore();

                eNode.particles.forEach((p) => {
                    const px = startX + (eNode.x - startX) * p.t;
                    const py = startY + (eNode.y - startY) * p.t;
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = "#ffffff";
                    ctx.shadowColor = eNode.color;
                    ctx.shadowBlur = 8;
                    ctx.globalAlpha = progress * 0.9;
                    ctx.fill();
                    ctx.restore();
                });
            }
        });

        experienceNodes.forEach((eNode) => {
            const dist = Math.hypot(eNode.x - expParent.x, eNode.y - expParent.y);
            const progress = Math.min(dist / 140, 1);

            if (progress > 0.2) {
                ctx.save();
                ctx.globalAlpha = progress;

                const isSelected = eNode.isHovered || eNode.expanded;
                if (isSelected) {
                    ctx.beginPath();
                    ctx.arc(eNode.x, eNode.y, eNode.radius + 6, 0, Math.PI * 2);
                    ctx.strokeStyle = eNode.color;
                    ctx.lineWidth = 2;
                    ctx.shadowColor = eNode.color;
                    ctx.shadowBlur = 18;
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.arc(eNode.x, eNode.y, eNode.radius, 0, Math.PI * 2);
                ctx.fillStyle = isSelected ? "#1e293b" : "#0f172a";
                ctx.fill();
                ctx.strokeStyle = eNode.color;
                ctx.lineWidth = isSelected ? 3.5 : 2;
                ctx.stroke();

                ctx.fillStyle = "#f8fafc";
                ctx.font = `600 ${eNode.fontSize}px sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(eNode.label, eNode.x, eNode.y);

                ctx.restore();
            }
        });
    }

    const activeExpNode = experienceNodes.find(n => n.expanded);
    if (activeExpNode && expParent && expParent.expanded) {
        const dist = Math.hypot(experienceTimeLineCard.x - activeExpNode.x, experienceTimeLineCard.y - activeExpNode.y);
        const progress = Math.min(dist / 160, 1);

        if (progress > 0.2) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(activeExpNode.x, activeExpNode.y + activeExpNode.radius);
            ctx.lineTo(experienceTimeLineCard.x, experienceTimeLineCard.y - (experienceTimeLineCard.height / 2));
            ctx.strokeStyle = activeExpNode.color;
            ctx.globalAlpha = progress * 0.5;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = activeExpNode.color;
            ctx.shadowBlur = 12;
            ctx.stroke();
            ctx.restore();

            drawTimelineCard(experienceTimeLineCard, activeExpNode, progress);
        }
    }

    const skillsParent = categoryNodes.find(c => c.id === "skills");
    if (skillsParent && skillsParent.expanded) {
        skillsBranchNodes.forEach((bNode) => {
            const dist = Math.hypot(bNode.x - skillsParent.x, bNode.y - skillsParent.y);
            const progress = Math.min(dist / 120, 1);

            if (progress > 0.15) {
                const angle = Math.atan2(bNode.y - skillsParent.y, bNode.x - skillsParent.x);
                const startX = skillsParent.x + Math.cos(angle) * skillsParent.radius;
                const startY = skillsParent.y + Math.sin(angle) * skillsParent.radius;

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(bNode.x, bNode.y);
                ctx.strokeStyle = bNode.color;
                ctx.globalAlpha = progress * 0.45;
                ctx.lineWidth = (bNode.isHovered || bNode.expanded) ? 6 : 2;
                if (bNode.isHovered || bNode.expanded) {
                    ctx.shadowColor = bNode.color;
                    ctx.shadowBlur = 14;
                }
                ctx.stroke();
                ctx.restore();

                bNode.particles.forEach((p) => {
                    const px = startX + (bNode.x - startX) * p.t;
                    const py = startY + (bNode.y - startY) * p.t;
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = "#ffffff";
                    ctx.shadowColor = bNode.color;
                    ctx.shadowBlur = 8;
                    ctx.globalAlpha = progress * 0.9;
                    ctx.fill();
                    ctx.restore();
                });
            }
        });

        const branchSkillsNode = skillsBranchNodes.find(b => b.id === "branch_skills");
        if (branchSkillsNode && branchSkillsNode.expanded) {
            skillSubNodes.forEach((sNode) => {
                const dist = Math.hypot(sNode.x - branchSkillsNode.x, sNode.y - branchSkillsNode.y);
                const progress = Math.min(dist / 100, 1);

                if (progress > 0.15) {
                    const angle = Math.atan2(sNode.y - branchSkillsNode.y, sNode.x - branchSkillsNode.x);
                    const startX = branchSkillsNode.x + Math.cos(angle) * branchSkillsNode.radius;
                    const startY = branchSkillsNode.y + Math.sin(angle) * branchSkillsNode.radius;

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(sNode.x, sNode.y);
                    ctx.strokeStyle = sNode.color;
                    ctx.globalAlpha = progress * 0.45;
                    ctx.lineWidth = (sNode.isHovered || sNode.expanded) ? 6 : 2;
                    if (sNode.isHovered || sNode.expanded) {
                        ctx.shadowColor = sNode.color;
                        ctx.shadowBlur = 14;
                    }
                    ctx.stroke();
                    ctx.restore();

                    sNode.particles.forEach((p) => {
                        const px = startX + (sNode.x - startX) * p.t;
                        const py = startY + (sNode.y - startY) * p.t;
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                        ctx.fillStyle = "#ffffff";
                        ctx.shadowColor = sNode.color;
                        ctx.shadowBlur = 8;
                        ctx.globalAlpha = progress * 0.9;
                        ctx.fill();
                        ctx.restore();
                    });
                }
            });
        }

        skillsBranchNodes.forEach((bNode) => {
            const dist = Math.hypot(bNode.x - skillsParent.x, bNode.y - skillsParent.y);
            const progress = Math.min(dist / 120, 1);

            if (progress > 0.2) {
                ctx.save();
                ctx.globalAlpha = progress;
                const isSelected = bNode.isHovered || bNode.expanded;

                if (isSelected) {
                    ctx.beginPath();
                    ctx.arc(bNode.x, bNode.y, bNode.radius + 6, 0, Math.PI * 2);
                    ctx.strokeStyle = bNode.color;
                    ctx.lineWidth = 2;
                    ctx.shadowColor = bNode.color;
                    ctx.shadowBlur = 18;
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.arc(bNode.x, bNode.y, bNode.radius, 0, Math.PI * 2);
                ctx.fillStyle = isSelected ? "#1e293b" : "#0f172a";
                ctx.fill();
                ctx.strokeStyle = bNode.color;
                ctx.lineWidth = isSelected ? 3.5 : 2;
                ctx.stroke();

                ctx.fillStyle = "#f8fafc";
                ctx.font = `600 ${bNode.fontSize}px sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(bNode.label, bNode.x, bNode.y);

                ctx.restore();
            }
        });

        if (branchSkillsNode && branchSkillsNode.expanded) {
            skillSubNodes.forEach((sNode) => {
                const dist = Math.hypot(sNode.x - branchSkillsNode.x, sNode.y - branchSkillsNode.y);
                const progress = Math.min(dist / 100, 1);

                if (progress > 0.2) {
                    ctx.save();
                    ctx.globalAlpha = progress;
                    const isSelected = sNode.isHovered || sNode.expanded;

                    if (isSelected) {
                        ctx.beginPath();
                        ctx.arc(sNode.x, sNode.y, sNode.radius + 6, 0, Math.PI * 2);
                        ctx.strokeStyle = sNode.color;
                        ctx.lineWidth = 2;
                        ctx.shadowColor = sNode.color;
                        ctx.shadowBlur = 18;
                        ctx.stroke();
                    }

                    ctx.beginPath();
                    ctx.arc(sNode.x, sNode.y, sNode.radius, 0, Math.PI * 2);
                    ctx.fillStyle = isSelected ? "#1e293b" : "#0f172a";
                    ctx.fill();
                    ctx.strokeStyle = sNode.color;
                    ctx.lineWidth = isSelected ? 3.5 : 2;
                    ctx.stroke();

                    ctx.fillStyle = "#f8fafc";
                    ctx.font = `600 ${sNode.fontSize}px sans-serif`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(sNode.label, sNode.x, sNode.y);

                    ctx.restore();
                }
            });
        }
    }

    const activeAwardNode = skillsBranchNodes.find(b => b.id === "branch_awards" && b.expanded);
    const activeSubSkillNode = skillSubNodes.find(s => s.expanded);
    const currentActiveCardNode = activeSubSkillNode || activeAwardNode;

    if (currentActiveCardNode && skillsParent && skillsParent.expanded) {
        const dist = Math.hypot(skillStageCard.x - currentActiveCardNode.x, skillStageCard.y - currentActiveCardNode.y);
        const progress = Math.min(dist / 220, 1);

        if (progress > 0.2) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(currentActiveCardNode.x - currentActiveCardNode.radius, currentActiveCardNode.y);
            ctx.lineTo(skillStageCard.x + (skillStageCard.width / 2), skillStageCard.y);
            ctx.strokeStyle = currentActiveCardNode.color;
            ctx.globalAlpha = progress * 0.5;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = currentActiveCardNode.color;
            ctx.shadowBlur = 12;
            ctx.stroke();
            ctx.restore();

            drawSkillMatrixCard(skillStageCard, currentActiveCardNode, progress);
        }
    }

    drawRootNode();

    ctx.restore();
}

function drawRootNode() {
    const time = rootNode.pulseAngle;
    const baseR = rootNode.radius;

    ctx.save();

    ctx.save();
    ctx.translate(rootNode.x, rootNode.y);
    ctx.rotate(-time * 0.5);
    ctx.beginPath();
    ctx.arc(0, 0, baseR + 24, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([12, 18, 4, 18]); 
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(rootNode.x, rootNode.y);
    ctx.rotate(time * 0.8);
    ctx.beginPath();
    ctx.arc(0, 0, baseR + 12, 0, Math.PI * 2);
    ctx.strokeStyle = rootNode.isHovered ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 12]);
    if (rootNode.isHovered) {
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 15;
    }
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1.5;
    const tickLen = 10;
    ctx.beginPath(); ctx.moveTo(rootNode.x, rootNode.y - baseR - 6); ctx.lineTo(rootNode.x, rootNode.y - baseR - 6 - tickLen); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rootNode.x, rootNode.y + baseR + 6); ctx.lineTo(rootNode.x, rootNode.y + baseR + 6 + tickLen); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rootNode.x - baseR - 6, rootNode.y); ctx.lineTo(rootNode.x - baseR - 6 - tickLen, rootNode.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rootNode.x + baseR + 6, rootNode.y); ctx.lineTo(rootNode.x + baseR + 6 + tickLen, rootNode.y); ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(rootNode.x, rootNode.y, baseR, 0, Math.PI * 2);
    ctx.fillStyle = rootNode.isHovered ? "#090d16" : "#030712"; // Deep space black
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = rootNode.isHovered ? 3.5 : 2;
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = rootNode.isHovered ? 24 : 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${rootNode.fontSize}px 'Courier New', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(rootNode.label, rootNode.x, rootNode.y);

    ctx.restore();
}

function drawGlassTextBox(card, data, alpha) {
    const w = card.width;
    const h = card.height;
    const x = card.x - w / 2;
    const y = card.y - h / 2;

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 14);
    ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
    ctx.fill();
    ctx.strokeStyle = data.color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = data.color;
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const titleEndY = wrapText(ctx, data.title || data.label, x + 20, y + 16, w - 40, 18);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "11.5px sans-serif";
    wrapText(ctx, data.desc || "", x + 20, titleEndY + 8, w - 40, 16);

    if (data.tags) {
        let tagX = x + 20;
        data.tags.forEach(tag => {
            ctx.font = "10px sans-serif";
            const tagW = ctx.measureText(tag).width + 14;

            ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
            ctx.fillRect(tagX, y + h - 30, tagW, 20);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
            ctx.strokeRect(tagX, y + h - 30, tagW, 20);

            ctx.fillStyle = "#e2e8f0";
            ctx.fillText(tag, tagX + 7, y + h - 25);
            tagX += tagW + 8;
        });
    }
    ctx.restore();
}

function drawImageCard(card, data, alpha) {
    const w = card.width;
    const h = card.height;
    const x = card.x - w / 2;
    const y = card.y - h / 2;

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
    ctx.strokeStyle = data.color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = data.color;
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x + 2, y + 2, w - 4, h - 4, 10);
    ctx.clip();

    if (data.imageObj && data.imageObj.complete && data.imageObj.naturalHeight !== 0) {
        ctx.drawImage(data.imageObj, x + 2, y + 2, w - 4, h - 4);
    } else {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
        ctx.fillStyle = "#64748b";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Loading Preview...", card.x, card.y);
    }
    ctx.restore();

    ctx.restore();
}

function drawHugeBioCard(card, alpha) {
    const w = card.width;
    const h = card.height;
    const x = card.x - w / 2;
    const y = card.y - h / 2;

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 16);
    ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
    ctx.fill();

    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 1.8;
    ctx.shadowColor = "#a855f7";
    ctx.shadowBlur = 16;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(card.title, x + 24, y + 20);

    ctx.beginPath();
    ctx.moveTo(x + 24, y + 46);
    ctx.lineTo(x + w - 24, y + 46);
    ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    let currentY = y + 58;
    card.sections.forEach(sec => {
        ctx.fillStyle = "#c084fc";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText(sec.heading, x + 24, currentY);
        currentY += 16;

        ctx.fillStyle = "#94a3b8";
        ctx.font = "11.5px sans-serif";
        currentY = wrapText(ctx, sec.text, x + 24, currentY, w - 48, 16);
        currentY += 10;
    });

    ctx.restore();
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let curY = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = context.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            context.fillText(line, x, curY);
            line = words[n] + " ";
            curY += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, curY);
    return curY + lineHeight;
}

function drawTimelineCard(card, data, alpha) {
    const w = card.width;
    const h = card.height;
    const x = card.x - w / 2;
    const y = card.y - h / 2;

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 16);
    ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
    ctx.fill();

    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.8;
    ctx.shadowColor = "#10b981";
    ctx.shadowBlur = 16;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(data.title || data.label, x + 24, y + 18);

    ctx.beginPath();
    ctx.moveTo(x + 24, y + 44);
    ctx.lineTo(x + w - 24, y + 44);
    ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const railX = x + 36;
    const railStartY = y + 64;
    const railEndY = y + h - 28;

    ctx.beginPath();
    ctx.moveTo(railX, railStartY);
    ctx.lineTo(railX, railEndY);
    ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    let currentY = railStartY;
    if (data.events) {
        data.events.forEach((evt) => {
            ctx.beginPath();
            ctx.arc(railX, currentY + 6, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#10b981";
            ctx.shadowColor = "#10b981";
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = "#6ee7b7";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText(evt.period, railX + 18, currentY);

            ctx.fillStyle = "#f8fafc";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText(`- ${evt.role}`, railX + 18 + ctx.measureText(evt.period).width + 10, currentY);

            currentY += 18;
            ctx.fillStyle = "#94a3b8";
            ctx.font = "italic 11px sans-serif";
            ctx.fillText(evt.org, railX + 18, currentY);

            currentY += 18;
            ctx.fillStyle = "#cbd5e1";
            ctx.font = "11px sans-serif";
            evt.bullets.forEach(bullet => {
                ctx.fillText("•", railX + 18, currentY);
                currentY = wrapText(ctx, bullet, railX + 30, currentY, w - 85, 15);
                currentY += 6;
            });
            currentY += 12;
        });
    }
    ctx.restore();
}

function drawSkillMatrixCard(card, data, alpha) {
    const w = card.width;
    const h = card.height;
    const x = card.x - w / 2;
    const y = card.y - h / 2;

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 16);
    ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
    ctx.fill();

    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1.8;
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 16;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(data.title, x + 24, y + 18);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "11px sans-serif";
    ctx.fillText(data.subtitle, x + 24, y + 36);

    ctx.beginPath();
    ctx.moveTo(x + 24, y + 54);
    ctx.lineTo(x + w - 24, y + 54);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    let currentY = y + 68;

    if (data.items) {
        data.items.forEach(item => {
            const badgeText = item.domain || item.badge || "SECURITY";
            ctx.font = "bold 9px sans-serif";
            const badgeW = ctx.measureText(badgeText).width + 12;

            ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
            ctx.fillRect(x + 24, currentY, badgeW, 18);
            ctx.strokeStyle = "#f59e0b";
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 24, currentY, badgeW, 18);

            ctx.fillStyle = "#fbbf24";
            ctx.fillText(badgeText, x + 30, currentY + 4);

            ctx.fillStyle = "#f8fafc";
            ctx.font = "bold 12.5px sans-serif";
            ctx.fillText(item.name, x + 24 + badgeW + 12, currentY + 3);

            ctx.fillStyle = "#94a3b8";
            ctx.font = "11px sans-serif";
            currentY = wrapText(ctx, item.context, x + 24, currentY + 24, w - 48, 15);
            currentY += 14; 
        });
    }

    if (data.awards) {
        data.awards.forEach(awd => {
            ctx.fillStyle = "#f59e0b";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText(awd.year, x + 24, currentY);

            ctx.fillStyle = "#f8fafc";
            ctx.font = "bold 12.5px sans-serif";
            ctx.fillText(awd.title, x + 68, currentY);

            currentY += 18;
            ctx.fillStyle = "#fbbf24";
            ctx.font = "italic 11px sans-serif";
            ctx.fillText(awd.issuer, x + 68, currentY);

            currentY += 18;
            ctx.fillStyle = "#cbd5e1";
            ctx.font = "11px sans-serif";
            currentY = wrapText(ctx, awd.desc, x + 68, currentY, w - 92, 16);
            currentY += 16;
        });
    }

    ctx.restore();
}

function drawCyberBackground(ctx, camera) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const gridSize = 48;

    ctx.save();
    
    const offsetX = (camera.x * 0.3) % gridSize;
    const offsetY = (camera.y * 0.3) % gridSize;

    ctx.beginPath();
    for (let x = offsetX; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }
    for (let y = offsetY; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.strokeStyle = "rgba(148, 163, 184, 0.05)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
    ctx.lineWidth = 1.5;
    const m = 30;
    const s = 14;
    ctx.beginPath(); ctx.moveTo(m, m + s); ctx.lineTo(m, m); ctx.lineTo(m + s, m); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(width - m - s, m); ctx.lineTo(width - m, m); ctx.lineTo(width - m, m + s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(m, height - m - s); ctx.lineTo(m, height - m); ctx.lineTo(m + s, height - m); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(width - m - s, height - m); ctx.lineTo(width - m, height - m); ctx.lineTo(width - m, height - m - s); ctx.stroke();

    ctx.fillStyle = "rgba(148, 163, 184, 0.35)";
    ctx.font = "9px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`SYS.LOC: [LAT: ${(camera.x).toFixed(1)} // LNG: ${(camera.y).toFixed(1)}]`, m + 8, height - m - 4);
    ctx.textAlign = "right";
    ctx.fillText("CORE.SEC // NODE_ENG: v3.4.0", width - m - 8, height - m - 4);

    ctx.restore();
}

function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

animate();