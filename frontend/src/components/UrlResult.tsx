import React, { useState } from 'react';
import { Copy, ExternalLink, Check, BarChart3 } from 'lucide-react';
import { CreateUrlResponse } from '../types';
import { copyToClipboard } from '../utils/clipboard';

interface UrlResultProps {
    result: CreateUrlResponse;
    onReset: () => void;
}

export const UrlResult: React.FC<UrlResultProps> = ({ result, onReset }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (): Promise<void> => {
        const success = await copyToClipboard(result.shortUrl);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2 text-green-800">
                <Check className="h-5 w-5" />
                <h3 className="font-semibold">URL raccourcie avec succès !</h3>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL originale
                    </label>
                    <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-600 break-all flex-1">{result.originalUrl}</p>
                        <a
                            href={result.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 flex-shrink-0"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL raccourcie
                    </label>
                    <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-3">
                        <p className="text-primary-600 font-mono flex-1">{result.shortUrl}</p>
                        <button
                            onClick={handleCopy}
                            className="text-gray-500 hover:text-gray-700 flex-shrink-0 p-1"
                            title="Copier l'URL"
                        >
                            {copied ? (
                                <Check className="h-4 w-4 text-green-600" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </button>
                        <a
                            href={result.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 flex-shrink-0 p-1"
                            title="Ouvrir l'URL"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div>
                        <span className="font-medium">Créée le :</span> {formatDate(result.createdAt)}
                    </div>
                    {result.expiresAt && (
                        <div>
                            <span className="font-medium">Expire le :</span> {formatDate(result.expiresAt)}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <BarChart3 className="h-4 w-4" />
                    <span>ID: {result.slug}</span>
                </div>
            </div>

            <button
                onClick={onReset}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
                Raccourcir une nouvelle URL
            </button>
        </div>
    );
};
