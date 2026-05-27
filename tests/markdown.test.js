import assert from 'assert';

// Verbatim copy of the markdownToHtml compiler from src/gemini-sidebar.js
function markdownToHtml(text) {
    if (!text) return '';
    
    // Normalize newlines to standard LF
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    const processedLines = [];
    
    for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            processedLines.push('<p style="margin: 0 0 10px 0;"></p>');
            continue;
        }
        
        // 1. Escape HTML special characters
        let l = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
            
        // 2. Headings
        let isHeading = false;
        if (trimmed.startsWith('### ')) {
            l = `<h3 style="margin: 15px 0 5px 0; color: #1c1c1e;">${trimmed.substring(4)}</h3>`;
            isHeading = true;
        } else if (trimmed.startsWith('## ')) {
            l = `<h2 style="margin: 15px 0 5px 0; color: #1c1c1e;">${trimmed.substring(3)}</h2>`;
            isHeading = true;
        } else if (trimmed.startsWith('# ')) {
            l = `<h1 style="margin: 15px 0 5px 0; color: #1c1c1e;">${trimmed.substring(2)}</h1>`;
            isHeading = true;
        }
        
        // 3. List Items
        let isList = false;
        if (!isHeading) {
            const listMatch = line.match(/^(\s*[-*+]\s+)(.*)$/);
            if (listMatch) {
                l = `<li style="margin-left: 15px; margin-bottom: 4px;">${listMatch[2]}</li>`;
                isList = true;
            }
        }
        
        // 4. Inline formatting (Bold, Italic, Code, Links)
        l = l
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background: #f2f2f7; padding: 2px 4px; border-radius: 4px; font-family: ui-monospace, monospace; font-size: 12px; color: #ff2d55;">$1</code>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #007AFF; text-decoration: none;">$1</a>');
            
        // 5. Append break if it is standard text (not list, heading, or paragraph)
        if (!isHeading && !isList) {
            l += '<br>';
        }
        
        processedLines.push(l);
    }
    
    return processedLines.join('');
}

// Test Suite
const suite = {
    testStandardFormatting() {
        const input = "This is **bold** and *italic* text.";
        const expected = "This is <strong>bold</strong> and <em>italic</em> text.<br>";
        assert.strictEqual(markdownToHtml(input), expected);
    },
    
    testHeadings() {
        assert.strictEqual(
            markdownToHtml("### Subheading"),
            '<h3 style="margin: 15px 0 5px 0; color: #1c1c1e;">Subheading</h3>'
        );
        assert.strictEqual(
            markdownToHtml("# Main Title"),
            '<h1 style="margin: 15px 0 5px 0; color: #1c1c1e;">Main Title</h1>'
        );
    },
    
    testAsteriskBulletLists() {
        const input = "*   **Bold Item**\n*   *Italic Item*";
        const expected = '<li style="margin-left: 15px; margin-bottom: 4px;"><strong>Bold Item</strong></li>' +
                         '<li style="margin-left: 15px; margin-bottom: 4px;"><em>Italic Item</em></li>';
        assert.strictEqual(markdownToHtml(input), expected);
    },
    
    testDashBulletLists() {
        const input = "-   Normal Item";
        const expected = '<li style="margin-left: 15px; margin-bottom: 4px;">Normal Item</li>';
        assert.strictEqual(markdownToHtml(input), expected);
    },
    
    testHtmlEscaping() {
        const input = "This page has a `<html>` tag and an `&` sign.";
        const expected = 'This page has a <code style="background: #f2f2f7; padding: 2px 4px; border-radius: 4px; font-family: ui-monospace, monospace; font-size: 12px; color: #ff2d55;">&lt;html&gt;</code> tag and an <code style="background: #f2f2f7; padding: 2px 4px; border-radius: 4px; font-family: ui-monospace, monospace; font-size: 12px; color: #ff2d55;">&amp;</code> sign.<br>';
        assert.strictEqual(markdownToHtml(input), expected);
    },
    
    testLinks() {
        const input = "Check out [Orion](https://kagi.com/orion/).";
        const expected = 'Check out <a href="https://kagi.com/orion/" target="_blank" style="color: #007AFF; text-decoration: none;">Orion</a>.<br>';
        assert.strictEqual(markdownToHtml(input), expected);
    },
    
    testParagraphSpacers() {
        const input = "Para 1\n\nPara 2";
        const expected = "Para 1<br><p style=\"margin: 0 0 10px 0;\"></p>Para 2<br>";
        assert.strictEqual(markdownToHtml(input), expected);
    }
};

// Run Tests
let passed = 0;
let total = 0;

console.log("🚀 Running Orion Programmable Button Markdown Tests...");

for (const [name, fn] of Object.entries(suite)) {
    total++;
    try {
        fn();
        console.log(`✅ ${name} passed.`);
        passed++;
    } catch (err) {
        console.error(`❌ ${name} failed!`);
        console.error(err);
    }
}

console.log(`\n📊 Test Summary: ${passed}/${total} passed.`);
process.exit(passed === total ? 0 : 1);
