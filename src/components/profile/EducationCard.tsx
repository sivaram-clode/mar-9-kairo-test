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
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function EducationCard({
  educations,
  isOwner,
  onDelete,
}: EducationCardProps) {
  if (educations.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
      <div className="space-y-4">
        {educations.map((edu) => (
          <div key={edu.id} className="flex gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-lg">
              🎓
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                  <p className="text-gray-600">
                    {edu.degree}, {edu.field}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(edu.startDate)} –{" "}
                    {edu.endDate ? formatDate(edu.endDate) : "Present"}
                  </p>
                </div>
                {isOwner && onDelete && (
                  <button
                    onClick={() => onDelete(edu.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
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
