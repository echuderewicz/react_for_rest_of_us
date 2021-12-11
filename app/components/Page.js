import React, { useEffect } from "react";
import Container from "./Container";

function Page(props) {
  //only run this the first time the component is rendered
  useEffect(() => {
    document.title = `${props.title} | ComplexApp`;
    window.scrollTo(0, 0);
    //this addition below will instead run everytime the title changes
    //when it was only an empty [], it only ran the first render time
  }, [props.title]);

  //The container component is just a wrapper around the content
  //to display it either "wide" or normal.
  //Visually Rich Comments would be a way to provide
  //a sketch of this abstraction which could visually
  //show how the Container component gets nested into
  //the Page component and the the props.children get nested
  //within Container compoent below.

  return <Container wide={props.wide}>{props.children}</Container>;
}

export default Page;
