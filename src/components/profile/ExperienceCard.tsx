"use client";

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
}

interface ExperienceCardProps {
  experiences: Experience[];
  isOwner: boolean;
  onDelete?: (id: string) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ExperienceCard({ experiences, isOwner, onDelete }: ExperienceCardProps) {
  if (experiences.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <h2 className="text-lg font-semibold text-linkedin-text mb-4">Experience</h2>
      <div className="space-y-5">
        {experiences.map((exp, i) => (
          <div key={exp.id} className={`flex gap-4 ${i < experiences.length - 1 ? "pb-5 border-b border-linkedin-border" : ""}`}>
            <div className="w-12 h-12 bg-linkedin-bg rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-linkedin-text-tertiary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm text-linkedin-text">{exp.title}</h3>
                  <p className="text-sm text-linkedin-text-secondary">{exp.company}</p>
                  <p className="text-xs text-linkedin-text-tertiary mt-0.5">
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </p>
                </div>
                {isOwner && onDelete && (
                  <button onClick={() => onDelete(exp.id)} className="text-linkedin-text-tertiary hover:text-red-500 p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              {exp.description && (
                <p className="text-sm text-linkedin-text-secondary mt-2 leading-relaxed">{exp.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
