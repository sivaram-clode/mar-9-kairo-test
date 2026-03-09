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
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function ExperienceCard({
  experiences,
  isOwner,
  onDelete,
}: ExperienceCardProps) {
  if (experiences.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp, i) => (
          <div key={exp.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-lg">
                🏢
              </div>
              {i < experiences.length - 1 && (
                <div className="w-px flex-1 bg-gray-200 mt-2" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </p>
                </div>
                {isOwner && onDelete && (
                  <button
                    onClick={() => onDelete(exp.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              {exp.description && (
                <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
