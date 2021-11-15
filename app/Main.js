import React from "react";
import ReactDOM from "react-dom";

//import components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";

function ExampleComponent() {
  return (
    <>
      <Header />
      <HomeGuest />
      <Footer />
    </>
  );
}

//Let's start building our first app
//Routing (Single Page Applications)

ReactDOM.render(<ExampleComponent />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
