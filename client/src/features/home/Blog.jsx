import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BlogCards from "./BlogCards";
import BlogSearch from "./BlogSearch";

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  // Initialize search from URL
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Handle search input changes
  const handleSearchInput = e => {
    setSearch(e.target.value);
    setSearchParams({ search: e.target.value }); // Update URL in real-time
  };

  // Execute search (this can be used for button click or enter press)
  const executeSearch = () => setSearchParams({ search });

  return (
    <div className="mt-16 container mx-auto">
      <BlogSearch
        search={search}
        handleSearchInput={handleSearchInput}
        executeSearch={executeSearch}
      />
      <BlogCards search={search} />
    </div>
  );
};

export default Blog;
