import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

// Import asset images
import deleteIcon from "../assets/delete.png";
import afterSave from "../assets/aftersave.png";
import cancelIcon from "../assets/cancel.png";
import stepImage from "../assets/next.png";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [viewRecipe, setViewRecipe] = useState(null);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://leftovermagic-recipesharingapplication.onrender.com/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  const deleteRecipe = async (recipeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this saved recipe?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://leftovermagic-recipesharingapplication.onrender.com1/recipes/${recipeId}`);
      setSavedRecipes(savedRecipes.filter((recipe) => recipe._id !== recipeId));
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  const unsaveRecipe = async (recipeId) => {
    try {
      await axios.put("https://leftovermagic-recipesharingapplication.onrender.com/recipes/unsave", {
        recipeID: recipeId,
        userID,
      });
      // Remove from local state after unsave
      setSavedRecipes(savedRecipes.filter((recipe) => recipe._id !== recipeId));
    } catch (err) {
      console.error("Error unsaving recipe:", err);
    }
  };

  return (
    <div className="px-8 py-10 font-[Poppins,sans-serif] relative">
      <h1 className="text-center mb-6 text-3xl font-semibold text-[#0d1936]">Your Saved Recipes</h1>

      {savedRecipes.length === 0 ? (
        <p className="text-center text-xl text-gray-500">No saved recipes found.</p>
      ) : (
        <div className="flex flex-wrap justify-start gap-6 pb-4">
          {savedRecipes.map((recipe) => (
            <div
              className="w-full sm:w-[48%] lg:w-[23%] rounded-xl shadow-md transition-transform transform hover:-translate-y-1 cursor-pointer bg-white border border-orange-200"
              key={recipe._id}
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-40 object-cover rounded-t-xl cursor-pointer"
                onClick={() => setViewRecipe(recipe)}
              />

              <div className="p-4 text-[#0d1936]">
                <h2 className="text-xl font-bold mb-2 text-[#fb8a42]">{recipe.name}</h2>
                <p className="text-sm text-[#3c3f47] mb-3">{recipe.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={() => unsaveRecipe(recipe._id)}
                    className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                    title="Unsave"
                  >
                    <img
                      src={afterSave}
                      alt="Unsave"
                      className="w-full h-full object-contain"
                    />
                  </button>

                  <button
                    onClick={() => deleteRecipe(recipe._id)}
                    className="w-7 h-7 hover:scale-110 transition-transform"
                    title="Delete"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-full h-full object-contain" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal to view full recipe details */}
      {viewRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
          <div className="relative bg-white/90 rounded-2xl shadow-2xl w-[95%] max-w-4xl p-8 max-h-[85vh] overflow-y-auto border border-orange-100">
            <button
              onClick={() => setViewRecipe(null)}
              className="absolute top-8 right-6 w-6 h-6 hover:scale-110 transition-transform"
            >
              <img src={cancelIcon} alt="Close" className="w-full h-full object-contain" />
            </button>

            <h2 className="text-3xl font-bold text-center mb-6 text-[#fb8a42]">
              {viewRecipe.name}
            </h2>

            {viewRecipe.imageUrl && (
              <img
                src={viewRecipe.imageUrl}
                alt={viewRecipe.name}
                className="w-full h-60 object-cover rounded-lg mb-6"
              />
            )}

            {viewRecipe.description && (
              <p className="text-[#3c3f47] mb-4">{viewRecipe.description}</p>
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
                        <span>{step.trim()}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {viewRecipe.cookingTime && (
              <p className="text-sm text-[#666] mt-4">
                Cooking Time: {viewRecipe.cookingTime} mins
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
