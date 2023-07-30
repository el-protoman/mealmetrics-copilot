/*
Create a HomePage Component with the following specifications:
1. A H1 with the text "Find Nutrition Facts for any recipe"
2. Create a text area and a button. When the button is clicked, the text in the text area should be sent to the server as a POST request.
3. The server should respond with the nutrition facts for the recipe below the text area.
*/

/* 
q: I want to add a header with the name on the left and the logo on the right. How do I do that?
a: You can use the AppBar component from Material UI. 
The AppBar component has a position prop that you can set to "static" to make it fixed at the top of the page. 
You can use the Toolbar component to add content to the AppBar. 
You can use the Typography component to add text to the Toolbar. 
You can use the IconButton component to add an icon to the Toolbar. 
You can use the img tag to add an image to the IconButton component. 
You can use the style prop to set the height of the image.


q: I want to add each nutrition fact to a separate line. How do I do that? The data comes back as a string and lokks like this: 
"\n\nCalories: 143 \nTotal Fat: 2.5 g \nSaturated Fat: 1.3 g \nTrans Fat: 0 g \nCholesterol: 5 mg \nSodium: 126 mg \nTotal Carbohydrate: 28.4 g \nDietary Fiber: 0.6 g \nSugars: 6.2 g \nProtein: 2.8 g"

a: You can use the split method to split the string into an array of strings.
You can use the map method to iterate over the array of strings and return a Typography component for each string.
You can use the key prop to set a unique key for each Typography component.
*/

import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextareaAutosize,
  Typography,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import { ThemeProvider } from "@material-ui/core/styles";
import Header from "../components/Header";
import NutritionFacts from "../components/NutritionFacts";
import Footer from "../components/Footer";
import theme from "../utils/theme";

function HomePage() {
  const [recipe, setRecipe] = useState("");
  const [mealType, setMealType] = useState("Mediterranean");
  const [gptResponse, setGPTResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0); // Track the selected tab index

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setRecipe("")
    setGPTResponse(""); //  Clears the card of previous data
    setError("");
  };

  const handleMealTypeChange = (mealType) => {
    setMealType(mealType);
  };

  async function getRecipeNutrition(recipe) {
    try {
      let requestBody = JSON.stringify({ recipe });
      console.log(requestBody)
      let serverUrl = "https://coral-app-foone.ondigitalocean.app"; // Production URL
      if (process.env.DEV === "true") {
        serverUrl = "http://localhost:8080"; // Localhost URL for development
      }
      const response = await fetch(
        `${serverUrl}/openai/generateinfo/recipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        }
      );

      // get nutrition info
      const nutrition = await response.json();

      // display nutrition info
      if (nutrition.data) {
        console.log(nutrition);
        setGPTResponse(nutrition.data);
        setLoading(false);
      } else {
        setError("Unable to get nutrition info");
        setLoading(false);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }

  async function getMealRecipe(recipe) {
    try {
      let requestBody = JSON.stringify({ recipe, mealType });
      console.log(requestBody)
      let serverUrl = "https://coral-app-foone.ondigitalocean.app"; // Production URL
      if (process.env.DEV === "true") {
        serverUrl = "http://localhost:8080"; // Localhost URL for development
      }
      const response = await fetch(
        `${serverUrl}/openai/generateinfo/meal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        }
      );

      // get meal info
      const meal = await response.json();

      // display recipe info
      if (meal.data) {
        console.log(meal);
        setGPTResponse(meal.data);
        setLoading(false);
      } else {
        setError("Unable to get recipe info");
        setLoading(false);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const newRecipe = event.target.elements.recipe.value;
    setRecipe(newRecipe);

    if (selectedTab === 0) {
      await getRecipeNutrition(newRecipe);
    } else if (selectedTab === 1) {
      await getMealRecipe(newRecipe);
    } else if (selectedTab === 2) {
      console.log("Please select tab"); //add additional endpoints here
    }
  }

  function handleClear(event) {
    event.preventDefault();
    setRecipe("");
  }

  return (
    <ThemeProvider theme={theme}>
      <Header selectedTab={selectedTab} handleTabChange={handleTabChange} handleMealTypeChange={handleMealTypeChange} />
      <Container maxWidth="md" style={{ marginTop: "40px", minHeight: "100vh", paddingBottom: "100px" }}>
        {/* Display the content of the selected tab */}
        {selectedTab === 0 && (
          <div>
            <Typography variant="h3" gutterBottom>
              🍎 Find Nutrition Facts for any recipe
            </Typography>
            <Paper elevation={24} style={{ padding: "20px" }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextareaAutosize
                      name="recipe"
                      value={recipe}
                      onChange={(e) => setRecipe(e.target.value)}
                      placeholder="Enter recipe to get nutrition facts"
                      style={{
                        width: "98%",
                        maxWidth: "850px",
                        minHeight: "200px",
                        padding: "10px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<Send />}
                    >
                      Submit
                    </Button>
                    <br />
                    <Button
                      style={{ marginTop: "10px" }}
                      variant="contained"
                      color="secondary"
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
            <div style={{ paddingTop: "40px" }}>
              {loading && (
                <Grid item xs={12}>
                  <CircularProgress />
                </Grid>
              )}
              {error ? (
                <Typography color="error">
                  An error occurred: {error.errorMessage}
                </Typography>
              ) : gptResponse ? (
                <NutritionFacts data={gptResponse} tabIndex={selectedTab} />
              ) : null}
            </div>
          </div>
        )}
        {selectedTab === 1 && (
          <div>
            <Typography variant="h3" gutterBottom>
              🍎 Create a Meal
            </Typography>
            <Paper elevation={24} style={{ padding: "20px" }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextareaAutosize
                      name="recipe"
                      value={recipe}
                      onChange={(e) => setRecipe(e.target.value)}
                      placeholder="Enter ingredients to get a recipe suggestion"
                      style={{
                        width: "98%",
                        maxWidth: "850px",
                        minHeight: "200px",
                        padding: "10px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<Send />}
                    >
                      Submit
                    </Button>
                    <br />
                    <Button
                      style={{ marginTop: "10px" }}
                      variant="contained"
                      color="secondary"
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
            <div style={{ paddingTop: "40px" }}>
              {loading && (
                <Grid item xs={12}>
                  <CircularProgress />
                </Grid>
              )}
              {error ? (
                <Typography color="error">
                  An error occurred: {error.errorMessage}
                </Typography>
              ) : gptResponse ? (
                <NutritionFacts data={gptResponse} tabIndex={selectedTab} />
              ) : null}
            </div>
          </div>
        )}
      </Container>
      {/* <Footer /> */}
    </ThemeProvider>
  );
}

export default HomePage;
