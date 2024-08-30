import { useState } from 'react'
import { ConvexLogo } from './components/ConvexLogo'
import { GitHubLogo } from './components/GithubLogo'
import QB from './components/qb'

function App() {
  const [showDialog, setShowDialog] = useState(false)

  const handleGitHubClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setShowDialog(true)
  }

  const handleConfirm = (willStar: boolean) => {
    window.open('https://github.com/hamzasaleem2/queryquest', '_blank', 'noopener,noreferrer')
    setShowDialog(false)
    if (willStar) {
      console.log('User intends to star the repo')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8">Query Quest</h1>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <QB />
      </div>
      <div className="mt-8 text-sm text-indigo-600 flex items-center gap-1">
        powered by <ConvexLogo width={69} height={11} />
      </div>
      <a href="#" onClick={handleGitHubClick} className="mt-4">
        <GitHubLogo width={24} height={24} className="text-indigo-600 hover:text-indigo-800 transition-colors" />
      </a>

      {showDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-0">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
      <div className="p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-800">Star this repo!</h2>
        <div className="bg-indigo-100 border-l-4 border-indigo-500 p-4 mb-4 rounded-r-lg">
          <p className="font-medium text-indigo-700">Query me this:</p>
          <p className="text-indigo-600 italic">
            What's the best way to show your support? It's not a "complex join", it's a simple star!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button onClick={() => handleConfirm(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
            I'll star it later, promise!
          </button>
          <button onClick={() => handleConfirm(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Sure, let's star!
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  )
}

export default App