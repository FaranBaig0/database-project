import { useParams } from "react-router-dom";
import Chat from "./Chat";
import SendMessage from "./SendMessage";
import "./css/ChatWrapper.css";

const ChatWrapper = () => {
  const { friendId } = useParams();

  return (
    <div className="chat-wrapper">
      {/* <header className="chat-header">
        <h2>💬 Chat with {friendId}</h2>
      </header> */}

      <main className="chat-main">
        <Chat friendId={friendId} />
      </main>

      <footer className="chat-footer">
        <SendMessage receiverId={friendId} />
      </footer>
    </div>
  );
};

export default ChatWrapper;
