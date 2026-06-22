import { useState } from "react";
import { Link } from "react-router-dom";

import GlassCard from "../../components/common/GlassCard";
import PrimaryButton from "../../components/common/PrimaryButton";
import { searchFaqs } from "../../api/faqApi";
import { askKnowledgeBase } from "../../api/ragApi";

const HomePage = () => {
  const [faqQuery, setFaqQuery] = useState("");
  const [faqResults, setFaqResults] = useState([]);
  const [faqLoading, setFaqLoading] = useState(false);

  const [ragQuestion, setRagQuestion] = useState("");
  const [ragAnswer, setRagAnswer] = useState(null);
  const [ragLoading, setRagLoading] = useState(false);

  const handleFaqSearch = async () => {
    if (!faqQuery.trim()) return;

    try {
      setFaqLoading(true);
      const data = await searchFaqs(faqQuery);
      setFaqResults(data);
    } catch (error) {
      setFaqResults([]);
    } finally {
      setFaqLoading(false);
    }
  };

  const handleRagAsk = async () => {
    if (!ragQuestion.trim()) return;

    try {
      setRagLoading(true);
      const data = await askKnowledgeBase(ragQuestion);
      setRagAnswer(data);
    } catch (error) {
      setRagAnswer({
        answer: "Unable to get knowledge base answer right now.",
        sources: [],
      });
    } finally {
      setRagLoading(false);
    }
  };



return (
  <div className="min-h-[calc(100vh-72px)] bg-[#F7F4EE] overflow-hidden">
    {/* NAVY TOP PART */}
    <section className="bg-[#1F2A44] h-[285px] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-3">
            SMART SERVICE DESK
          </h1>
          <p className="text-[#d9e2ff] text-base">
            How can we help you today?
          </p>
        </div>
      </section>

    {/* OFF-WHITE BOTTOM PART */}
    <section className="max-w-[1440px] mx-auto px-6 md:px-8 -mt-[70px] pb-8">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* FAQ SEARCH */}
        <GlassCard className="p-6 min-h-[390px]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-lg bg-[#1F2A44] flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                quiz
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1F2A44]">
                Search FAQs
              </h2>
              <p className="text-[#45464d] text-sm">
                Quick answers from admin-managed FAQs
              </p>
            </div>
          </div>

          <div className="input-glass rounded-lg p-3 flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#45464d]">
              search
            </span>

            <input
              className="bg-transparent border-none focus:ring-0 w-full outline-none"
              placeholder="Example: password, leave, VPN, AC"
              value={faqQuery}
              onChange={(e) => setFaqQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFaqSearch()}
            />

            <button
              onClick={handleFaqSearch}
              className="bg-[#1F2A44] hover:bg-[#09152e] text-white px-5 py-2 rounded-lg text-sm font-bold"
            >
              Search
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {faqLoading && (
              <p className="text-[#45464d] text-sm">Searching FAQs...</p>
            )}

            {!faqLoading && faqResults.length === 0 && (
              <div className="bg-white/60 rounded-lg p-4 border border-white/50">
                <p className="text-[#45464d] text-sm">
                  Search for common questions like password reset, leave, VPN, or facilities.
                </p>
              </div>
            )}

            {faqResults.map((faq) => (
              <div
                key={faq.id}
                className="bg-white/70 rounded-lg p-4 border border-white/60"
              >
                <div className="flex justify-between gap-3 mb-2">
                  <h3 className="font-bold text-[#1F2A44]">
                    {faq.question}
                  </h3>

                  <span className="text-xs bg-[#E8DCC8] text-[#372800] px-2 py-1 rounded-full font-bold h-fit">
                    {faq.category}
                  </span>
                </div>

                <p className="text-[#45464d] text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* RAG SEARCH */}
        <GlassCard className="p-7 min-h-[460px]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-lg bg-[#C6A75E] flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                psychology
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1F2A44]">
                Ask Knowledge Base
              </h2>
              <p className="text-[#45464d] text-sm">
                RAG answer from uploaded company documents
              </p>
            </div>
          </div>

          <div className="input-glass rounded-lg p-3 flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#45464d]">
              travel_explore
            </span>

            <input
              className="bg-transparent border-none focus:ring-0 w-full outline-none"
              placeholder="Ask about company policies or support steps..."
              value={ragQuestion}
              onChange={(e) => setRagQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRagAsk()}
            />

            <button
              onClick={handleRagAsk}
              className="bg-[#C6A75E] hover:bg-[#b89547] text-white px-5 py-2 rounded-lg text-sm font-bold"
            >
              Ask
            </button>
          </div>

          <div className="bg-white/60 rounded-lg p-5 border border-white/50 min-h-[210px]">
            {ragLoading && (
              <p className="text-[#45464d] text-sm">
                Generating answer from knowledge base...
              </p>
            )}

            {!ragLoading && !ragAnswer && (
              <div className="flex flex-col items-center justify-center min-h-[170px] text-center">
                <span className="material-symbols-outlined text-4xl text-[#C6A75E] mb-3">
                  info
                </span>
                <p className="text-[#45464d] text-sm max-w-[80%]">
                  Ask any question about company policy, IT hardware, benefits, or procedures to query the knowledge base.
                </p>
              </div>
            )}

            {!ragLoading && ragAnswer && (
              <>
                <h3 className="font-bold text-[#1F2A44] mb-3">
                  Knowledge Base Answer
                </h3>

                <p className="text-[#45464d] text-sm leading-relaxed whitespace-pre-line">
                  {ragAnswer.answer}
                </p>

                {ragAnswer.sources?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#1F2A44] mb-2">
                      Sources
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {ragAnswer.sources.map((source, index) => (
                        <span
                          key={index}
                          className="text-xs bg-[#E8DCC8] text-[#372800] px-3 py-1 rounded-full font-bold"
                        >
                          {source.title || "KB Document"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </GlassCard>
      </div>

      <div className="max-w-[520px] mx-auto mt-10 text-center">
        <p className="text-[#45464d] text-sm mb-4">
          Can&apos;t find what you&apos;re looking for?
        </p>

        <Link to="/login">
          <PrimaryButton variant="gold">
             Contact Our Agent
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </PrimaryButton>
        </Link>
      </div>
    </section>
  </div>
);
};

export default HomePage;
