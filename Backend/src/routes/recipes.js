import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

// GET all recipes
router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST - Create a new recipe
router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description, // ✅ Added
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    userOwner: req.body.userOwner,
  });

  try {
    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        _id: result._id,
        name: result.name,
        description: result.description, // ✅ Added
        ingredients: result.ingredients,
        instructions: result.instructions,
        imageUrl: result.imageUrl,
        cookingTime: result.cookingTime,
        userOwner: result.userOwner,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT - Save a recipe
router.put("/", async (req, res) => {
  const recipe = await RecipesModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET saved recipe IDs
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET saved recipe objects
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.status(201).json({ savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT - Unsave a recipe
router.put("/unsave", async (req, res) => {
  const { userID, recipeID } = req.body;
  try {
    await UserModel.findByIdAndUpdate(userID, {
      $pull: { savedRecipes: recipeID },
    });
    const user = await UserModel.findById(userID);
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE - Delete a recipe
router.delete("/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;
    await RecipesModel.findByIdAndDelete(recipeId);
    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete recipe.", error });
  }
});

export { router as recipesRouter };
