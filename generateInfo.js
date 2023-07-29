const { Configuration, OpenAIApi } = require('openai');
// import json data from prompt.json file
const { recipePrompt } = require('./prompt.json');
const { mealPrompt } = require('./prompt2.json');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Add a 'promptType' parameter to the function
const generateInfo = async (req, res, promptType) => {
  const { recipe } = req.body;

  try {
    // Use the 'promptType' to determine the appropriate prompt
    let prompt;
    let isRecipePrompt = true; // Change this to false if it's the meal prompt

    if (promptType === 'recipe') {
      prompt = recipePrompt;
    } else if (promptType === 'meal') {
      prompt = mealPrompt;
      isRecipePrompt = false; // Change this to boolean
    } else {
      // Default to recipePrompt if no valid promptType is provided
      prompt = recipePrompt;
    }

    // Set temperature and n based on the prompt type
    const temperature = isRecipePrompt ? 0 : 0.8;
    const n = isRecipePrompt ? 1 : 2;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `${prompt}${recipe}` }],
      max_tokens: 2000,
      temperature,
      n,
    });

    const response = completion.data.choices[0].message.content;

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    if (error.response.status === 401) {
      return res.status(401).json({
        error: "Please provide a valid API key.",
      });
    }
    return res.status(500).json({
      error:
        "An error occurred while generating recipe information. Please try again later.",
    });
  }
};

module.exports = { generateInfo };
