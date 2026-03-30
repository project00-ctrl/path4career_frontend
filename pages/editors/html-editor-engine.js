// HTML Editor Engine — loaded externally so template literals with
// </script> inside user code can never break the HTML parser.

const htmlInput = document.getElementById('htmlInput');
const htmlOutput = document.getElementById('htmlOutput');
const runBtn = document.getElementById('runBtn');

// 1. Default template (safe — no parser issue in a .js file)
const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Page Title</title>
</head>
<body>
    <h1>Hello, CareerPath! 🚀</h1>
    <p>Edit the HTML code on the left to see changes instantly.</p>
    <button class="btn" onclick="alert('HTML and JS working perfectly!')">Click Me</button>
</body>
</html>`;

// 2. Load saved code or default
const savedHtmlCode = localStorage.getItem('careerPathHtmlCode');
htmlInput.value = savedHtmlCode ? savedHtmlCode : defaultHtml;

// 3. The Engine: Writes the HTML directly to the iframe
function executeHTML() {
    const htmlCode = htmlInput.value;
    const iframeDoc = htmlOutput.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlCode);
    iframeDoc.close();
}

// 4. Smart Indentation Engine
htmlInput.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        const spaces = "    "; // 4 spaces
        this.value = this.value.substring(0, start) + spaces + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + spaces.length;
        
        // Trigger auto-update
        localStorage.setItem('careerPathHtmlCode', this.value);
        executeHTML();
    }
});

// 5. Real-time Live Reload Engine & Auto-Save
htmlInput.addEventListener('input', () => {
    localStorage.setItem('careerPathHtmlCode', htmlInput.value);
    executeHTML();
});

// 6. Run button
runBtn.addEventListener('click', executeHTML);

// 7. Run immediately on load
executeHTML();
