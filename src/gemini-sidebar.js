/**
 * Orion Browser Programmable Button: Gemini Helper
 * 
 * INSTRUCTIONS:
 * 1. Right-click your Orion toolbar -> "Customize Toolbar".
 * 2. Drag a "Programmable Button" (puzzle piece/icon) onto your toolbar.
 * 3. Click the button to configure:
 *    - Title: Gemini Helper
 *    - Script Type: JavaScript
 *    - Show Output in Sidebar: TRUE (Check this box!)
 * 4. Paste this entire file's code into the button's script area.
 * 5. Replace 'YOUR_GEMINI_API_KEY' with your Google AI Studio key.
 */

(async () => {
    // 1. SET UP KEY AND COMPATIBLE MODEL
    const apiKey = 'YOUR_GEMINI_API_KEY'; // Paste your key here
    const model = 'gemini-3.1-flash-lite'; // Google's premier, fast, and covered model
    
    // 2. SCRAPE WEB PAGE CONTENT
    const pageTitle = document.title;
    const pageParagraphs = Array.from(document.querySelectorAll('p, h1, h2, h3, li'))
        .map(el => el.innerText)
        .slice(0, 150) // Cap content length to stay light
        .join('\n');
        
    // 3. PROMPT USER FOR QUERY
    const userPrompt = prompt("What would you like Gemini to do with this page?\n(e.g., 'Summarize key takeaways', 'Translate to Spanish', 'Explain like I'm 5')");
    if (!userPrompt) return; // User cancelled

    // Open sidebar instantly with loading state
    OrionInternals.setSidebarContent(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 15px; color: #1c1c1e;">
            <h3 style="margin-top: 0; color: #007AFF;">⚡ Gemini is analyzing...</h3>
            <p style="font-size: 13px; color: #8e8e93;">Reading page: <em>${pageTitle}</em></p>
        </div>
    `);

    // 4. CONSTRUCT BODY COMPATIBLE WITH OPENAI FORMAT
    const requestBody = {
        'model': model,
        'messages': [
            { 'role': 'system', 'content': 'You are a helpful in-browser assistant. Answer the user\'s request concisely using the webpage content provided.' },
            { 'role': 'user', 'content': `WEBPAGE TITLE: ${pageTitle}\n\nWEBPAGE CONTENT:\n${pageParagraphs}\n\nUSER REQUEST: ${userPrompt}` }
        ],
        'max_tokens': 1000,
        'temperature': 0.2,
        'stream': true
    };

    // 5. FETCH FROM GOOGLE'S OPENAI-COMPATIBLE PATHWAY
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
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
                        
                        // Clean markdown rendering for the WebKit sidebar view
                        const formattedHtml = summary
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/^### (.*$)/gim, '<h3 style="margin: 15px 0 5px 0; color: #1c1c1e;">$1</h3>')
                            .replace(/^## (.*$)/gim, '<h2 style="margin: 15px 0 5px 0; color: #1c1c1e;">$1</h2>')
                            .replace(/^# (.*$)/gim, '<h1 style="margin: 15px 0 5px 0; color: #1c1c1e;">$1</h1>')
                            .replace(/^\s*[-*+]\s+(.*)/gim, '<li style="margin-left: 15px; margin-bottom: 4px;">$1</li>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/`(.*?)`/g, '<code style="background: #f2f2f7; padding: 2px 4px; border-radius: 4px; font-family: ui-monospace, monospace; font-size: 12px; color: #ff2d55;">$1</code>')
                            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #007AFF; text-decoration: none;">$1</a>')
                            .replace(/\n\n/g, '<p style="margin: 0 0 10px 0;"></p>')
                            .replace(/\n/g, '<br>');

                        OrionInternals.setSidebarContent(`
                            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 15px; font-size: 14px; line-height: 1.6; color: #1c1c1e;">
                                <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e5e5ea;">
                                    <h4 style="margin: 0 0 4px 0; color: #8e8e93; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">User Request</h4>
                                    <p style="margin: 0; font-size: 13px; font-style: italic; color: #3a3a3c;">"${userPrompt}"</p>
                                </div>
                                <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e5ea;">
                                    <h4 style="margin: 0 0 10px 0; color: #34c759; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Gemini Helper</h4>
                                    <div style="font-size: 14px;">${formattedHtml}</div>
                                </div>
                            </div>
                        `);
                    }
                } catch (error) {
                    // Ignore JSON parsing errors for trailing/incomplete chunks
                }
            }
        }
    } else {
        const errorText = await response.text();
        console.error('API request failed:', errorText);
        OrionInternals.setSidebarContent(`
            <div style="font-family: -apple-system, sans-serif; padding: 15px; color: #ff3b30;">
                <h3>⚠️ Connection Error</h3>
                <p>${errorText}</p>
            </div>
        `);
    }
})();
