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

### Option A: Gemini (requires Google AI Premium)

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

### Option B: OpenCode Go (zero-cost with Go subscription)

**Why:** If you're done with Google's pricing or want a free alternative, the OpenCode Go API is a drop-in replacement using the same OpenAI-compatible format.

1. **Get an API Key:**
   * Your OpenCode Go API key is in `~/.hermes/.env` as `OPENCODE_GO_API_KEY`.
   * Or grab one from the [OpenCode dashboard](https://opencode.ai/).

2. **Configure the Toolbar:**
   * **Right-click** anywhere on your Orion browser toolbar and select **Customize Toolbar**.
   * Drag the **Programmable Button** (puzzle piece icon) onto your toolbar.

3. **Set Up the Button:**
   * Click your new toolbar button to configure it:
   * **Title:** `OpenCode Helper`
   * **Script Type:** `JavaScript`
   * **Show Output in Sidebar:** **TRUE** (Check this box! This is the magic that opens the sidebar).
   * **Icon:** Select a slick symbol (e.g., `sparkles`, `brain`, `eyes`, or `doc.text.magnifyingglass`).

4. **Add the Code:**
   * Copy the entire code from [src/opencode-sidebar.js](./src/opencode-sidebar.js) and paste it into the script area.
   * Replace `'YOUR_OPENCODE_KEY'` at the top of the script with your actual OpenCode Go API key.
   * Optionally change the `model` variable — recommended: `qwen3.5-plus`, `kimi-k2.6`, or `minimax-m3`.
   * Click **Save** and enjoy!

**Or import the pre-packaged .plist:** Download [`OpenCode Companion.plist`](./OpenCode%20Companion.plist) and double-click to install — all settings pre-configured. You'll still need to replace the API key after importing.

**What changed from Gemini:**
- **Endpoint:** `https://opencode.ai/zen/go/v1/chat/completions` (instead of Google's)
- **API key format:** Same `Bearer` token auth — just paste a different key
- **Models:** Access to 18+ models on a zero-cost Go subscription plan
- **SSE streaming:** Fully compatible — same `data:` chunk / `[DONE]` protocol

#### Model recommendations for buttons

| Model | Streaming Content | Notes |
|-------|-------------------|-------|
| `qwen3.5-plus` | ✅ After reasoning phase | Best balance — clean output, fast |
| `kimi-k2.6` | ⚠️ Via content field | Reasoning_content first, then content |
| `minimax-m3` | ✅ Direct content | May include `<think>` reasoning in answer |
| `deepseek-v4-flash` | ❌ Reasoning only | Verbose reasoning eats token budget |

---

## 📂 Project Structure

```text
├── src/
│   ├── gemini-sidebar.js     # Original Gemini-powered streaming script
│   └── opencode-sidebar.js    # New OpenCode Go-powered alternative
├── Gemini Companion.plist     # Pre-packaged Gemini button for import
├── OpenCode Companion.plist   # Pre-packaged OpenCode button for import
├── docs/
│   └── notes.md               # Research and roadmap notes
└── package.json               # Project metadata
```

---

## 🤝 Contributing

Contributions, feedback, and new button ideas are highly welcome! Feel free to open an Issue or submit a Pull Request.

---

## 📄 License

MIT © [Frank Pigeon](https://github.com/fpigeonjr)
