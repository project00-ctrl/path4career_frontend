// jQuery Editor Engine — loaded externally so template literals with
// </script> inside the preview HTML can never break the HTML parser.

const jqueryInput = document.getElementById('jqueryInput');
const previewFrame = document.getElementById('previewFrame');
const runBtn = document.getElementById('runBtn');

// 1. Default jQuery template
const defaultTemplate = `// Write your jQuery code here!
$(document).ready(function() {
    
    // Hello World - manipulate the demo element
    $('#demo').text('Hello from jQuery!');
    
    // Hide/Show elements with animation
    $('#hideBtn').click(function() {
        $('#demo').hide(1000);
    });
    
    $('#showBtn').click(function() {
        $('#demo').show(1000);
    });
    
    $('#toggleBtn').click(function() {
        $('#demo').toggle(500);
    });
    
    // Fade effects
    $('#fadeInBtn').click(function() {
        $('#box1').fadeIn('slow');
        $('#box2').fadeIn('slow');
        $('#box3').fadeIn('slow');
    });
    
    $('#fadeOutBtn').click(function() {
        $('#box1').fadeOut('slow');
        $('#box2').fadeOut('slow');
        $('#box3').fadeOut('slow');
    });
    
    // Slide effects
    $('#slideUpBtn').click(function() {
        $('#panel').slideUp();
    });
    
    $('#slideDownBtn').click(function() {
        $('#panel').slideDown();
    });
    
    // Animation
    $('#animateBtn').click(function() {
        $('#animateBox').animate({
            left: '250px',
            opacity: '0.5',
            height: '150px',
            width: '150px'
        });
    });
    
    // Add/Remove Class dynamically
    $('#addClassBtn').click(function() {
        $('#styleDemo').addClass('highlight');
    });
    
    $('#removeClassBtn').click(function() {
        $('#styleDemo').removeClass('highlight');
    });
    
    // Content Manipulation
    $('#getTextBtn').click(function() {
        let text = $('#contentDemo').text();
        alert('Text content: ' + text);
    });
    
    $('#setTextBtn').click(function() {
        $('#contentDemo').text('Text changed by jQuery!');
    });
    
    // Event handling
    $('#mouseDemo').mouseenter(function() {
        $(this).css('background-color', '#00ffb3');
    });
    
    $('#mouseDemo').mouseleave(function() {
        $(this).css('background-color', '#1e293b');
    });
    
});`;

// 2. Load saved code or default
const savedCode = localStorage.getItem('careerPathJqueryCode');
jqueryInput.value = savedCode ? savedCode : defaultTemplate;

// 3. The Engine: Build preview HTML and inject jQuery CDN via DOM
function executeJquery() {
    const userCode = jqueryInput.value.trim();
    if (!userCode) return;

    // Build the sandbox HTML WITHOUT any <script> tags
    const sandboxHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h2 style="text-align: center; color: #1e293b; margin-bottom: 30px;">jQuery Sandbox Preview</h2>
    
    <div class="demo-section">
        <h4>Basic Show/Hide</h4>
        <div id="demo">Hello from jQuery! Click the buttons below.</div>
        <button id="hideBtn">Hide</button>
        <button id="showBtn">Show</button>
        <button id="toggleBtn">Toggle</button>
    </div>
    
    <div class="demo-section">
        <h4>Fade Effects</h4>
        <div id="box1" class="box" style="display:none;"></div>
        <div id="box2" class="box" style="display:none;"></div>
        <div id="box3" class="box" style="display:none;"></div>
        <br>
        <button id="fadeInBtn">Fade In</button>
        <button id="fadeOutBtn">Fade Out</button>
    </div>
    
    <div class="demo-section">
        <h4>Slide Effects</h4>
        <div id="panel">Sliding Panel - Click to slide up/down</div>
        <button id="slideUpBtn">Slide Up</button>
        <button id="slideDownBtn">Slide Down</button>
    </div>
    
    <div class="demo-section">
        <h4>Animation</h4>
        <div id="animateBox">Animate Me!</div>
        <button id="animateBtn">Run Animation</button>
    </div>
    
    <div class="demo-section">
        <h4>CSS Class Manipulation</h4>
        <div id="styleDemo">Click buttons to add/remove CSS class</div>
        <button id="addClassBtn">Add Class</button>
        <button id="removeClassBtn">Remove Class</button>
    </div>
    
    <div class="demo-section">
        <h4>Content Manipulation</h4>
        <div id="contentDemo">Original content here</div>
        <button id="getTextBtn">Get Text</button>
        <button id="setTextBtn">Set Text</button>
    </div>
    
    <div class="demo-section">
        <h4>Event Handling (Mouse Enter/Leave)</h4>
        <div id="mouseDemo">Hover over me!</div>
    </div>
</body>
</html>`;

    const iframeDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(sandboxHTML);
    iframeDoc.close();

    // Inject jQuery CDN via DOM, then execute user code after it loads
    const jqueryCdn = iframeDoc.createElement('script');
    jqueryCdn.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
    jqueryCdn.onload = () => {
        const userScript = iframeDoc.createElement('script');
        userScript.textContent = `
            try {
                ${userCode}
            } catch (e) {
                document.body.innerHTML += '<div style="color: red; padding: 20px; background: #ffe0e0; border-radius: 8px; margin-top: 20px;"><strong>Error:</strong> ' + e.message + '</div>';
            }
        `;
        iframeDoc.body.appendChild(userScript);
    };
    iframeDoc.head.appendChild(jqueryCdn);
}

// 4. Smart Indentation Engine
jqueryInput.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        const spaces = "    "; // 4 spaces
        this.value = this.value.substring(0, start) + spaces + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + spaces.length;
        localStorage.setItem('careerPathJqueryCode', this.value);
    }
});

// 5. Auto-Save
jqueryInput.addEventListener('input', () => {
    localStorage.setItem('careerPathJqueryCode', jqueryInput.value);
});

// 6. Run button
runBtn.addEventListener('click', executeJquery);

// 7. Run immediately on load
executeJquery();
