import  { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { contentService } from "../services/contentService";
import aiService from "../services/aiService";

// ── STAGES ──
const STAGE = { INTRO: "intro", INTERVIEW: "interview", EVALUATING: "evaluating", RESULT: "result" };

function MockInterview() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((store) => store.auth);
  const [jobData, setJobData] = useState(null);
  const [stage, setStage] = useState(STAGE.INTRO);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!jobId) return;
    contentService.getSingleJob(jobId).then(setJobData).catch(console.error);
  }, [jobId]);

  // Timer
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleSubmitAnswer();
    }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timeLeft]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const candidateProfile = `
        Name: ${userData?.userProfile?.name || "Candidate"}
        Role: ${userData?.userProfile?.primaryRole || ""}
        Skills: ${userData?.userProfile?.skills?.join(", ") || ""}
        Experience: ${userData?.userProfile?.yearsOfExperience || 0} years
        Bio: ${userData?.userProfile?.bio || ""}
      `;

      const prompt = `Generate 6 interview questions for this candidate applying for ${jobData?.title}.
CANDIDATE: ${candidateProfile}
JOB SKILLS: ${jobData?.skills?.join(", ") || ""}
JOB DESCRIPTION: ${jobData?.description?.replace(/<[^>]*>/g, "").substring(0, 500) || ""}

Mix of: 2 technical, 2 behavioural, 1 situational, 1 motivational.
Make them specific to this candidate and role.
Return ONLY a JSON array: [{"question":"<q>","type":"Technical|Behavioural|Situational|Motivational","hint":"<what a good answer covers>"}]`;

      const reply = await aiService.chat(prompt, { task: "generate_questions" });
      const raw = typeof reply === "string" ? reply : reply?.reply || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("[");
      const end = clean.lastIndexOf("]");
      const parsed = JSON.parse(clean.slice(start, end + 1));
      setQuestions(parsed);
      setStage(STAGE.INTERVIEW);
      setTimeLeft(120);
      setTimerActive(true);
      setTimeout(() => textareaRef.current?.focus(), 100);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() && timeLeft > 0) return;
    setTimerActive(false);
    clearTimeout(timerRef.current);

    const answer = currentAnswer.trim() || "[No answer provided]";
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setCurrentAnswer("");
    setEvaluating(true);

    // Evaluate this answer live
    try {
      const evalPrompt = `Evaluate this interview answer briefly.
QUESTION: ${questions[currentQ]?.question}
ANSWER: ${answer}
EXPECTED: ${questions[currentQ]?.hint}

Return ONLY JSON: {"score":<0-10>,"feedback":"<1-2 sentence feedback>","strength":"<what was good>","improvement":"<what to improve>"}`;

      const reply = await aiService.chat(evalPrompt, { task: "evaluate_answer" });
      const raw = typeof reply === "string" ? reply : reply?.reply || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const s = clean.indexOf("{");
      const e = clean.lastIndexOf("}");
      const evalResult = JSON.parse(clean.slice(s, e + 1));
      setFeedback((prev) => [...prev, evalResult]);
    } catch {
      setFeedback((prev) => [...prev, { score: 5, feedback: "Answer recorded.", strength: "Attempted", improvement: "Be more specific" }]);
    } finally {
      setEvaluating(false);
    }

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setTimeLeft(120);
      setTimerActive(true);
      setTimeout(() => textareaRef.current?.focus(), 100);
    } else {
      // All questions answered — generate final report
      generateFinalReport(newAnswers);
    }
  };

  const generateFinalReport = async (allAnswers) => {
    setStage(STAGE.EVALUATING);
    try {
      const qa = questions.map((q, i) => `Q${i + 1}: ${q.question}\nA: ${allAnswers[i] || "No answer"}`).join("\n\n");

      const prompt = `Generate a final interview scorecard.
CANDIDATE: ${userData?.userProfile?.name}
JOB: ${jobData?.title}

INTERVIEW Q&A:
${qa}

Return ONLY JSON:
{"overallScore":<0-100>,"hireConfidence":"<STRONG_HIRE|HIRE|MAYBE|PASS>","summary":"<3-4 sentence overall assessment>","strengths":["<3 key strengths shown>"],"improvements":["<3 areas to improve>"],"technicalScore":<0-10>,"communicationScore":<0-10>,"confidenceScore":<0-10>,"nextSteps":"<1-2 sentences on what to do next>"}`;

      const reply = await aiService.chat(prompt, { task: "final_scorecard" });
      const raw = typeof reply === "string" ? reply : reply?.reply || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const s = clean.indexOf("{");
      const e = clean.lastIndexOf("}");
      const report = JSON.parse(clean.slice(s, e + 1));
      setResult(report);
      setStage(STAGE.RESULT);
    } catch (err) {
      console.error(err);
      setStage(STAGE.RESULT);
      setResult({ overallScore: 65, hireConfidence: "MAYBE", summary: "Interview completed.", strengths: [], improvements: [], nextSteps: "Review your answers." });
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const timerColor = timeLeft > 60 ? "text-emerald-400" : timeLeft > 30 ? "text-amber-400" : "text-red-400";

  const hireColor = {
    STRONG_HIRE: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    HIRE: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    MAYBE: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    PASS: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  if (!jobData) return (
    <div className="min-h-screen bg-[#0D0F12] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0F12] pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* ── INTRO ── */}
        {stage === STAGE.INTRO && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-3xl mx-auto">🎙️</div>
              <h1 className="text-2xl font-bold text-white">AI Mock Interview</h1>
              <p className="text-gray-500">Practice for <span className="text-indigo-400 font-semibold">{jobData.title}</span> at <span className="text-white font-semibold">{jobData.employer?.userProfile?.companyName || "the company"}</span></p>
            </div>

            <div className="bg-[#131720] border border-white/5 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white">How it works</h3>
              {[
                { icon: "🧠", text: "AI generates 6 personalized questions based on your profile + job" },
                { icon: "⏱️", text: "You have 2 minutes per question to type your answer" },
                { icon: "📊", text: "AI evaluates each answer live and gives instant feedback" },
                { icon: "🏆", text: "Get a final scorecard with hire confidence rating" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <p className="text-sm text-gray-400">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
              <p className="text-xs text-amber-400">💡 Tip: Answer as you would in a real interview. Be specific, use examples, and structure your answers clearly.</p>
            </div>

            <button onClick={startInterview} disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-2xl transition-all text-lg shadow-lg shadow-indigo-900/30">
              {loading
                ? <span className="flex items-center justify-center gap-3"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Preparing your interview...</span>
                : "Start Mock Interview →"}
            </button>
          </div>
        )}

        {/* ── INTERVIEW ── */}
        {stage === STAGE.INTERVIEW && questions.length > 0 && (
          <div className="space-y-5">
            {/* Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {questions.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${
                    i < currentQ ? "bg-indigo-500 w-8" : i === currentQ ? "bg-indigo-400 w-10" : "bg-white/10 w-8"
                  }`} />
                ))}
              </div>
              <span className="text-xs text-gray-500">Question {currentQ + 1} of {questions.length}</span>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-between bg-[#131720] border border-white/5 rounded-2xl px-5 py-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  questions[currentQ]?.type === "Technical" ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  : questions[currentQ]?.type === "Behavioural" ? "bg-violet-500/10 border-violet-500/20 text-violet-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                }`}>{questions[currentQ]?.type}</span>
              </div>
              <div className={`flex items-center gap-1.5 font-mono text-lg font-bold ${timerColor}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Question */}
            <div className="bg-[#131720] border border-indigo-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">{currentQ + 1}</div>
                <p className="text-base font-medium text-white leading-relaxed">{questions[currentQ]?.question}</p>
              </div>
            </div>

            {/* Live feedback from previous */}
            {feedback.length > 0 && feedback.length === currentQ && (
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-indigo-400">Previous answer feedback</p>
                <p className="text-xs text-gray-400">{feedback[feedback.length - 1]?.feedback}</p>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">✓ {feedback[feedback.length - 1]?.strength}</span>
                </div>
              </div>
            )}

            {/* Answer area */}
            <div className="space-y-3">
              <textarea
                ref={textareaRef}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here... Be specific and use real examples."
                rows={6}
                className="w-full px-4 py-3 bg-[#131720] border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl text-sm text-gray-200 placeholder-gray-600 outline-none transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{currentAnswer.length} characters</span>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={evaluating || !currentAnswer.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all text-sm">
                  {evaluating
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Evaluating...</>
                    : currentQ + 1 === questions.length ? "Finish Interview →" : "Next Question →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── EVALUATING ── */}
        {stage === STAGE.EVALUATING && (
          <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" style={{ borderWidth: "3px" }} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">Generating your scorecard...</p>
              <p className="text-gray-500 text-sm mt-2">AI is analyzing all your answers</p>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {stage === STAGE.RESULT && result && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-4xl">🏆</div>
              <h1 className="text-2xl font-bold text-white">Interview Complete</h1>
              <p className="text-gray-500 text-sm">{jobData.title} · {jobData.employer?.userProfile?.companyName}</p>
            </div>

            {/* Score card */}
            <div className="bg-[#131720] border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Overall Score</p>
                  <p className="text-5xl font-bold text-white tabular-nums mt-1">{result.overallScore}<span className="text-xl text-gray-500">/100</span></p>
                </div>
                <span className={`text-sm font-bold px-4 py-2 rounded-xl border ${hireColor[result.hireConfidence] || hireColor.MAYBE}`}>
                  {result.hireConfidence?.replace("_", " ")}
                </span>
              </div>

              <div className="w-full bg-white/5 rounded-full h-2">
                <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full" style={{ width: `${result.overallScore}%` }} />
              </div>

              <p className="text-sm text-gray-400 leading-relaxed">{result.summary}</p>

              {/* Sub scores */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Technical", score: result.technicalScore, max: 10 },
                  { label: "Communication", score: result.communicationScore, max: 10 },
                  { label: "Confidence", score: result.confidenceScore, max: 10 },
                ].map((s, i) => (
                  <div key={i} className="text-center p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                    <p className="text-lg font-bold text-white">{s.score}<span className="text-xs text-gray-500">/{s.max}</span></p>
                    <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Strengths</p>
                {result.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <p className="text-sm text-gray-300">{s}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Improvements */}
            {result.improvements?.length > 0 && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 space-y-3">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Areas to Improve</p>
                {result.improvements.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p className="text-sm text-gray-300">{s}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Per-question breakdown */}
            {feedback.length > 0 && (
              <div className="bg-[#131720] border border-white/5 rounded-2xl p-5 space-y-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Question Breakdown</p>
                {questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${
                      (feedback[i]?.score || 0) >= 7 ? "bg-emerald-500/10 text-emerald-400" :
                      (feedback[i]?.score || 0) >= 5 ? "bg-indigo-500/10 text-indigo-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>{feedback[i]?.score || "?"}/10</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-300 line-clamp-2">{q.question}</p>
                      <p className="text-xs text-gray-500 mt-1">{feedback[i]?.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Next steps */}
            {result.nextSteps && (
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-indigo-400 mb-1">Next Steps</p>
                <p className="text-sm text-gray-400">{result.nextSteps}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => { setStage(STAGE.INTRO); setAnswers([]); setFeedback([]); setCurrentQ(0); setResult(null); setQuestions([]); }}
                className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-semibold rounded-xl transition-all text-sm">
                Retry Interview
              </button>
              <button onClick={() => navigate(`/job/${jobId}`)}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all text-sm">
                Apply for This Job →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MockInterview;