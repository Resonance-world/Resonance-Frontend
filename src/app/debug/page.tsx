'use client';

export default function DebugPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  const testBackend = async () => {
    try {
      console.log('🧪 Testing backend connection...');
      console.log('🔗 Backend URL:', backendUrl);
      
      const response = await fetch(`${backendUrl}/health`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        }
      });
      
      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📊 Response data:', data);
      
      alert(`✅ Backend is reachable!\nStatus: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('❌ Backend test failed:', error);
      alert(`❌ Backend connection failed!\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">🔍 Debug Information</h1>
      
      <div className="bg-gray-100 p-4 rounded space-y-2">
        <p><strong>NEXT_PUBLIC_BACKEND_URL:</strong></p>
        <code className="block bg-white p-2 rounded">
          {backendUrl || '❌ NOT SET'}
        </code>
      </div>

      <div className="bg-gray-100 p-4 rounded space-y-2">
        <p><strong>Expected Backend URL:</strong></p>
        <code className="block bg-white p-2 rounded">
          https://resonance-backend-nwjg.onrender.com
        </code>
      </div>

      <div className="bg-gray-100 p-4 rounded space-y-2">
        <p><strong>Environment:</strong></p>
        <code className="block bg-white p-2 rounded">
          {process.env.NODE_ENV}
        </code>
      </div>

      <button
        onClick={testBackend}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        🧪 Test Backend Connection
      </button>

      <div className="mt-8 p-4 bg-yellow-100 rounded">
        <h2 className="font-bold mb-2">📝 Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Check if NEXT_PUBLIC_BACKEND_URL matches the expected URL</li>
          <li>Click "Test Backend Connection" to verify connectivity</li>
          <li>Check browser console for detailed logs</li>
          <li>If URL is wrong, update it in Vercel Dashboard</li>
        </ol>
      </div>
    </div>
  );
}



