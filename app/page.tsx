export default function HelloWorldPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold text-gray-900 tracking-tight">
          Hello World
        </h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Welcome to your new Next.js application. This is where your journey begins!
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <span>Built with</span>
          <span className="font-semibold">Next.js</span>
          <span>•</span>
          <span className="font-semibold">Tailwind CSS</span>
        </div>
      </div>
    </div>
  )
}
