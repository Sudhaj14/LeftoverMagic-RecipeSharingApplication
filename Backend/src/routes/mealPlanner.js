const express = require("express");
// const { MealPlanner } = require("../models/MealPlanner");
const { mealPlannerRouter } = require("./routes/mealPlanner");
const router = express.Router();

router.get("/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const planner = await MealPlanner.findOne({ userID }).populate(
      "plan.Monday plan.Tuesday plan.Wednesday plan.Thursday plan.Friday plan.Saturday plan.Sunday"
    );

    if (!planner) return res.status(404).json({ message: "Meal plan not found" });

    res.json(planner);
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Add or update meals for a day
router.post("/add", async (req, res) => {
  const { userID, day, recipeID } = req.body;

  try {
    let planner = await MealPlanner.findOne({ userID });

    if (!planner) {
      planner = new MealPlanner({ userID, plan: {} });
    }

    if (!planner.plan[day]) planner.plan[day] = [];
    planner.plan[day].push(recipeID);

    await planner.save();
    res.status(200).json({ message: "Recipe added to planner", planner });
  } catch (err) {
    res.status(500).json({ message: "Error adding recipe to planner", err });
  }
});

// Export shopping list (ingredients)
router.get("/shopping-list/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const planner = await MealPlanner.findOne({ userID }).populate(
      "plan.Monday plan.Tuesday plan.Wednesday plan.Thursday plan.Friday plan.Saturday plan.Sunday"
    );

    if (!planner) return res.status(404).json({ message: "Meal plan not found" });

    const allRecipes = Object.values(planner.plan).flat();
    const ingredients = allRecipes.flatMap((recipe) => recipe.ingredients);

    const uniqueIngredients = [...new Set(ingredients.map(i => i.toLowerCase()))];

    res.status(200).json({ shoppingList: uniqueIngredients });
  } catch (err) {
    res.status(500).json({ message: "Error generating shopping list", err });
  }
});

export const MealPlanner = MealPlanner;
