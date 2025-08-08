// Minh

import React, { useState } from "react";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom"; // Thêm import này

const SearchBar = ({ defaultValue = "" }) => { // Thêm prop defaultValue
  const [keyword, setKeyword] = useState(defaultValue);
  const navigate = useNavigate(); // Sử dụng navigate thay vì window.location

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${keyword}`); // Sử dụng navigate
    }
  };

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products, ..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          🔍
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
