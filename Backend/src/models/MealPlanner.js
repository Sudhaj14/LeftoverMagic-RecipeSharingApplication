const MealPlannerSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  plan: {
    Monday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    Tuesday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    Wednesday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    Thursday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    Friday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    Saturday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    Sunday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
});
