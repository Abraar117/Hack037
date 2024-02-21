const express = require('express');
const app = express();
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const path = require('path');


app.get('/home', async (req, res) => {
    try {
        // Read CSV file (assuming 'superstore_product_data.csv' is in the same directory)
        const csvData = await readFileAsync('superstore_product_data.csv', 'utf8');
        const data = parseCSV(csvData);

        // Perform data manipulation similar to Python code

        // Create bar graph of ProfitOptimized against Category
        const metric1Image = createBarGraph(data, 'Category', 'ProfitOptimized', 'static/metric1.png');

        // Create bar graph of Popularity against Category
        const metric2Image = createBarGraph(data, 'Category', 'Popularity', 'static/metric2.png');

        // Create line graph of SeasonalPopularity against Category
        const metric3Image = createLineGraph(data, 'Category', ['MonthOfSaleMean', 'PopularityMean'], 'static/metric3.png');

        // Grouped metric: Multiple line graph of category against ProfitOptimized, Popularity, and SeasonalPopularity
        const groupedMetricImage = createGroupedMetricGraph(data, 'Category', ['ProfitOptimized', 'Popularity', 'SeasonalPopularity'], 'static/groupedMetric.png');

        res.json({
            metric1: metric1Image,
            metric2: metric2Image,
            metric3: metric3Image,
            groupedMetric: groupedMetricImage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

function parseCSV(csvData) {
    // Implement CSV parsing logic
    // Example: You might want to use a library like 'csv-parser'
}

function createBarGraph(data, xColumn, yColumn, outputPath) {
    // Implement bar graph creation logic
    // Example: You might want to use a library like 'plotly' or 'chart.js'
}

function createLineGraph(data, xColumn, yColumns, outputPath) {
    // Implement line graph creation logic
    // Example: You might want to use a library like 'plotly' or 'chart.js'
}

function createGroupedMetricGraph(data, xColumn, yColumns, outputPath) {
    // Implement grouped metric graph creation logic
    // Example: You might want to use a library like 'plotly' or 'chart.js'
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
