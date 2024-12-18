import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Send as SendIcon,
  // Mic as MicIcon,
  CopyAll as CopyIcon,
  // Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
// import { FaBriefcaseMedical } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { getAIResponse } from "../../utils";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  // const [isListening, setIsListening] = useState(false);
  const [file, setFile] = useState(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(true);
  const inputRef = useRef(null);
  const chatHistoryRef = useRef(null);
  const recognitionRef = useRef(null);

  const sampleQuestions = [
    {
      text: "Generate a SQL query to fetch the names of employees who joined after 2020.",
      // icon: <FaBriefcaseMedical className="sample-question-icon" />,
    },
    {
      text: "Suggest an itinerary for a 3-day trip to Paris, including must-see landmarks and activities.",
      // icon: <FaBriefcaseMedical className="sample-question-icon" />,
    },
    // {
    //   text: "Explain the benefits of exercise for mental health.",
    //   icon: <FaBriefcaseMedical className="sample-question-icon" />,
    // },
    // {
    //   text: "What are the symptoms of heart disease",
    //   icon: <FaBriefcaseMedical className="sample-question-icon" />,
    // },
  ];

  useEffect(() => {
    if (!isSending) {
      inputRef.current.focus();
    }
  }, [isSending]);

  useEffect(() => {
    chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = useCallback(
    async (event) => {
      event && event.preventDefault();
      if (!inputValue && !file) return;

      setIsSending(true);
      setError(null);

      const newMessage = {
        role: "user",
        content: inputValue,
        file: file ? URL.createObjectURL(file) : null,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      try {
        setIsTyping(true);
        const response = await getAIResponse(inputValue, file);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: response },
        ]);
      } catch (error) {
        console.error(error);
        setError("An error occurred while processing your request.");
      } finally {
        setIsSending(false);
        setIsTyping(false);
        setInputValue("");
        setFile(null);
      }
    },
    [inputValue, file]
  );

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setInputValue(speechToText);
        // setIsListening(false);

        // Automatically trigger the handleSubmit function
        handleSubmit();
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        // setIsListening(false);
      };
    }
  }, [handleSubmit]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !isSending) {
      handleSubmit(event);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // const handleVoiceInput = () => {
  //   if (recognitionRef.current) {
  //     if (isListening) {
  //       recognitionRef.current.stop();
  //       setIsListening(false);
  //     } else {
  //       recognitionRef.current.start();
  //       setIsListening(true);
  //     }
  //   } else {
  //     console.warn("Web Speech API is not supported in this browser.");
  //   }
  // };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleRetry = () => {
    setError(null);
    setIsSending(false);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSampleQuestionClick = async (question) => {
    setInputValue(question);
    setTimeout(() => {
      handleSubmit(); // Automatically submit the question
    }, 0);
  };

  const handleCloseDisclaimer = () => {
    setDisclaimerOpen(false);
  };

  return (
    <div className="chat-container">
      <Dialog open={disclaimerOpen} onClose={handleCloseDisclaimer}>
        <DialogTitle>Disclaimer</DialogTitle>
        <DialogContent>
          <DialogContentText>
          By using this chat application, you agree to the terms and
            conditions. The information provided is for general informational
            purposes only and is not a substitute for professional.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDisclaimer} color="primary">
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <div className="sample-questions">
        {sampleQuestions.map((question, index) => (
          <Card
            key={index}
            className="sample-question-card"
            onClick={() => handleSampleQuestionClick(question.text)}
          >
            <CardContent>
              {question.icon}
              {question.text}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="chat-history" ref={chatHistoryRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            <div className="chat-message-avatar">
              <img
                src={
                  message.role === "user"
                    ? "https://digitalt3.com/wp-content/uploads/2024/08/woman_16669873.png"
                    : "https://digitalt3.com/wp-content/uploads/2024/08/3d-render-flash-lightning-sale-thunder-bolt-icon-scaled.jpg"
                }
                alt={message.role}
                width="40"
                height="40"
              />
            </div>
            <div className="chat-message-content">
              <div className="chat-message-text">
                {message.role === "assistant" ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  message.content
                )}
                {message.file && (
                  <a
                    href={message.file}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="contained" color="primary">
                      View File
                    </Button>
                  </a>
                )}
              </div>
              <div className="chat-message-timestamp">
                {new Date().toLocaleTimeString()}
              </div>
              <CopyToClipboard text={message.content}>
                <IconButton size="small" className="chat-copy-button">
                  <CopyIcon />
                </IconButton>
              </CopyToClipboard>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-typing-indicator">
            <span>FlashAI is typing...</span>
          </div>
        )}
      </div>
      {error && (
        <div className="chat-error">
          <span>{error}</span>
          <Button variant="contained" color="primary" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      )}
      <form className="chat-input" onSubmit={handleSubmit}>
        <TextField
          className="chat-input-field"
          placeholder="Type your message..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isSending}
          inputRef={inputRef}
        />
        {/* <IconButton
          onClick={handleVoiceInput}
          className={`chat-voice-button ${isListening ? "listening" : ""}`}
        >
          {isListening ? <CloseIcon /> : <MicIcon />}
        </IconButton> */}
        <input
          accept="*"
          className="chat-file-input"
          id="file-input"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="file-input">
          {/* <IconButton component="span">
            <IoCloudUpload />
          </IconButton> */}
        </label>
        <Button
          className="chat-submit-button"
          type="submit"
          disabled={isSending || (!inputValue && !file)}
        >
          {isSending ? <CircularProgress size={24} /> : <SendIcon />}
        </Button>
        <IconButton onClick={handleClearChat} className="clear-chat-button">
          <DeleteIcon />
        </IconButton>
      </form>
    </div>
  );
};

export default Chat;
