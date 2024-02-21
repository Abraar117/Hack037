import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';


import './App.css'; // Import the CSS file

const RoundedButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'red', // Set the button color to red
      cursor: 'pointer',
      color: 'white',
      border: 'none',
      fontSize: '1em', // Adjust the font size if needed
      margin: '0 5px', // Add margin to create spacing between buttons
    }}
  >
    {label}
  </button>
);

const ButtonContainer = {
  display: 'flex',
  justifyContent: 'center', // Center horizontally
  alignItems: 'center', // Center vertically
  marginTop: '20px', // Adjust the margin as needed
};

const App = () => {
  const [chartImage, setChartImage] = useState('');
  const [optimizedShelves, setOptimizedShelves] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryMetrics, setCategoryMetrics] = useState({});
  const [shelvesForCategory, setShelvesForCategory] = useState([]);

  const calculateMetrics = (shelves) => {
    const metrics = {};

    Object.keys(shelves).forEach((shelf) => {
      metrics[shelf] = shelves[shelf].length;
    });

    setCategoryMetrics(metrics);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const generateChartOptions = (category) => {
    return {
      xaxis: {
        categories: Object.keys(categoryMetrics),
        title: {
          text: `${category}`,
          style: {
            color: '#000000', // Change the color to your desired color (yellow in this example)
            fontSize: '18px', // Set the font size for the x-axis title
          },
        },
      },
      yaxis: {
        title: {
          text: '',
          style: {
            color: '#000000', // Change the color to your desired color (yellow in this example)
            fontSize: '18px', // Set the font size for the y-axis title
          },
        },
      },
    };
  };
  const [popularityChartOptions, setPopularityChartOptions] = useState({});
  const [popularityChartSeries, setPopularityChartSeries] = useState([]);

  const [seasonalPopularityChartOptions, setSeasonalPopularityChartOptions] = useState({});
  const [seasonalPopularityChartSeries, setSeasonalPopularityChartSeries] = useState([]);

  const [profitOptimizedChartOptions, setProfitOptimizedChartOptions] = useState({});
  const [profitOptimizedChartSeries, setProfitOptimizedChartSeries] = useState([]);

  useEffect(() => {
    fetchOptimizedShelves(selectedCategory);

    // Fetch popularity metrics data when the component mounts
    fetchPopularityMetrics(selectedCategory);

    // Fetch seasonal popularity metrics data when the component mounts
    fetchSeasonalPopularityMetrics(selectedCategory);
    fetch('http://localhost:5000/plot')
      .then(response => response.json())
      .then(data => {
        setChartImage(data.image);
      })
      .catch(error => console.error('Error fetching chart:', error));
  }, [selectedCategory]);

  const fetchOptimizedShelves = (category) => {
    axios
      .get(`http://localhost:5000/api/optimized_shelves?category=${category}`)
      .then((response) => {
        setOptimizedShelves(response.data);
        calculateMetrics(response.data);
        setShelvesForCategory(Object.keys(response.data));
      })
      .catch((error) => console.error('Error fetching optimized shelves:', error));
  };

  const fetchPopularityMetrics = (category) => {
    axios
      .get(`http://localhost:5000/api/popularity_metrics?category=${category}`)
      .then((response) => {
        // Handle response for popularity metrics
        console.log(response.data);
        // Update state or perform other actions as needed
      })
      .catch((error) => console.error('Error fetching popularity metrics:', error));
  };

  const fetchSeasonalPopularityMetrics = (category) => {
    axios
      .get(`http://localhost:5000/api/seasonal_popularity_metrics?category=${category}`)
      .then((response) => {
        setSeasonalPopularityChartOptions(generateChartOptions(category));
        setSeasonalPopularityChartSeries(generateChartSeries(response.data));
      })
      .catch((error) => console.error('Error fetching seasonal popularity metrics:', error));
  };

  const generateChartSeries = () => {
    return [
      {
        name: `Number of Products in ${selectedCategory}`,
        data: Object.values(categoryMetrics),
      },
    ];
  };

  const handleShelfClick = (aisle, shelf) => {
    // Add your logic here to handle the shelf click event
    console.log(`Clicked on ${shelf} in Aisle ${aisle}`);
  };

  const ShelfButton = ({ shelf, occupied, onClick, isHighlighted }) => {
    return (
      <button
        onClick={onClick}
        disabled={occupied}
        style={{
          width: '60px',
          height: '30px',
          borderRadius: '5px',
          backgroundColor: occupied ? 'red' : isHighlighted ? 'red' : 'blue',
          margin: '5px',
          cursor: 'pointer',
          color: 'white',
        }}
      >
        {shelf}
      </button>
    );
  };

  return (
    <div className="App">
      <h1>Retail Shelf Optimization Tool</h1>
      <br />
      <br />
      <br />
      <div>
        <label htmlFor="categoryDropdown">Select Category:</label>
        <select id="categoryDropdown" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="all">All Categories</option>
          <option value="groceries">Groceries</option>
          <option value="clothing">Clothing</option>
          <option value="electronics">Electronics</option>
          <option value="home">Home Items</option>
          <option value="toys">Toys</option>
        </select>
      </div>
      <br />
      {selectedCategory !== 'all' && (
        <div>
          <h2>Shelves for {selectedCategory}:</h2>
          <div style={ButtonContainer}>
            {[...Array(20)].map((_, buttonIndex) => (
              <ShelfButton
                key={buttonIndex}
                shelf={`Shelf ${buttonIndex + 1}`}
                occupied={false} // You can customize the occupied state based on your logic
                onClick={() => console.log(`Clicked on Shelf ${buttonIndex + 1}`)}
                isHighlighted={buttonIndex < 2} // Highlight the first two buttons in red
              />
            ))}
          </div>
          <ul>
            {shelvesForCategory.map((shelf) => (
              <li key={shelf}>{shelf}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <br />
        <br />
        <h2>Optimized Shelves:</h2>
        <br />
        {Object.keys(optimizedShelves).map((shelf) => (
          <div key={shelf} style={{ marginBottom: '20px' }}>
            <strong>{shelf}:</strong>
            <ul>
              {optimizedShelves[shelf].map((product) => (
                <li key={product}>{product}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={ButtonContainer}>
        {[...Array(20)].map((_, buttonIndex) => (
          <RoundedButton
            key={buttonIndex}
            label={buttonIndex + 1}
            onClick={() => console.log(`Clicked on Shelf ${buttonIndex + 1}`)}
          />
        ))}
      </div>
      <br />
      <br />
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '10px' }}>
        <h2>Popularity Chart:</h2>
        {/* Display the popularity chart */}
        <Chart options={popularityChartOptions} series={popularityChartSeries} type="bar" height={350} />
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '10px' }}>
        <h2>Seasonal Variation Chart:</h2>
        {/* Display the seasonal popularity chart */}
        <Chart
          options={seasonalPopularityChartOptions}
          series={seasonalPopularityChartSeries}
          type="bar"
          height={350}
        />
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '10px' }}>
        <h2>Profit Optimized Chart:</h2>
        {/* Display the profit optimized chart */}
        <Chart options={profitOptimizedChartOptions} series={profitOptimizedChartSeries} type="bar" height={350} />
      </div>
      <div>
      {chartImage && <img src={`data:image/png;base64,${chartImage}`} alt="Chart" />}
    </div>
    {/* <img src={metric1} alt="Metric 1" />
<img src={metric2} alt="Metric 2" />
<img src={metric3} alt="Metric 3" /> */}
    </div>

    
  );
};

export default App;
