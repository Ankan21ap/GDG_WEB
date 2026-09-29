import { useState } from "react";
import { Search, ChevronDown, HelpCircle, Filter } from "lucide-react";
import { faqItems } from "../data/faq";
import { GoogleDots } from "../components/GoogleColorsBar";

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>("faq-e1");

  const categories = ["All", "Events", "Registration", "Participation", "Certificates", "Community", "Technical"];

  const filteredFaqs = faqItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div id="faq-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 bg-[#F8F9FA] text-[#202124]">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DADCE0] text-[#3C4043] shadow-2xs">
          <HelpCircle className="w-3.5 h-3.5 text-[#1A73E8]" />
          <span>Help &amp; Answers</span>
          <GoogleDots />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202124] tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-[#5F6368] max-w-2xl mx-auto">
          Everything you need to know about attending GDG on Campus FIEM events, claiming entry passes, earning certificates, and getting involved.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#80868B] pointer-events-none" />
        <input
          type="text"
          id="search-faqs-input"
          placeholder="Search questions (e.g. beginners, certificates, cost)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-[#DADCE0] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#1A73E8] transition-colors shadow-2xs"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-[#5F6368] hidden sm:inline-block mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#1A73E8] text-white shadow-xs"
                : "bg-white text-[#5F6368] hover:text-[#202124] hover:bg-neutral-50 border border-[#DADCE0]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-3">
          {filteredFaqs.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                id={`faq-item-${item.id}`}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? "bg-white border-blue-400 shadow-sm ring-1 ring-blue-200"
                    : "bg-white border-[#DADCE0] hover:border-neutral-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#1A73E8]">
                      {item.category}
                    </span>
                    <span className="text-base font-bold text-[#202124] leading-snug">
                      {item.question}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-[#5F6368] transition-transform duration-200 shrink-0 ${
                      isExpanded ? "rotate-180 text-[#1A73E8]" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 text-sm text-[#5F6368] leading-relaxed border-t border-neutral-100 bg-neutral-50/50 animate-in fade-in duration-200">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-[#DADCE0] rounded-2xl p-12 text-center max-w-md mx-auto space-y-3 shadow-xs">
          <HelpCircle className="w-8 h-8 text-[#80868B] mx-auto" />
          <h3 className="text-base font-bold text-[#202124]">No questions found</h3>
          <p className="text-xs text-[#5F6368]">
            No FAQ entries matched "{searchQuery}". You can also reach out to our team directly through the Connect page!
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="text-xs text-[#1A73E8] font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Still have questions banner */}
      <div className="bg-white border border-[#DADCE0] rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-xs">
        <h3 className="text-lg font-bold text-[#202124]">Still have a question?</h3>
        <p className="text-xs sm:text-sm text-[#5F6368] max-w-md mx-auto">
          Our core organizers and community leads are always happy to help. Send us an email or connect through our social channels.
        </p>
        <div className="pt-2">
          <a
            href="mailto:gdgcampus.fiem@gmail.com"
            className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white hover:bg-neutral-50 text-[#3C4043] hover:text-[#202124] border border-[#DADCE0] text-xs font-semibold transition-colors shadow-2xs"
          >
            <span>Email Organizers</span>
          </a>
        </div>
      </div>
    </div>
  );
}
