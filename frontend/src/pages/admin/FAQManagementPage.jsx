import { useEffect, useState } from "react";
import GlassCard from "../../components/common/GlassCard";
import { getAdminFaqs, createFaq, updateFaq, deleteFaq } from "../../api/adminApi";

const emptyForm = {
  question: "",
  answer: "",
  category: "General",
};

const FAQManagementPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [error, setError] = useState("");

  const loadFaqs = async () => {
    try {
      const data = await getAdminFaqs();
      setFaqs(data);
      setError("");
    } catch (err) {
      setError("Unable to load FAQs");
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingFaqId(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingFaqId) {
        await updateFaq(editingFaqId, formData);
      } else {
        await createFaq(formData);
      }

      resetForm();
      await loadFaqs();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save FAQ");
    }
  };

  const handleEdit = (faq) => {
    setEditingFaqId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "General",
      status: faq.status,
    });
  };

  const handleDelete = async (faqId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this FAQ?");
    if (!confirmDelete) return;

    try {
      await deleteFaq(faqId);
      await loadFaqs();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete FAQ");
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#09152e]">
          FAQ Management
        </h1>
        <p className="text-[#45464d] mt-1">
          Manually add and manage FAQ content for customer search.
        </p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="grid xl:grid-cols-[430px_1fr] gap-6">
        <GlassCard className="p-6 h-fit">
          <h2 className="text-2xl font-bold text-[#09152e] mb-1">
            {editingFaqId ? "Edit FAQ" : "Add FAQ"}
          </h2>
          <p className="text-[#45464d] text-sm mb-5">
            FAQ is manual. RAG is only for Knowledge Base.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                Question
              </label>
              <input
                className="input-glass w-full rounded-lg px-4 py-3 mt-1"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="How to reset my password?"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                Answer
              </label>
              <textarea
                className="input-glass w-full rounded-lg px-4 py-3 mt-1 min-h-[150px] resize-none"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Enter FAQ answer..."
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                Category
              </label>
              <select
                className="input-glass w-full rounded-lg px-4 py-3 mt-1"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="General">General</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Facilities">Facilities</option>
              </select>
            </div>

            {editingFaqId && (
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                  Status
                </label>
                <select
                  className="input-glass w-full rounded-lg px-4 py-3 mt-1"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="draft">draft</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#09152e] text-white px-5 py-3 rounded-lg font-bold hover:bg-[#1f2a44]"
            >
              {editingFaqId ? "Update FAQ" : "Create FAQ"}
            </button>

            {editingFaqId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full border border-[#09152e]/20 text-[#09152e] px-5 py-3 rounded-lg font-bold hover:bg-[#09152e]/5"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </GlassCard>

        <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
          {faqs.length === 0 && (
            <GlassCard className="p-8 text-center text-[#45464d]">
              No FAQs found.
            </GlassCard>
          )}

          {faqs.map((faq) => (
            <GlassCard key={faq.id} className="p-5">
              <div className="flex justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-bold text-[#09152e] text-lg">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-[#45464d] mt-2 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>

                <span
                  className={`h-fit px-3 py-1 rounded-full text-xs font-bold ${
                    faq.status === "active"
                      ? "bg-green-100 text-green-700"
                      : faq.status === "draft"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {faq.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="bg-[#eadeca] text-[#372800] px-3 py-1 rounded-full text-xs font-bold">
                  {faq.category}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="bg-[#09152e] text-white px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQManagementPage;