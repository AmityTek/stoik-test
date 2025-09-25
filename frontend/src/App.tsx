import { Scissors } from 'lucide-react';
import { UrlForm } from './components/UrlForm';
import { UrlResult } from './components/UrlResult';
import { ErrorMessage } from './components/ErrorMessage';
import { useUrlShortener } from './hooks/useUrlShortener';

function App(): JSX.Element {
    const { loading, error, result, createShortUrl, reset } = useUrlShortener();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary-600 p-3 rounded-full">
                            <Scissors className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        URL Shortener
                    </h1>
                    <p className="text-lg text-gray-600 max-w-md mx-auto">
                        Transformez vos URLs longues en liens courts et faciles à partager
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {error && (
                        <div className="mb-6">
                            <ErrorMessage message={error} onClose={reset} />
                        </div>
                    )}

                    {result ? (
                        <UrlResult result={result} onReset={reset} />
                    ) : (
                        <UrlForm onSubmit={createShortUrl} loading={loading} />
                    )}
                </div>

                {/* Features */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                        <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                            <Scissors className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Raccourcissement rapide</h3>
                        <p className="text-gray-600 text-sm">
                            Transformez instantanément vos URLs longues en liens courts
                        </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                        <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Statistiques</h3>
                        <p className="text-gray-600 text-sm">
                            Suivez le nombre de clics sur vos liens raccourcis
                        </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                        <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Expiration</h3>
                        <p className="text-gray-600 text-sm">
                            Définissez une date d'expiration pour vos liens
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-gray-500 text-sm">
                    <p>© 2024 URL Shortener - Service de raccourcissement d'URLs</p>
                </div>
            </div>
        </div>
    );
}

export default App;
