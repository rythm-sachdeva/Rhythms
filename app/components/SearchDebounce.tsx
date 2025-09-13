import React from 'react';

// Define the type for a single search result, mirroring the parent component.
// This ensures that the props passed to this component are correctly typed.
interface SearchResult {
    id: string;
    title: string;
    thumbnail?: { thumbnails?: [{
        url:string,
        width?: number,
        height?: number
    }] };
    channel?: { name?: string };
    url: string;
}

// Define the props that this component will accept.
interface SearchResultsProps {
    isSearching: boolean;
    searchList: SearchResult[];
    onSelectSearchResult: (video: SearchResult) => void;
}



/**
 * A component that displays the top 3 YouTube search results.
 * It shows a loading state and handles clicks on individual results.
 */
const SearchResults: React.FC<SearchResultsProps> = ({ isSearching, searchList, onSelectSearchResult }) => {
    
    // If we are not in a searching state and the list is empty, don't render anything.
    if (!isSearching && searchList.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2 mt-4"> {/* Added margin for spacing below the form */}
            {/* Show a "Searching..." message while the API call is in progress */}
            {isSearching && <p className="text-center text-gray-400">Searching...</p>}
            
            {/* When not searching and results are available, map through the top 3 */}
            {!isSearching && searchList.length > 0 && searchList.slice(0, 3).map(video => (
                <div 
                    key={video.id} 
                    className="flex items-center p-2 space-x-3 bg-gray-900 border border-gray-800 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                    //@ts-ignore
                    onClick={() => ( onSelectSearchResult(video))}
                >
                    
                    <img 
                       //@ts-ignore
                        src={video.thumbnail?.thumbnails[0]?.url || 'https://placehold.co/120x90/1a1a1a/ffffff?text=Video'} 
                        alt={video.title} 
                        className="w-24 h-14 object-cover rounded"
                        // Add a fallback for broken image links
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/120x90/1a1a1a/ffffff?text=Error'; }}
                    />
                    <div className="flex-1 min-w-0"> {/* Prevents text from overflowing its container */}
                        <p className="font-semibold text-white text-sm leading-tight truncate">{video.title}</p>
                        <p className="text-gray-400 text-xs mt-1 truncate">{video.channel?.name}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;
