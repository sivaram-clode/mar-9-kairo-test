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

export default function SkillsList({
  skills,
  isOwner,
  onDelete,
}: SkillsListProps) {
  if (skills.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
          >
            {skill.name}
            {isOwner && onDelete && (
              <button
                onClick={() => onDelete(skill.id)}
                className="ml-1 text-blue-400 hover:text-red-500"
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
