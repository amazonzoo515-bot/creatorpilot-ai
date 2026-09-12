export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-xl font-bold text-gray-900 text-center md:text-left">
              YouTube Thumbnail Downloader
            </h2>

            <p className="mt-1 max-w-md text-sm text-gray-600 text-center md:text-left">
              Download YouTube thumbnails in HD, HQ, MQ, SD and Max Resolution
              instantly for free.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} YouTube Thumbnail Downloader. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}