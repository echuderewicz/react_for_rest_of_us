import React, { useEffect, useContext } from "react";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import { Link } from "react-router-dom";
import Post from "./Post";

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
    //as long as the field is not blank, it will be set to true
    if (state.searchTerm.trim()) {
      setstate((draft) => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setstate((draft) => {
          //once typing ceases
          //requestCount is incremented
          draft.requestCount++;
        });
        console.log(state.searchTerm);
      }, 750);

      //cleanup will get initiated prior the above code
      //running again due to another key being pressed
      return () => clearTimeout(delay);
    } else {
      setstate((draft) => {
        draft.show = "neither";
      });
    }
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
          setstate((draft) => {
            draft.results = response.data;
            //this will cause the fetched results to display
            //and the spinning loader icon will hide
            draft.show = "results";
            console.log(response.data);
          });
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
    <>
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
          <div
            // based on loading flag certain classes will dipslay based on terniary
            className={
              "circle-loader " +
              (state.show == "loading" ? "circle-loader--visible" : "")
            }
          ></div>
          <div
            className={
              "live-search-results " +
              (state.show == "results" ? "live-search-results--visible" : "")
            }
          >
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length}{" "}
                  {state.results.length > 1 ? "items " : "item "}
                  found)
                </div>
                {state.results.map((post) => {
                  return (
                    <Post
                      post={post}
                      key={post._id}
                      onClick={() => appDispatch({ type: "closeSearch" })}
                    />
                  );
                })}
              </div>
            )}
            {!Boolean(state.results.length) && (
              <p className="alert alert-danger text-center shadwo-sm">
                Sorry, we could not find any results for that search
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
