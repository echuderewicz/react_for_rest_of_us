import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
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
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar"),
    },
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

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
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
          </Switch>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
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
//52. Client-Side Form Validation - CURRENT
//53. Quick Attention To Detail Features
//54. Delete a Post

//Section 9: Search Overlay
//55.
//56.
//57.
//58.
//59.
//60.

//Section 10: Letting Users Follow Each Other
//61.
//62.
//62.
//63.

//Section 11: Building a Live Chat Feature
//64.
//65.
//66.
//67.

//Section 12: Registration Form Validation
//68.
//69.
//70.
//71.
//72.
//73.

//Section 13: Getting Ready To Go Live
//74.
//75.
//76.
//77.
//78.
//79.
//80.
//81.

//Section 14: Extra Credit Ideas/Challenges
//82.
//83.
//84.
//85.

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
