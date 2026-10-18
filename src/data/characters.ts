// Talks to the free Rick and Morty API: https://rickandmortyapi.com (no key needed)
const API_URL = 'https://rickandmortyapi.com/api/character';

export type StatusFilter = 'all' | 'alive' | 'dead' | 'unknown';

export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  origin: { name: string };
  location: { name: string };
  image: string;
  episode: string[];
}

export interface CharacterPage {
  characters: Character[];
  total: number;
  hasMore: boolean;
}

// The shape the API sends back; we only keep what the app needs
interface ApiResponse {
  info: { count: number; pages: number; next: string | null };
  results: Character[];
}

export const fetchCharacters = async (
  page: number,
  name: string,
  status: StatusFilter,
  signal?: AbortSignal
): Promise<CharacterPage> => {
  const params = new URLSearchParams({ page: String(page) });
  if (name.trim()) params.set('name', name.trim());
  if (status !== 'all') params.set('status', status);

  const response = await fetch(`${API_URL}?${params}`, { signal });

  // The API answers 404 when nobody matches the filters: that is "no results", not an error
  if (response.status === 404) return { characters: [], total: 0, hasMore: false };
  if (!response.ok) throw new Error(`Request failed (${response.status})`);

  const data: ApiResponse = await response.json();
  return { characters: data.results, total: data.info.count, hasMore: data.info.next !== null };
};

export const fetchRandomCharacter = async (): Promise<Character> => {
  // Ask for the first page only to learn how many characters exist
  const { total } = await fetchCharacters(1, '', 'all');
  const id = Math.floor(Math.random() * total) + 1;

  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
};
