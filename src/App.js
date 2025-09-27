import { useEffect, useState } from 'react';
import WeatherApp from './WeatherApp';
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";


function App() {
  const [darkMode, setDarkMode] = useState(false);

   useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  return (
    <div className="App">
       {/* Toggle dark mode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-6 right-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full shadow hover:scale-105 transition-transform"
      >
         {darkMode ? (
          <SunIcon className="h-6 w-6 text-yellow-400" />
        ) : (
          <MoonIcon className="h-6 w-6 text-gray-800" />
        )}
      </button>
      <WeatherApp/>
    </div>
  );
}

export default App;
