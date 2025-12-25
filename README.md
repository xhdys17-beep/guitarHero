
# 🎸 GuitarMaster Toolkit (摇滚英雄吉他工具站)

一个专为吉他手设计的全功能 Web 应用。它结合了现代化的 UI 设计与强大的乐理引擎，支持动态音阶展示、和弦库查询、自定义调弦以及实时节拍器。

---

## 🌟 核心功能

1.  **交互式指板 (Interactive Fretboard)**
    *   动态展示 15 品格音阶图。
    *   支持音名 (Notes) 与 唱名 (Solfège/Degrees) 切换。
    *   自动高亮根音。
2.  **万能和弦库 (Ultimate Chord Library)**
    *   基于 CAGED 系统生成的多种按法。
    *   支持 17 种和弦性质（大、小、属七、大七、挂留、增减等）。
    *   清晰的弦序标识 (6-1弦) 与品格指示。
3.  **全平台自定义调弦 (Custom Tuning)**
    *   内置标准 (Standard)、Drop D、DADGAD 等常用预设。
    *   **独家功能**：支持 6 根弦独立自定义音高，并实时更新全站指板逻辑。
4.  **音阶探索 (Scale Explorer)**
    *   内置大调、小调、五声音阶及全部调式 (Modes)。
    *   支持 12 个半音调性切换。
5.  **辅助工具**
    *   **内置节拍器**：支持 40-280 BPM，具备强弱拍视觉反馈。
    *   **多语言支持**：支持 中文 (ZH)、英文 (EN)、日语 (JA)。
    *   **响应式布局**：完美适配手机、平板与桌面端。

---

## 🛠 技术栈

*   **框架**: [React 19](https://react.dev/)
*   **样式**: [Tailwind CSS](https://tailwindcss.com/)
*   **图标**: [Lucide React](https://lucide.dev/)
*   **加载方案**: 原生 ES Modules + [ESM.sh](https://esm.sh/) (无需复杂打包，即开即用)
*   **设计风格**: 现代极简、高对比度、强调交互反馈。

---

## 🚀 快速启动与部署

项目采用 **Modern Vanilla React** 架构，利用浏览器的 `importmap` 功能，无需繁琐的 Webpack 或 Vite 预编译即可在现代浏览器中运行。

### 1. 本地运行 (无需编译)

由于项目依赖于 ES Modules，你只需要一个简单的静态服务器：

**方法 A：使用 Python (推荐)**
在根目录下运行：
```bash
python -m http.server 8000
```
访问 `http://localhost:8000`

**方法 B：使用 Node.js (npx)**
```bash
npx serve .
```
访问 `http://localhost:3000`

### 2. 本地开发 (Vite 环境)

如果你希望在更复杂的工程中使用此代码，建议使用 Vite。

1.  **初始化**: `npm create vite@latest` (选择 React + TypeScript)
2.  **安装依赖**:
    ```bash
    npm install lucide-react
    ```
3.  **安装 Tailwind**: 按照 [Tailwind 官方文档](https://tailwindcss.com/docs/guides/vite) 配置 `tailwind.config.js`。
4.  **复制文件**: 将 `App.tsx`, `types.ts`, `constants.ts`, `services/`, `components/` 移动至 `src/` 目录。
5.  **运行**: `npm run dev`

### 3. 部署到线上

**部署至 Vercel / Netlify:**
1.  将代码推送到 GitHub。
2.  在 Vercel 中选择该项目。
3.  **由于本项目是纯静态的**，Build Command 留空，Publish Directory 设置为当前目录 `.` 即可。

---

## 🎼 乐理引擎说明 (`services/guitarEngine.ts`)

项目核心逻辑位于 `services/` 目录下：
*   **位移算法**: 基于半音阶索引实现，支持所有调性的无缝转调。
*   **和弦推导**: 采用 `transposeSteps` 算法，将基础和弦指型 (E/A/D/C Shape) 根据目标根音自动推算全指板按法。
*   **品格自适应**: 自动计算和弦图的起始品位 (Base Fret)，确保高把位和弦展示准确。

---

## 🎨 UI 设计规范

*   **品牌色**: `Slate-900` (专业感), `Orange-500` (点睛/活力)。
*   **字体**: 系统预设 `Inter`。
*   **交互**: 所有的按钮均具备 `active:scale-95` 点击缩放反馈，下拉框具备平滑淡入动画。

---

## ⚖️ 开源协议

MIT License. 欢迎用于教学、练习或二次开发。
