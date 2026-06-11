const ErrorPage = ({error}:{error:Error}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <div className="text-4xl">⚠️</div>
          <p className="text-sm font-semibold text-red-500">
            {error.message || "Something went wrong"}
          </p>
        </div>
      </div>
  )
}
export default ErrorPage
