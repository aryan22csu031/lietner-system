const express = require("express");
const {
  createFlashcard,
  getFlashcards,
  updateFlashcard,
  deleteFlashcard,
} = require("../controllers/Flashcard.controller");
const AuthMiddleware = require("../middleware/Auth.middleware");
const flashRouter = express.Router();

flashRouter.post("/flashcards/create", AuthMiddleware, createFlashcard);
flashRouter.get("/flashcards/all", AuthMiddleware, getFlashcards);
flashRouter.put("/flashcards/update/:id", updateFlashcard);
flashRouter.delete("/flashcards/delete/:id", deleteFlashcard);

module.exports = flashRouter;
