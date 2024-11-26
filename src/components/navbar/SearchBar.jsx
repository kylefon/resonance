import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { FaSearch } from "react-icons/fa";
import { Form, useSearchParams, useSubmit } from "react-router-dom";

export default function SearchBar() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get("q") || "";
    const [query, setQuery ] = useState(q);
    const submit = useSubmit();

    useEffect(() => {
        setQuery(q);
    }, [q]);

    return (
        <IconContext.Provider value={{ className: "search-icon" }}>
            <Form 
                className="nav-input" 
                role="search"
                action="/search" 
                onSubmit={(e) => {
                    e.preventDefault(); 
                    submit(e.currentTarget); 
                }}>
                <input
                    id="q"
                    aria-label="Search albums"
                    type="search"
                    name="q"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                }}
            /> 
            <FaSearch />
            </Form>
        </IconContext.Provider>
    )
}