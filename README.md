# COSMIX — AI Virtual Makeup Studio

> **High-Precision Real-Time Lipstick Shade Simulation with WebGL 2, MediaPipe Face Mesh & CIELAB Perceptual Color Physics.**

Developed by **[Praveen Pandey](https://www.linkedin.com/in/praveen-pandey-6b781b32b)** • [GitHub Profile](https://github.com/PRAVEENPANDEY7)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![WebGL 2.0](https://img.shields.io/badge/WebGL-2.0-990000?style=flat&logo=webgl)](https://www.khronos.org/webgl/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-FaceMesh%20478-0097A7?style=flat&logo=google)](https://developers.google.com/mediapipe)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Overview

**COSMIX** is a production-grade, zero-upload virtual makeup try-on platform that allows users to instantly visualize bespoke lipstick shades with realistic physics directly in their browser. 

Using **Google MediaPipe Face Mesh (478 3D landmarks)** and custom **WebGL2 GLSL fragment shaders**, COSMIX preserves authentic lip skin textures, fine wrinkles, and micro-highlights while delivering true-to-life pigment coverage across diverse skin tones.

---

## ✨ Key Features

### 1. 🎯 Precision Computer Vision & Face Mesh Geometry
- **478 3D Facial Landmarks**: Sub-millimeter tracking running client-side at 30–60 FPS.
- **Anatomical Lip Extraction**: Separate tracking of outer contours (`61→0→291→17→61`) and inner vermilion boundaries (`78→13→308→14→78`).
- **Oral Cavity & Teeth Punch-Out**: Real-time mouth-opening detection metric that punches out teeth and inner mouth cavity to prevent unnatural lipstick bleeding onto teeth.
- **Exponential Moving Average (EMA) Smoothing**: Eliminates landmark jitter during real-time video stream movements.

### 2. 🧪 Realistic Texture Physics & WebGL 2 Blending
- **Hardware-Accelerated WebGL 2**: Custom GLSL fragment shader (`lipstick.frag` & `lipstick.vert`) for instant real-time shading.
- **Luminance-Preserving Perceptual Math**: Retains individual lip creases, reflections, and natural specular skin highlights.
- **Three Realistic Finishes**:
  - **Matte**: Velvety, soft-focus finish with compressed specular peaks.
  - **Satin**: Balanced, luminous radiance with subtle sheen.
  - **Gloss**: High-shine mirror finish with synthetic Fresnel highlights.
- **2D Canvas Fallback**: CPU fallback utilizing CIELAB D65 color space conversions for universal browser compatibility.

### 3. 🎨 35 Curated Luxury Lipstick Shades
- **Categorized Swatches**: Nudes, Pinks, Reds, Browns, and Berries.
- **Search & Filter**: Real-time search filter and finish selector.
- **Save to Favourites**: Save and manage favourite shades with persistent browser storage.

### 4. 👩🏽 Diverse Studio Models & Live Mirror
- **4 High-Resolution Studio Models**:
  - **Tara** (*Dusky Warm*)
  - **Meera** (*Warm Golden*)
  - **Zoya** (*Neutral Olive*)
  - **Amara** (*Rich Deep*)
- **Dual Try-On Modes**:
  - **Live Camera**: Instant real-time virtual mirror using device webcam.
  - **Upload Portrait / Studio Models**: Upload any high-res portrait or choose from diverse studio presets.

### 5. 🔒 100% On-Device Privacy Architecture
- **Zero Server Uploads**: 100% of neural inference and shader rendering runs on your device using client-side WebAssembly and WebGL2.
- **Complete Privacy**: No camera feeds, photos, or facial biometric data ever leave your browser.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Frontend UI** | React 19, Tailwind CSS |
| **Language** | TypeScript |
| **State Management** | Zustand (Persistent Studio & Favourites stores) |
| **Computer Vision** | Google `@mediapipe/tasks-vision` (WASM + `face_landmarker.task`) |
| **Graphics Engine** | WebGL 2.0 (Custom GLSL Shaders), HTML5 Canvas 2D |
| **Icons & UI** | Lucide React |
| **Testing** | Node.js Native Test Runner (`node --test`) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ or 20+ (tested on Node v20/v22/v25)
- npm, pnpm, or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/PRAVEENPANDEY7/COSMIX-AI-Virtual-Makeup-Studio.git
cd COSMIX-AI-Virtual-Makeup-Studio
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience COSMIX.

### 5. Run Unit Tests

```bash
npm test
```

### 6. Build for Production

```bash
npm run build
npm run start
```

---

## 📐 Project Directory Structure

```
├── public/
│   ├── assets/cosmix/          # Brand logos, swatches, image sequence & studio models
│   ├── models/                 # MediaPipe face_landmarker.task (3.75 MB)
│   └── wasm/                   # MediaPipe WebAssembly runtimes
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing Page & Luxury Editorial Presentation
│   │   ├── try-on/             # Virtual Try-On Studio (Upload & Live Webcam)
│   │   ├── shades/             # 35 Bespoke Shades Collection with Search & Filters
│   │   └── favourites/         # Saved Shades & Personalized Looks
│   ├── components/
│   │   ├── hero/               # Scrollytelling hero sequence & luxury text
│   │   ├── layout/             # Header with navigation & Brand Footer
│   │   ├── sections/           # Brand story & shade discovery
│   │   └── studio/             # ImageCanvas, CameraPreview, MakeupControls, PhotoUploader
│   ├── hooks/                  # useFaceLandmarks, useMakeupRenderer, useCameraTryOn
│   ├── lib/
│   │   ├── camera/             # Camera stream management & cleanup
│   │   ├── makeup/             # LipRenderer, WebGL ShaderManager, CIELAB ColorUtils
│   │   └── vision/             # MediaPipe FaceLandmarker singleton & contour extraction
│   └── stores/                 # Zustand Studio & Favourites stores
├── tests/                      # Unit tests for Color Science & Geometry
├── .env.example                # Sample environment variables
├── .gitignore                  # Git ignore rules
└── package.json
```

---

## 👨‍💻 Author

**Praveen Pandey**
- **LinkedIn**: [linkedin.com/in/praveen-pandey-6b781b32b](https://www.linkedin.com/in/praveen-pandey-6b781b32b)
- **GitHub**: [@PRAVEENPANDEY7](https://github.com/PRAVEENPANDEY7)
- **Email**: pravinpandey2006@gmail.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
