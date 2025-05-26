// Base URLs for Open Library APIs
const OPEN_LIBRARY_BASE = 'https://openlibrary.org';
const COVERS_BASE = 'https://covers.openlibrary.org';

// Search for books by query
export const searchBooks = async (query: string): Promise<any> => {
  try {
    const response = await fetch(`${OPEN_LIBRARY_BASE}/search.json?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to fetch books');
    return await response.json();
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

// Get book details by key
export const getBookDetails = async (key: string): Promise<any> => {
  try {
    const response = await fetch(`${OPEN_LIBRARY_BASE}${key}.json`);
    if (!response.ok) throw new Error('Failed to fetch book details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};

// Get author details
export const getAuthor = async (key: string): Promise<any> => {
  try {
    const response = await fetch(`${OPEN_LIBRARY_BASE}${key}.json`);
    if (!response.ok) throw new Error('Failed to fetch author');
    return await response.json();
  } catch (error) {
    console.error('Error fetching author:', error);
    throw error;
  }
};

// Get books by subject
export const getSubject = async (subject: string): Promise<any> => {
  try {
    const response = await fetch(`${OPEN_LIBRARY_BASE}/subjects/${encodeURIComponent(subject)}.json`);
    if (!response.ok) throw new Error('Failed to fetch subject');
    return await response.json();
  } catch (error) {
    console.error('Error fetching subject:', error);
    throw error;
  }
};

// Get popular subjects
export const getPopularSubjects = async (): Promise<any> => {
  return {
    subjects: [
      { name: 'Fantasy' },
      { name: 'Science Fiction' },
      { name: 'Romance' },
      { name: 'Mystery' },
      { name: 'Biography' },
      { name: 'History' },
      { name: 'Self-help' },
      { name: 'Children' }
    ]
  };
};

// Get recent changes/updates
export const getRecentChanges = async (): Promise<any> => {
  try {
    const response = await fetch(`${OPEN_LIBRARY_BASE}/recentchanges.json`);
    if (!response.ok) throw new Error('Failed to fetch recent changes');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent changes:', error);
    throw error;
  }
};

// Get cover image URL by cover ID
export const getCoverUrl = (coverId: number, size: 'S' | 'M' | 'L' = 'M'): string => {
  return `${COVERS_BASE}/b/id/${coverId}-${size}.jpg`;
};

// Local storage functions for user book lists
export const getUserBookLists = (): UserBookStatus => {
  const storedLists = localStorage.getItem('userBookLists');
  if (storedLists) {
    return JSON.parse(storedLists);
  }
  return {
    read: [],
    reading: [],
    wantToRead: []
  };
};

export const saveUserBookLists = (lists: UserBookStatus): void => {
  localStorage.setItem('userBookLists', JSON.stringify(lists));
};

export const addBookToList = (book: any, listType: 'read' | 'reading' | 'wantToRead'): void => {
  const lists = getUserBookLists();
  
  // Remove from all lists first to avoid duplicates
  const updatedLists = {
    read: lists.read.filter(b => b.key !== book.key),
    reading: lists.reading.filter(b => b.key !== book.key),
    wantToRead: lists.wantToRead.filter(b => b.key !== book.key)
  };
  
  // Add to specified list
  updatedLists[listType] = [...updatedLists[listType], book];
  
  saveUserBookLists(updatedLists);
};

export const removeBookFromList = (bookKey: string, listType: 'read' | 'reading' | 'wantToRead'): void => {
  const lists = getUserBookLists();
  lists[listType] = lists[listType].filter(book => book.key !== bookKey);
  saveUserBookLists(lists);
};

// Type definition for user book status
export interface UserBookStatus {
  read: any[];
  reading: any[];
  wantToRead: any[];
}