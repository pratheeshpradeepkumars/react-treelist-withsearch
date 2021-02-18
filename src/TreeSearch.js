import React, { Component, createRef } from "react";
import lodash from "lodash";

class TreeSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSuggestion: false,
      searchValue: this.props.value,
      suggestions: [],
      cursor: 0
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

  highlightSearch = (string, subString) => {
    const substringRegx = new RegExp(subString, "ig");
    return string.replaceAll(substringRegx, match => {
      return match.toUpperCase();
    });
  };

  escapeRegExp = (str = "") => str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  highlight = ({ search = "", children = "" }) => {
    const patt = new RegExp(`(${this.escapeRegExp(search.trim())})`, "i");
    const parts = String(children).split(patt);

    if (search) {
      return parts.map((part, index) =>
        patt.test(part) ? <b key={index}>{part}</b> : part
      );
    } else {
      return children;
    }
  };

  renderSuggestions = option => {
    return (
      <>
        <li
          key={option.suggestion_key.suggestion}
          onClick={() => this.handleSuggestionSelected(option)}
          className="ft-as-list-item"
          tabIndex="0"
        >
          <this.highlight search={this.state.searchValue}>
            {option.suggestion_key.suggestion}
          </this.highlight>
        </li>
        {option.children && option.children.length > 0 && (
          <ul className="ft-as-list-con inner-ul">
            {option.children.map(opt => {
              return this.renderSuggestions(opt);
            })}
          </ul>
        )}
      </>
    );
  };

  handleKeyDown = e => {
    const { cursor, suggestions } = this.state;
    // arrow up/down button should select next/previous list element
    if (e.keyCode === 38 && cursor > 0) {
      this.setState(prevState => ({
        cursor: prevState.cursor - 1
      }));
    } else if (e.keyCode === 40 && cursor < suggestions.length - 1) {
      console.log("Sugg : ", suggestions.length);
      this.setState(prevState => ({
        cursor: prevState.cursor + 1
      }));
    }
  };

  render() {
    const { searchValue, showSuggestion, suggestions } = this.state;
    const height = this.props.height;
    console.log(this.state.cursor);
    return (
      <div className="ft-tree-search-container" ref={this.wrapperRef}>
        <input
          value={searchValue}
          onChange={this.handleSearch}
          onClick={this.handleSearchClick}
          placeholder={this.props.placeholder || ""}
          onKeyDown={this.handleKeyDown}
        />
        {showSuggestion &&
          suggestions &&
          suggestions.length > 0 &&
          searchValue !== "" && (
            <div
              className="auto-suggest-container"
              style={height ? { maxHeight: `${this.props.height}px` } : {}}
            >
              <ul className="ft-as-list-con outer-ul">
                {suggestions.map(option => this.renderSuggestions(option))}
              </ul>
            </div>
          )}
      </div>
    );
  }
}

export default TreeSearch;
