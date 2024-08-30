import { ConvexLogo } from './components/ConvexLogo'
import QB from './components/qb'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8">Query Quest</h1>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <QB />
      </div>
      <div className="mt-8 text-sm text-indigo-600 flex items-center gap-1">
        powered by <ConvexLogo width={69} height={11} />
      </div>
    </div>
  )
}

export default App