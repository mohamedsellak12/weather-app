import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    onSearch(input); // remonte la ville vers le parent
    setInput("");
  };

  return (
   <form
  onSubmit={handleSubmit}
  className="flex gap-2 mt-6 mb-6 justify-center"
>
  <input
    type="text"
    placeholder="Rechercher une ville..."
    value={input}
    onChange={(e) => setInput(e.target.value)}
    className="p-3 rounded-l-xl shadow-md focus:outline-none w-64
               bg-white text-gray-800 placeholder-gray-400
               dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-300
               transition-colors duration-300"
  />
  <button
    type="submit"
    className="bg-blue-500 text-white p-3 rounded-r-xl shadow-md
               hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500
               transition-colors duration-300"
  >
    Search
    
  </button>
</form>

  );
}
