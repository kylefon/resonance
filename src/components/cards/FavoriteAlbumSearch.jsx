import './favoritealbumsearch.css';
import SearchResults from "./SearchResults";
import { Form } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useFetchSearch } from "../../hooks/useFetchSearch";

export default function FavoriteAlbumSearch({ isOpen, closeModal, onAlbumSelect }) {

    const [ query, setQuery ] = useState('');
    const { search: searchResults, isLoading } = useFetchSearch(query);

    const inputRef = useRef(null);
    const searchResultsRef = useRef(null);
    const [searchPosition, setSearchPosition] = useState({ top: 0, left: 0, width: 0});

    useEffect(() => {
        if (inputRef.current) {
            const { top, left, width, height} = inputRef.current.getBoundingClientRect();
            setSearchPosition({ top: top + height + window.scrollY, left, width });
        }
    }, [query])
    
    useEffect(() => {
        if (!isOpen) {
            setQuery("");
        }
    }, [isOpen])

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" >
            <div className="modal-container">

            <Form className="dialog-form">
                {isLoading && <p className='header-listen'>Loading...</p>}
                    <h1>PICK A FAVORITE FILM</h1>
                    <div className="film-input-container">
                        <label htmlFor="film-name" className="film-title">Name of Film</label>
                        <input 
                            ref={inputRef}
                            name="film-name" 
                            className="film-input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            />                        
                    </div>
                    <button type="button" className="modal-close" onClick={closeModal}>
                    <IoMdClose className="modal-button" />
                </button>
            </Form>
            </div>

            <SearchResults
                results={searchResults}
                ref={searchResultsRef}
                style={{
                    position: "absolute",
                    top: `${searchPosition.top}px`,
                    left: `${searchPosition.left}px`,
                    width: `${searchPosition.width}px`
                }}
                onSelect={(album) => {
                    onAlbumSelect(album);
                    closeModal();
                }}
            />        
        </div>
    )
}