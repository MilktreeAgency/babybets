<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BabyBets - Premium Family Prize Competition Platform

A modern, family-friendly competition platform built with React, TypeScript, and Tailwind CSS. Features instant-win games, scratch cards, and premium prizes for families.

View your app in AI Studio: https://ai.studio/apps/drive/1fHuvk43h4XVc3Po35OFJkSk8a18kCQO1

---

## 🚀 Run Locally

**Prerequisites:** Node.js (v18+)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Create `.env.local` and add your `GEMINI_API_KEY`
   - (Optional for production features)

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:5173`

---

## 🎨 Nanobanana Pro MCP Setup (Image Generation)

This project uses **Nanobanana Pro MCP** for generating on-brand competition images through Cursor AI.

### ✅ Already Configured

The MCP is already set up in your Cursor settings with:
- **Server**: `@nanobanana/mcp-server-pro`
- **API Key**: Your Gemini API key
- **Location**: `/Users/levi/Library/Application Support/Cursor/User/settings.json`

### 🎯 How to Use

1. **Restart Cursor** (if you just set this up)
2. **Open Cursor AI chat** in your BabyBets project
3. **Request images** using the templates in [`IMAGE_GENERATION_GUIDE.md`](./IMAGE_GENERATION_GUIDE.md)

**Example request:**
```
Generate a competition image for BabyBets:
Prize: Bugaboo Fox 5 Stroller Bundle
Category: Nursery
Description: Premium luxury stroller in a beautiful modern nursery with natural light
```

### 📚 Documentation

- **[`.cursorrules`](./.cursorrules)** - Complete brand guidelines for AI image generation
- **[`IMAGE_GENERATION_GUIDE.md`](./IMAGE_GENERATION_GUIDE.md)** - Quick reference and templates

### 🎨 Brand Colors
- **Primary Teal**: `#496B71`
- **Secondary Peach**: `#FED0B9`
- **Background Cream**: `#FBEFDF`

---

## 📦 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Zustand** - State management
- **Framer Motion** - Animations
- **Lucide React** - Icon library

---

## 🏗️ Project Structure

```
babybets/
├── components/
│   ├── layout/          # Navbar, Footer
│   └── ui/              # Reusable UI components
├── pages/               # Route pages
├── public/              # Static assets
├── mockData.ts          # Competition and winner data
├── types.ts             # TypeScript interfaces
├── store.ts             # Zustand store (cart, basket, state)
├── .cursorrules         # AI brand guidelines
└── IMAGE_GENERATION_GUIDE.md
```

---

## 🎯 Key Features

- ✨ **Instant Win** competitions with animated reveals
- 🎰 **Spin the Wheel** gamification modal
- 🎫 **Scratch Card** interface for ticket reveals
- 🛒 **Shopping cart** with bundle pricing
- 📊 **Progress tracking** for ticket sales
- 🏆 **Winners gallery** with social proof
- 📱 **Fully responsive** mobile-first design
- 🎨 **On-brand imagery** via Nanobanana MCP

---

## 📝 Competition Categories

1. **Cash** - Tax-free cash prizes
2. **Nursery** - Baby furniture, strollers, essentials
3. **Toys** - LEGO, tech, ride-ons, educational toys
4. **Holidays** - Disney, Lapland, luxury family trips
5. **Essentials** - Nappies, vouchers, meal kits

---

## 🎨 Design System

The site uses a warm, family-friendly design system:
- **Rounded corners** (2xl radius)
- **Soft shadows** and subtle hover effects
- **Pastel color palette** (teal, peach, cream)
- **Modern sans-serif** typography (DM Sans)
- **Trust-building** elements (reviews, winner proof)

---

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🚀 Deployment

Built with Vite for easy deployment to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

---

## 📄 License

This project is part of AI Studio.

---

## 🤝 Contributing

When adding new competitions or features:
1. Follow the brand guidelines in `.cursorrules`
2. Use the established color palette
3. Generate images via Nanobanana MCP for consistency
4. Update `mockData.ts` with new competition data
5. Test on mobile devices

---

**Built with ❤️ for families**
