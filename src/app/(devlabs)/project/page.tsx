export default function ProjectPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-600">Projects</h1>
        <p className="mt-2 text-gray-600">
          Manage and view all your development projects
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold">Project Alpha</h3>
          <p className="text-sm text-muted-foreground mt-2">
            A modern web application built with Next.js and TypeScript
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Active
            </span>
            <span className="text-sm text-muted-foreground">
              Last updated: 2 days ago
            </span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold">Project Beta</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Mobile application development using React Native
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              In Progress
            </span>
            <span className="text-sm text-muted-foreground">
              Last updated: 1 week ago
            </span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold">Project Gamma</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Backend API development with Node.js and PostgreSQL
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              Planning
            </span>
            <span className="text-sm text-muted-foreground">
              Last updated: 3 days ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
