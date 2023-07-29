/*
Create a component with the following specifications:

1. the component must split the received string data at /n/nor /n and return a Typography component for each string
2. the component must set a unique key for each Typography component
3. the component must return a div with the Typography components
4. the component must return null if the data is not a string

*/

import React from "react";
import { Typography, Paper } from "@material-ui/core";

const NutritionFacts = ({ data, tabIndex }) => {
    if (typeof data !== "string") return null;

    let message = "🍎 Nutrition Facts:"

    const nutrition = data.split(/\n\n|\n/);

    if (tabIndex === 0) {
        // Find Nutrition Facts tab
        message = "🍎 Here's the nutrition facts for your recipe:";
    } else if (tabIndex === 1) {
        // Create Meal tab
        message = "🍎 Here's the instructions for your delicious meal:";
    } else {
        // Handle other tab indices here if needed
        message = "🍎 Nutrition Facts:";
    }

    return (
        <Paper elevation={24} style={{ padding: "20px" }}>
            <h3> {message} </h3>
            {nutrition.map((item, index) => (
                <Typography key={index}>{item}</Typography>
            ))}
        </Paper>
    );
}

export default NutritionFacts;