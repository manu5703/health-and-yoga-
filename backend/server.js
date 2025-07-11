const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());


app.post("/get-recommendations", (req, res) => {
    const { profession, health_condition, fitness_goal } = req.body;
    console.log("Received prompt:", profession, health_condition, fitness_goal);

  
    // if (!profession || !health_condition || !fitness_goal) {
    //     return res.status(400).json({ error: "All fields (age, healthCondition, goal) are required" });
    // }

    // Call the Python script with the user's input
    console.log('reached here')
    const pythonProcess = spawn("python", ["backend2.py", profession, health_condition, fitness_goal]);

    let responseData = "";
    
    pythonProcess.stdout.on("data", (data) => (responseData += data.toString()));
    console.log("r:",responseData)
    pythonProcess.stderr.on("data", (data) => console.error(`Python Error111: ${data.toString()}`));

    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: "Error executing Python script" });
        }
        res.json({ recommendations: responseData.trim() });
    });
});


app.post("/generate-response", (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  const pythonProcess = spawn("python", ["backend.py", prompt]);
  let responseData = "";
  pythonProcess.stdout.on("data", (data) => (responseData += data.toString()));
  pythonProcess.stderr.on("data", (data) => console.error(`Error: ${data.toString()}`));
  pythonProcess.on("close", (code) => {
    if (code !== 0) return res.status(500).json({ error: "Error executing Python script" });
    res.json({ response: responseData.trim() });
  });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
