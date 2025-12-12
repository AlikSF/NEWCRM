import React, { useState, useRef, useEffect } from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  icon,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.sublabel && option.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700/50 hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-left"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
          {selectedOption ? (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{selectedOption.label}</div>
              {selectedOption.sublabel && (
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{selectedOption.sublabel}</div>
              )}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-64">
            {filteredOptions.length > 0 ? (
              <div className="py-1">
                {filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      value === option.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                    }`}
                  >
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {option.label}
                      </div>
                      {option.sublabel && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {option.sublabel}
                        </div>
                      )}
                    </div>
                    {value === option.id && (
                      <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
