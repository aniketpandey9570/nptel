/**
 * Certificate Studio & Verification Engine
 * Handles live preview, QR code generation, photo uploads, PDF export & print.
 */

// Default configuration state
const defaultState = {
  fullName: "ANIKET PANDEY",
  courseTitle: "INTRODUCTION TO PROGRAMMING IN C",
  rollNo: "AP2026CS113S353300028",
  certId: "CERT-2026-NPTEL-98234",
  collegeName: "Indian Institute of Technology & Engineering Demo",
  score: "88%",
  assignmentScore: "24.54/25",
  examScore: "63.50/75",
  certifiedCount: "1650",
  sessionPeriod: "JUL-SEP 2026",
  sessionDuration: "(8 week course)",
  credits: "3",
  sig1Name: "Prof. B. V. Ratish Kumar",
  sig1Title: "Chairman, Centre for Continuing Education",
  sig1Inst: "IIT Demonstration Centre",
  sig2Name: "Prof. Satyaki Roy",
  sig2Title: "Program Coordinator",
  sig2Inst: "IIT Demonstration Centre",
  targetUrl: "https://aniketpandey.github.io/nptel/certificate.html",
  photoData: ""
};

// Application state (cloned from defaults or loaded from localStorage)
let state = { ...defaultState };
let currentScale = 1.0;
let qrInstance = null;

// Default sample avatar SVG (Data URI)
const DEFAULT_AVATAR = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" width="100" height="125">
  <rect width="100" height="125" fill="#e9edf4"/>
  <circle cx="50" cy="42" r="22" fill="#a0aec0"/>
  <path d="M18 108 C 22 80, 78 80, 82 108 Z" fill="#718096"/>
  <path d="M38 48 Q 50 58 62 48" stroke="#cbd5e1" stroke-width="2" fill="none"/>
