import React, { useState, useEffect } from 'react';
import food from '../../../../assets/avocado.png';
import Button from '../../../atoms/Buttons/GeneralButton/generalButton.tsx';
import './Nutrition.css';

const Nutrition: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState({
    name: '',
    tags: '',
    includeIngredients: '',
    excludeIngredients: '',
    maxPrepareTime: '',
    maxCookTime: '',
    maxCalories: '',
    maxNetCarbs: '',
    maxSugar: '',
    maxAddedSugar: '',
    limit: '10',
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const queryString = Object.entries(searchParams)
        .filter(([key, value]) => value !== '')
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      const response = await fetch(
        `https://low-carb-recipes.p.rapidapi.com/search?${queryString}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key':
              '445682dcdemsh600f1eb484c697ap116b1fjsn2155c9034309',
            'X-RapidAPI-Host': 'low-carb-recipes.p.rapidapi.com',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      } else {
        throw new Error('Failed to fetch recipes');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const calculateBMI = async () => {
    if (weight && height) {
      try {
        const response = await fetch(
          `https://body-mass-index-bmi-calculator.p.rapidapi.com/imperial?weight=${weight}&height=${height}`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key':
                '445682dcdemsh600f1eb484c697ap116b1fjsn2155c9034309',
              'X-RapidAPI-Host':
                'body-mass-index-bmi-calculator.p.rapidapi.com',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBmiResult(data.bmi);
          setShowResult(true); // Display the result
        } else {
          throw new Error('Failed to fetch BMI data');
        }
      } catch (error) {
        console.error('Error calculating BMI:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchRecipes();
  };

  return (
    <div className="Nutrition">
      <div className="MainNutriPage">
        <div className="Nutrition-box1">
          <div className="Calculator-box">
            <div className="Nutrition-form">
              <div className="Nutrition-heading">BMI Calculator</div>
              <div className="Nutrition-input">
                <label className="Nutrition-label">Weight (Pounds):</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="Nutrition-input-field"
                />
              </div>
              <div className="Nutrition-input">
                <label className="Nutrition-label">Height (Inches):</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="Nutrition-input-field"
                />
              </div>
              <Button
                text="Calculate BMI"
                styleType="style2"
                buttonSize="medium"
                onClick={calculateBMI}
              />
            </div>
            <div className="Nutrition-result">
              <div className="Nutrition-subheading">BMI Categories</div>
              <div className="Nutrition-categories">
                <div>Underweight: Less than 18.5</div>
                <div>Normal weight: 18.5-24.9</div>
                <div>Overweight: 25-29.9</div>
                <div>Obesity: 30 or greater</div>
              </div>
              {showResult && bmiResult !== null && (
                <div className="actual-result">
                  Your BMI: {bmiResult.toFixed(2)}
                </div>
              )}
            </div>
          </div>
          {/* Recipe Search Form */}
          <div className="Nutrition-heading2">Recipe Search</div>
          <form onSubmit={handleSearchSubmit} className="Recipe-search-form">
            <input
              type="text"
              name="name"
              value={searchParams.name}
              onChange={handleInputChange}
              placeholder="Recipe Name"
            />
            <input
              type="text"
              name="tags"
              value={searchParams.tags}
              onChange={handleInputChange}
              placeholder="Tags (e.g., keto;dairy-free)"
            />
            <input
              type="text"
              name="includeIngredients"
              value={searchParams.includeIngredients}
              onChange={handleInputChange}
              placeholder="Include Ingredients"
            />
            <input
              type="text"
              name="excludeIngredients"
              value={searchParams.excludeIngredients}
              onChange={handleInputChange}
              placeholder="Exclude Ingredients"
            />
            <input
              type="number"
              name="maxPrepareTime"
              value={searchParams.maxPrepareTime}
              onChange={handleInputChange}
              placeholder="Max Preparation Time (minutes)"
            />
            <input
              type="number"
              name="maxCookTime"
              value={searchParams.maxCookTime}
              onChange={handleInputChange}
              placeholder="Max Cook Time (minutes)"
            />
            <input
              type="number"
              name="maxCalories"
              value={searchParams.maxCalories}
              onChange={handleInputChange}
              placeholder="Max Calories"
            />
            <input
              type="number"
              name="maxNetCarbs"
              value={searchParams.maxNetCarbs}
              onChange={handleInputChange}
              placeholder="Max Net Carbs"
            />
            <input
              type="number"
              name="maxSugar"
              value={searchParams.maxSugar}
              onChange={handleInputChange}
              placeholder="Max Sugar"
            />
            <input
              type="number"
              name="maxAddedSugar"
              value={searchParams.maxAddedSugar}
              onChange={handleInputChange}
              placeholder="Max Added Sugar"
            />
            <Button
              text="Search Recipes"
              styleType="style2"
              buttonSize="medium"
              onClick={handleSearchSubmit}
              width="70%"
            />
          </form>
        </div>
        <div className="Nutrition-box2">
          <div className="Nutrition-food-image">
            <img src={food} alt="food" />
          </div>
        </div>
      </div>
      {/* Display Recipes */}
      <div className="Recipe-container">
        <div className="Nutrition-heading3">Recipes</div>
        <ul className="Recipe-list">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <div className="Recipe-image">
                <img src={recipe.image} alt={recipe.name} />
              </div>
              <div className="Recipe-details">
                <h3>{recipe.name}</h3>
                <div className="Recipe-serving">
                  <p>Servings: {recipe.servings}</p>
                </div>
                <div className="Recipe-steps">
                  <h4>Preparation Steps:</h4>
                  <ol>
                    {recipe.steps.map((step: any, index: any) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div className="Recipe-nutrients">
                  <div>
                    Calories: {recipe.nutrients.caloriesKCal.toFixed(0)}
                  </div>
                  <div>Carbs: {recipe.nutrients.netCarbs.toFixed(1)}g</div>
                  <div>Protein: {recipe.nutrients.protein.toFixed(1)}g</div>
                  <div>Fat: {recipe.nutrients.fat.toFixed(1)}g</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Nutrition;
