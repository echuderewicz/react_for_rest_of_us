import React, { useEffect, useContext } from "react";
import Page from "./Page";
import StateContext from "../StateContext";
import { useImmer } from "use-immer";

function Home() {
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchData() {
      try {
        const response = await Axios.post(
          `/profile/${username}`,
          {
            token: appState.user.token,
          },
          {
            cancelToken: ourRequest.token,
          }
        );
        //setProfileData(response.data);
        setState((draft) => {
          draft.profileData = response.data;
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

  return (
    <Page title="your feed">
      <h2 className="text-center">
        Hello <strong>{appState.user.username}</strong>, your feed is empty.
      </h2>
      <p className="lead text-muted text-center">
        Your feed displays the latest posts from the people you follow. If you
        don&rsquo;t have any friends to follow that&rsquo;s okay; you can use
        the &ldquo;Search&rdquo; feature in the top menu bar to find content
        written by people with similar interests and then follow them.
      </p>
    </Page>
  );
}

export default Home;
