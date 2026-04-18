export function TripleGeniusBadge() {
  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50">
      <div className="bg-gradient-to-r from-[#7c6f5f] via-[#8b9d83] to-[#a67c8a] p-[2px] rounded-full shadow-lg">
        <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-[#7c6f5f] to-[#8b9d83] rounded-full flex items-center justify-center">
            <span className="text-white text-xs">⚡</span>
          </div>
          <span className="text-sm bg-gradient-to-r from-[#7c6f5f] via-[#8b9d83] to-[#a67c8a] bg-clip-text text-transparent">
            Triple Genius
          </span>
        </div>
      </div>
    </div>
  );
}
