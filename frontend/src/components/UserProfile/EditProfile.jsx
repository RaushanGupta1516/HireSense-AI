import { useEffect, useState } from "react";
import AboutForm from "./AboutForm";
import SocialProfileForm from "./SocialProfileForm";
import WorkExperienceCard from "./WorkExperienceCard";
import WorkExperienceForm from "./WorkExperienceForm";
import EducationCard from "./EducationCard";
import EducationForm from "./EducationForm";
import { useSelector } from "react-redux";
import SkillsSearch from "../Common/SkillsSearch";

// ── SECTION WRAPPER ──
function ProfileSection({ icon, title, description, children, last = false }) {
  return (
    <div className={`flex flex-col md:flex-row gap-8 py-8 ${!last ? "border-b border-white/5" : ""}`}>
      {/* Left label */}
      <div className="w-full md:w-[28%] shrink-0 flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <p className="font-semibold text-white text-sm">{title}</p>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed pl-9">{description}</p>
      </div>

      {/* Right content */}
      <div className="w-full md:w-[72%]">{children}</div>
    </div>
  );
}

// ── ADD BUTTON ──
function AddButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-150 mt-1 group"
    >
      <div className="w-5 h-5 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      {label}
    </button>
  );
}

function EditProfile() {
  const [showAddWorkExperience, setShowAddWorkExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(new Map());

  const { userData } = useSelector((store) => store.auth);
  const userEducation = userData?.userProfile?.education || [];
  const userWorkExperience = userData?.userProfile?.workExperience || [];

  const [workExperienceFormData, setWorkExperienceFormData] = useState(null);
  const [educationFormData, setEducationFormData] = useState(null);

  useEffect(() => {
    if (userData?.userProfile?.skills) {
      setSelectedSkills(new Map(userData.userProfile.skills.map((s) => [s, true])));
    }
  }, [userData]);

  if (!userData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  const sections = [
    {
      icon: (
        <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: "About",
      description: "Tell us about yourself so companies know who you are.",
      content: <AboutForm userData={userData} />,
    },
    {
      icon: (
        <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      title: "Social Profiles",
      description: "Where can people find you online?",
      content: <SocialProfileForm userData={userData} />,
    },
    {
      icon: (
        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Work Experience",
      description: "What positions have you held?",
      content: (
        <div className="flex flex-col gap-3">
          {userWorkExperience.length > 0 && (
            <div className="flex flex-col gap-3">
              {userWorkExperience.map((exp, i) => (
                <WorkExperienceCard
                  key={i} exp={exp}
                  setShowAddWorkExperience={setShowAddWorkExperience}
                  setWorkExperienceFormData={setWorkExperienceFormData}
                />
              ))}
            </div>
          )}
          {showAddWorkExperience ? (
            <WorkExperienceForm
              setShowAddWorkExperience={setShowAddWorkExperience}
              data={workExperienceFormData}
              setWorkExperienceFormData={setWorkExperienceFormData}
            />
          ) : (
            <AddButton label="Add work experience" onClick={() => { setWorkExperienceFormData(null); setShowAddWorkExperience(true); }} />
          )}
        </div>
      ),
    },
    {
      icon: (
        <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      title: "Education",
      description: "What schools have you studied at?",
      content: (
        <div className="flex flex-col gap-3">
          {userEducation.length > 0 && (
            <div className="flex flex-col gap-3">
              {userEducation.map((edu, i) => (
                <EducationCard
                  key={i} edu={edu}
                  setShowAddEducation={setShowAddEducation}
                  setEducationFormData={setEducationFormData}
                />
              ))}
            </div>
          )}
          {showAddEducation ? (
            <EducationForm
              setShowAddEducation={setShowAddEducation}
              educationFormData={educationFormData}
              setEducationFormData={setEducationFormData}
            />
          ) : (
            <AddButton label="Add education" onClick={() => { setEducationFormData(null); setShowAddEducation(true); }} />
          )}
        </div>
      ),
    },
    {
      icon: (
        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Skills",
      description: "This helps companies hone in on your strengths.",
      content: (
        <SkillsSearch
          selectedSkills={selectedSkills}
          setSelectedSkills={setSelectedSkills}
          profile={true}
        />
      ),
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Keep your profile updated to get better job matches.</p>
      </div>

      {/* Profile completion nudge */}
      {selectedSkills.size === 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl mb-6">
          <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-amber-400">Complete your profile</p>
            <p className="text-xs text-gray-500 mt-0.5">Add your skills to get 3x more profile views from recruiters.</p>
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="bg-[#131720] border border-white/5 rounded-2xl px-6 sm:px-8 shadow-xl">
        {sections.map((section, i) => (
          <ProfileSection
            key={i}
            icon={section.icon}
            title={section.title}
            description={section.description}
            last={i === sections.length - 1}
          >
            {section.content}
          </ProfileSection>
        ))}
      </div>
    </div>
  );
}

export default EditProfile;