// Bootstrap Editor Engine — loaded externally so template literals with
// </script> inside the default template can never break the HTML parser.

const bootstrapInput = document.getElementById('bootstrapInput');
const outputIframe = document.getElementById('outputIframe');
const runBtn = document.getElementById('runBtn');

// 1. Default Bootstrap template (safe in .js — parser can't interfere)
const defaultTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap Demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
</head>
<body class="bg-light">

<div class="container mt-5">
    <h1 class="display-4 text-primary">Welcome to Bootstrap! <i class="bi bi-bootstrap"></i></h1>
    <p class="lead">Build responsive, mobile-first sites with Bootstrap.</p>
    
    <hr class="my-4">
    
    <h3>Buttons</h3>
    <button class="btn btn-primary">Primary</button>
    <button class="btn btn-secondary">Secondary</button>
    <button class="btn btn-success">Success</button>
    <button class="btn btn-danger">Danger</button>
    <button class="btn btn-warning">Warning</button>
    <button class="btn btn-info">Info</button>
    
    <hr class="my-4">
    
    <h3>Cards</h3>
    <div class="row">
        <div class="col-md-4">
            <div class="card shadow-sm mb-3">
                <div class="card-header bg-primary text-white">Featured</div>
                <div class="card-body">
                    <h5 class="card-title">Special Title</h5>
                    <p class="card-text">Some quick example text.</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card shadow-sm mb-3">
                <div class="card-header bg-success text-white">Popular</div>
                <div class="card-body">
                    <h5 class="card-title">Another Card</h5>
                    <p class="card-text">More content here.</p>
                    <a href="#" class="btn btn-success">Learn More</a>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card shadow-sm mb-3">
                <div class="card-header bg-danger text-white">New</div>
                <div class="card-body">
                    <h5 class="card-title">Third Card</h5>
                    <p class="card-text">Even more content.</p>
                    <a href="#" class="btn btn-danger">View Details</a>
                </div>
            </div>
        </div>
    </div>
    
    <hr class="my-4">
    
    <h3>Alerts & Progress</h3>
    <div class="alert alert-success" role="alert">
        <i class="bi bi-check-circle-fill"></i> System running perfectly!
    </div>
    <div class="progress mt-3 mb-5" style="height: 25px;">
        <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" style="width: 75%">75% Completed</div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

// 2. Load saved code or default
const savedCode = localStorage.getItem('careerPathBootstrapCode');
bootstrapInput.value = savedCode ? savedCode : defaultTemplate;

// 3. The Engine: Writes the code directly to the iframe
function executeBootstrap() {
    const code = bootstrapInput.value;
    const iframeDoc = outputIframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(code);
    iframeDoc.close();
}

// 4. Smart Indentation Engine
bootstrapInput.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        const spaces = "    "; // 4 spaces
        this.value = this.value.substring(0, start) + spaces + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + spaces.length;
        
        // Trigger auto-update
        localStorage.setItem('careerPathBootstrapCode', this.value);
        executeBootstrap();
    }
});

// 5. Real-time Live Reload Engine & Auto-Save
bootstrapInput.addEventListener('input', () => {
    localStorage.setItem('careerPathBootstrapCode', bootstrapInput.value);
    executeBootstrap();
});

// 6. Run button
runBtn.addEventListener('click', executeBootstrap);

// 7. Run immediately on load
executeBootstrap();
