import React, { useEffect, useContext } from "react";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import Axios from "axios";

function Search() {
  const appDispatch = useContext(DispatchContext);

  const [state, setstate] = useImmer({
    searchTerm: "",
    //posts that match the search term will live in the results property
    results: [],
    //will be set to either "loadingIcon" or "results"
    show: "neither",
    requestCount: 0,
  });

  //useEffect #1: run only the first time this component is rendered
  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler);
    return () => {
      document.removeEventListener("keyup", searchKeyPressHandler);
    };
  }, []);

  //useEffect #2:
  //the below use effect handles the waiting
  //for the user to stop typing

  useEffect(() => {
    const delay = setTimeout(() => {
      setstate((draft) => {
        //once typing ceases
        //requestCount is incremented
        draft.requestCount++;
      });
      console.log(state.searchTerm);
    }, 3000);

    //cleanup will get initiated prior the above code
    //running again due to another key being pressed
    return () => clearTimeout(delay);
  }, [state.searchTerm]);

  //useEffect #3: Watches for the change
  //in state of requestCount and then
  //fires the axios request.

  useEffect(() => {
    if (state.requestCount) {
      //cancel token to cancel axios request
      //if this component unmounts in the middle of the request
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/search",
            {
              searchTerm: state.searchTerm,
            },
            { cancelToken: ourRequest.token }
          );
          console.log(response.data);
        } catch (e) {
          console.log("there was a problem or the request was canceled");
        }
      }
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.requestCount]);

  function searchKeyPressHandler(e) {
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" });
    }
  }

  function handleInput(e) {
    const value = e.target.value;
    setstate((draft) => {
      draft.searchTerm = value;
    });
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            onChange={handleInput}
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
          />
          <span
            onClick={() => {
              appDispatch({ type: "closeSearch" });
            }}
            className="close-live-search"
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className="live-search-results live-search-results--visible">
            <div className="list-group shadow-sm">
              <div className="list-group-item active">
                <strong>Search Results</strong> (3 items found)
              </div>
              <a href="#" className="list-group-item list-group-item-action">
                <img
                  className="avatar-tiny"
                  src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
                />{" "}
                <strong>Example Post #1</strong>
                <span className="text-muted small">by brad on 2/10/2020 </span>
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                <img
                  className="avatar-tiny"
                  src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"
                />{" "}
                <strong>Example Post #2</strong>
                <span className="text-muted small">
                  by barksalot on 2/10/2020{" "}
                </span>
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                <img
                  className="avatar-tiny"
                  src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
                />{" "}
                <strong>Example Post #3</strong>
                <span className="text-muted small">by brad on 2/10/2020 </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
