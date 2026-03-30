import { WebR } from 'https://webr.r-wasm.org/latest/webr.mjs';

const rInput = document.getElementById('rInput');
const consoleDiv = document.getElementById('consoleDiv');
const runBtn = document.getElementById('runBtn');

const defaultTemplate = `# Welcome to R Editor!
# Write your R code here!

print("Hello From WebR!")
x <- c(1, 2, 3, 4, 5)
print(paste("Mean of x is:", mean(x)))

# Try some statistics
summary(mtcars$mpg)
`;

const savedCode = localStorage.getItem('careerPathRCode');
rInput.value = savedCode ? savedCode : defaultTemplate;

let webR;
let suppressOutput = true; // Flag to ignore startup noise

function appendToConsole(text, className) {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text + '\n';
    consoleDiv.appendChild(span);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

async function initWebR() {
    try {
        webR = new WebR();
        await webR.init();
        
        // Ensure console is empty and ready for user output
        consoleDiv.innerHTML = '';
        suppressOutput = false; 
        
        runBtn.disabled = false;
        runBtn.innerHTML = 'Run Code';
        
        // Continuous output stream listener
        (async () => {
            for (;;) {
                const output = await webR.read();
                if (suppressOutput) continue; 
                
                switch (output.type) {
                case 'stdout':
                    appendToConsole(output.data, 'log-normal');
                    break;
                case 'stderr':
                    appendToConsole(output.data, 'log-error');
                    break;
                }
            }
        })();
        
    } catch (error) {
        console.error('WebR Init Error:', error);
    }
}

async function executeRCode() {
    const code = rInput.value.trim();
    if (!code) return;
    
    localStorage.setItem('careerPathRCode', code);
    
    // Clear the console before each run so ONLY the current output is shown
    consoleDiv.innerHTML = '';
    
    try {
        runBtn.disabled = true;
        runBtn.innerHTML = 'Running...';
        
        await webR.writeConsole(code);
        
    } catch (error) {
        appendToConsole('Error: ' + error.message, 'log-error');
    } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = 'Run Code';
    }
}

runBtn.addEventListener('click', executeRCode);

// Keyboard shortcut: Ctrl+Enter
rInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        executeRCode();
    }
});

// Initialize on load
initWebR();
