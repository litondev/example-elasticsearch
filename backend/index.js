const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({
        "message" : "Your Login"
    })
});

app.listen(3001,() => {
    console.log("Service App Is Running in port 3001");
});