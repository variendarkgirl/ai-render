
import React, { useState } from 'react';
import { Search, X } from 'react-feather';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      performSearch(query);
    } else {
      setSearchResults([]);
    }
  };
  
  // Mock search function - in a real app this would query an API
  const performSearch = async (query) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Mock search results
      const results = [
        {
          id: 'log-001',
          type: 'log',
          title: 'Prompt Injection Attempt',
          description: 'Attempt to bypass system prompt',
          timestamp: '2025-02-27T15:32:17'
        },
        {
          id: 'model-a',
          type: 'model',
          title: 'Model A',
          description: 'Production language model',
          vulnerabilities: 12
        },
        {
          id: 'vuln-004',
          type: 'vulnerability',
          title: 'PII Extraction Vulnerability',
          description: 'High severity issue in Model A',
          status: 'open'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
      setIsLoading(false);
    }, 300);
  };
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would redirect to a search results page
    console.log('Search submitted:', searchQuery);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // Handle result click
  const handleResultClick = (result) => {
    // In a real app, this would navigate to the appropriate page
    console.log('Result clicked:', result);
    setSearchResults([]);
    setIsExpanded(false);
  };
  
  // Toggle search expansion on mobile
  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus the input when expanding
      setTimeout(() => {
        document.getElementById('search-input').focus();
      }, 100);
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`search-container ${isExpanded ? 'expanded' : ''}`}>
      <button 
        className="search-toggle btn icon-btn"
        onClick={toggleSearch}
      >
        <Search size={20} />
      </button>
      
      <form onSubmit={handleSearchSubmit} className="search-form">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search logs, models, vulnerabilities..."
            className="search-input"
          />
          {searchQuery && (
            <button 
              type="button" 
              className="clear-search-btn"
              onClick={clearSearch}
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {searchResults.length > 0 && (
          <div className="search-results">
            {isLoading ? (
              <div className="search-loading">Searching...</div>
            ) : (
              <>
                <div className="results-header">
                  <span>Search Results</span>
                  <span className="results-count">{searchResults.length} found</span>
                </div>
                <ul className="results-list">
                  {searchResults.map(result => (
                    <li 
                      key={result.id} 
                      className="result-item"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="result-icon">
                        {result.type === 'log' && <span className="icon-log">L</span>}
                        {result.type === 'model' && <span className="icon-model">M</span>}
                        {result.type === 'vulnerability' && <span className="icon-vulnerability">V</span>}
                      </div>
                      <div className="result-content">
                        <div className="result-title">{result.title}</div>
                        <div className="result-description">{result.description}</div>
                      </div>
                      <div className="result-meta">
                        {result.timestamp && (
                          <span className="result-time mono">{formatTimestamp(result.timestamp)}</span>
                        )}
                        {result.vulnerabilities && (
                          <span className="result-vuln-count">{result.vulnerabilities} issues</span>
                        )}
                        {result.status && (
                          <span className={`result-status status-${result.status}`}>{result.status}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="results-footer">
                  <button className="btn btn-small">View All Results</button>
                </div>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
