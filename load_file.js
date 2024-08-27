const fs = require('fs');

// Function to load JSON file
function loadFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file:", err);
        return null;
    }
}

module.exports = loadFile;