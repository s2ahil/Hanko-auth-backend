const axios = require("axios");

async function summarizeText(text) {
    let data = JSON.stringify({
        "inputs": text,
        "parameters": {
            "max_length": 100,
            "min_length": 30
        }
    });
    const token = process.env.HUGGING_FACE_API;

    try {
        const response = await axios.post("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        );

        console.log("response" + JSON.stringify(response.data));

        if (response.data.error) {
            console.log("Error message: " + response.data.error);

        } else {

            return response.data[0].summary_text;
        }
    } catch (error) {

        console.log(error);
    }
}

module.exports = summarizeText;
