const Flashcard = require("../models/Flashcard");

// Add Flashcard
exports.createFlashcard = async (req, res) => {
  try {
    const { question, answer } = req.body;
    console.log("current user: ",req.user);
    
    const newFlashcard = new Flashcard({
      user: req.user.id,
      question,
      answer,
    });
    await newFlashcard.save();
    res.status(201).json({
      success: true,
      message: "Flashcard created successfully",
      data: newFlashcard,
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      success: false,
      message: "Error creating flashcard",
      error: error.message,
    });
  }
};

// Get All Flashcards
exports.getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ user: req.user.id });
    res.status(200).json({
      success: true,
      message: "Flashcards retrieved successfully",
      data: flashcards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving flashcards",
      error: error.message,
    });
  }
};

// Update Flashcard (Move to next box or reset)
exports.updateFlashcard = async (req, res) => {
  try {
    const { id } = req.params;
    const { correct } = req.body;
    const flashcard = await Flashcard.findById(id);

    if (!flashcard)
      return res.status(404).json({
        success: false,
        message: "Flashcard not found",
      });

    if (correct) {
      flashcard.box = Math.min(5, flashcard.box + 1);
    } else {
      flashcard.box = 1;
    }
    flashcard.nextReview = new Date(
      Date.now() + flashcard.box * 24 * 60 * 60 * 1000
    );
    await flashcard.save();
    res.status(200).json({
      success: true,
      message: "Flashcard updated successfully",
      data: flashcard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating flashcard",
      error: error.message,
    });
  }
};

// Delete Flashcard
exports.deleteFlashcard = async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Flashcard deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
