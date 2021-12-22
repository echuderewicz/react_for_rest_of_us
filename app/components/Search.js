import React, { useEffect } from "react";

function Search() {
  return (
    <div class="search-overlay">
      <div class="search-overlay-top shadow-sm">
        <div class="container container--narrow">
          <label for="live-search-field" class="search-overlay-icon">
            <i class="fas fa-search"></i>
          </label>
          <input
            autofocus
            type="text"
            autocomplete="off"
            id="live-search-field"
            class="live-search-field"
            placeholder="What are you interested in?"
          />
          <span class="close-live-search">
            <i class="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div class="search-overlay-bottom">
        <div class="container container--narrow py-3">
          <div class="live-search-results live-search-results--visible">
            <div class="list-group shadow-sm">
              <div class="list-group-item active">
                <strong>Search Results</strong> (3 items found)
              </div>
              <a href="#" class="list-group-item list-group-item-action">
                <img
                  class="avatar-tiny"
                  src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
                />{" "}
                <strong>Example Post #1</strong>
                <span class="text-muted small">by brad on 2/10/2020 </span>
              </a>
              <a href="#" class="list-group-item list-group-item-action">
                <img
                  class="avatar-tiny"
                  src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"
                />{" "}
                <strong>Example Post #2</strong>
                <span class="text-muted small">by barksalot on 2/10/2020 </span>
              </a>
              <a href="#" class="list-group-item list-group-item-action">
                <img
                  class="avatar-tiny"
                  src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
                />{" "}
                <strong>Example Post #3</strong>
                <span class="text-muted small">by brad on 2/10/2020 </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
