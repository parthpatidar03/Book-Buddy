import { useState } from 'react';

const NotesSection = ({ notes, onAddNote, onDownloadNotes }) => {
  const [newNote, setNewNote] = useState('');
  const [page, setPage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsAdding(true);
    try {
      await onAddNote({ text: newNote, page: page ? parseInt(page, 10) : null });
      setNewNote('');
      setPage('');
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDownload = async () => {
    if (!notes || notes.length === 0) return;
    
    setIsDownloading(true);
    try {
      await onDownloadNotes();
    } catch (error) {
      console.error('Error downloading notes:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#27272A] p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notes & Highlights</h3>
        {notes && notes.length > 0 && (
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center gap-1"
          >
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>
        )}
      </div>
      
      <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
        {notes && notes.length > 0 ? (
          notes.map((note, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-100 dark:border-gray-700">
              <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap">{note.text}</p>
              <div className="mt-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                {note.page && <span>Page {note.page}</span>}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No notes yet. Add one below!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note or highlight..."
            className="input w-full h-24 resize-none"
            required
          />
        </div>
        <div className="flex gap-3">
          <input
            type="number"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            placeholder="Page (opt)"
            className="input w-24"
            min="1"
          />
          <button
            type="submit"
            disabled={isAdding}
            className="btn btn-primary flex-1"
          >
            {isAdding ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotesSection;
