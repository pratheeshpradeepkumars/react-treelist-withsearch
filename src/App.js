import React, { useEffect, useState } from "react";
import "./style.css";
import TreeSearch from "./TreeSearch";

let model = [
  {
    suggestion_key: {
      suggestion: "fever" + Math.floor(Math.random() * 101),
      description: ""
    },
    children: [
      {
        suggestion_key: {
          suggestion: "fever" + Math.floor(Math.random() * 101),
          description: ""
        },
        children: []
      },
      {
        suggestion_key: {
          suggestion: "fever" + Math.floor(Math.random() * 101),
          description: ""
        },
        children: [
          {
            suggestion_key: {
              suggestion: "newFever" + Math.floor(Math.random() * 101),
              description: ""
            },
            children: []
          }
        ]
      }
    ]
  },
  {
    suggestion_key: {
      suggestion: "Cough" + Math.floor(Math.random() * 101),
      description: ""
    },
    children: [
      {
        suggestion_key: {
          suggestion: "Cough" + Math.floor(Math.random() * 101),
          description: ""
        }
      }
    ]
  }
];
let counter = 0;
export default function App() {
  const [search, setSearch] = useState("sho");
  const [options, setOptions] = useState([]);
  const getFakeData = searchValue => {
    fetch(
      "https://my-json-server.typicode.com/pratheeshpradeepkumars/mockjson/suggestions"
    )
      .then(response => response.json())
      .then(data => {
        counter++;
        if (counter % 2 === 0) {
          setOptions(model);
          console.log("Model", model);
        } else {
          setOptions(data);
        }
      });
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