</svg>
`);

// Preset datasets for quick testing
const presets = {
  c_prog: {
    fullName: "ANIKET PANDEY",
    courseTitle: "INTRODUCTION TO PROGRAMMING IN C",
    rollNo: "AP2026CS113S353300028",
    certId: "CERT-2026-CS-35330",
    collegeName: "Indian Institute of Technology & Engineering Demo",
    score: "88%",
    assignmentScore: "24.54/25",
    examScore: "63.50/75",
    certifiedCount: "1650",
    sessionPeriod: "JUL-SEP 2026",
    sessionDuration: "(8 week course)",
    credits: "3"
  },
  data_science: {
    fullName: "ANIKET PANDEY",
    courseTitle: "PYTHON FOR DATA SCIENCE & MACHINE LEARNING",
    rollNo: "AP2026DS204M498210045",
    certId: "CERT-2026-DS-49821",
    collegeName: "Indian Institute of Technology & Engineering Demo",
    score: "92%",
    assignmentScore: "25.00/25",
    examScore: "67.00/75",
    certifiedCount: "2140",
    sessionPeriod: "JAN-APR 2026",
    sessionDuration: "(12 week course)",
    credits: "4"
  },
  cloud_computing: {
    fullName: "ANIKET PANDEY",
    courseTitle: "CLOUD COMPUTING ARCHITECTURE & DEVOPS",
    rollNo: "AP2026CC312K771450091",
    certId: "CERT-2026-CC-77145",
    collegeName: "Indian Institute of Technology & Engineering Demo",
    score: "85%",
    assignmentScore: "23.80/25",
    examScore: "61.20/75",
    certifiedCount: "1320",
    sessionPeriod: "JUL-OCT 2026",
    sessionDuration: "(12 week course)",
    credits: "3"
  }
};

/**
 * Initialize Studio
 */
document.addEventListener("DOMContentLoaded", () => {
  // Check if we are on certificate.html (standalone verification page)
  if (document.body.classList.contains("standalone-body")) {
    initStandaloneView();
    return;
  }

  // Load saved state from localStorage if available
  loadSavedState();

  // Populate form fields with current state
  populateFormFields();

  // Initialize UI event handlers
  initFormListeners();
  initPhotoUploader();
  initZoomControls();
  initAccordions();
  initActionButtons();

  // Render certificate & QR code
  renderCertificate();
  autoScaleCertificate();

  // Listen to window resize for auto-scaling
  window.addEventListener("resize", debounce(autoScaleCertificate, 150));
});

/**
 * Populate form inputs from state
 */
function populateFormFields() {
  const fields = [
    "fullName", "courseTitle", "rollNo", "certId", "collegeName",
    "score", "assignmentScore", "examScore", "certifiedCount",
    "sessionPeriod", "sessionDuration", "credits",
    "sig1Name", "sig1Title", "sig1Inst",
    "sig2Name", "sig2Title", "sig2Inst",
    "targetUrl"
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && state[id] !== undefined) {
      el.value = state[id];
    }
  });

  // Update thumbnail
  const thumb = document.getElementById("photoThumbnail");
  if (thumb) {
    thumb.src = state.photoData || DEFAULT_AVATAR;
  }
}

/**
 * Initialize listeners on form controls for live updates
 */
function initFormListeners() {
  const form = document.getElementById("certConfigForm");
  if (!form) return;

  form.addEventListener("input", (e) => {
    const { id, value } = e.target;
    if (id && state.hasOwnProperty(id)) {
      state[id] = value;
      renderCertificate();
      saveStateToLocalStorage();
      
      // If the target URL or core IDs change, update the QR code
      if (id === "targetUrl" || id === "rollNo" || id === "certId" || id === "fullName") {
        updateQRCode();
      }
    }
  });
}

/**
 * Render all text and visual elements into the Certificate DOM
 */
function renderCertificate() {
  setText("certFullName", state.fullName || "YOUR FULL NAME");
  setText("certCourseTitle", state.courseTitle || "COURSE TITLE");
  setText("certRollNo", `Roll No: ${state.rollNo || "NPTELDEMO00000"}`);
  setText("certCollegeName", state.collegeName || "Institution / College Name");
  setText("certScore", state.score || "0%");
  setText("certAssignmentScore", state.assignmentScore || "0/25");
  setText("certExamScore", state.examScore || "0/75");
  setText("certCertifiedCount", state.certifiedCount || "0");
  setText("certSessionPeriod", state.sessionPeriod || "SESSION 2026");
  setText("certSessionDuration", state.sessionDuration || "(8 week course)");
  setText("certCredits", `No. of credits recommended: ${state.credits || "3"}`);

  // Signatures
  setText("certSig1Name", state.sig1Name);
  setText("certSig1Title", state.sig1Title);
  setText("certSig1Inst", state.sig1Inst);

  setText("certSig2Name", state.sig2Name);
  setText("certSig2Title", state.sig2Title);
  setText("certSig2Inst", state.sig2Inst);

  // Photo
  const photoImg = document.getElementById("certPhoto");
  if (photoImg) {
    photoImg.src = state.photoData || DEFAULT_AVATAR;
  }

  // Update QR Code
  updateQRCode();
}

/**
 * Helper to safely update text content
 */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/**
 * Generate high-contrast, verifiable QR Code
 */
function updateQRCode() {
  const qrContainer = document.getElementById("certQrCode");
  if (!qrContainer) return;

  // Build the target verification link
  const link = getVerificationUrl();

  // Clear previous QR code
  qrContainer.innerHTML = "";

  try {
    // Generate QR with error correction level M (15% redundancy) for high scan reliability
    new QRCode(qrContainer, {
      text: link,
      width: 120, // Generated high-res and styled by CSS to 52px for retina/print sharpness
      height: 120,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });

    // Also update current QR link display in sidebar if present
    const linkPreview = document.getElementById("qrLinkPreview");
    if (linkPreview) {
      linkPreview.textContent = link;
      linkPreview.href = link;
    }
  } catch (err) {
    console.error("QR Code Generation Error:", err);
  }
}

/**
 * Build verification URL with encoded parameters
 */
function getVerificationUrl(includeAllParams = true) {
  let baseUrl = state.targetUrl ? state.targetUrl.trim() : "";
  if (!baseUrl) {
    baseUrl = window.location.origin + window.location.pathname.replace("index.html", "") + "certificate.html";
  }

  try {
    const url = new URL(baseUrl, window.location.href);

    if (includeAllParams) {
      url.searchParams.set("name", state.fullName);
      url.searchParams.set("course", state.courseTitle);
      url.searchParams.set("roll", state.rollNo);
      url.searchParams.set("score", state.score);
      url.searchParams.set("assign", state.assignmentScore);
      url.searchParams.set("exam", state.examScore);
      url.searchParams.set("certId", state.certId);
      url.searchParams.set("session", state.sessionPeriod);
      url.searchParams.set("duration", state.sessionDuration);
      url.searchParams.set("credits", state.credits);
      url.searchParams.set("college", state.collegeName);
    }

    return url.toString();
  } catch (e) {
    return baseUrl;
  }
}

/**
 * Photo uploader handling
 */
function initPhotoUploader() {
  const fileInput = document.getElementById("photoFileInput");
  const thumb = document.getElementById("photoThumbnail");
  const resetBtn = document.getElementById("resetPhotoBtn");

  if (!fileInput) return;

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, or WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      state.photoData = dataUrl;
      if (thumb) thumb.src = dataUrl;
      const certPhoto = document.getElementById("certPhoto");
      if (certPhoto) certPhoto.src = dataUrl;
      saveStateToLocalStorage();
    };
    reader.readAsDataURL(file);
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.photoData = "";
      if (fileInput) fileInput.value = "";
      if (thumb) thumb.src = DEFAULT_AVATAR;
      const certPhoto = document.getElementById("certPhoto");
      if (certPhoto) certPhoto.src = DEFAULT_AVATAR;
      saveStateToLocalStorage();
    });
  }
}

/**
 * Auto-scale certificate to fit preview stage
 */
function autoScaleCertificate() {
  const stage = document.querySelector(".preview-stage");
  const wrapper = document.getElementById("certScaleWrapper");
  if (!stage || !wrapper) return;

  const stageWidth = stage.clientWidth - 48; // padding
  const baseWidth = 1050; // CSS cert-width

  let scale = Math.min(1.0, stageWidth / baseWidth);
  if (scale < 0.45) scale = 0.45;

  setScale(scale);
}

function setScale(scale) {
  currentScale = scale;
  const wrapper = document.getElementById("certScaleWrapper");
  const zoomDisplay = document.getElementById("zoomLevelDisplay");
  if (wrapper) {
    wrapper.style.transform = `scale(${scale})`;
  }
  if (zoomDisplay) {
    zoomDisplay.textContent = `${Math.round(scale * 100)}%`;
  }
}

/**
 * Zoom Buttons (+, -, Reset, Fit)
 */
function initZoomControls() {
  const zoomIn = document.getElementById("zoomInBtn");
  const zoomOut = document.getElementById("zoomOutBtn");
  const zoomReset = document.getElementById("zoomResetBtn");
  const zoomFit = document.getElementById("zoomFitBtn");

  if (zoomIn) {
    zoomIn.addEventListener("click", () => {
      setScale(Math.min(1.4, currentScale + 0.1));
    });
  }
  if (zoomOut) {
    zoomOut.addEventListener("click", () => {
      setScale(Math.max(0.4, currentScale - 0.1));
    });
  }
  if (zoomReset) {
    zoomReset.addEventListener("click", () => {
      setScale(1.0);
    });
  }
  if (zoomFit) {
    zoomFit.addEventListener("click", autoScaleCertificate);
  }
}

/**
 * Accordion Collapsible Sections
 */
function initAccordions() {
  const titles = document.querySelectorAll(".accordion-title");
  titles.forEach(title => {
    title.addEventListener("click", () => {
      const group = title.closest(".accordion-group");
      if (group) {
        group.classList.toggle("collapsed");
      }
    });
  });
}

/**
 * Action Buttons (Print, Download PDF, Share Link, Presets, Reset)
 */
function initActionButtons() {
  // 1. Print Button
  const printBtn = document.getElementById("printCertBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // 2. Download PDF Button
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", exportPDF);
  }

  // 3. Open Verification Page Button
  const openVerifyBtn = document.getElementById("openVerifyPageBtn");
  if (openVerifyBtn) {
    openVerifyBtn.addEventListener("click", () => {
      const url = getVerificationUrl(true);
      window.open(url, "_blank");
    });
  }

  // 4. Copy Share Link
  const copyLinkBtn = document.getElementById("copyLinkBtn");
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", () => {
      const url = getVerificationUrl(true);
      navigator.clipboard.writeText(url).then(() => {
        showToast("Public verification URL copied to clipboard!");
      }).catch(() => {
        prompt("Copy this public certificate URL:", url);
      });
    });
  }

  // 5. Presets Switcher
  const presetSelector = document.getElementById("presetSelector");
  if (presetSelector) {
    presetSelector.addEventListener("change", (e) => {
      const selected = e.target.value;
      if (presets[selected]) {
        state = { ...state, ...presets[selected] };
        populateFormFields();
        renderCertificate();
        saveStateToLocalStorage();
        showToast(`Loaded preset: ${presets[selected].courseTitle}`);
      }
    });
  }

  // 6. Reset Defaults
  const resetBtn = document.getElementById("resetDefaultsBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset all certificate details to initial placeholders?")) {
        state = { ...defaultState };
        localStorage.removeItem("cert_studio_state");
        populateFormFields();
        renderCertificate();
        showToast("Reset to default placeholders.");
      }
    });
  }

  // 7. QR modal trigger
  const qrBox = document.getElementById("certQrCode");
  if (qrBox) {
    qrBox.addEventListener("click", () => {
      const modal = document.getElementById("qrModal");
      if (modal) {
        modal.classList.add("active");
        const urlDisplay = document.getElementById("modalUrlDisplay");
        if (urlDisplay) {
          urlDisplay.textContent = getVerificationUrl(true);
        }
      }
    });
  }

  const modalClose = document.getElementById("modalCloseBtn");
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      const modal = document.getElementById("qrModal");
      if (modal) modal.classList.remove("active");
    });
  }
}

/**
 * Export high quality Landscape A4 PDF using html2pdf
 */
function exportPDF() {
  const certElement = document.getElementById("certificateCard");
  const downloadBtn = document.getElementById("downloadPdfBtn");
  if (!certElement) return;

  const originalText = downloadBtn ? downloadBtn.innerHTML : "";
  if (downloadBtn) {
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = "<span>Generating PDF...</span>";
  }

  // Clean filename from recipient name
  const safeName = (state.fullName || "Certificate").trim().replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `${safeName}_Certificate.pdf`;

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2, // 2x high DPI rendering
      useCORS: true,
      logging: false,
      scrollY: 0,
      scrollX: 0
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "landscape"
    }
  };

  html2pdf().set(opt).from(certElement).save().then(() => {
    if (downloadBtn) {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = originalText;
    }
    showToast("PDF downloaded successfully!");
  }).catch((err) => {
    console.error("PDF export failed:", err);
    if (downloadBtn) {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = originalText;
    }
    // Fallback to window.print()
    alert("PDF generator encountered an error. Opening print preview dialog instead...");
    window.print();
  });
}

/**
 * LocalStorage persistence
 */
function saveStateToLocalStorage() {
  try {
    // Avoid saving large photo base64 strings to localStorage if quota exceeded
    const toSave = { ...state };
    if (toSave.photoData && toSave.photoData.length > 500000) {
      // Photo is over ~500KB, omit from localStorage to avoid quota issues
      delete toSave.photoData;
    }
    localStorage.setItem("cert_studio_state", JSON.stringify(toSave));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
}

function loadSavedState() {
  try {
    const saved = localStorage.getItem("cert_studio_state");
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...defaultState, ...parsed };
    }
  } catch (e) {
    console.warn("Could not load from localStorage:", e);
  }
}

/**
 * Toast Notification Helper
 */
function showToast(msg) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.right = "24px";
    toast.style.background = "#1e293b";
    toast.style.color = "#ffffff";
    toast.style.padding = "10px 18px";
    toast.style.borderRadius = "6px";
    toast.style.fontSize = "13px";
    toast.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
    toast.style.zIndex = "9999";
    toast.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
  }, 3200);
}

/**
 * Debounce helper
 */
function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * --------------------------------------------------------------------------
 * Standalone Verification View Handler (certificate.html)
 * --------------------------------------------------------------------------
 */
function initStandaloneView() {
  const params = new URLSearchParams(window.location.search);

  // If query params exist, populate state from URL
  if (params.has("name")) state.fullName = params.get("name");
  if (params.has("course")) state.courseTitle = params.get("course");
  if (params.has("roll")) state.rollNo = params.get("roll");
  if (params.has("score")) state.score = params.get("score");
  if (params.has("assign")) state.assignmentScore = params.get("assign");
  if (params.has("exam")) state.examScore = params.get("exam");
  if (params.has("certId")) state.certId = params.get("certId");
  if (params.has("session")) state.sessionPeriod = params.get("session");
  if (params.has("duration")) state.sessionDuration = params.get("duration");
  if (params.has("credits")) state.credits = params.get("credits");
  if (params.has("college")) state.collegeName = params.get("college");

  // Otherwise, fallback to localStorage if available
  if (!params.has("name")) {
    loadSavedState();
  }

  // Render certificate details
  renderCertificate();

  // Populate metadata badges in standalone verification header
  setText("metaCertId", state.certId);
  setText("metaRollNo", state.rollNo);
  setText("metaFullName", state.fullName);
  setText("metaCourse", state.courseTitle);
  setText("metaScore", state.score);

  // Attach Standalone View action handlers
  const printBtn = document.getElementById("standalonePrintBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  const downloadBtn = document.getElementById("standaloneDownloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", exportPDF);
  }

  // Auto scale certificate to fit viewport
  const viewport = document.querySelector(".standalone-cert-viewport");
  if (viewport) {
    const scaleToFit = () => {
      const availWidth = viewport.clientWidth - 32;
      const baseWidth = 1050;
      let scale = Math.min(1.0, availWidth / baseWidth);
      if (scale < 0.35) scale = 0.35;
      const wrapper = document.getElementById("certScaleWrapper");
      if (wrapper) wrapper.style.transform = `scale(${scale})`;
    };
    scaleToFit();
    window.addEventListener("resize", debounce(scaleToFit, 150));
  }
}
