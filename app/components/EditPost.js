import React, { useEffect, useState } from "react";
import { useImmerReducer } from "use-immer";
import Page from "./Page";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ViewSinglePost() {
  //2021-12-16T00:02:19.777Z
  //finding it hard to follow at this point
  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    loading: true,
    saveIsLoading: false,
    id: useParams().id,
    //keep track of how many times we send an axios request
    sendCount: 0,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        //action.value.title ("is a property on the object sent back in the axios request")
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.loading = false;
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token,
        });
        dispatch({ type: "fetchComplete", value: response.data });
      } catch (e) {
        console.log("problem generated in catch: ViewSinglePost.js");
      }
    }
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (isLoading) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );
  }

  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Page title="Edit Post">
      <form>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            value={post.title}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            value={post.body}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          />
        </div>

        <button className="btn btn-primary">Save Updates </button>
      </form>
    </Page>
  );
}

export default ViewSinglePost;
