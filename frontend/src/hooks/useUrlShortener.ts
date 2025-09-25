import { useState } from 'react';
import { urlService } from '../services/urlService';
import { CreateUrlRequest, CreateUrlResponse } from '../types';

interface UseUrlShortenerState {
    loading: boolean;
    error: string | null;
    result: CreateUrlResponse | null;
}

export const useUrlShortener = (): {
    loading: boolean;
    error: string | null;
    result: CreateUrlResponse | null;
    createShortUrl: (data: CreateUrlRequest) => Promise<CreateUrlResponse>;
    reset: () => void;
} => {
    const [state, setState] = useState<UseUrlShortenerState>({
        loading: false,
        error: null,
        result: null,
    });

    const createShortUrl = async (data: CreateUrlRequest): Promise<CreateUrlResponse> => {
        setState({ loading: true, error: null, result: null });

        try {
            if (!urlService.validateUrl(data.originalUrl)) {
                throw new Error('Veuillez entrer une URL valide (http:// ou https://)');
            }

            const result = await urlService.createShortUrl(data);
            setState({ loading: false, error: null, result });
            return result;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
            setState({ loading: false, error: errorMessage, result: null });
            throw error;
        }
    };

    const reset = (): void => {
        setState({ loading: false, error: null, result: null });
    };

    return {
        ...state,
        createShortUrl,
        reset,
    };
};
