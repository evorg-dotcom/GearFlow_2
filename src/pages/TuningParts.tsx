import React, { useState, useEffect } from 'react';
import { Search, Filter, Wrench, Zap, DollarSign, Clock, TrendingUp, Award, Truck, ArrowLeft, Shield, CheckCircle, AlertTriangle, Package, Users, ExternalLink, Heart, Eye, Bookmark, Info, ShoppingCart } from 'lucide-react';
import { tuningPartsDatabase, categories, popularBrands, safetyDisclaimers, type TuningPart } from '../data/tuningPartsDatabase';
import FilterSortModal from './FilterSortModal'; // Corrected import path

const TuningParts: React.FC = () => {
  const [parts, setParts] = useState<TuningPart[]>([]);
  const [filteredParts, setFilteredParts] = useState<TuningPart[]>([]);
  const [selectedPart, setSelectedPart] = useState<TuningPart | null>(null);
  
  // State for filters and sort, now managed here and passed to modal
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedMake, setSelectedMake] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState('popular');

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'installation' | 'reviews'>('overview');
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showFilterSortModal, setShowFilterSortModal] = useState(false); // New state for modal visibility

  const categoryOptions = ['all', ...categories.map(cat => cat.id)];
  const difficulties = ['all', 'easy', 'medium', 'hard', 'expert'];
  const makes = ['all', 'Honda', 'Toyota', 'BMW', 'Audi', 'Volkswagen', 'Subaru', 'Ford', 'Chevrolet', 'Nissan', 'Mazda', 'Hyundai', 'Mercedes-Benz', 'Porsche', 'Mitsubishi'];
  const brands = ['all', ...popularBrands];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'brand', label: 'Brand A-Z' },
    { value: 'make', label: 'Car Make A-Z' },
    { value: 'newest', label: 'Newest First' }
  ];

  // Trusted automotive retailers
  const getRetailerLinks = (part: TuningPart) => {
    const retailers = [
      {
        name: 'Summit Racing',
        url: `https://www.summitracing.com/search/brand/${encodeURIComponent(part.brand)}/part-number/${encodeURIComponent(part.partNumber || part.name)}`,
        description: 'Performance parts specialist',
        logo: '🏁'
      },
      {
        name: 'JEGS',
        url: `https://www.jegs.com/s?query=${encodeURIComponent(part.partNumber || part.name || part.brand)}`,
        description: 'High-performance automotive',
        logo: '⚡'
      },
      {
        name: 'AutoZone',
        url: `https://www.autozone.com/search?searchText=${encodeURIComponent(part.partNumber || part.name || part.brand)}`,
        description: 'Auto parts and accessories',
        logo: '🔧'
      },
      {
        name: 'RockAuto',
        url: `https://www.rockauto.com/en/parts/search?query=${encodeURIComponent(part.partNumber || part.name || part.brand)}`,
        description: 'Discount auto parts',
        logo: '🪨'
      },
      {
        name: 'FCP Euro',
        url: `https://www.fcpeuro.com/search?query=${encodeURIComponent(part.brand + ' ' + part.partNumber)}`,
        description: 'European auto parts',
        logo: '🇪🇺'
      }
    ];

    // Add brand-specific retailers
    if (part.brand === 'K&N') {
      retailers.unshift({
        name: 'K&N Official Store',
        url: `https://www.knfilters.com/search?q=${encodeURIComponent(part.partNumber || part.name)}`,
        description: 'Official K&N store',
        logo: '🏪'
      });
    } else if (part.brand === 'Brembo') {
      retailers.unshift({
        name: 'Brembo Official',
        url: `https://www.brembo.com/en/car/aftermarket/products`,
        description: 'Official Brembo store',
        logo: '🏪'
      });
    } else if (part.brand === 'COBB') {
      retailers.unshift({
        name: 'COBB Tuning',
        url: `https://www.cobbtuning.com/products/${encodeURIComponent(part.name.toLowerCase().replace(/\s+/g, '-'))}`,
        description: 'Official COBB store',
        logo: '🏪'
      });
    }

    return retailers.slice(0, 4); // Return top 4 retailers
  };

  useEffect(() => {
    // Load parts from database
    setTimeout(() => {
      setParts(tuningPartsDatabase);
      setFilteredParts(tuningPartsDatabase);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = parts.filter(part => {
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           part.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           part.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           part.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           part.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || part.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || part.difficulty === selectedDifficulty;
      const matchesMake = selectedMake === 'all' || part.make === selectedMake;
      const matchesBrand = selectedBrand === 'all' || part.brand === selectedBrand;
      const matchesPrice = part.price >= priceRange[0] && part.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesMake && matchesBrand && matchesPrice;
    });

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          return b.reviews - a.reviews;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return b.year - a.year;
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'make':
          return a.make.localeCompare(b.make);
        default:
          return 0;
      }
    });

    setFilteredParts(filtered);
  }, [parts, searchTerm, selectedCategory, selectedDifficulty, selectedMake, selectedBrand, priceRange, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };


  const handlePartClick = (part: TuningPart) => {
    setSelectedPart(part);
    setActiveTab('overview');
  };

  const handleBackToList = () => {
    setSelectedPart(null);
  };

  const formatCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  };

  // Function to apply filters from the modal
  const handleApplyFilters = (filters: {
    searchTerm: string;
    selectedCategory: string;
    selectedDifficulty: string;
    selectedMake: string;
    selectedBrand: string;
    priceRange: [number, number];
    sortBy: string;
  }) => {
    setSearchTerm(filters.searchTerm);
    setSelectedCategory(filters.selectedCategory);
    setSelectedDifficulty(filters.selectedDifficulty);
    setSelectedMake(filters.selectedMake);
    setSelectedBrand(filters.selectedBrand);
    setPriceRange(filters.priceRange);
    setSortBy(filters.sortBy);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Detailed Part View
  return (
  <div className="max-w-7xl mx-auto">
    {selectedPart ? (
      // DETAILED PART VIEW JSX
      <>
        {/* Back Button */}
        {/* Back Button */}
  <button
    onClick={handleBackToList}
    className="flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors"
  >
    <ArrowLeft className="h-5 w-5 mr-2" />
    Back to Parts
  </button>

  <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
    {/* Product Info */}
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-primary-600 font-semibold">{selectedPart.brand}</span>
        {selectedPart.certifications.map((cert, index) => (
          <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {cert}
          </span>
        ))}
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedPart.name}</h1>

      <div className="flex items-center space-x-4 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedPart.difficulty)}`}>
          {selectedPart.difficulty} install
        </span>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <span className="text-3xl font-bold text-gray-900">${selectedPart.price}</span>
        <span className="text-s text-gray-500 mr-1">(estimated)</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Zap className="h-4 w-4 mr-1" />
            Performance Gain
          </div>
          <div className="font-semibold">{selectedPart.performanceGain}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Clock className="h-4 w-4 mr-1" />
            Install Time
          </div>
          <div className="font-semibold">{selectedPart.installTime}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Package className="h-4 w-4 mr-1" />
            Part Number
          </div>
          <div className="font-semibold">{selectedPart.partNumber}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Shield className="h-4 w-4 mr-1" />
            Warranty
          </div>
          <div className="font-semibold text-sm">{selectedPart.warranty || 'N/A'}</div>
        </div>
      </div>

      {selectedPart.safetyNotes && selectedPart.safetyNotes.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <h5 className="font-medium text-yellow-800 mb-2">Safety Information</h5>
              <ul className="text-yellow-700 text-sm space-y-1">
                {selectedPart.safetyNotes.map((note, index) => (
                  <li key={index}>• {note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <h5 className="font-medium text-blue-900 mb-1">Retailer Search Note</h5>
            <p className="text-blue-800 text-sm">
              Direct links to retailer search results may not always work perfectly due to varying website search algorithms. If a link doesn't lead to the exact part, please try searching for the part name or number directly on the retailer's website.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

      
      {/* Retailer Links Section */}
      <div className="mt-8 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Where to Buy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          {getRetailerLinks(selectedPart).map((retailer, index) => (
            <a 
              key={index}
              href={retailer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all hover:bg-gray-50"
            >
              <div className="text-2xl mr-4">{retailer.logo}</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{retailer.name}</h4>
                <p className="text-sm text-gray-600">{retailer.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-primary-500 ml-3 flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>

  {/* Tabs */}
  <div className="bg-white rounded-lg shadow-md">
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 px-6">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'specs', label: 'Specifications' },
          { id: 'installation', label: 'Installation' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>

    <div className="p-6">
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Description</h3>
            <p className="text-gray-700 leading-relaxed">{selectedPart.detailedDescription}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Compatibility</h3>
            <ul className="space-y-2">
              {selectedPart.compatibility.map((vehicle, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  {vehicle}
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

      {activeTab === 'specs' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(selectedPart.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">{key}:</span>
                <span className="text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'installation' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {selectedPart.installation.tools.map((tool, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <Wrench className="h-4 w-4 text-gray-500 mr-2" />
                  {tool}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Installation Steps</h3>
            <ol className="space-y-3">
              {selectedPart.installation.steps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-primary-100 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Installation Tips</h3>
            <ul className="space-y-2">
              {selectedPart.installation.tips.map((tip, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

     
    </div>
  </div>

            
      </>
    ) : (
      // MAIN LIST VIEW JSX
      <>
        <div className="text-center mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Performance Tuning Parts</h1>
    <p className="text-lg text-gray-600">
      Discover genuine performance parts from trusted brands to enhance your car's power and handling
    </p>
    <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-500">
      <div className="flex items-center">
        <Award className="h-4 w-4 mr-1 text-yellow-500" />
        Verified Brands
      </div>
      <div className="flex items-center">
        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
        Real Performance Gains
      </div>
      <button
        onClick={() => setShowSafetyModal(true)}
        className="flex items-center text-orange-500 hover:text-orange-600 transition-colors"
      >
        <Info className="h-4 w-4 mr-1" />
        Safety Information
      </button>
    </div>
  </div>

  {/* Sort & Filter Button */}
  <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex justify-between items-center">
    <h2 className="text-xl font-semibold text-gray-900">Browse Parts</h2>
    <button
      onClick={() => setShowFilterSortModal(true)}
      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
    >
      <Filter className="h-5 w-5 mr-2" />
      Sort & Filter
    </button>
  </div>

  {/* Results Count and Stats */}
  <div className="mb-6 flex justify-between items-center">
    <p className="text-gray-600">
      Showing {filteredParts.length} of {parts.length} parts
    </p>
    <div className="flex items-center space-x-4 text-sm text-gray-500">
      <span>{parts.filter(p => p.isPopular).length} Popular</span>
      <span>{parts.filter(p => p.isBestSeller).length} Best Sellers</span>
    </div>
  </div>

  {/* Enhanced Parts Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredParts.map((part) => (
      <div
        key={part.id}
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-primary-500 flex flex-col h-full"
        onClick={() => handlePartClick(part)}
      >
        <div className="p-6 flex-grow">
          {/* Header with badges and brand */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex flex-wrap gap-2">
              {!part.inStock && (
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  Out of Stock
                </span>
              )}
              {part.isPopular && (
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                  Popular
                </span>
              )}
              {part.isBestSeller && (
                <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold">
                  Best Seller
                </span>
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(part.difficulty)}`}>
              {part.difficulty}
            </span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold text-primary-600">{part.brand}</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">{part.name}</h3>
          
          <div className="bg-gray-100 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Vehicle:</span>
              <span className="font-medium text-gray-900">{part.make} {part.model} ({part.year})</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium text-gray-900">{formatCategoryName(part.category)}</span>
            </div>
          </div>
          
          {part.partNumber && (
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-600">Part Number:</span>
              <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">{part.partNumber}</span>
            </div>
          )}
          
          <p className="text-gray-700 text-sm mb-4 leading-relaxed">{part.description}</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-sm text-gray-700">
              <Zap className="h-4 w-4 mr-1 text-yellow-500" />
              <span className="font-medium">{part.performanceGain}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Clock className="h-4 w-4 mr-1" />
              <span className="font-medium">{part.installTime}</span>
            </div>
          </div>

          {/* Certifications */}
          {part.certifications && part.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {part.certifications.map((cert, index) => (
                <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">
                  {cert}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 px-6 pb-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900">
                ${part.price}
              </span>
              <span className="text-xs text-gray-500 -mt-1 ml-0.5">(estimated)</span>
            </div>

            <a
              href={`https://www.summitracing.com/search/brand/${encodeURIComponent(part.brand)}/part-number/${encodeURIComponent(part.partNumber || part.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-primary-500 text-white px-5 py-2.5 rounded-md hover:bg-primary-600 transition-colors flex items-center text-sm font-medium shadow-md hover:shadow-lg"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Find Retailers
            </a>
          </div>
        </div>
      </div>
    ))}
  </div>

  {filteredParts.length === 0 && (
    <div className="text-center py-16">
      <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No parts found</h3>
      <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
    </div>
  )}

  {/* Trusted Retailers Section */}
  <div className="mt-8 bg-gray-50 rounded-lg p-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">Trusted Retailers</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <a 
        href="https://www.summitracing.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 hover:border-primary-300 flex items-center"
      >
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">Summit Racing</h4>
          <p className="text-sm text-gray-600">Performance parts specialist</p>
        </div>
        <ExternalLink className="h-4 w-4 text-primary-600" />
      </a>
      
      <a 
        href="https://www.jegs.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 hover:border-primary-300 flex items-center"
      >
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">JEGS</h4>
          <p className="text-sm text-gray-600">High-performance automotive</p>
        </div>
        <ExternalLink className="h-4 w-4 text-primary-600" />
      </a>
      
      <a 
        href="https://www.fcpeuro.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 hover:border-primary-300 flex items-center"
      >
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">FCP Euro</h4>
          <p className="text-sm text-gray-600">European auto parts</p>
        </div>
        <ExternalLink className="h-4 w-4 text-primary-600" />
      </a>
    </div>
  </div>
      </>
    )}

    {/* Safety Modal */}
    {showSafetyModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-orange-500" />
                Safety Information & Disclaimers
              </h3>
              <button
                onClick={() => setShowSafetyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Important Safety Considerations</h4>
                <ul className="space-y-2 text-orange-700 text-sm">
                  {safetyDisclaimers.map((disclaimer, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {disclaimer}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Professional Installation Recommended</h4>
                <p className="text-blue-700 text-sm">
                  Many performance modifications require specialized tools, knowledge, and experience. We strongly recommend professional installation for complex modifications to ensure safety, proper function, and warranty compliance.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Warranty & Legal Considerations</h4>
                <p className="text-gray-700 text-sm">
                  Performance modifications may affect your vehicle's warranty and may not be legal in all jurisdictions. Please check local laws and consult with your dealer before making modifications. Some parts may require additional supporting modifications or professional tuning to function properly.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSafetyModal(false)}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Filter Modal */}
    <FilterSortModal
      isOpen={showFilterSortModal}
      onClose={() => setShowFilterSortModal(false)}
      currentFilters={{
        searchTerm,
        selectedCategory,
        selectedDifficulty,
        selectedMake,
        selectedBrand,
        priceRange,
        sortBy,
      }}
      onApplyFilters={handleApplyFilters}
      categoryOptions={categoryOptions}
      difficulties={difficulties}
      makes={makes}
      brands={brands}
      sortOptions={sortOptions}
    />
  </div>
  );
};

export default TuningParts;