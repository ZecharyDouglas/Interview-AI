import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import "./Modal.css"; // The styling for the modals

function HomePage() {
  // State variables for each piece of data
  const [modal, setModal] = useState(false);
  const [topic, setTopic] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [feedback, setFeedback] = useState("");

  // Toggles the modal visibility 
  const toggleModal = () => {
    setModal(!modal);
  };

  // Handle input changes for topic and user response
  const handleTopic = (e) => setTopic(e.target.value);
  const handleUserResponse = (e) => setUserResponse(e.target.value);

  // Generate interview questions based on the provided topic.
  // The response from the backend is used to update the "interviewQuestions" field.
  const generateInterview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/speech/api/generateInterview", { topic });
      console.log("Interview generated:", response.data);
      if (response.data.interviewTranscript) {
        setInterviewQuestions(response.data.interviewTranscript);
      }
    } catch (error) {
      console.error("Error generating interview:", error);
    }
  };

  // Assess interview performance by sending both the generated interview and candidate's response.
  // The feedback returned by the backend fills the "feedback" field.
  const assessPerformance = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user_prompt: `Interview Questions: ${interviewQuestions}\nCandidate Response: ${userResponse}`,
      };
      const response = await axios.post("/transcript/advice", payload);
      console.log("Interview assessed:", response.data);
      if (response.data.response) {
        setFeedback(response.data.response);
      }
    } catch (error) {
      console.error("Error assessing interview performance:", error);
    }
  };

  // Submit all interview data (topic, questions, candidate's response, and feedback) to the backend.
  const submitInterviewData = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        interview_topic: topic,
        interview_questions: interviewQuestions,
        interview_transcript: userResponse, // Candidate's response
        interview_feedback: feedback,
      };
      const response = await axios.post("/api/putInterviewData", payload);
      console.log("Interview data submitted:", response.data);
      // Clear all fields and close the modal upon success
      setTopic("");
      setInterviewQuestions("");
      setUserResponse("");
      setFeedback("");
      toggleModal();
    } catch (error) {
      console.error("Error submitting interview data:", error);
    }
  };

  return (
    <>
      <button onClick={toggleModal} className="btn-modal">
        Start Interview
      </button>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Interview Modal</h2>
            <Box component="form" noValidate autoComplete="off">
              {/* Interview Topic */}
              <TextField
                fullWidth
                label="Interview Topic"
                value={topic}
                onChange={handleTopic}
                margin="normal"
              />

              {/* Generate Interview Questions */}
              <Button
                variant="contained"
                color="primary"
                onClick={generateInterview}
                sx={{ mt: 2, mb: 2 }}
              >
                Generate Interview
              </Button>

              {/* Display generated Interview Questions (read-only) */}
              <TextField
                fullWidth
                label="Interview Questions"
                value={interviewQuestions}
                margin="normal"
                multiline
                rows={4}
                InputProps={{ readOnly: true }}
              />

              {/* User inputs their response */}
              <TextField
                fullWidth
                label="Your Response"
                value={userResponse}
                onChange={handleUserResponse}
                margin="normal"
                multiline
                rows={4}
              />

              {/* Assess performance using generated questions and candidate's response */}
              <Button
                variant="contained"
                color="primary"
                onClick={assessPerformance}
                sx={{ mt: 2, mb: 2 }}
              >
                Assess Performance
              </Button>

              {/* Display Interview Feedback (read-only) */}
              <TextField
                fullWidth
                label="Interview Feedback"
                value={feedback}
                margin="normal"
                multiline
                rows={2}
                InputProps={{ readOnly: true }}
              />

              {/* Submit Interview Data to the backend */}
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={submitInterviewData}
                >
                  Submit Interview
                </Button>
              </Box>
            </Box>
            <Button
              className="close-modal"
              onClick={toggleModal}
              sx={{ mt: 2 }}
            >
              CLOSE
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
