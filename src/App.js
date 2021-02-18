import React, { useEffect, useState } from "react";
import "./style.css";
import TreeSearch from "./TreeSearch";

export default function App() {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const getFakeData = searchValue => {
    fetch(
      "https://my-json-server.typicode.com/pratheeshpradeepkumars/mockjson/suggestions"
    )
      .then(response => response.json())
      .then(data => setOptions(data));
  };
  const handleSearch = searchValue => {
    setSearch(searchValue);
  };
  const getSuggestionSlection = obj => {
    setSearch(obj.suggestion_key.suggestion);
  };
  useEffect(() => {
    if (search !== "" && search.length > 0) {
      getFakeData(search);
    } else {
      setOptions([]);
    }
  }, [search]);
  return (
    <TreeSearch
      onSuggestionSearch={handleSearch}
      value={search}
      suggestions={options}
      onSuggestionSelected={getSuggestionSlection}
      height={200}
      placeholder={"-"}
    />
  );
}
