/**
 * Orion Browser Programmable Button: OpenCode Sidebar Helper
 *
 * A drop-in replacement for the Gemini-powered button, uses OpenCode Go API
 * instead of Google's paid Gemini endpoint. Zero-cost on Go subscription.
 *
 * INSTRUCTIONS:
 * 1. Right-click your Orion toolbar -> "Customize Toolbar".
 * 2. Drag a "Programmable Button" (puzzle piece) onto your toolbar.
 * 3. Click the button to configure:
 *    - Title: OpenCode Helper
 *    - Script Type: JavaScript
 *    - Show Output in Sidebar: TRUE (Check this box!)
 * 4. Paste this entire file's code into the button's script area.
 * 5. Replace 'YOUR_OPENCODE_KEY' with your OpenCode Go API key
 *    (from ~/.hermes/.env or your OpenCode account dashboard).
 * 6. (Optional) Change 'model' to your preferred model (see notes below).
 *
 * Recommended models for this button:
 *   - qwen3.5-plus  — best overall: fast, clean output, content in streaming
 *   - kimi-k2.6     — great for non-streaming fallback, very capable
 *   - minimax-m3    — good quality, may include <think> reasoning in output
 *
 * NOTE: Many OpenCode models (deepseek-v4-*, kimi-k2.6, glm-5.*) emit
 * reasoning_content in SSE before visible content. The button handles this
 * correctly — it only reads delta.content, so you see a brief pause during
 * reasoning, then the answer streams in. qwen3.5-plus is recommended for
 * the best interactive experience.
 */

// Clean text for plain-text sidebar (Orion on GFE treats sidebar as plain text, not HTML)
function cleanText(text) {
    if (!text) return '';

    let l = text;

    // Step 1: Strip any HTML tags outright
    l = l.replace(/<[^>]*>/g, '');

    // Step 2: Strip markdown heading markers
    l = l.replace(/^#+\s+/gm, '');

    // Step 3: Convert markdown links [text](url) → "text (url)"
    l = l.replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1 ($2)');

    // Step 4: Strip markdown list markers
    l = l.replace(/^\s*[-*+]\s+/gm, '');

    // Step 5: Strip bold/italic markers
    l = l.replace(/\*\*(.*?)\*\*/g, '$1');
    l = l.replace(/\*(.*?)\*/g, '$1');

    // Step 6: Strip inline code backticks
    l = l.replace(/`(.*?)`/g, '$1');

    return l;
}

(async () => {
    // 1. SET UP KEY AND MODEL
    const apiKey = 'YOUR_OPENCODE_KEY'; // Paste your OpenCode Go key here
    const model = 'qwen3.5-plus';       // Best balance of speed, quality, and streaming output
    const baseUrl = 'https://opencode.ai/zen/go/v1';

    // 2. SCRAPE WEB PAGE CONTENT
    const pageTitle = document.title;
    const pageParagraphs = Array.from(document.querySelectorAll('p, h1, h2, h3, li'))
        .map(el => el.innerText)
        .slice(0, 150) // Cap content length to stay light
        .join('\n');

    // 3. PROMPT USER FOR QUERY
    const userPrompt = prompt("What would you like AI to do with this page?\n(e.g., 'Summarize key takeaways', 'Translate to Spanish', 'Explain like I'\''m 5')");
    if (!userPrompt) return; // User cancelled

    // Open sidebar instantly with loading state (plain text — NO HTML!)
    OrionInternals.setSidebarContent("⚡ OpenCode is analyzing: " + pageTitle);

    // 4. CONSTRUCT BODY — exact same OpenAI format as the Gemini version
    const requestBody = {
        'model': model,
        'messages': [
            { 'role': 'system', 'content': 'You are a helpful in-browser assistant. Answer the user\'s request concisely using the webpage content provided. Do not include <think> tags or internal reasoning in your final answer.' },
            { 'role': 'user', 'content': `WEBPAGE TITLE: ${pageTitle}\n\nWEBPAGE CONTENT:\n${pageParagraphs}\n\nUSER REQUEST: ${userPrompt}` }
        ],
        'max_tokens': 1000,
        'temperature': 0.2,
        'stream': true
    };

    // 5. FETCH FROM OPENCODE GO ENDPOINT (OpenAI-compatible)
    const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    });

    if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let summary = '';
        let reasoningSeen = false;

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            // Split and clean standard SSE stream chunks
            const chunks = decoder.decode(value).split('\n').filter(line => line.trim() !== '');
            for (const chunk of chunks) {
                const message = chunk.replace(/^data: /, '').trim();
                if (message === '[DONE]') break;

                try {
                    const parsed = JSON.parse(message);
                    const content = parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content;
                    if (content) {
                        summary += content;

                        // Clean text for plain-text sidebar (NO HTML!)
                        const cleaned = cleanText(summary);

                        // Content block: plain text only
                        if (!reasoningSeen) {
                            OrionInternals.setSidebarContent(
                                "--- User Request ---\n" + userPrompt + "\n\n--- OpenCode Helper ---\n" + cleaned
                            );
                            reasoningSeen = true;
                        } else {
                            OrionInternals.setSidebarContent(
                                "--- User Request ---\n" + userPrompt + "\n\n--- OpenCode Helper ---\n" + cleaned
                            );
                        }
                    }
                } catch (error) {
                    // Ignore JSON parsing errors for trailing/incomplete chunks
                }
            }
        }
    } else {
        const errorText = await response.text();
        console.error('API request failed:', errorText);
        OrionInternals.setSidebarContent("⚠️ Connection Error:\n" + errorText + "\n\nCheck: Is your API key correct? Is the OpenCode Go endpoint reachable?");
    }
})();
