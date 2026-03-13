"use client";

type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function PaginationControls({ page, totalPages, onPrev, onNext }: Props) {
  return (
    <div className="mt-7 flex items-center justify-center gap-3">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="px-4 py-2 rounded-lg border border-white/20 text-sm disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm">Page {page} of {totalPages}</span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-4 py-2 rounded-lg border border-white/20 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
