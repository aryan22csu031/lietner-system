import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import flashcardReducer from "./flashcardSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    flashcards: flashcardReducer,
  },
});

export default store;
