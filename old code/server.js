const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/save-data', (req, res) => {
    const filePath = path.join(__dirname, 'data_structure.json');
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));