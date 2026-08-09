import { useState, useEffect, useRef } from 'react';

export default function LocationSearch({ placeholder, value, onChange }) {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
                const data = await res.json();
                setSuggestions(data);
                setShowDropdown(true);
            } catch (error) {
                console.error("Search error:", error);
            }
        }, 500);

        return () => clearTimeout(timeoutRef.current);
    }, [query]);

    const handleSelect = (place) => {
        setQuery(place.display_name);
        setShowDropdown(false);
        onChange(place.display_name);
    };

    return (
        <div className="relative w-full">
            <input 
                type="text" 
                placeholder={placeholder}
                className="w-full p-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
            />
            
            {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-14 left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                    {suggestions.map((place, index) => (
                        <div 
                            key={index}
                            className="p-3 border-b border-gray-50 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 transition"
                            onClick={() => handleSelect(place)}
                        >
                            {place.display_name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}