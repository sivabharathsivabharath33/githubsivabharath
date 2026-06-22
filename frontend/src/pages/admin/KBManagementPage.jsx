import { useEffect, useState } from "react";
import GlassCard from "../../components/common/GlassCard";
import {
  uploadKbDocument,
  getKbDocuments,
  deleteKbDocument,
} from "../../api/adminApi";

const KBManagementPage = () => {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDocuments = async () => {
    try {
      const data = await getKbDocuments();
      setDocuments(data);
      setError("");
    } catch (err) {
      setError("Unable to load knowledge base documents");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title.trim() || !file) {
      setError("Please enter title and choose a file");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("file", file);

      await uploadKbDocument(formData);

      setTitle("");
      setCategory("General");
      setFile(null);
      setSuccess("Knowledge base document uploaded and processed successfully.");
      await loadDocuments();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    const confirmDelete = window.confirm("Delete this knowledge base document?");
    if (!confirmDelete) return;

    try {
      await deleteKbDocument(documentId);
      await loadDocuments();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete document");
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#09152e]">
          Knowledge Base Management
        </h1>
        <p className="text-[#45464d] mt-1">
          Upload company documents for RAG-based knowledge search.
        </p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-semibold">
          {success}
        </div>
      )}

      <div className="grid xl:grid-cols-[420px_1fr] gap-6">
        <GlassCard className="p-6 h-fit">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-lg bg-[#C6A75E] flex items-center justify-center">
              <span className="material-symbols-outlined text-white">upload_file</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#09152e]">Upload Document</h2>
              <p className="text-[#45464d] text-sm">PDF, TXT, or DOCX allowed</p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                Title
              </label>
              <input
                className="input-glass w-full rounded-lg px-4 py-3 mt-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="IT VPN Support Policy"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                Category
              </label>
              <select
                className="input-glass w-full rounded-lg px-4 py-3 mt-1"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">General</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Facilities">Facilities</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                File
              </label>
              <input
                className="input-glass w-full rounded-lg px-4 py-3 mt-1"
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <p className="text-xs text-[#45464d] mt-2">
                After upload, backend extracts text, chunks it, creates embeddings, and stores it in ChromaDB.
              </p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-[#09152e] text-white px-5 py-3 rounded-lg font-bold hover:bg-[#1f2a44] disabled:opacity-60"
            >
              {uploading ? "Uploading & Processing..." : "Upload to Knowledge Base"}
            </button>
          </form>
        </GlassCard>

        <GlassCard className="overflow-hidden">
          <div className="p-5 border-b border-[#09152e]/10">
            <h2 className="text-xl font-bold text-[#09152e]">Uploaded Documents</h2>
            <p className="text-sm text-[#45464d]">Documents used by the RAG search engine</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-white/50 border-b border-[#09152e]/10">
                <tr>
                  <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Title</th>
                  <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">File</th>
                  <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Category</th>
                  <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Status</th>
                  <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Action</th>
                </tr>
              </thead>

              <tbody>
                {documents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-10 text-center text-[#45464d]">
                      No documents uploaded.
                    </td>
                  </tr>
                )}

                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-[#09152e]/10 hover:bg-white/40">
                    <td className="px-5 py-4 font-bold text-[#09152e]">{doc.title}</td>
                    <td className="px-5 py-4 text-[#45464d]">{doc.file_name}</td>
                    <td className="px-5 py-4">
                      <span className="bg-[#eadeca] text-[#372800] px-3 py-1 rounded-full text-xs font-bold">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-bold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default KBManagementPage;