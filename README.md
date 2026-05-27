# Orion Programmable Buttons — Gemini Sidebar Helper 🚀

An open-source showcase of custom WebKit workflows and enhancements for the [Orion Browser](https://browser.kagi.com/) by Kagi. 

The premier feature is the **Gemini Sidebar Helper**—a context-aware browser assistant that reads the page you are on and streams premium AI responses directly into Orion's native sidebar.

---

## ⚡ The Gemini Sidebar Helper

https://github.com/fpigeonjr/orion-programmable-buttons/assets/demo.mp4

### Why it's a game-changer:
1. **Context-Aware:** It automatically scrapes the active page title, headers, and body paragraphs.
2. **True Streaming (SSE):** It uses Google's OpenAI-compatible endpoint to stream responses line-by-line into the native sidebar. No waiting around for a block response!
3. **Zero Extra Cost:** If you have a **Google One AI Premium** subscription, your API calls are covered under your flat-rate consumer tier (no commercial GCP billing required).

---

## 🛠️ Installation Guide

Setting this up in your Orion browser takes under 3 minutes:

1. **Get an API Key:**
   * Grab a key from [Google AI Studio](https://aistudio.google.com/) (takes 30 seconds).

2. **Configure the Toolbar:**
   * **Right-click** anywhere on your Orion browser toolbar and select **Customize Toolbar**.
   * Drag the **Programmable Button** (puzzle piece icon) onto your toolbar.

3. **Set Up the Button:**
   * Click your new toolbar button to configure it:
     * **Title:** `Gemini Helper`
     * **Script Type:** `JavaScript`
     * **Show Output in Sidebar:** **TRUE** (Check this box! This is the magic that opens the sidebar).
     * **Icon:** Select a slick symbol (e.g., `sparkles`, `brain`, or `eyes`).

4. **Add the Code:**
   * Copy the entire code from [src/gemini-sidebar.js](./src/gemini-sidebar.js) and paste it into the script area.
   * Replace `'YOUR_GEMINI_API_KEY'` at the top of the script with your Google API Key.
   * Click **Save** and enjoy!

---

## 📂 Project Structure

```text
├── src/
│   └── gemini-sidebar.js  # Clean, commented streaming script for Orion
├── docs/
│   └── notes.md           # Research and roadmap notes
└── package.json           # Project metadata
```

---

## 🤝 Contributing

Contributions, feedback, and new button ideas are highly welcome! Feel free to open an Issue or submit a Pull Request.

---

## 📄 License

MIT © [Frank Pigeon](https://github.com/fpigeonjr)
