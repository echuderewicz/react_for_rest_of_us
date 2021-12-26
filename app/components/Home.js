import React, { useEffect, useContext } from "react";
import Page from "./Page";
import StateContext from "../StateContext";
import { useImmer } from "use-immer";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Axios from "axios";
import { Link } from "react-router-dom";
//import DispatchContext from "../DispatchContext";

function Home() {
  const appState = useContext(StateContext);
  //const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchData() {
      try {
        const response = await Axios.post(
          "/getHomeFeed",
          {
            token: appState.user.token,
          },
          {
            cancelToken: ourRequest.token,
          }
        );
        //setProfileData(response.data);
        setState((draft) => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (e) {
        console.log("problem generated in catch: profile.js");
      }
    }
    fetchData();
    return () => {
      ourRequest.cancel();
    };
    //updated dependency array...to run first time component is rendered
  }, []);

  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <Page title="your feed">
      {state.feed.length > 0 && (
        <>
          <h2>The Latest from those you follow</h2>
          <div className="list-group">
            {state.feed.map((post) => {
              const date = new Date(post.createdDate);
              const dateFormatted = `${
                date.getMonth() + 1
              }/${date.getDate()}/${date.getFullYear()}`;

              return (
                <Link
                  key={post._id}
                  to={`/post/${post._id}`}
                  className="list-group-item list-group-item-action"
                >
                  <img className="avatar-tiny" src="post.author.avatar" />{" "}
                  <strong>{post.title}</strong>{" "}
                  <span className="text-muted small">
                    by {post.author.username} on {dateFormatted}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}
      {state.feed.length == 0 && (
        // jsx expression can have only (1) top level element, hence the fragment below <></>
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}
    </Page>
  );
}

export default Home;
