import { useState } from "react";
import "./ChatBot.css";
import {
  Avatar,
  Button,
  Input,
  Spinner,
  makeStyles,
} from "@fluentui/react-components";
import { SendFilled } from "@fluentui/react-icons";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const constInfo =
  "Your name is Guac. You are a chat assistant recommending exercises and lifts to our Power Pit fitness app users based on their desired muscle groups or goals.";
const useStyles = makeStyles({
  send: {},
  input: {
    width: "18rem",
  },
});
const ChatBot = () => {
  const styles = useStyles();
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am Guac the personal fitness",
      sender: "ChatGPT",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = async () => {
    if (inputValue.trim() === "") return;

    const newMessage = {
      message: inputValue,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);
    await processMessageToChatGPT(newMessages);
    setInputValue(""); // Reset input value here
  };

  async function processMessageToChatGPT(chatMessages: any) {
    let apiMessages = chatMessages.map((messageObject: any) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: constInfo,
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    const data = await response.json();
    setMessages([
      ...chatMessages,
      {
        message: data.choices[0].message.content,
        sender: "ChatGPT",
      },
    ]);
    setTyping(false);
  }

  return (
    <div className="chat-container">
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <Avatar className="avatarChat" />
            <div className="message-content">{msg.message}</div>
          </div>
        ))}
        {typing && (
          <div className="message ChatGPT">
            <Spinner size="small" labelPosition="after" label="Thinking..." />
          </div>
        )}
      </div>

      <div className="input-container">
        <Input
          type="text"
          placeholder="Ask Guac"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onClick={handleSend}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          className={styles.input}
        />
        <Button
          className={styles.send}
          onClick={handleSend}
          icon={<SendFilled />}
        ></Button>
      </div>
    </div>
  );
};

export default ChatBot;
