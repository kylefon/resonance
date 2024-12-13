export async function SearchLoader({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";  // Extract the query from URL
  return { query };
}
