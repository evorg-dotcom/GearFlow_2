import React, { useState, useEffect } from 'react';
import { X, Filter, Search, ArrowRight, ArrowLeft } from 'lucide-react';

interface FilterSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: {
    searchTerm: string;
    selectedCategory: string;
    selectedDifficulty: string;
    selectedMake: string;
    selectedBrand: string;
    priceRange: [number, number];
    sortBy: string;
  };
  onApplyFilters: (filters: FilterSortModalProps['currentFilters']) => void;
  categoryOptions: string[];
  difficulties: string[];
  makes: string[];
  brands: string[];
  sortOptions: { value: string; label: string }[];
}

const FilterSortModal: React.FC<FilterSortModalProps> = ({
  isOpen,
  onClose,
  currentFilters,
  onApplyFilters,
  categoryOptions,
  difficulties,
  makes,
  brands,
  sortOptions,
}) => {
  const [searchTerm, setSearchTerm] = useState(currentFilters.searchTerm);
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.selectedCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState(currentFilters.selectedDifficulty);
  const [selectedMake, setSelectedMake] = useState(currentFilters.selectedMake);
  const [selectedBrand, setSelectedBrand] = useState(currentFilters.selectedBrand);
  const [priceRange, setPriceRange] = useState<[number, number]>(currentFilters.priceRange);
  const [sortBy, setSortBy] = useState(currentFilters.sortBy);

  // Update internal state when currentFilters prop changes (e.g., when modal is opened with new initial values)
  useEffect(() => {
    setSearchTerm(currentFilters.searchTerm);
    setSelectedCategory(currentFilters.selectedCategory);
    setSelectedDifficulty(currentFilters.selectedDifficulty);
    setSelectedMake(currentFilters.selectedMake);
    setSelectedBrand(currentFilters.selectedBrand);
    setPriceRange(currentFilters.priceRange);
    setSortBy(currentFilters.sortBy);
  }, [currentFilters]);

  const handleApply = () => {
    onApplyFilters({
      searchTerm,
      selectedCategory,
      selectedDifficulty,
      selectedMake,
      selectedBrand,
      priceRange,
      sortBy,
    });
    onClose();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedMake('all');
    setSelectedBrand('all');
    setPriceRange([0, 5000]);
    setSortBy('popular');
  };

  if (!isOpen) return null;

  const formatCategoryName = (categoryId: string) => {
    // This function should ideally be passed as a prop or imported from a shared utility
    // For now, a basic implementation is provided.
    if (categoryId === 'all') return 'All Categories';
    return categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Filter & Sort Parts</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Filters Content */}
        <div className="p-6 space-y-6">
          {/* Search */}
          <div>
            <label htmlFor="modalSearchTerm" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                id="modalSearchTerm"
                placeholder="Search parts, brands, or car models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="modalCategory" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="modalCategory"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categoryOptions.map(category => (
                <option key={category} value={category}>
                  {formatCategoryName(category)}
                </option>
              ))}
            </select>
          </div>

          {/* Make */}
          <div>
            <label htmlFor="modalMake" className="block text-sm font-medium text-gray-700 mb-2">
              Car Make
            </label>
            <select
              id="modalMake"
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {makes.map(make => (
                <option key={make} value={make}>
                  {make === 'all' ? 'All Makes' : make}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="modalBrand" className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <select
              id="modalBrand"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>
                  {brand === 'all' ? 'All Brands' : brand}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label htmlFor="modalDifficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Installation Difficulty
            </label>
            <select
              id="modalDifficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="modalSortBy" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="modalSortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Reset Filters
          </button>
          <button
            onClick={handleApply}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
          >
            Apply Filters
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSortModal;
