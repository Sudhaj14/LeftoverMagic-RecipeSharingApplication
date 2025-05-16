import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreateRecipe = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [""],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleAddIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!recipe.name.trim()) newErrors.name = "Name is required.";
    if (!recipe.description.trim()) newErrors.description = "Description is required.";
    if (recipe.ingredients.length === 0 || recipe.ingredients.some((i) => !i.trim()))
      newErrors.ingredients = "All ingredients must be filled.";
    if (!recipe.instructions.trim()) newErrors.instructions = "Instructions are required.";
    if (
  !recipe.imageUrl.trim() ||
  !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/.test(recipe.imageUrl)
)
  newErrors.imageUrl = "Valid image URL is required.";
if (recipe.cookingTime <= 0) newErrors.cookingTime = "Cooking time must be greater than 0.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(
        "https://leftovermagic-recipesharingapplication.onrender.com/recipes",
        { ...recipe },
        {
          headers: { authorization: cookies.access_token },
        }
      );
      alert("Recipe Created");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-gray-300 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-center text-[#dd6b20] mb-8">Create a Delicious Recipe 🍽️</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-lg font-semibold text-[#dd6b20]">Name</label>
            <input
              type="text"
              name="name"
              value={recipe.name}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 border-2 border-[#dd6b20] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dd6b20] transition-all duration-300"
              placeholder="Enter recipe name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-lg font-semibold text-[#dd6b20]">Description</label>
            <textarea
              name="description"
              value={recipe.description}
              onChange={handleChange}
              rows={3}
              className="w-full mt-2 px-4 py-2 border-2 border-[#dd6b20] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dd6b20] transition-all duration-300"
              placeholder="What makes this recipe special?"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Ingredients Input */}
          <div>
            <label className="block text-lg font-semibold text-[#dd6b20]">Ingredients</label>
            {recipe.ingredients.map((ingredient, index) => (
              <input
                key={index}
                type="text"
                value={ingredient}
                onChange={(event) => handleIngredientChange(event, index)}
                className="w-full mt-2 px-4 py-2 mb-2 border-2 border-[#dd6b20] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dd6b20] transition-all duration-300"
                placeholder={`Ingredient ${index + 1}`}
              />
            ))}
            {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
            <button
              type="button"
              onClick={handleAddIngredient}
              className="mt-2 inline-block px-4 py-2 bg-[#dd6b20] text-white rounded-md hover:bg-[#b25b1c] transition duration-300"
            >
              + Add Ingredient
            </button>
          </div>

          {/* Instructions Input */}
          <div>
            <label className="block text-lg font-semibold text-[#dd6b20]">Instructions</label>
            <textarea
              name="instructions"
              value={recipe.instructions}
              onChange={handleChange}
              rows={4}
              className="w-full mt-2 px-4 py-2 border-2 border-[#dd6b20] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dd6b20] transition-all duration-300"
              placeholder="Step-by-step instructions"
            />
            {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
          </div>

          {/* Image URL Input */}
          <div>
            <label className="block text-lg font-semibold text-[#dd6b20]">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={recipe.imageUrl}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 border-2 border-[#dd6b20] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dd6b20] transition-all duration-300"
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
          </div>

          {/* Cooking Time Input */}
          <div>
            <label className="block text-lg font-semibold text-[#dd6b20]">Cooking Time (minutes)</label>
            <input
              type="number"
              name="cookingTime"
              value={recipe.cookingTime}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 border-2 border-[#dd6b20] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dd6b20] transition-all duration-300"
            />
            {errors.cookingTime && <p className="text-red-500 text-sm mt-1">{errors.cookingTime}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-[#dd6b20] to-[#fbbf24] text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
          >
            ✅ Create Recipe
          </button>
        </form>
      </div>
    </div>
  );
};
