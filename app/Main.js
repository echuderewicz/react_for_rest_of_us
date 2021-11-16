import React from "react";
import ReactDOM from "react-dom";

//import components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";

function Main() {
  return (
    <>
      <Header />
      <About />
      <Footer />
    </>
  );
}

//Let's start building our first app
//Routing (Single Page Applications)

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
