# Certificate Studio: Landscape A4 Personal & Portfolio Certificate

A clean, responsive, and customizable certificate website designed to replicate the general layout, structure, and professional aesthetic of academic online certificates (such as NPTEL course certificates) while serving as an **unofficial personal demo / portfolio showcase**.

> **Disclaimer:** This project is strictly for personal portfolios, student resumes, and demonstrative showcases. It contains **no official logos, seals, signatures, or trademarks** of NPTEL, SWAYAM, IITs, or Government ministries. It clearly identifies itself as an unofficial personal certificate.

---

## 🌟 Key Features

1. **Landscape A4 Precision Layout**
   - Exact 1.414 aspect ratio (297mm × 210mm) matching standard A4 certificates.
   - Two-tone institutional footer bands (pale tan institution band + deep crimson maroon bottom band).
   - Clean academic typography with serif headings, italic script connective phrases, and bold tabular score breakdowns.
   - Right-side portrait photo container with upload support.

2. **Live Interactive Customizer (`index.html`)**
   - Real-time updates for:
     - Candidate Full Name
     - Roll Number / Personal ID
     - Certificate ID
     - Profile Photograph (instant file upload or default avatar)
     - Course Title
     - College / Institution Name
     - Consolidated Score, Assignments Score, and Proctored Exam Score
     - Total Certified Candidates Count
     - Academic Term / Session and Duration
     - Signatory Names, Roles, and Departments
     - Public Deployed URL
   - 1-click Preset Loaders (C Programming, Python & Machine Learning, Cloud Architecture).

3. **High-Contrast Smartphone-Verifiable QR Code**
   - Generates real QR codes at 300 DPI readiness using bundled `qrcode.min.js`.
   - Encodes your public HTTPS URL directly.
   - When scanned using any smartphone camera, it immediately opens the verified certificate page.

4. **Standalone Verification Webpage (`certificate.html`)**
   - The public landing page that opens when someone scans your QR code.
   - Parses URL parameters (`?name=...&course=...&roll=...&score=...`) dynamically.
   - Displays a green "Verified Personal Certificate Record" header with verification status.
   - Fully responsive for mobile phone viewports with 1-click print and PDF download buttons.

5. **A4 Landscape Print & PDF Export**
   - Print-ready stylesheet (`@page { size: 297mm 210mm landscape; margin: 0; }`).
   - One-click high-resolution PDF download powered by bundled `html2pdf.bundle.min.js`.

---

## 📁 Project Structure

```text
nptel/
├── index.html               # Main certificate customizer & live studio
├── certificate.html         # Standalone public verification page (QR destination)
├── style.css                # Styles for UI, landscape A4 layout & print CSS
├── script.js                # Live data binding, QR code generator & PDF exporter
├── qrcode.min.js            # Self-contained QR code generation library
├── html2pdf.bundle.min.js   # Client-side Landscape A4 PDF export library
└── README.md                # Deployment and user guide
```

---

## 🚀 How to Run Locally

You can open the project directly in your browser:

1. Double-click `index.html` to open it in Chrome, Safari, Edge, or Firefox.
2. Alternatively, start a lightweight local web server in your terminal:
   ```bash
   python3 -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

---

## 🌐 Deployment Guide: Publishing on GitHub Pages

To make the QR code work from anywhere in the world and open your real certificate when scanned by a phone camera, host the project for free on **GitHub Pages**:

### Step 1: Initialize Git and Commit
Open your terminal in this workspace (`/Users/aniketpandey/nptel`):
```bash
git init
git add .
git commit -m "Initial commit of Certificate Studio"
```

### Step 2: Create a GitHub Repository
1. Go to [github.com](https://github.com) and log in.
2. Click **New Repository** (or visit `https://github.com/new`).
3. Name your repository (e.g., `nptel` or `personal-certificate`).
4. Set visibility to **Public**.
5. Do not initialize with a README (you already have one).
6. Click **Create repository**.

### Step 3: Push Files to GitHub
Run the following commands in your terminal (replace `<your-username>` with your GitHub username):
```bash
git remote add origin https://github.com/<your-username>/nptel.git
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. On GitHub, navigate to your repository's **Settings** tab.
2. In the left sidebar, click **Pages** (under "Code and automation").
3. Under **Branch**, select `main` and set the folder to `/ (root)`.
4. Click **Save**.
5. Wait 1 to 2 minutes. GitHub will display a notification:
   > *Your site is live at `https://<your-username>.github.io/nptel/`*

Your standalone certificate verification page URL is:
```text
https://aniketpandey9570.github.io/nptel/certificate.html
```

---

## 📱 Generating Your Final QR Code & Testing

Once your site is live on GitHub Pages:

1. Open `https://<your-username>.github.io/nptel/` in your browser.
2. In the left sidebar, scroll down to **Section 6: QR Code & Public Hosted Link**.
3. In the **Deployed HTTPS URL** field, enter your public verification link:
   ```text
   https://aniketpandey9570.github.io/nptel/certificate.html
   ```
4. The QR code on the certificate will immediately regenerate to encode your live link.
5. Click **Download PDF** or **Print Landscape A4** to save your certificate.

### Testing on Your Phone
1. Open the camera app on your iPhone or Android smartphone.
2. Point the camera at the QR code displayed on your screen or printed on paper.
3. Tap the yellow/white notification pill that appears on your phone screen.
4. Your browser will immediately open `certificate.html` showing the verified personal certificate record!

---

## 🖨️ Printing Instructions (Landscape A4)

When printing directly from the browser dialog (`Ctrl + P` or `Cmd + P`):
- **Destination:** Save as PDF or Select your color printer
- **Layout:** Landscape
- **Paper Size:** A4
- **Margins:** None (or Default)
- **Options / More Settings:**
  - Check **Background graphics** (crucial for the tan and maroon color bands)
  - Uncheck **Headers and footers** (removes browser URL and page numbers)

