import React, { Component, createRef } from "react";
import lodash from "lodash";

class TreeSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSuggestion: false,
      searchValue: this.props.value,
      suggestions: []
    };
    this.wrapperRef = createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate() {
    if (!lodash.isEqual(this.props.suggestions, this.state.suggestions)) {
      console.log("DATA", this.props.suggestions);
      this.setState({ suggestions: this.props.suggestions }, () => {
        if (this.props.suggestions.length > 0) {
          this.setState({ showSuggestion: true });
        }
      });
    }
    if (this.state.searchValue !== this.props.value) {
      this.setState({ searchValue: this.props.value });
    }
  }

  componentWillUnMount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    const { current: wrap } = this.wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      this.setState({ showSuggestion: false });
    }
  };

  handleSearch = event => {
    const value = event.target.value;
    this.clearSuggestion(() => {
      this.setState({ searchValue: value }, () => {
        this.props.onSuggestionSearch(value);
      });
    });
  };

  handleSearchClick = event => {
    const { searchValue } = this.state;
    if (searchValue !== "") {
      this.setState({ showSuggestion: true });
    }
  };

  clearSuggestion = callback => {
    this.setState({ showSuggestion: false, suggestions: [] }, () => callback());
  };

  handleSuggestionSelected = obj => {
    this.props.onSuggestionSelected(obj);
    this.setState({ showSuggestion: false });
  };

  render() {
    const { searchValue, showSuggestion, suggestions } = this.state;
    return (
      <div className="ft-tree-search-container" ref={this.wrapperRef}>
        <input
          value={searchValue}
          onChange={this.handleSearch}
          onClick={this.handleSearchClick}
        />
        {showSuggestion &&
          suggestions &&
          suggestions.length > 0 &&
          searchValue !== "" && (
            <div className="auto-suggest-container">
              <ul>
                {suggestions.map(option => (
                  <li
                    key={option.suggestion_key.suggestion}
                    onClick={() => this.handleSuggestionSelected(option)}
                  >
                    {option.suggestion_key.suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    );
  }
}

export default TreeSearch;
