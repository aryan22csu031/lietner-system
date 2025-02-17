import { useEffect, useState } from "react";
import axios from "../api";
import {
  fetchFlashcardsStart,
  fetchFlashcardsSuccess,
  fetchFlashcardsFailure,
  createFlashcardSuccess,
  updateFlashcardSuccess,
  deleteFlashcardSuccess,
} from "../utils/flashcardSlice";
import { logoutSuccess } from "../utils/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Homepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { flashcards, loading, error } = useSelector((state) => state.flashcards);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false); 
  const [confirmShowAnswer, setConfirmShowAnswer] = useState(false); // For confirmation before showing the answer

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const fetchFlashcards = async () => {
        dispatch(fetchFlashcardsStart());
        try {
          const response = await axios.get("/flashcards/all");
          dispatch(fetchFlashcardsSuccess(response.data.data));
        } catch (err) {
          dispatch(fetchFlashcardsFailure(err.response?.data?.message || "Error fetching flashcards"));
        }
      };

      fetchFlashcards();
    }
  }, [dispatch, user, navigate]);

  const handleCreateFlashcard = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/flashcards/create", { question, answer });
      dispatch(createFlashcardSuccess(response.data.data));
      setQuestion("");
      setAnswer("");
    } catch (err) {
      console.error("Error creating flashcard:", err);
    }
  };

  const handleUpdateFlashcard = async (id, correct, currentBox) => {
    const newBox = correct ? currentBox + 1 : 1; 
    try {
      const response = await axios.put(`/flashcards/update/${id}`, { box: newBox });
      dispatch(updateFlashcardSuccess(response.data.data));

      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
      setShowAnswer(false);
      setConfirmShowAnswer(false);
    } catch (err) {
      console.error("Error updating flashcard:", err);
    }
  };

  const handleDeleteFlashcard = async (id) => {
    try {
      await axios.delete(`/flashcards/delete/${id}`);
      dispatch(deleteFlashcardSuccess(id));

      setCurrentIndex((prevIndex) => (prevIndex >= flashcards.length - 1 ? 0 : prevIndex));
      setShowAnswer(false);
      setConfirmShowAnswer(false);
    } catch (err) {
      console.error("Error deleting flashcard:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      dispatch(logoutSuccess());
      navigate("/login");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-bold">Flashcard tool (leitner System)</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold">Create New Flashcard</h3>
        <form onSubmit={handleCreateFlashcard} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          <input
            type="text"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            type="submit"
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Add Flashcard
          </button>
        </form>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-semibold">Your Flashcards</h3>
        {loading && <p>Loading flashcards...</p>}
        {error && <p className="mb-4 text-red-500">{error}</p>}

        {flashcards.length > 0 ? (
          <div className="p-4 bg-white border rounded shadow">
            <h4 className="mb-2 text-lg font-medium">{flashcards[currentIndex].question}</h4>

            {/* Show Answer Logic */}
            {!showAnswer && !confirmShowAnswer && (
              <button
                onClick={() => setConfirmShowAnswer(true)}
                className="px-3 py-1 mb-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
              >
                Show Answer
              </button>
            )}

            {/* Confirmation Message */}
            {confirmShowAnswer && (
              <div className="mb-2 p-3 border rounded bg-yellow-100">
                <p className="text-yellow-700">Are you sure you want to see the answer?</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setShowAnswer(true);
                      setConfirmShowAnswer(false);
                    }}
                    className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                  >
                    Yes, Show Answer
                  </button>
                  <button
                    onClick={() => setConfirmShowAnswer(false)}
                    className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                  >
                    No, Keep Hidden
                  </button>
                </div>
              </div>
            )}

            {/* Display Answer */}
            {showAnswer && <p className="mb-2">{flashcards[currentIndex].answer}</p>}

            <p className="mb-2 text-sm text-gray-500">Box: {flashcards[currentIndex].box}</p>

            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateFlashcard(flashcards[currentIndex]._id, true, flashcards[currentIndex].box)}
                className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
              >
                Got it Right
              </button>
              <button
                onClick={() => handleUpdateFlashcard(flashcards[currentIndex]._id, false, flashcards[currentIndex].box)}
                className="px-3 py-1 text-sm font-semibold text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-colors"
              >
                Got it Wrong
              </button>
              <button
                onClick={() => handleDeleteFlashcard(flashcards[currentIndex]._id)}
                className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <p>No flashcards available.</p>
        )}
      </div>
    </div>
  );
};

export default Homepage;
