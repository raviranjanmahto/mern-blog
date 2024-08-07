import { useEffect, useRef } from "react";

const BlogSearch = ({ search, handleSearchInput, executeSearch }) => {
  const inputRef = useRef(null); // Create a ref for the input field

  // Handle key press event for Enter key
  const handleKeyDown = e => {
    if (e.key === "Enter") executeSearch(); // Execute search on Enter key press
  };

  // Handle global keydown event for Ctrl+K
  useEffect(() => {
    const handleGlobalKeyDown = e => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault(); // Prevent the default browser behavior
        inputRef.current?.focus(); // Focus the search input
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Handle click event for the Clear button
  const handleClearSearch = () => {
    handleSearchInput({ target: { value: "" } }); // Clear the search input
    inputRef.current?.focus(); // Optionally refocus the input field
  };

  return (
    <div className="w-full flex gap-2 items-center">
      <div className="relative w-full">
        <input
          type="text"
          value={search}
          onChange={handleSearchInput} // Trigger search on input change
          onKeyDown={handleKeyDown} // Trigger search on Enter key press
          placeholder="Search for a blog post..."
          className="py-2 px-4 w-full bg-bgPrimary border focus:outline-none focus:border-green-700 pr-32 box-border" // Add border and other styles
          ref={inputRef} // Attach the ref to the input
        />
        <span className="absolute right-2 top-2.5 bg-gray-400 text-white text-xs px-2 py-1 rounded">
          Ctrl+K
        </span>
      </div>
      {search && (
        <button
          onClick={handleClearSearch}
          className="py-2 px-8 bg-red-600 text-white hidden md:flex"
        >
          Clear
        </button>
      )}
      <button
        onClick={executeSearch} // Trigger search on button click
        disabled={!search}
        className="py-2 px-8 bg-blue-600 text-white disabled:bg-gray-400 hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
};

export default BlogSearch;
