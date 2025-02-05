const apiKey = 'AIzaSyDLEx9bvCCmyhRuTCl4VijpJMTPTz5UlpA'; // Replace with your actual API key

// Function to process uploaded images
async function processImages() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    const resultsDiv = document.getElementById('imageResults');
    resultsDiv.innerHTML = 'Processing images...';

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            const imageBase64 = e.target.result.split(',')[1];
            const result = await callGeminiAPI(imageBase64);
            resultsDiv.innerHTML += `<p>${result}</p>`;
        };
        reader.readAsDataURL(file);
    }
}

// Function to send chat messages
async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');
    const userMessage = chatInput.value.trim();

    if (!userMessage) return;

    // Display user message
    chatBox.innerHTML += `<div class="message user-message">You: ${userMessage}</div>`;
    chatInput.value = ''; // Clear input field

    // Call Gemini API for response
    const botResponse = await callGeminiAPIText(userMessage);

    // Display bot response
    chatBox.innerHTML += `<div class="message bot-message">Bot: ${botResponse}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
}

// Function to call Gemini API for image processing
async function callGeminiAPI(imageBase64) {
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    const requestBody = {
        requests: [{
            image: {
                content: imageBase64
            },
            features: [{
                type: "TEXT_DETECTION"
            }]
        }]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    return data.responses[0].fullTextAnnotation.text;
}

// Function to call Gemini API for text-based responses
async function callGeminiAPIText(text) {
    // Replace this with the actual API endpoint for text-based queries
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
    const requestBody = {
        contents: [{
            parts: [{
                text: text
            }]
        }]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}
