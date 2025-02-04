export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF3F0]">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-playfair text-[#A52A2A]">Valentine Dashboard</h1>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}