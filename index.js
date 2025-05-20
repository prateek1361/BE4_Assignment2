const express= require("express")
const mongoose = require("mongoose")
const Recipe = require("./recipe.js")
const cors = require("cors");
const { initializeDatabase } = require("./db/db.connect")

const app = express()
app.use(cors())
app.use(express.json())

initializeDatabase()

async function createRecipe(data){
    try{
        const recipe = new Recipe(data)
        const saverecipe = await recipe.save()
        return saverecipe
    } catch(error){
       throw error
    }
}

app.post("/recipes", async (req, res) => {
    try{
        const savedrecipe = await createRecipe(req.body)
        res.status(201).json({message: "Recipe added succesfully", recipe: savedrecipe})
    } catch(error){
        res.status(500).json({error: "Failed to add recipe."})
    }
})

async function getAllRecipes(){
    try{
        const allRecipes = await Recipe.find()
        return allRecipes
    } catch(error){
        console.log(error)
    }
}

app.get("/recipes", async (req, res) => {
    try{
        const recipes = await getAllRecipes()
        if(recipes.length != 0){
            res.json(recipes)
        } else {
            res.status(404).json({error: "No recipes found."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch recipes."})
    }
})

async function getRecipeByTitle(title) {
    try {
        return await Recipe.findOne({ title });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

app.get("/recipes/title/:title", async (req, res) => {
    const { title } = req.params;
    try {
        const recipe = await getRecipeByTitle(title);
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ error: "Recipe not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recipe." });
    }
});

async function getRecipesByAuthor(author) {
    try {
        return await Recipe.find({ author });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

app.get("/recipes/author/:author", async (req, res) => {
    const { author } = req.params;
    try {
        const recipes = await getRecipesByAuthor(author);
        if (recipes.length > 0) {
            res.json(recipes);
        } else {
            res.status(404).json({ error: "No recipes found for this author." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recipes." });
    }
});

async function getEasyRecipes() {
    try {
        return await Recipe.find({ difficulty: "Easy" });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

app.get("/recipes/difficulty/easy", async (req, res) => {
    try {
        const recipes = await getEasyRecipes();
        if (recipes.length > 0) {
            res.json(recipes);
        } else {
            res.status(404).json({ error: "No easy recipes found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recipes." });
    }
});

async function updateDifficultyById(recipeId, dataToUpdate) {
    try {
        const updatedrecipe = await Recipe.findByIdAndUpdate(
            recipeId,
            dataToUpdate,
            { new: true }
        );
        return updatedrecipe;
    } catch (error) {
        console.log("Error in updating recipe rating.", error);
        throw error;
    }
}

app.post("/recipes/:recipeId", async (req, res) => {
    try {
        const updatedrecipe = await updateDifficultyById(req.params.recipeId, req.body);
        if (updatedrecipe) {
            res.status(200).json({
                message: "Recipe difficulty updated successfully.",
                updatedrecipe: updatedrecipe,
            });
        } else {
            res.status(404).json({ error: "Recipe does not exist." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update recipe rating." });
    }
});

async function updateByTitle(recipeTitle, dataToUpdate){
  try{
    const updatedRecipe = await Recipe.findOneAndUpdate({title: recipeTitle}, dataToUpdate, {new: true})
    return updatedRecipe
  } catch(error){
    console.log("Error in updating Recipe.", error)
  }
}

app.post("/recipes/title/:title", async (req, res) => {
      try{
        const updatedRecipe = await updateByTitle(req.params.title, req.body)
        if(updatedRecipe){
            res.status(200).json({message: "Recipe updated successfully.", updatedRecipe: updatedRecipe})
        } else {
            res.status(404).json({error: "Recipe not found."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to update Recipe."})
    }
})

async function deleteRecipeById(recipeId){
    try{
        const deletedRecipe = await recipe.findByIdAndDelete(recipeId)
        return deletedRecipe
    } catch(error){
        console.log(error)
    }
}

app.delete("/recipes/:recipeId", async (req, res) => {
    try{
        const deletedRecipe = await deleteRecipeById(req.params.recipeId)
        if(deletedRecipe){
            res.status(200).json({message: "Recipe deleted successfully."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to delete recipe."})
    }
})


const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})