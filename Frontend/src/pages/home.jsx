import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

import beforeSave from "../assets/beforesave.png";
import afterSave from "../assets/aftersave.png";
import deleteIcon from "../assets/delete.png";
import cancelIcon from "../assets/cancel.png";
import stepImage from "../assets/next.png";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [viewRecipe, setViewRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("https://leftovermagic-recipesharing-application.onrender.com/recipes");
        setRecipes(response.data);
        setFilteredRecipes(response.data); // Show all initially
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://leftovermagic-recipesharing-application.onrender.com/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userID]);

  const saveRecipe = async (recipeID) => {
    try {
      const url = isRecipeSaved(recipeID)
        ? "https://leftovermagic-recipesharing-application.onrender.com/recipes/unsave"
        : "https://leftovermagic-recipesharing-application.onrender.com/recipes";

      const response = await axios.put(url, { recipeID, userID });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  const deleteRecipe = async (recipeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://leftovermagic-recipesharing-application.onrender.com/recipes/${recipeId}`);
      const updated = recipes.filter((recipe) => recipe._id !== recipeId);
      setRecipes(updated);
      setFilteredRecipes(updated);
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  const handleSearch = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchQuery(input);

    if (!input.trim()) {
      setFilteredRecipes(recipes); // Reset if empty
      return;
    }

    const ingredients = input.split(",").map((item) => item.trim());

    const matched = recipes.filter((recipe) =>
      ingredients.every((ingredient) =>
        recipe.ingredients?.some((ri) =>
          ri.toLowerCase().includes(ingredient)
        )
      )
    );

    setFilteredRecipes(matched);
  };

  return (
    <div className="px-8 py-10 font-[Poppins,sans-serif]">
      <h1 className="text-center mb-6 text-3xl font-semibold text-[#0d1936]">Recipes</h1>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by ingredients (e.g., tomato, onion)"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRecipes.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No recipes match the entered ingredients.
          </p>
        ) : (
          filteredRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="relative group bg-white border border-orange-200 rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-in-out h-[320px] hover:h-[480px]"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-40 object-cover rounded-t-xl cursor-pointer"
                onClick={() => setViewRecipe(recipe)}
              />

              <div className="p-4 text-[#0d1936] flex flex-col justify-between h-[calc(100%-160px)]">
                <div>
                  <h2 className="text-xl font-bold text-[#fb8a42]">{recipe.name}</h2>

                  <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-500 ease-in-out mt-2">
                    <p className="text-sm text-[#3c3f47] overflow-y-auto max-h-40">
                      {recipe.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => saveRecipe(recipe._id)}
                    className="flex items-center gap-2 hover:scale-110 transition-transform"
                  >
                    <img
                      src={isRecipeSaved(recipe._id) ? afterSave : beforeSave}
                      alt="Save"
                      className="w-6 h-6"
                    />
                    <span className="text-sm text-gray-600">
                      {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                    </span>
                  </button>

                  <button
                    onClick={() => deleteRecipe(recipe._id)}
                    className="flex items-center gap-2 hover:scale-110 transition-transform"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-6 h-6" />
                    <span className="text-sm text-gray-600">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Modal */}
      {viewRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
          <div className="relative bg-white/90 rounded-2xl shadow-2xl w-[95%] max-w-4xl p-8 max-h-[85vh] overflow-y-auto border border-orange-100">
            <button
              onClick={() => setViewRecipe(null)}
              className="absolute top-8 right-6 w-6 h-6 hover:scale-110 transition-transform"
            >
              <img src={cancelIcon} alt="Close" className="w-full h-full object-contain" />
            </button>

            <h2 className="text-3xl font-bold text-center mb-2 text-[#fb8a42]">
              {viewRecipe.name}
            </h2>

            {viewRecipe.cookingTime && (
              <p className="text-center mb-6 font-semibold text-xl text-[#3a18fe90]">
                Cooking Time: {viewRecipe.cookingTime}
              </p>
            )}

            {viewRecipe.ingredients && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-[#0d1936]">Ingredients:</h3>
                <ul className="list-disc list-inside text-gray-800 space-y-1">
                  {viewRecipe.ingredients.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {viewRecipe.instructions && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[#0d1936]">Instructions:</h3>
                <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                  {viewRecipe.instructions
                    .split(".")
                    .filter((step) => step.trim() !== "")
                    .map((step, index) => (
                      <div className="flex items-center mb-2" key={index}>
                        <img
                          src={stepImage}
                          alt={`Step ${index + 1}`}
                          className="w-4 h-4 mr-3 object-contain"
                        />
                        <span>{step.trim()}.</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
