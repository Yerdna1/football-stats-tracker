'use client';

export default function StyleTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Styling Test Page
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            If you can see this styled properly, Tailwind CSS is working!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-red-100 border border-red-300 rounded-lg p-4">
              <h3 className="font-semibold text-red-800">Red Card</h3>
              <p className="text-red-600 text-sm mt-2">Background, border, and text colors</p>
            </div>
            
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <h3 className="font-semibold text-green-800">Green Card</h3>
              <p className="text-green-600 text-sm mt-2">Grid layout and spacing</p>
            </div>
            
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800">Blue Card</h3>
              <p className="text-blue-600 text-sm mt-2">Responsive design</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Hover me!
            </button>
            
            <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
              ← Back to App
            </a>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="font-semibold text-yellow-800 mb-2">Status Check</h2>
          <ul className="space-y-1 text-sm text-yellow-700">
            <li>✅ Colors working</li>
            <li>✅ Spacing and padding working</li>
            <li>✅ Typography working</li>
            <li>✅ Responsive grid working</li>
            <li>✅ Hover effects working</li>
          </ul>
        </div>
      </div>
    </div>
  );
}