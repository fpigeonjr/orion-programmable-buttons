import assert from 'assert';

// OrionInternals.setSidebarContent() on GFE treats all content as PLAIN TEXT, not HTML.
// So we must strip ALL HTML tags and output clean, readable plain text only.

function cleanText(text) {
    if (!text) return '';
    
    // Normalize newlines
    let lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    const processed = [];
    
    for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            processed.push('');
            continue;
        }
        
        let l = line;
        
        // Step 1: Strip any HTML tags outright (e.g. from Gemini responses containing sample code)
        l = l.replace(/<[^>]*>/g, '');
        
        // Step 2: Strip markdown image/heading markers
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
        
        processed.push(l);
    }
    
    return processed.join('\n');
}

// Test Suite — ALL tests expect PLAIN TEXT output (zero HTML)
const suite = {
    testNoHtmlTagsInOutput() {
        const input = "This is **bold** and *italic* text.";
        const result = cleanText(input);
        // Must contain NO HTML angle brackets — GFE sidebar treats everything as plain text
        assert.ok(!result.includes('<'), `Should not contain '<', got: ${result}`);
        assert.ok(!result.includes('>'), `Should not contain '>', got: ${result}`);
    },

    testBoldPreservesText() {
        const input = "This is **bold** and *italic* text.";
        const result = cleanText(input);
        assert.ok(result.includes('bold'), 'bold text must be preserved');
        assert.ok(result.includes('italic'), 'italic text must be preserved');
        assert.ok(!result.includes('**'), 'bold markers must be stripped');
        assert.ok(!result.includes('<strong>'), 'HTML tags must not appear');
    },
    
    testBulletListsReadable() {
        const input = "*   **Browsers:** Orion (daily driver)\n*   *Git* - Version control.";
        const result = cleanText(input);
        assert.ok(result.includes('Browsers:'), 'list item text must be preserved');
        assert.ok(result.includes('Orion'), 'content after list marker must be preserved');
        assert.ok(result.includes('Git'), 'italic list items must preserve content');
        assert.ok(!result.includes('<li'), 'no HTML list tags');
        assert.ok(!result.includes('<strong>'), 'no HTML bold tags');
        assert.ok(!result.includes('<em>'), 'no HTML italic tags');
    },
    
    testInlineCodePreserved() {
        const input = "Run `git pull` to update.";
        const result = cleanText(input);
        assert.ok(result.includes('git pull'), 'code content must be preserved');
        assert.ok(!result.includes('<code'), 'no HTML code tags');
        assert.ok(!result.includes('`'), 'backticks should be stripped');
    },
    
    testLinksBecomeReadable() {
        const input = "Check [Orion](https://kagi.com/orion/) today.";
        const result = cleanText(input);
        assert.ok(result.includes('Orion'), 'link text must be preserved');
        assert.ok(!result.includes('<a'), 'no HTML link tags');
    },
    
    testNoHtmlEntities() {
        const input = "Use `<html>` tags in code.";
        const result = cleanText(input);
        assert.ok(!result.includes('&lt;'), 'no HTML entity escaping');
        assert.ok(!result.includes('&amp;'), 'no HTML entity escaping');
        assert.ok(!result.includes('&gt;'), 'no HTML entity escaping');
    },
    
    testEmptyAndWhitespace() {
        assert.strictEqual(cleanText(''), '');
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
