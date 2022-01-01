import React, { useEffect, useContext, useRef } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
//this below will establish an ongoing connection
//with the backend server and the browser
const socket = io("http://localhost:8080");

function Chat() {
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  //some local, component centric state management
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: [],
  });

  //this useEffect runs immediately on chat
  //component render pulling in any message
  //sent out AFTER any of my apps browser refresh

  useEffect(() => {
    socket.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message);
      });
    });
  }, []);

  //Making sure to focus the chat field
  useEffect(() => {
    //below will focus the chat input field if the
    //chat is already open
    if (appState.isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "clearUnreadChatCount" });
    } else {
    }
    //looks for changes
  }, [appState.isChatOpen]);

  useEffect(() => {
    //related to scrolling
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    //related to incrementing unread chats
    if (state.chatMessages.length > 1 && !appState.isChatOpen) {
      appDispatch({ type: "incrementUnreadChatCount" });
    }
  }, [state.chatMessages]);

  function handleFieldChange(e) {
    //state updated with every change to field
    //console.log(e.target.value);
    //Brad referred to this as a synthetic event...weird
    const value = e.target.value;
    setState((draft) => {
      draft.fieldValue = value;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    //Send message to chat server
    console.log(state.fieldValue);
    socket.emit("chatFromBrowser", {
      message: state.fieldValue,
      token: appState.user.token,
    });
    setState((draft) => {
      // Add message to state collection of messages
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: appState.user.username,
        avatar: appState.user.avatar,
      });
      //empties out
      draft.fieldValue = "";
    });
  }

  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper  shadow border-top border-left border-right " +
        (appState.isChatOpen ? "chat-wrapper--is-visible" : "")
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span
          onClick={() => {
            appDispatch({ type: "closeChat" });
          }}
          className="chat-title-bar-close"
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          // if the message is from the current user
          // return the below jsx
          if (message.username == appState.user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }

          // if the message is from another a different
          // user than return this jsx below

          return (
            <div key={index} className="chat-other">
              <Link to={`/profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username} </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          // this is now considered a controlled input
          //when you add the value attribute
          value={state.fieldValue}
          onChange={handleFieldChange}
          ref={chatField}
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
        />
      </form>
    </div>
  );
}

export default Chat;
