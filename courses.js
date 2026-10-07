/* =====================================================================
   Central course list – maintain ONLY here (coupon, prices, courses, badges)
   The page (index.html) is built from this automatically by app.js.
   ===================================================================== */

var SHOP = {
  // Current Udemy coupon code – appended to every course link
  coupon: "LINK-2026-09",

  // Coupon price
  price: 12.99,

  // Default anchor price (struck through). IMPORTANT: must match the real
  // Udemy list price. Set differing prices per course via "listPrice".
  listPrice: 49.99,

  currency: "USD",
  locale: "en-US",

  // Udemy figures for the header (from the Udemy statistics page)
  stats: { rating: 4.49, students: 4605, reviews: 731 },

  text: {
    all: "All",
    featured: "Start for free",
    free: "FREE",
    isNew: "NEW",
    bestseller: "BESTSELLER",
    cta: "View course →",
    ctaFree: "Watch for free →",
    course: "course",
    courses: "courses",
    rating: "rating",
    students: "students",
    reviews: "reviews"
  },

  // Reihenfolge = Reihenfolge auf der Seite; hint = kleiner Text unter dem Namen
  categories: [
    { id: "virtualization", label: "Virtualization", hint: "Proxmox · Hyper-V" },
    { id: "automation", label: "Automation & DevOps", hint: "Ansible · AWX · PowerShell" },
    { id: "ai", label: "AI (Claude/Codex)", hint: "Agentic Engineering · Admin" },
    { id: "network", label: "Network & Security", hint: "FortiGate · Linux Security" },
    { id: "windows", label: "Windows & Microsoft", hint: "Server · PowerShell · Hyper-V" },
    { id: "linux", label: "Linux", hint: "Security · Administration" }
  ],

  /* Fields per course:
     slug       Udemy course slug (from udemy.com/course/<slug>/)
     title      Display title
     img        Image in img/
     cats       Categories; the FIRST one decides the section in "All"
     level      optional: "Beginner", "Advanced", "Beginner to Expert"
     bestseller optional: true -> "BESTSELLER" badge (best-selling courses)
     isNew      optional: true -> "NEW" badge
     free       optional: true -> free course (highlighted on top)
     url        optional: full link instead of slug + coupon
     listPrice  optional: differing anchor price */
  // Reihenfolge: neue Kurse zuerst, dann Gratis, dann nach Verkaeufen (Stand 10/2026)
  courses: [
    {
      slug: "linux-security-hardening-auditing-practical-course",
      title: "Linux Security Hardening & Auditing: Practical Course",
      img: "thumb-tux-security-1-lock-dark-sq.png", cats: ["linux", "network"], isNew: true
    },
    {
      slug: "openai-codex-agentic-engineering-next-level-ai-development",
      title: "Codex & Agentic Engineering: Next-Level AI Development",
      img: "codex-thumbnail-en-sq.png", cats: ["ai"], isNew: true
    },
    {
      slug: "proxmox-hands-on-masterclass-from-beginner-to-expert",
      title: "Proxmox Hands-On Masterclass – From Beginner to Expert",
      img: "prox_master.jpg", cats: ["virtualization"], bestseller: true, level: "Beginner to Expert"
    },
    {
      slug: "proxmox-ve-advanced-virtualization-hands-on-course",
      title: "Proxmox VE 8 Advanced – Virtualization Hands-On Course",
      img: "proxmox-advanced.jpg", cats: ["virtualization"], bestseller: true, level: "Advanced"
    },
    {
      // Slug contains Udemy's original typo "pracical" – do not change
      slug: "fortinet-fortigate-pracical-firewalling-course",
      title: "Fortinet FortiGate: Practical Firewalling Course",
      img: "fortinet.jpg", cats: ["network"], bestseller: true
    },
    {
      slug: "proxmox-ve-8-practical-course-on-virtualization",
      title: "Proxmox VE 8 Practical Course on Virtualization",
      img: "proxmox.jpg", cats: ["virtualization"]
    },
    {
      slug: "ansible-masterclass-en",
      title: "Ansible Masterclass – From Beginner to Expert 2026",
      img: "thumbnail-en-sq.jpg", cats: ["automation"], level: "Beginner to Expert"
    },
    {
      slug: "claude-code-agentic-engineering-next-level-ai-development",
      title: "Claude Code & Agentic Engineering: Next-Level AI Development",
      img: "claude-code-en.jpg", cats: ["ai"]
    },
    {
      slug: "ansible-advanced-hands-on-course",
      title: "Ansible Advanced – Hands-On Course 2025",
      img: "ansible-advanced-en.jpg", cats: ["automation"], level: "Advanced"
    },
    {
      slug: "microsoft-hyper-v-on-windows-server-2025-windows-11",
      title: "Microsoft Hyper-V on Windows Server 2025 & Windows 11",
      img: "hyper-v.jpg", cats: ["windows", "virtualization"]
    },
    {
      slug: "powershell-hands-on-course",
      title: "PowerShell Hands-On Course – From Beginner to Pro",
      img: "powershell-en-sq.jpg", cats: ["windows", "automation"], level: "Beginner to Expert"
    },
    {
      slug: "ansible-it-automation-for-beginners",
      title: "Ansible: IT Automation for Beginners 2025",
      img: "ansible-beginner-en.jpg", cats: ["automation"], level: "Beginner"
    },
    {
      slug: "ansible-awx-hands-on-course",
      title: "Ansible AWX Hands-On Course 2026",
      img: "awx-en.jpg", cats: ["automation"]
    },
    {
      slug: "next-level-linux-system-administration-with-claude-code",
      title: "Next-Level Linux System Administration with Claude Code",
      img: "thumb-tux-auto-orange-sq.png", cats: ["ai", "linux"]
    },
    {
      slug: "windows-server-2025-hands-on-course",
      title: "Windows Server 2025 – Beginner-Friendly Hands-On Course",
      img: "server2025-en.jpg", cats: ["windows"], level: "Beginner"
    },
    {
      slug: "next-level-system-administration-devops-via-claude-code",
      title: "Next-Level System Administration & DevOps via Claude Code",
      img: "claude-server.jpg", cats: ["ai", "automation"]
    },
    {
      slug: "next-level-windows-system-administration-with-claude-code",
      title: "Next-Level Windows System Administration with Claude Code",
      img: "claude-windows.jpg", cats: ["ai", "windows"]
    }
  ]
};
