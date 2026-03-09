"use client";

interface Skill {
  id: string;
  name: string;
}

interface SkillsListProps {
  skills: Skill[];
  isOwner: boolean;
  onDelete?: (id: string) => void;
}

export default function SkillsList({ skills, isOwner, onDelete }: SkillsListProps) {
  if (skills.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <h2 className="text-lg font-semibold text-linkedin-text mb-4">Skills</h2>
      <div className="space-y-3">
        {skills.map((skill, i) => (
          <div
            key={skill.id}
            className={`flex items-center justify-between py-2 ${i < skills.length - 1 ? "border-b border-linkedin-border" : ""}`}
          >
            <span className="text-sm font-semibold text-linkedin-text">{skill.name}</span>
            {isOwner && onDelete && (
              <button
                onClick={() => onDelete(skill.id)}
                className="text-linkedin-text-tertiary hover:text-red-500 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
