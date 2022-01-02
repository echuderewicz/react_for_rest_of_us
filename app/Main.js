import React, { useState, useReducer, useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";

//contexts
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";

//import components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
//import CreatePost from "./components/CreatePost";
//the below really just contains a promise
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));

import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
// import Search from "./components/Search";
//import Chat from "./components/Chat";
import LoadingDotsIcon from "./components/LoadingDotsIcon";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar"),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };

  function ourReducer(immerDraft, action) {
    //immer creates a draft of state and so you can mutate it
    switch (action.type) {
      case "login":
        immerDraft.loggedIn = true;
        immerDraft.user = action.data;
        return;
      case "logout":
        immerDraft.loggedIn = false;
        return;
      case "flashmessage":
        //we use push instead of concat since it's immerDraft that we CAN mutate.
        immerDraft.flashMessages.push(action.value);
        return;
      case "openSearch":
        immerDraft.isSearchOpen = true;
        return;
      case "closeSearch":
        immerDraft.isSearchOpen = false;
        return;
      case "toggleChat":
        immerDraft.isChatOpen = !immerDraft.isChatOpen;
        return;
      case "closeChat":
        immerDraft.isChatOpen = false;
        return;
      case "incrementUnreadChatCount":
        immerDraft.unreadChatCount++;
        return;
      case "clearUnreadChatCount":
        immerDraft.unreadChatCount = 0;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappToken", state.user.token);
      localStorage.setItem("complexappUsername", state.user.username);
      localStorage.setItem("complexappAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("complexappToken");
      localStorage.removeItem("complexappUsername");
      localStorage.removeItem("complexappAvatar");
    }
    //the change in value of this argument will trigger function above running
    //keep in mind that the below value: state.loggedIn must be in an array
  }, [state.loggedIn]);

  //check if token has expired or not on first render

  useEffect(() => {
    if (state.loggedIn) {
      //cancel token to cancel axios request
      //if this component unmounts in the middle of the request
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/checkToken",
            {
              token: state.user.token,
            },
            { cancelToken: ourRequest.token }
          );
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({
              type: "flashmessage",
              value: "Your session has expired. Please log in again",
            });
          }
        } catch (e) {
          console.log("there was a problem or the request was canceled");
        }
      }

      fetchResults();

      return () => ourRequest.cancel();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          {/* Header kicks it all off */}
          <Header />
          <Suspense fallback={"nut"}>
            <Switch>
              {/* the use variable username shows in detructure line in profile */}
              <Route path="/profile/:username">
                <Profile />
              </Route>

              {/* login...true Home...false HomeGuest */}
              <Route path="/" exact>
                {state.loggedIn ? <Home /> : <HomeGuest />}
              </Route>

              {/* create post */}
              <Route path="/create-post">
                <CreatePost />
              </Route>

              {/* display individual post just created */}
              <Route path="/post/:id" exact>
                <ViewSinglePost />
              </Route>

              {/* edit a post */}
              <Route path="/post/:id/edit" exact>
                <EditPost />
              </Route>

              {/* about us */}
              <Route path="/about-us">
                <About />
              </Route>

              {/* terms */}
              <Route path="/terms">
                <Terms />
              </Route>

              {/* catch all */}
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
          {/* initial state of isSearchOpen is false */}
          {/* {state.isSearchOpen ? <Search /> : ""} */}
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}

//Udemy React For The Rest Of Us - Sections

//Let's start building our first app

//Routing (Single Page Applications)
//20. Create a Reusable "Container" Component
//21. Quick Details & Composition
//29. Sending a Request From the Front-End
//30. Access Form Field Values with React
//32. Render Different Components Depending on State
//38. Context
//41. What is Immer?
//42. useEffect Practice

//Section 7: Actually Building Our App
//43. Profile Screen
//44. Load Posts by Author
//45. Make Single Post Screen Actually Load the Real Content
//46. Animated Loading Icon
//47. Cleaning Up After Ourselves
//48. Markdown in React

//Section 8: Edit and Delete Post Actions
//49. Adding Tooltips on Hover for Actions
//50. Edit (Update) Post Component
//51. Edit Post Continued
//52. Client-Side Form Validation
//53. Quick Attention To Detail Features
//54. Delete a Post

//Section 9: Search Overlay
//55. Setting Up Search Overlay
//56. React Transition Group (CSS Transition)
//57. Regarding The Index In The Next Lesson
//58. Waiting for User To Stop Typing
//59. Finishing Search (Part 1)
//60. Finishing Search (Part 2)

//Section 10: Letting Users Follow Each Other
//61. Follow User Feature
//62. Profile Followers and Following Tabs
//63. Homepage Post Feed

//Section 11: Building a Live Chat Feature
//64. Live Chat User Interface
//65. Sending & Receiving Chats (Part 1)
//66. Sending & Receiving Chats (Part 2)
//67. Finishing Chat

//Section 12: Registration Form Validation
//68. Improving Registration Form
//69. Finishing Registration Form (Part 1)
//70. Quick Note About If Statement
//71. Finishing Registration Form (Part 2)
//72. Quick Flash Message Details
//73. Proactively Check If Token Has Expired

//Section 13: Getting Ready To Go Live
//74. React Suspense - Lazy Loading (part 1)
//75. React Suspense - Lazy Loading (part 2) - CURRENT
//76. Note About Suspense for Data fetching
//77. Building a "Dist" Copy of Our Site
//78. React Outside of the Browser (Part 1)
//79. React Outside of the Browser (Part 2)
//80. Pushing Our API Backend Server Up To The Web
//81. Pushing Our react Front-End Up To The Web

//Section 14: Extra Credit Ideas/Challenges
//82. Welcome To The Extra Credit Section
//83. Profile Not Found Situation
//84. Login Form: Highlight Empty Fields With Red Border
//85. Allow For Other Color of Flash Messages (Not Only Green)
