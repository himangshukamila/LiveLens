import Webcam from "react-webcam";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import "./CameraPage.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const EMOJIS = [
  { id: "heart_eyes", emoji: "😍" },
  { id: "fire", emoji: "🔥" },
  { id: "thumbsup", emoji: "👍" },
  { id: "heart", emoji: "❤️" },
  { id: "beaming", emoji: "😁" },
  { id: "kiss", emoji: "😘" },
];

function CameraPage() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    if (socket.connected) {
      setConnected(true);
      socket.emit("register", "controller");
    } else {
      socket.connect();
    }

    const onConnect = () => {
      setConnected(true);
      socket.emit("register", "controller");
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    const onConnectError = () => {
      setConnected(false);
    };

    const onRedirect = () => {
      setImage(null);
      setShowEmoji(false);
      navigate("/");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("redirect_to_login", onRedirect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("redirect_to_login", onRedirect);
    };
  }, []);

  function capture() {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }

  function retake() {
    setImage(null);
    setShowEmoji(false);
  }

  async function handleSubmit() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${SERVER_URL}/api/images/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ image }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowEmoji(true);
      } else {
        alert("Upload failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  }

  function sendEmoji(id, emoji) {
    if (!socket.connected) return;

    socket.emit("emoji_reaction", { emojiId: id, emoji });
  }

  return (
    <div className="camera-container">
      <div className="socket-status">
        <span className="status-text">
          {connected ? "Connected" : "Disconnected"}
        </span>
        <span
          className={
            connected
              ? "status-dot status-connected"
              : "status-dot status-disconnected"
          }
        />
      </div>

      <h1 className="camera-title">Capture your moment</h1>

      <div className="camera-card">
        <div className="camera-preview">
          {image ? (
            <img src={image} alt="preview" />
          ) : (
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
          )}
        </div>

        <div className="camera-buttons">
          {!image && (
            <button onClick={capture} className="capture-btn">
              Capture
            </button>
          )}

          {image && !showEmoji && (
            <>
              <button onClick={retake} className="retake-btn">
                Retake
              </button>

              <button onClick={handleSubmit} className="submit-btn">
                Submit
              </button>
            </>
          )}
        </div>

        {showEmoji && (
          <div className="emoji-section">
            <p className="emoji-title">React to your photo</p>

            <div className="emoji-container">
              {EMOJIS.map(({ id, emoji }) => (
                <button
                  key={id}
                  onClick={() => sendEmoji(id, emoji)}
                  className="emoji-btn"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CameraPage;
