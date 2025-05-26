export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
  isbn?: string[];
}

export interface Author {
  key: string;
  name: string;
  birth_date?: string;
  bio?: string;
  top_work?: string;
  work_count?: number;
}

export interface Subject {
  name: string;
  count: number;
  works?: Book[];
}

export interface BookList {
  id: string;
  name: string;
  description?: string;
  books: Book[];
}

export interface UserBookStatus {
  read: Book[];
  reading: Book[];
  wantToRead: Book[];
}