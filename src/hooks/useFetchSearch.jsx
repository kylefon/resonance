import { useEffect, useState } from "react";
import { useFetchAccessToken } from "../context/AccessTokenContext";
import { useDebounce } from "./useDebounce";
import { useQuery } from "@tanstack/react-query";

const fetchSearch = async (query, accessToken) => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=album`,
    options
  );

  if (!response.ok) {
    throw new Error("Failed to fetch searches");
  }

  const data = await response.json();

  if (data.albums?.items) {
    return data.albums.items.filter((item) => item.album_type === "album");
  } else {
    console.error("Invalid data structure: ", data);
    return [];
  }
};

export const useFetchSearch = (q = '') => {
  const accessToken = useFetchAccessToken();
  const debouncedQuery = useDebounce(q, 300);

  const { data: search, isLoading, error } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => fetchSearch(debouncedQuery, accessToken),
    enabled: !!debouncedQuery && !!accessToken,
    staleTime: 60000,
    cacheTime: 300000,
    }
  ) 

  return { search: search || [], isLoading, error };
};
