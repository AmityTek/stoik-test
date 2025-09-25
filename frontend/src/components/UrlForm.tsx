import React, { useState } from "react";
import { Link, Calendar } from "lucide-react";
import { CreateUrlRequest, CreateUrlResponse } from "../types";

interface UrlFormProps {
  onSubmit: (data: CreateUrlRequest) => Promise<CreateUrlResponse>;
  loading: boolean;
}

export const UrlForm: React.FC<UrlFormProps> = ({ onSubmit, loading }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showExpiration, setShowExpiration] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      return;
    }

    const data: CreateUrlRequest = {
      originalUrl: originalUrl.trim(),
    };

    if (expiresAt) {
      data.expiresAt = expiresAt;
    }

    await onSubmit(data);
  };

  const getMinDateTime = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          URL à raccourcir
        </label>
        <div className="relative">
          <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="url"
            id="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-3">
          <input
            type="checkbox"
            id="hasExpiration"
            checked={showExpiration}
            onChange={(e) => setShowExpiration(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            disabled={loading}
          />
          <label
            htmlFor="hasExpiration"
            className="text-sm font-medium text-gray-700"
          >
            Définir une date d'expiration
          </label>
        </div>

        {showExpiration && (
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="datetime-local"
              id="expiresAt"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={getMinDateTime()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              disabled={loading}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !originalUrl.trim()}
        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Creation de l'URL..." : "Raccourcir l'URL"}
      </button>
    </form>
  );
};
