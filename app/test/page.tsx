'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          🔥 Tailwind CSS Test Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Card 1</h2>
            <p className="text-gray-600">This should have white background and shadow.</p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Button Test
            </button>
          </div>
          
          <div className="bg-green-100 p-6 rounded-lg border-2 border-green-500">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">Card 2</h2>
            <p className="text-green-700">This should have green background and border.</p>
            <div className="mt-4 flex space-x-2">
              <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">Tag 1</span>
              <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">Tag 2</span>
            </div>
          </div>
          
          <div className="bg-purple-200 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">Card 3</h2>
            <p className="text-purple-700">This should have purple background.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                List item 1
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                List item 2
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <h3 className="text-lg font-semibold text-yellow-800">Tailwind Status</h3>
          <p className="text-yellow-700 mt-2">
            If you can see colors, borders, spacing, and typography working properly, 
            then Tailwind CSS is loaded correctly.
          </p>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-100 p-6 rounded-lg">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Responsive Test</h3>
            <p className="text-gray-600">This layout should change on different screen sizes.</p>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-red-500 rounded"></div>
            <div className="w-8 h-8 bg-blue-500 rounded"></div>
            <div className="w-8 h-8 bg-green-500 rounded"></div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            ← Back to App
          </a>
        </div>
      </div>
    </div>
  );
}