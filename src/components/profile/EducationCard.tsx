"use client";

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string | null;
}

interface EducationCardProps {
  educations: Education[];
  isOwner: boolean;
  onDelete?: (id: string) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function EducationCard({ educations, isOwner, onDelete }: EducationCardProps) {
  if (educations.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <h2 className="text-lg font-semibold text-linkedin-text mb-4">Education</h2>
      <div className="space-y-5">
        {educations.map((edu, i) => (
          <div key={edu.id} className={`flex gap-4 ${i < educations.length - 1 ? "pb-5 border-b border-linkedin-border" : ""}`}>
            <div className="w-12 h-12 bg-linkedin-bg rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-linkedin-text-tertiary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm text-linkedin-text">{edu.school}</h3>
                  <p className="text-sm text-linkedin-text-secondary">{edu.degree}, {edu.field}</p>
                  <p className="text-xs text-linkedin-text-tertiary mt-0.5">
                    {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : "Present"}
                  </p>
                </div>
                {isOwner && onDelete && (
                  <button onClick={() => onDelete(edu.id)} className="text-linkedin-text-tertiary hover:text-red-500 p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
