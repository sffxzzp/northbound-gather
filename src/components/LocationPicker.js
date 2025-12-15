"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";


export default function LocationPicker({ value, onChange }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Sync internal query with external value if it changes externally
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Debounce Autocomplete Fetch
  useEffect(() => {
    // Only search if query is different from current value (to avoid searching selected item)
    // AND query length > 2
    if (query === value || query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
        if (data.length > 0) setIsOpen(true);
      } catch (error) {
        console.error("Autocomplete fetch error:", error);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query, value]);

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setQuery(newVal);
    onChange(newVal); // Propagate text immediately to form state
    if (!isOpen) setIsOpen(true);
  };

  const handleSelect = (suggestion) => {
    const formattedDate = suggestion.display_name;
    setQuery(formattedDate);
    onChange(formattedDate);
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <input 
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          placeholder="Search for a location..."
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-card border border-border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li 
              key={item.place_id}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-muted cursor-pointer text-sm border-b border-border last:border-0"
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
