import { createSlice } from "@reduxjs/toolkit";

const flashcardSlice = createSlice({
  name: "flashcards",
  initialState: {
    flashcards: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchFlashcardsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFlashcardsSuccess: (state, action) => {
      state.loading = false;
      state.flashcards = action.payload;
    },
    fetchFlashcardsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createFlashcardSuccess: (state, action) => {
      state.flashcards.push(action.payload);
    },
    updateFlashcardSuccess: (state, action) => {
      const index = state.flashcards.findIndex(
        (f) => f._id === action.payload._id
      );
      if (index !== -1) {
        state.flashcards[index] = action.payload;
      }
    },
    deleteFlashcardSuccess: (state, action) => {
      state.flashcards = state.flashcards.filter(
        (f) => f._id !== action.payload
      );
    },
  },
});

export const {
  fetchFlashcardsStart,
  fetchFlashcardsSuccess,
  fetchFlashcardsFailure,
  createFlashcardSuccess,
  updateFlashcardSuccess,
  deleteFlashcardSuccess,
} = flashcardSlice.actions;
export default flashcardSlice.reducer;
