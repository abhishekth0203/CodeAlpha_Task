import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import AddEditBookPage from './pages/AddEditBookPage';
import BorrowingHistoryPage from './pages/BorrowingHistoryPage';
import { LibraryProvider } from './contexts/LibraryContext';

function App() {
  return (
    <BrowserRouter>
      <LibraryProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/add" element={<AddEditBookPage />} />
            <Route path="/edit/:id" element={<AddEditBookPage />} />
            <Route path="/history" element={<BorrowingHistoryPage />} />
          </Routes>
        </Layout>
      </LibraryProvider>
    </BrowserRouter>
  );
}

export default App;