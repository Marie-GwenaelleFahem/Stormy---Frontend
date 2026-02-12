import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-primary mb-2">
            ⚡ Stormy
          </h1>
          <p className="text-gray-600">
            Messagerie en temps réel
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
              ✓
            </div>
            <span className="text-gray-700">React 19 + TypeScript</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
              ✓
            </div>
            <span className="text-gray-700">Vite + Tailwind CSS</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
              ✓
            </div>
            <span className="text-gray-700">Docker + Hot Reload</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
              ✓
            </div>
            <span className="text-gray-700">Firebase Auth (prêt)</span>
          </div>
        </div>

        <div className="p-4 bg-accent/10 rounded-lg border-2 border-accent/20 mb-6">
          <p className="text-sm text-gray-700 text-center font-medium">
            🎉 Environnement prêt !<br />
            Tu peux commencer à coder avec ton binôme.
          </p>
        </div>

        <div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tape un message de test..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
          />
          {message && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
              <p className="text-sm font-medium text-primary">Message: {message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App