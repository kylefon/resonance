import './favoritealbumsearch.css';

export default function SearchResults({ results, onSelect, style }) {
    if (!results || results.length === 0) return null;

    return (
        <ul className="search-results" style={style}>
            {results.map((album) => (
                <li
                    key={album.id}
                    className="search-result-item"
                    onClick={() => onSelect(album)}
                >
                    <h2 className="search-album">{album.name}</h2>
                    <h2 className="search-artist">
                        {album.artists.map((artist) => artist.name).join(', ')}
                    </h2>
                </li>
            ))}
        </ul>
    );
}