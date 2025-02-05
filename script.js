const apiKey = 'AIzaSyBacs-f252IdAP2qfK0Tja56BPI0jyZoeM'; // Replace with your actual API key

async function processImages() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Processing...';

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
