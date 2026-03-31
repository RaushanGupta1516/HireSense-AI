 function ApplicantInfoUi() {
  const fields = [
    { label: "Full Name", value: "Margot Foster" },
    { label: "Application For", value: "Backend Developer" },
    { label: "Email Address", value: "margotfoster@example.com" },
    { label: "Salary Expectation", value: "$120,000" },
    {
      label: "About",
      value: "Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident.",
    },
  ];

  const attachments = [
    { name: "resume_back_end_developer.pdf", size: "2.4mb" },
    { name: "coverletter_back_end_developer.pdf", size: "4.5mb" },
  ];

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Applicant Information</h3>
        <p className="text-sm text-gray-500 mt-1">Personal details and application.</p>
      </div>

      {/* Fields */}
      <div className="bg-[#131720] border border-white/5 rounded-2xl overflow-hidden">
        {fields.map((field, i) => (
          <div key={i} className={`flex flex-col sm:grid sm:grid-cols-3 sm:gap-4 px-6 py-5 ${i < fields.length - 1 ? "border-b border-white/5" : ""}`}>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-0.5">{field.label}</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 text-sm text-gray-300 leading-relaxed">{field.value}</dd>
          </div>
        ))}

        {/* Attachments */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-4 px-6 py-5 border-t border-white/5">
          <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-0.5">Attachments</dt>
          <dd className="mt-2 sm:mt-0 sm:col-span-2">
            <ul className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden">
              {attachments.map((file, i) => (
                <li key={i} className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-300 truncate">{file.name}</p>
                      <p className="text-xs text-gray-600">{file.size}</p>
                    </div>
                  </div>
                  <a href="#"
                    className="ml-4 shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </div>
    </div>
  );
}
export default ApplicantInfoUi;