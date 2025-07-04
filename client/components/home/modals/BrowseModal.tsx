"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

interface Quiz {
  question: string;
  options?: string[];
  answer: string;
}

interface BrowseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BrowseModal: React.FC<BrowseModalProps> = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quizTypes, setQuizTypes] = useState<string[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get("/api/categories");
      setCategories(data);
    };
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const fetchQuizTypes = async (category: string) => {
    const { data } = await axios.get(`/api/category/${category}/types`);
    setQuizTypes(data);
    setFilteredTypes(data);
    setSelectedType(null);
    setQuizzes([]);
    setPage(1);
  };

  const fetchQuizzes = async (category: string, type: string, pageNum = 1) => {
    const { data } = await axios.get(
      `/api/category/${category}/type/${type}?page=${pageNum}&page_size=5`,
    );
    if (data.length < 5) setHasMore(false);
    setQuizzes((prev) => (pageNum === 1 ? data : [...prev, ...data]));
  };

  useEffect(() => {
    if (search) {
      const filtered = quizTypes.filter((type) =>
        type.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredTypes(filtered);
    } else {
      setFilteredTypes(quizTypes);
    }
  }, [search, quizTypes]);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setPage(1);
    fetchQuizzes(selectedCategory!, type);
  };

  const loadMore = () => {
    if (!selectedCategory || !selectedType || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchQuizzes(selectedCategory, selectedType, nextPage);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <Dialog.Title className="text-xl font-bold text-[#0F2654]">
              Browse by Category
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {!selectedCategory ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    fetchQuizTypes(cat);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-gray-800"
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setQuizTypes([]);
                    setQuizzes([]);
                    setSearch("");
                    setSelectedType(null);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  ← Back to Categories
                </button>
                <input
                  type="text"
                  placeholder="Filter quiz types..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border px-3 py-2 rounded-md text-sm"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      selectedType === type
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {selectedType && (
                <div className="mt-6 space-y-4">
                  {quizzes.map((quiz, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 border rounded-lg shadow-sm"
                    >
                      <h3 className="font-semibold text-gray-800">
                        {quiz.question}
                      </h3>
                      {quiz.options && (
                        <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
                          {quiz.options.map((opt, i) => (
                            <li key={i}>{opt}</li>
                          ))}
                        </ul>
                      )}
                      <p className="mt-2 text-sm">
                        <strong>Answer:</strong> {quiz.answer}
                      </p>
                    </div>
                  ))}
                  {hasMore && (
                    <div className="text-center">
                      <button
                        onClick={loadMore}
                        className="mt-4 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BrowseModal;
