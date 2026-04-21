# Design Specification: Premium Fitness Dark Mode

This document outlines the design system used for the **Fitness Pro** web application. It is designed to be mobile-first, high-performance, and visually premium.

## 🎨 Color Palette (Curated Dark Mode)

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `bg-black` | `#000000` | Main application background |
| `bg-dark` | `#1C1C1E` | Primary cards and sections |
| `bg-card` | `#2C2C2E` | Secondary/Nested elements and toggles |
| `accent-green` | `#30D158` | Primary CTA, Success states, Completion |
| `accent-orange`| `#FF9F0A` | Streaks, High-burn indicators |
| `accent-blue` | `#0A84FF` | Informational elements |
| `accent-red` | `#FF453A` | Destructive actions, target date alerts |
| `text-main` | `#FFFFFF` | Primary headings and text |
| `text-secondary`| `#8E8E93` | Metadata, labels, and placeholders |

## 🔠 Typography

*   **Font Family**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
*   **Scale**:
    *   **H1**: `32px`, weight `800`, letter-spacing `-0.5px`.
    *   **H2**: `24px`, weight `700`.
    *   **Subtitle**: `14px`, weight `600`, uppercase, letter-spacing `1px`.
    *   **Body**: `17px` (Regular), `14px` (Small).

## 🧩 Components

### 1. The "Premium" Card
*   **Background**: `var(--bg-dark)`
*   **Border Radius**: `20px`
*   **Shadow**: `0 8px 32px rgba(0, 0, 0, 0.3)`
*   **Transition**: `transform 0.2s ease` (Scales to `0.98` on click).

### 2. Glass Navigation (Bottom Nav)
*   **Position**: Fixed to bottom.
*   **Background**: `rgba(28, 28, 30, 0.8)`
*   **Blur**: `backdrop-filter: blur(20px)`
*   **Border Top**: `1px solid rgba(255, 255, 255, 0.1)`

### 3. Progressive Buttons
*   **Primary**: `var(--accent-green)` background, Black text. `16px` padding, `16px` radius.
*   **Shadow**: `0 4px 15px rgba(48, 209, 88, 0.3)`.
*   **Secondary**: `var(--bg-card)` background, White text, subtler border.

### 4. Intensity Toggle
*   A rounded container (`12px`) with `var(--bg-card)`.
*   Internal buttons occupy equal space with a "pill" background indicating the active state.

## 🎬 Interactions & Motion

*   **Entrance**: All main sections use `@keyframes fadeIn` which combines `opacity: 0` to `1` with a slight `10px` upward translation.
*   **Duration**: `0.4s`
*   **Easing**: `ease-out` or `cubic-bezier(0.175, 0.885, 0.32, 1.275)` for progress bars.

## 📐 Layout Principles
*   **Max Width**: `500px` (Optimized for mobile-center viewing).
*   **Padding**: Standardized gutter of `20px` across the app.
*   **Spacing**: Vertical rhythm maintained by `20px` margins between cards.
