import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ============================================================
// SVG ICON COMPONENTS
// ============================================================

const Icons = {
  graduationCap: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/>
    </svg>
  ),
  layoutDashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
    </svg>
  ),
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  bookOpen: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  barChart: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  ),
  calendar: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  fileText: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  logOut: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  bell: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  plus: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  edit: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  trash: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  eye: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  menu: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  trendingUp: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  checkCircle: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  xCircle: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  alertCircle: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  clipboard: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  ),
  arrowLeft: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  refresh: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
  clock: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  award: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  ),
  target: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  x: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  chevronDown: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

// ============================================================
// PAGE NAME LABELS
// ============================================================

const PAGE_LABELS = {
  dashboard: "Dashboard",
  students: "Students",
  subjects: "Subjects",
  grades: "Grades",
  attendance: "Attendance",
  assignments: "Assignments",
  settings: "Settings",
};

function App() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");

  // =========================
  // AUTHENTICATION
  // =========================

  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem("acadflow_token");
    if (!saved) return null;
    try {
      const parts = saved.split(".");
      if (parts.length !== 3) {
        localStorage.removeItem("acadflow_token");
        return null;
      }
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("acadflow_token");
        return null;
      }
      return saved;
    } catch {
      localStorage.removeItem("acadflow_token");
      return null;
    }
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // UI STATE
  // =========================

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Topbar interactive states
  const [globalSearch, setGlobalSearch] = useState("");
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "AcadFlow System Ready",
      message: "FastAPI REST API active with SQLite database.",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      title: "Academic Curriculum Active",
      message: "Subjects, grading metrics, and coursework tracking online.",
      time: "5m ago",
      read: false,
    },
    {
      id: 3,
      title: "Administrative Privileges",
      message: "Authenticated with full Read & Write administrative access.",
      time: "10m ago",
      read: false,
    },
  ]);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close topbar dropdowns when clicking outside
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowGlobalSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  const currentUsername = useMemo(() => {
    if (!token) return "admin";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || "admin";
    } catch {
      return "admin";
    }
  }, [token]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // =========================
  // AUTH FETCH WRAPPER
  // Handles 401 auto-logout for expired tokens
  // =========================

  const doLogout = useCallback(() => {
    localStorage.removeItem("acadflow_token");
    setToken(null);
    setActivePage("dashboard");
    setStudents([]);
    setSubjects([]);
    setGrades([]);
    setAttendances([]);
    setAssignments([]);
    setSelectedStudent(null);
    setStudentSummary(null);
    setEditingStudent(null);
    setEditingAssignment(null);
    setUsername("");
    setPassword("");
    setLoginError("");
  }, []);

  const authFetch = useCallback(async (url, options = {}) => {
    const currentToken = localStorage.getItem("acadflow_token");
    if (!currentToken) {
      doLogout();
      throw new Error("No authentication token");
    }
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${currentToken}`,
    };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      addToast("Session expired. Please log in again.", "error");
      doLogout();
      throw new Error("Session expired");
    }
    return response;
  }, [doLogout, addToast]);

  // =========================
  // STUDENT STATES
  // =========================

  const [showStudentForm, setShowStudentForm] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");

  const [studentError, setStudentError] = useState("");
  const [studentSuccess, setStudentSuccess] = useState("");
  const [savingStudent, setSavingStudent] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSummary, setStudentSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");

  // =========================
  // SUBJECT STATES
  // =========================

  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [subjectSuccess, setSubjectSuccess] = useState("");
  const [savingSubject, setSavingSubject] = useState(false);
  const [subjectSearchTerm, setSubjectSearchTerm] = useState("");

  // =========================
  // GRADE STATES
  // =========================

  const [grades, setGrades] = useState([]);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [gradeStudentId, setGradeStudentId] = useState("");
  const [gradeSubjectId, setGradeSubjectId] = useState("");
  const [gradeScore, setGradeScore] = useState("");
  const [gradeSemester, setGradeSemester] = useState("");
  const [gradeError, setGradeError] = useState("");
  const [gradeSuccess, setGradeSuccess] = useState("");
  const [savingGrade, setSavingGrade] = useState(false);
  const [gradeStudentFilter, setGradeStudentFilter] = useState("all");
  const [gradeSubjectFilter, setGradeSubjectFilter] = useState("all");
  const [gradeSemesterFilter, setGradeSemesterFilter] = useState("all");

  // =========================
  // ATTENDANCE STATES
  // =========================

  const [attendances, setAttendances] = useState([]);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [attendanceStudentId, setAttendanceStudentId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceStatus, setAttendanceStatus] = useState("Present");
  const [attendanceError, setAttendanceError] = useState("");
  const [attendanceSuccess, setAttendanceSuccess] = useState("");
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceStudentFilter, setAttendanceStudentFilter] = useState("all");
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState("all");
  const [attendanceDateFilter, setAttendanceDateFilter] = useState("");

  // =========================
  // ASSIGNMENT STATES
  // =========================

  const [assignments, setAssignments] = useState([]);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentSubjectId, setAssignmentSubjectId] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [assignmentStatus, setAssignmentStatus] = useState("Pending");
  const [assignmentError, setAssignmentError] = useState("");
  const [assignmentSuccess, setAssignmentSuccess] = useState("");
  const [savingAssignment, setSavingAssignment] = useState(false);
  const [assignmentSubjectFilter, setAssignmentSubjectFilter] = useState("all");
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState("all");
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState("");
  const [editingAssignment, setEditingAssignment] = useState(null);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoginError("");
    setLoading(true);

    try {
      const formData = new URLSearchParams();

      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(
          data.detail || "Invalid username or password"
        );
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "acadflow_token",
        data.access_token
      );

      setToken(data.access_token);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Unable to connect to server");
    }

    setLoading(false);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    doLogout();
  };

  // =========================
  // FETCH STUDENTS
  // =========================

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/students`);

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();

      console.log("Students from API:", data);

      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // =========================
  // FETCH SUBJECTS
  // =========================

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${API_URL}/subjects`);

      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }

      const data = await response.json();

      console.log("Subjects from API:", data);

      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  // =========================
  // FETCH GRADES
  // =========================

  const fetchGrades = async () => {
    try {
      const response = await fetch(`${API_URL}/grades`);

      if (!response.ok) {
        throw new Error("Failed to fetch grades");
      }

      const data = await response.json();
      console.log("Grades from API:", data);
      setGrades(data);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  // =========================
  // FETCH ATTENDANCE
  // =========================

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_URL}/attendance`);
      if (!response.ok) {
        throw new Error("Failed to fetch attendance");
      }
      const data = await response.json();
      console.log("Attendance from API:", data);
      setAttendances(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  // =========================
  // FETCH ASSIGNMENTS
  // =========================

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${API_URL}/assignments`);
      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }
      const data = await response.json();
      console.log("Assignments from API:", data);
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    if (token) {
      setInitialLoading(true);
      Promise.all([
        fetchStudents(),
        fetchSubjects(),
        fetchGrades(),
        fetchAttendance(),
        fetchAssignments(),
      ]).finally(() => setInitialLoading(false));
    } else {
      setInitialLoading(false);
    }
  }, [token]);

  // =========================
  // ADD STUDENT
  // =========================

  const handleAddStudent = async (event) => {
    event.preventDefault();

    setStudentError("");
    setStudentSuccess("");
    setSavingStudent(true);

    try {
      const response = await authFetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: studentName,
          grade_level: gradeLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStudentError(
          data.detail || "Unable to add student"
        );
        setSavingStudent(false);
        return;
      }

      setStudents((currentStudents) => [
        ...currentStudents,
        data,
      ]);

      setStudentName("");
      setGradeLevel("");

      addToast("Student added successfully");
      setShowStudentForm(false);
    } catch (error) {
      console.error("Add student error:", error);
      if (error.message === "Session expired" || error.message === "No authentication token") {
        setShowStudentForm(false);
      } else {
        setStudentError("Unable to connect to server");
      }
    }

    setSavingStudent(false);
  };

  // =========================
  // DELETE STUDENT
  // =========================

  const handleDeleteStudent = async (studentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await authFetch(
        `${API_URL}/students/${studentId}`,
        {
          method: "DELETE",
          headers: {},
        }
      );

      if (!response.ok) {
        let message = "Unable to delete student";

        try {
          const data = await response.json();
          message = data.detail || message;
        } catch {
          // No JSON response
        }

        addToast(message, "error");
        return;
      }

      setStudents((currentStudents) =>
        currentStudents.filter(
          (student) => student.id !== studentId
        )
      );

      if (selectedStudent?.id === studentId) {
        setSelectedStudent(null);
      }

      if (editingStudent?.id === studentId) {
        setEditingStudent(null);
      }

      addToast("Student deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      addToast("Unable to connect to server", "error");
    }
  };

  // =========================
  // UPDATE STUDENT
  // =========================

  const handleUpdateStudent = async (event) => {
    event.preventDefault();

    if (!editingStudent) {
      return;
    }

    try {
      const response = await authFetch(
        `${API_URL}/students/${editingStudent.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingStudent.name,
            grade_level: editingStudent.grade_level,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        addToast(data.detail || "Unable to update student", "error");
        return;
      }

      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === data.id
            ? data
            : student
        )
      );

      setEditingStudent(null);
      addToast("Student updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      addToast("Unable to connect to server", "error");
    }
  };

  const handleViewStudent = async (student) => {
    setSelectedStudent(student);
    setStudentSummary(null);
    setLoadingSummary(true);

    try {
      const response = await fetch(`${API_URL}/students/${student.id}/summary`);
      if (response.ok) {
        const data = await response.json();
        setStudentSummary(data);
      }
    } catch (error) {
      console.error("Error fetching student summary:", error);
    }

    setLoadingSummary(false);
  };

  // =========================
  // ADD SUBJECT
  // =========================

  const handleAddSubject = async (event) => {
    event.preventDefault();

    setSubjectError("");
    setSubjectSuccess("");
    setSavingSubject(true);

    try {
      const response = await authFetch(`${API_URL}/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: subjectName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubjectError(
          data.detail || "Unable to add subject"
        );
        setSavingSubject(false);
        return;
      }

      setSubjects((currentSubjects) => [
        ...currentSubjects,
        data,
      ]);

      setSubjectName("");

      addToast("Subject added successfully");
      setShowSubjectForm(false);
    } catch (error) {
      console.error("Add subject error:", error);
      if (error.message === "Session expired" || error.message === "No authentication token") {
        setShowSubjectForm(false);
      } else {
        setSubjectError("Unable to connect to server");
      }
    }

    setSavingSubject(false);
  };

  // =========================
  // DELETE SUBJECT
  // =========================

  const handleDeleteSubject = async (subjectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject? This will cascade-delete associated grades and assignments."
    );
    if (!confirmed) return;

    try {
      const response = await authFetch(`${API_URL}/subjects/${subjectId}`, {
        method: "DELETE",
        headers: {},
      });

      if (!response.ok) {
        let message = "Unable to delete subject";
        try {
          const data = await response.json();
          message = data.detail || message;
        } catch {
          // No json
        }
        addToast(message, "error");
        return;
      }

      setSubjects((current) => current.filter((s) => s.id !== subjectId));
      setGrades((current) => current.filter((g) => g.subject_id !== subjectId));
      setAssignments((current) =>
        current.filter((a) => a.subject_id !== subjectId)
      );
      addToast("Subject deleted successfully");
    } catch (error) {
      console.error("Delete subject error:", error);
      addToast("Unable to connect to server", "error");
    }
  };

  // =========================
  // ADD GRADE
  // =========================

  const handleAddGrade = async (event) => {
    event.preventDefault();

    setGradeError("");
    setGradeSuccess("");

    const score = Number(gradeScore);

    if (!gradeStudentId || !gradeSubjectId || !gradeSemester.trim()) {
      setGradeError("Please fill all fields");
      return;
    }

    if (Number.isNaN(score) || score < 0 || score > 100) {
      setGradeError("Score must be between 0 and 100");
      return;
    }

    setSavingGrade(true);

    try {
      const response = await authFetch(`${API_URL}/grades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: Number(gradeStudentId),
          subject_id: Number(gradeSubjectId),
          score,
          semester: gradeSemester.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGradeError(data.detail || "Unable to add grade");
        setSavingGrade(false);
        return;
      }

      setGrades((currentGrades) => [...currentGrades, data]);

      setGradeStudentId("");
      setGradeSubjectId("");
      setGradeScore("");
      setGradeSemester("");

      addToast("Grade added successfully");
      setShowGradeForm(false);
    } catch (error) {
      console.error("Add grade error:", error);
      if (error.message === "Session expired" || error.message === "No authentication token") {
        setShowGradeForm(false);
      } else {
        setGradeError("Unable to connect to server");
      }
    }

    setSavingGrade(false);
  };

  // =========================
  // DELETE GRADE
  // =========================

  const handleDeleteGrade = async (gradeId) => {
    const confirmed = window.confirm("Are you sure you want to delete this grade?");
    if (!confirmed) return;

    try {
      const response = await authFetch(`${API_URL}/grades/${gradeId}`, {
        method: "DELETE",
        headers: {},
      });

      if (!response.ok) {
        let message = "Unable to delete grade";
        try {
          const data = await response.json();
          message = data.detail || message;
        } catch {
          // No json
        }
        addToast(message, "error");
        return;
      }

      setGrades((current) => current.filter((g) => g.id !== gradeId));
      addToast("Grade deleted successfully");
    } catch (error) {
      console.error("Delete grade error:", error);
      addToast("Unable to connect to server", "error");
    }
  };

  // =========================
  // ATTENDANCE HANDLERS
  // =========================

  const handleAddAttendance = async (event) => {
    event.preventDefault();
    setAttendanceError("");
    setAttendanceSuccess("");

    if (!attendanceStudentId || !attendanceDate || !attendanceStatus) {
      setAttendanceError("Please fill all required fields");
      return;
    }

    setSavingAttendance(true);

    try {
      const response = await authFetch(`${API_URL}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: Number(attendanceStudentId),
          date: attendanceDate,
          status: attendanceStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAttendanceError(data.detail || "Unable to record attendance");
        setSavingAttendance(false);
        return;
      }

      setAttendances((current) => [...current, data]);
      setAttendanceStudentId("");

      addToast("Attendance recorded successfully");
      setShowAttendanceForm(false);
    } catch (error) {
      console.error("Add attendance error:", error);
      if (error.message === "Session expired" || error.message === "No authentication token") {
        setShowAttendanceForm(false);
      } else {
        setAttendanceError("Unable to connect to server");
      }
    }

    setSavingAttendance(false);
  };

  const handleDeleteAttendance = async (attendanceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );
    if (!confirmed) return;

    try {
      const response = await authFetch(`${API_URL}/attendance/${attendanceId}`, {
        method: "DELETE",
        headers: {},
      });

      if (!response.ok) {
        let message = "Unable to delete attendance record";
        try {
          const data = await response.json();
          message = data.detail || message;
        } catch {
          // No json
        }
        addToast(message, "error");
        return;
      }

      setAttendances((current) =>
        current.filter((record) => record.id !== attendanceId)
      );
      addToast("Attendance record deleted");
    } catch (error) {
      console.error("Delete attendance error:", error);
      addToast("Unable to connect to server", "error");
    }
  };

  const handleUpdateAttendanceStatus = async (attendanceId, newStatus) => {
    try {
      const response = await authFetch(`${API_URL}/attendance/${attendanceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        addToast(data.detail || "Unable to update status", "error");
        return;
      }

      setAttendances((current) =>
        current.map((record) => (record.id === data.id ? data : record))
      );
      addToast(`Attendance status updated to "${newStatus}"`);
    } catch (error) {
      console.error("Update attendance status error:", error);
      if (error.message !== "Session expired" && error.message !== "No authentication token") {
        addToast("Unable to connect to server", "error");
      }
    }
  };

  // =========================
  // ASSIGNMENT HANDLERS
  // =========================

  const handleAddAssignment = async (event) => {
    event.preventDefault();
    setAssignmentError("");
    setAssignmentSuccess("");

    if (!assignmentTitle.trim() || !assignmentSubjectId || !assignmentDueDate) {
      setAssignmentError("Please fill all required fields");
      return;
    }

    setSavingAssignment(true);

    try {
      const response = await authFetch(`${API_URL}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: assignmentTitle.trim(),
          subject_id: Number(assignmentSubjectId),
          description: assignmentDescription.trim(),
          due_date: assignmentDueDate,
          status: assignmentStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAssignmentError(data.detail || "Unable to create assignment");
        setSavingAssignment(false);
        return;
      }

      setAssignments((current) => [...current, data]);
      setAssignmentTitle("");
      setAssignmentSubjectId("");
      setAssignmentDescription("");
      setAssignmentDueDate("");
      setAssignmentStatus("Pending");

      addToast("Assignment created successfully");
      setShowAssignmentForm(false);
    } catch (error) {
      console.error("Add assignment error:", error);
      if (error.message === "Session expired" || error.message === "No authentication token") {
        setShowAssignmentForm(false);
      } else {
        setAssignmentError("Unable to connect to server");
      }
    }

    setSavingAssignment(false);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );
    if (!confirmed) return;

    try {
      const response = await authFetch(`${API_URL}/assignments/${assignmentId}`, {
        method: "DELETE",
        headers: {},
      });

      if (!response.ok) {
        let message = "Unable to delete assignment";
        try {
          const data = await response.json();
          message = data.detail || message;
        } catch {
          // No json
        }
        addToast(message, "error");
        return;
      }

      setAssignments((current) =>
        current.filter((item) => item.id !== assignmentId)
      );
      addToast("Assignment deleted successfully");
    } catch (error) {
      console.error("Delete assignment error:", error);
      addToast("Unable to connect to server", "error");
    }
  };

  const handleUpdateAssignmentStatus = async (assignmentId, newStatus) => {
    try {
      const response = await authFetch(`${API_URL}/assignments/${assignmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        addToast(data.detail || "Unable to update status", "error");
        return;
      }

      setAssignments((current) =>
        current.map((item) => (item.id === data.id ? data : item))
      );
      addToast(`Assignment status updated to "${newStatus}"`);
    } catch (error) {
      console.error("Update assignment status error:", error);
      if (error.message !== "Session expired" && error.message !== "No authentication token") {
        addToast("Unable to connect to server", "error");
      }
    }
  };

  const handleUpdateAssignment = async (event) => {
    event.preventDefault();
    if (!editingAssignment) return;

    try {
      const response = await authFetch(
        `${API_URL}/assignments/${editingAssignment.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editingAssignment.title.trim(),
            subject_id: Number(editingAssignment.subject_id),
            description: (editingAssignment.description || "").trim(),
            due_date: editingAssignment.due_date,
            status: editingAssignment.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        addToast(data.detail || "Unable to update assignment", "error");
        return;
      }

      setAssignments((current) =>
        current.map((item) => (item.id === data.id ? data : item))
      );
      setEditingAssignment(null);
      addToast("Assignment updated successfully");
    } catch (error) {
      console.error("Update assignment error:", error);
      addToast("Unable to connect to server", "error");
    }
  };

  // =========================
  // SEARCH + FILTER STUDENTS
  // =========================

  const filteredStudents = students.filter(
    (student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesGrade =
        gradeFilter === "all" ||
        String(student.grade_level) ===
          String(gradeFilter);

      return matchesSearch && matchesGrade;
    }
  );

  const gradeOptions = [
    ...new Set(
      students.map(
        (student) => student.grade_level
      )
    ),
  ];

  // =========================
  // FILTER SUBJECTS
  // =========================

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name
        .toLowerCase()
        .includes(subjectSearchTerm.toLowerCase())
  );

  const getStudentName = (studentId) => {
    const student = students.find((student) => student.id === studentId);
    return student ? student.name : `Student #${studentId}`;
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((subject) => subject.id === subjectId);
    return subject ? subject.name : `Subject #${subjectId}`;
  };

  const getGradeLetter = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B+";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 40) return "D";
    return "F";
  };

  const getGradeLetterClass = (score) => {
    if (score >= 80) return "grade-a";
    if (score >= 60) return "grade-b";
    if (score >= 40) return "grade-c";
    return "grade-f";
  };

  const gradeSemesters = [
    ...new Set(grades.map((grade) => grade.semester)),
  ];

  const filteredGrades = grades.filter((grade) => {
    const matchesStudent =
      gradeStudentFilter === "all" ||
      String(grade.student_id) === String(gradeStudentFilter);

    const matchesSubject =
      gradeSubjectFilter === "all" ||
      String(grade.subject_id) === String(gradeSubjectFilter);

    const matchesSemester =
      gradeSemesterFilter === "all" ||
      grade.semester === gradeSemesterFilter;

    return matchesStudent && matchesSubject && matchesSemester;
  });

  // =========================
  // FILTER ATTENDANCE & ASSIGNMENTS
  // =========================

  const filteredAttendance = attendances.filter((record) => {
    const matchesStudent =
      attendanceStudentFilter === "all" ||
      String(record.student_id) === String(attendanceStudentFilter);

    const matchesStatus =
      attendanceStatusFilter === "all" ||
      record.status === attendanceStatusFilter;

    const matchesDate =
      !attendanceDateFilter || record.date === attendanceDateFilter;

    return matchesStudent && matchesStatus && matchesDate;
  });

  const filteredAssignments = assignments.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(assignmentSearchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(assignmentSearchTerm.toLowerCase()));

    const matchesSubject =
      assignmentSubjectFilter === "all" ||
      String(item.subject_id) === String(assignmentSubjectFilter);

    const matchesStatus =
      assignmentStatusFilter === "all" || item.status === assignmentStatusFilter;

    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Real Dashboard Statistics
  const averageGradeScore =
    grades.length > 0
      ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1)
      : null;

  const presentCount = attendances.filter((a) => a.status === "Present").length;
  const attendancePercentage =
    attendances.length > 0
      ? ((presentCount / attendances.length) * 100).toFixed(1)
      : "N/A";

  const pendingAssignmentsCount = assignments.filter(
    (a) => a.status === "Pending"
  ).length;

  // Global search multi-entity matcher
  const globalSearchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return { students: [], subjects: [], assignments: [], total: 0 };

    const matchedStudents = students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        String(s.grade_level).toLowerCase().includes(q) ||
        String(s.id).includes(q)
    ).slice(0, 4);

    const matchedSubjects = subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        String(s.id).includes(q)
    ).slice(0, 4);

    const matchedAssignments = assignments.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
    ).slice(0, 4);

    return {
      students: matchedStudents,
      subjects: matchedSubjects,
      assignments: matchedAssignments,
      total: matchedStudents.length + matchedSubjects.length + matchedAssignments.length,
    };
  }, [globalSearch, students, subjects, assignments]);

  // Close sidebar on page change (mobile)
  const navigateTo = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-card">

          <div className="login-logo">
            {Icons.graduationCap}
          </div>

          <h1>Welcome to AcadFlow</h1>

          <p className="login-subtitle">
            Academic Management System
          </p>

          <form onSubmit={handleLogin}>

            <div className="login-field">
              <label htmlFor="login-username">Username</label>

              <input
                id="login-username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>

              <input
                id="login-password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />
            </div>

            {loginError && (
              <div className="login-error">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

          <small>
            AcadFlow • Administrator Portal
          </small>

          <div style={{ marginTop: "14px", padding: "10px 14px", background: "var(--border-light)", borderRadius: "var(--radius-sm)", fontSize: "12px", color: "var(--text-secondary)", textAlign: "center" }}>
            Default Login: <strong>admin</strong> / <strong>admin123</strong>
          </div>

        </div>
      </div>
    );
  }

  // =========================
  // MAIN APPLICATION
  // =========================

  return (
    <div className="app">

      {/* TOAST NOTIFICATIONS */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <span className="toast-icon">
                {toast.type === "success" ? Icons.checkCircle : Icons.xCircle}
              </span>
              {toast.message}
            </div>
          ))}
        </div>
      )}

      {/* SIDEBAR OVERLAY (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* SIDEBAR */}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <div>

          <div className="brand">

            <div className="brand-icon">
              {Icons.graduationCap}
            </div>

            <h2>AcadFlow</h2>

          </div>

          <nav className="nav" aria-label="Main navigation">

            <button
              className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
              onClick={() => navigateTo("dashboard")}
              aria-label="Dashboard"
            >
              {Icons.layoutDashboard} Dashboard
            </button>

            <button
              className={`nav-item ${activePage === "students" ? "active" : ""}`}
              onClick={() => navigateTo("students")}
              aria-label="Students"
            >
              {Icons.users} Students
            </button>

            <button
              className={`nav-item ${activePage === "subjects" ? "active" : ""}`}
              onClick={() => navigateTo("subjects")}
              aria-label="Subjects"
            >
              {Icons.bookOpen} Subjects
            </button>

            <button
              className={`nav-item ${activePage === "grades" ? "active" : ""}`}
              onClick={() => navigateTo("grades")}
              aria-label="Grades"
            >
              {Icons.barChart} Grades
            </button>

            <button
              className={`nav-item ${activePage === "attendance" ? "active" : ""}`}
              onClick={() => navigateTo("attendance")}
              aria-label="Attendance"
            >
              {Icons.calendar} Attendance
            </button>

            <button
              className={`nav-item ${activePage === "assignments" ? "active" : ""}`}
              onClick={() => navigateTo("assignments")}
              aria-label="Assignments"
            >
              {Icons.fileText} Assignments
            </button>

          </nav>

        </div>

        <div className="sidebar-bottom">

          <button
            className={`nav-item ${activePage === "settings" ? "active" : ""}`}
            onClick={() => navigateTo("settings")}
            aria-label="Settings"
          >
            {Icons.settings} Settings
          </button>

          <button
            className="nav-item logout"
            onClick={handleLogout}
            aria-label="Logout"
          >
            {Icons.logOut} Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              {Icons.menu}
            </button>
            <div className="topbar-breadcrumb">
              AcadFlow / <span>{PAGE_LABELS[activePage] || "Dashboard"}</span>
            </div>
          </div>
          <div className="topbar-right">
            {/* GLOBAL SEARCH */}
            <div className="topbar-relative-wrap" ref={searchRef}>
              <div className="topbar-search">
                {Icons.search}
                <input
                  type="text"
                  placeholder="Quick search across portal..."
                  value={globalSearch}
                  onChange={(e) => {
                    setGlobalSearch(e.target.value);
                    setShowGlobalSearch(true);
                  }}
                  onFocus={() => setShowGlobalSearch(true)}
                  aria-label="Global search"
                />
                {globalSearch && (
                  <button
                    className="search-clear-btn"
                    onClick={() => {
                      setGlobalSearch("");
                      setShowGlobalSearch(false);
                    }}
                    title="Clear search"
                  >
                    {Icons.x}
                  </button>
                )}
              </div>

              {/* SEARCH RESULTS FLYOUT */}
              {showGlobalSearch && globalSearch.trim().length > 0 && (
                <div className="topbar-search-flyout">
                  {globalSearchResults.total === 0 ? (
                    <div className="search-flyout-empty">
                      No matching records found for "{globalSearch}"
                    </div>
                  ) : (
                    <>
                      {globalSearchResults.students.length > 0 && (
                        <div>
                          <div className="search-flyout-group">Students</div>
                          {globalSearchResults.students.map((student) => (
                            <div
                              key={student.id}
                              className="search-flyout-item"
                              onClick={() => {
                                navigateTo("students");
                                handleViewStudent(student);
                                setShowGlobalSearch(false);
                                setGlobalSearch("");
                              }}
                            >
                              <div className="item-icon">{Icons.users}</div>
                              <div className="item-info">
                                <div className="item-title">{student.name}</div>
                                <div className="item-sub">Grade {student.grade_level} • ID #{student.id}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {globalSearchResults.subjects.length > 0 && (
                        <div>
                          <div className="search-flyout-group">Subjects</div>
                          {globalSearchResults.subjects.map((subject) => (
                            <div
                              key={subject.id}
                              className="search-flyout-item"
                              onClick={() => {
                                navigateTo("subjects");
                                setSubjectSearchTerm(subject.name);
                                setShowGlobalSearch(false);
                                setGlobalSearch("");
                              }}
                            >
                              <div className="item-icon">{Icons.bookOpen}</div>
                              <div className="item-info">
                                <div className="item-title">{subject.name}</div>
                                <div className="item-sub">Course #{subject.id} • Active</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {globalSearchResults.assignments.length > 0 && (
                        <div>
                          <div className="search-flyout-group">Assignments</div>
                          {globalSearchResults.assignments.map((assignment) => (
                            <div
                              key={assignment.id}
                              className="search-flyout-item"
                              onClick={() => {
                                navigateTo("assignments");
                                setAssignmentSearchTerm(assignment.title);
                                setShowGlobalSearch(false);
                                setGlobalSearch("");
                              }}
                            >
                              <div className="item-icon">{Icons.clipboard}</div>
                              <div className="item-info">
                                <div className="item-title">{assignment.title}</div>
                                <div className="item-sub">
                                  {getSubjectName(assignment.subject_id)} • {assignment.status}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* NOTIFICATIONS */}
            <div className="topbar-relative-wrap" ref={notifRef}>
              <button
                className="topbar-icon-btn"
                aria-label="Notifications"
                title="Notifications"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                  setShowGlobalSearch(false);
                }}
              >
                {Icons.bell}
                {unreadNotificationsCount > 0 && (
                  <span className="topbar-notif-dot" />
                )}
              </button>

              {showNotifications && (
                <div className="topbar-popover notifications-popover">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    {unreadNotificationsCount > 0 && (
                      <button
                        className="mark-read-btn"
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((n) => ({ ...n, read: true }))
                          )
                        }
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="notifications-list">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`notif-item ${notif.read ? "" : "unread"}`}
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((n) =>
                              n.id === notif.id ? { ...n, read: true } : n
                            )
                          )
                        }
                      >
                        {!notif.read && <div className="notif-dot" />}
                        <div className="notif-content">
                          <strong>{notif.title}</strong>
                          <p>{notif.message}</p>
                          <span>{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="topbar-divider" />

            {/* PROFILE MENU */}
            <div className="topbar-relative-wrap" ref={profileRef}>
              <div
                className="topbar-profile"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                  setShowGlobalSearch(false);
                }}
                title="Account menu"
              >
                <div className="topbar-avatar">
                  {currentUsername.charAt(0).toUpperCase()}
                </div>
                <div className="topbar-user-info">
                  <strong>{currentUsername}</strong>
                  <small>Administrator</small>
                </div>
                <span style={{ color: "var(--text-muted)", marginLeft: "4px" }}>
                  {Icons.chevronDown}
                </span>
              </div>

              {showProfileMenu && (
                <div className="topbar-popover profile-popover">
                  <div className="profile-popover-header">
                    <strong>{currentUsername}</strong>
                    <span>System Administrator</span>
                  </div>
                  <button
                    className="profile-menu-item"
                    onClick={() => {
                      navigateTo("settings");
                      setShowProfileMenu(false);
                    }}
                  >
                    {Icons.settings} Settings &amp; Architecture
                  </button>
                  <button
                    className="profile-menu-item"
                    onClick={() => {
                      fetchStudents();
                      fetchSubjects();
                      fetchGrades();
                      fetchAttendance();
                      fetchAssignments();
                      addToast("Application data refreshed");
                      setShowProfileMenu(false);
                    }}
                  >
                    {Icons.refresh} Refresh System Data
                  </button>
                  <button
                    className="profile-menu-item danger"
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                  >
                    {Icons.logOut} Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="page-content">

          {initialLoading ? (
            <div className="loading-spinner" style={{ minHeight: "300px" }}>
              <div className="spinner" />
              <span>Loading school data...</span>
            </div>
          ) : (
            <>
              {/* ================= DASHBOARD ================= */}

              {activePage === "dashboard" && (
                <>

            <header className="header">

              <div>

                <span className="page-label">
                  OVERVIEW
                </span>

                <h1>Dashboard</h1>

                <p>
                  Welcome back to AcadFlow
                </p>

              </div>

            </header>

            <section className="stats-grid">

              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon blue">
                    {Icons.users}
                  </div>
                </div>
                <p className="stat-label">Total Students</p>
                <h2>{students.length}</h2>
                <small>Students in database</small>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon purple">
                    {Icons.bookOpen}
                  </div>
                </div>
                <p className="stat-label">Total Subjects</p>
                <h2>{subjects.length}</h2>
                <small>Active subjects</small>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon green">
                    {Icons.barChart}
                  </div>
                </div>
                <p className="stat-label">Average Grade</p>
                <h2>{averageGradeScore !== null ? `${averageGradeScore}%` : "N/A"}</h2>
                <small>
                  {grades.length > 0
                    ? `${grades.length} grade${grades.length !== 1 ? "s" : ""} recorded`
                    : "No grades recorded"}
                </small>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon orange">
                    {Icons.fileText}
                  </div>
                </div>
                <p className="stat-label">Assignments</p>
                <h2>{assignments.length}</h2>
                <small>{pendingAssignmentsCount} pending</small>
              </div>

            </section>

            <section className="dashboard-grid">

              <div className="panel grades-panel">

                <div className="panel-header">
                  <div>
                    <h2>Recent Grades</h2>
                    <p>Latest student performance</p>
                  </div>
                  <button
                    className="outline-button"
                    onClick={() => navigateTo("grades")}
                  >
                    View All
                  </button>
                </div>

                <div className="table">

                  <div className="table-row table-head">
                    <span>STUDENT</span>
                    <span>SUBJECT</span>
                    <span>MARKS</span>
                    <span>GRADE</span>
                  </div>

                  {grades.length > 0 ? (
                    grades.slice(-4).reverse().map((grade) => (
                      <div className="table-row" key={grade.id}>
                        <div className="student">
                          <div className="student-avatar">
                            {getStudentName(grade.student_id).charAt(0).toUpperCase()}
                          </div>
                          <strong>{getStudentName(grade.student_id)}</strong>
                        </div>
                        <span>{getSubjectName(grade.subject_id)}</span>
                        <span>{grade.score}/100</span>
                        <span className={`grade-letter ${getGradeLetterClass(grade.score)}`}>
                          {getGradeLetter(grade.score)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state" style={{ padding: "30px 10px" }}>
                      <div className="empty-state-icon">{Icons.barChart}</div>
                      <p>No grades recorded yet</p>
                    </div>
                  )}

                </div>

              </div>

              <div className="panel">

                <div className="panel-header">
                  <div>
                    <h2>Quick Actions</h2>
                    <p>Manage your academic data</p>
                  </div>
                </div>

                <div className="actions">

                  <button
                    onClick={() => {
                      setShowStudentForm(true);
                      setStudentError("");
                      setStudentSuccess("");
                    }}
                  >
                    <span className="action-icon">{Icons.plus}</span>
                    Add Student
                  </button>

                  <button
                    onClick={() => {
                      setShowSubjectForm(true);
                      setSubjectError("");
                      setSubjectSuccess("");
                    }}
                  >
                    <span className="action-icon">{Icons.bookOpen}</span>
                    Add Subject
                  </button>

                  <button
                    onClick={() => {
                      setShowGradeForm(true);
                      setGradeError("");
                      setGradeSuccess("");
                    }}
                    disabled={students.length === 0 || subjects.length === 0}
                    title={
                      students.length === 0 && subjects.length === 0
                        ? "Add at least one student and one subject first"
                        : students.length === 0
                        ? "Add at least one student first"
                        : subjects.length === 0
                        ? "Add at least one subject first"
                        : "Add Grade"
                    }
                  >
                    <span className="action-icon">{Icons.barChart}</span>
                    Add Grade
                  </button>

                  <button
                    onClick={() => {
                      setShowAttendanceForm(true);
                      setAttendanceError("");
                      setAttendanceSuccess("");
                    }}
                    disabled={students.length === 0}
                    title={students.length === 0 ? "Add at least one student first" : "Mark Attendance"}
                  >
                    <span className="action-icon">{Icons.calendar}</span>
                    Mark Attendance
                  </button>

                  <button
                    onClick={() => {
                      setShowAssignmentForm(true);
                      setAssignmentError("");
                      setAssignmentSuccess("");
                    }}
                    disabled={subjects.length === 0}
                    title={subjects.length === 0 ? "Add at least one subject first" : "Add Assignment"}
                  >
                    <span className="action-icon">{Icons.clipboard}</span>
                    Add Assignment
                  </button>

                </div>

              </div>

            </section>

            <section className="bottom-grid">

              <div className="info-card">
                <div>
                  <span className="info-label">ATTENDANCE</span>
                  <h2>{attendancePercentage}%</h2>
                  <p>
                    {attendances.length > 0
                      ? `${presentCount} present of ${attendances.length} records`
                      : "No attendance records yet"}
                  </p>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${attendancePercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="info-card">
                <div>
                  <span className="info-label">ACADEMIC PERFORMANCE</span>
                  <h2>{averageGradeScore !== null ? (Number(averageGradeScore) >= 70 ? "Excellent" : Number(averageGradeScore) >= 50 ? "Good" : "Needs Improvement") : "N/A"}</h2>
                  <p>{grades.length > 0 ? `Based on ${grades.length} grade records` : "No grade data available"}</p>
                </div>
                <div className="performance-icon">
                  {Icons.trendingUp}
                </div>
              </div>

            </section>

          </>
        )}

        {/* ================= STUDENTS ================= */}

        {activePage === "students" && (
          <section>

            <header className="header">
              <div>
                <span className="page-label">ACADEMIC MANAGEMENT</span>
                <h1>Students</h1>
                <p>Manage student profiles and academic information</p>
              </div>
              <button
                className="primary-button"
                onClick={() => {
                  setShowStudentForm(true);
                  setStudentError("");
                  setStudentSuccess("");
                }}
              >
                {Icons.plus} Add Student
              </button>
            </header>

            {/* STUDENT STATS */}
            <div className="student-stats">
              <div className="student-stat-card">
                <div className="stat-card-icon">{Icons.users}</div>
                <div>
                  <small>Total Students</small>
                  <strong>{students.length}</strong>
                </div>
              </div>
              <div className="student-stat-card">
                <div className="stat-card-icon green">{Icons.checkCircle}</div>
                <div>
                  <small>Active Students</small>
                  <strong>{students.length}</strong>
                </div>
              </div>
              <div className="student-stat-card">
                <div className="stat-card-icon purple">{Icons.award}</div>
                <div>
                  <small>Grade Levels</small>
                  <strong>{gradeOptions.length}</strong>
                </div>
              </div>
            </div>

            {/* SEARCH */}
            <div className="panel">
              <div className="student-toolbar">
                <div className="search-box">
                  {Icons.search}
                  <input
                    type="text"
                    placeholder="Search student by name..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    aria-label="Search students"
                  />
                </div>
                <select
                  value={gradeFilter}
                  onChange={(event) => setGradeFilter(event.target.value)}
                  aria-label="Filter by grade level"
                >
                  <option value="all">All Grades</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>

                {(searchTerm !== "" || gradeFilter !== "all") && (
                  <button
                    className="outline-button"
                    onClick={() => {
                      setSearchTerm("");
                      setGradeFilter("all");
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* STUDENT TABLE */}
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2>Students List</h2>
                  <p>
                    {filteredStudents.length}{" "}
                    student{filteredStudents.length !== 1 ? "s" : ""}{" "}
                    found
                  </p>
                </div>
              </div>

              <div className="table">
                <div className="table-row student-table table-head">
                  <span>ID</span>
                  <span>STUDENT</span>
                  <span>GRADE LEVEL</span>
                  <span>STATUS</span>
                  <span>ACTIONS</span>
                </div>

                {filteredStudents.map((student) => (
                  <div className="table-row student-table" key={student.id}>
                    <span>#{student.id}</span>
                    <div className="student">
                      <div className="student-avatar">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <strong>{student.name}</strong>
                    </div>
                    <span>{student.grade_level}</span>
                    <span className="status-active">Active</span>
                    <div className="student-actions">
                      <button
                        className="view-btn"
                        onClick={() => handleViewStudent(student)}
                        aria-label={`View ${student.name}`}
                      >
                        {Icons.eye} View
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => setEditingStudent({ ...student })}
                        aria-label={`Edit ${student.name}`}
                      >
                        {Icons.edit} Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteStudent(student.id)}
                        aria-label={`Delete ${student.name}`}
                      >
                        {Icons.trash} Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredStudents.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">{Icons.users}</div>
                  <h3>No students found</h3>
                  <p>Try another search or add a new student.</p>
                </div>
              )}
            </div>

          </section>
        )}

        {/* ================= SUBJECTS ================= */}

        {activePage === "subjects" && (
          <section>
            <header className="header">
              <div>
                <span className="page-label">ACADEMIC MANAGEMENT</span>
                <h1>Subjects</h1>
                <p>Manage academic subjects and courses</p>
              </div>
              <button
                className="primary-button"
                onClick={() => {
                  setShowSubjectForm(true);
                  setSubjectError("");
                  setSubjectSuccess("");
                }}
              >
                {Icons.plus} Add Subject
              </button>
            </header>

            {/* SUBJECT STATS */}
            <div className="student-stats">
              <div className="student-stat-card">
                <div className="stat-card-icon purple">{Icons.bookOpen}</div>
                <div>
                  <small>Total Subjects</small>
                  <strong>{subjects.length}</strong>
                </div>
              </div>
              <div className="student-stat-card">
                <div className="stat-card-icon green">{Icons.checkCircle}</div>
                <div>
                  <small>Active Subjects</small>
                  <strong>{subjects.length}</strong>
                </div>
              </div>
              <div className="student-stat-card">
                <div className="stat-card-icon">{Icons.award}</div>
                <div>
                  <small>Academic Courses</small>
                  <strong>{subjects.length}</strong>
                </div>
              </div>
            </div>

            {/* SUBJECT SEARCH */}
            <div className="panel">
              <div className="student-toolbar">
                <div className="search-box">
                  {Icons.search}
                  <input
                    type="text"
                    placeholder="Search subject by name..."
                    value={subjectSearchTerm}
                    onChange={(event) => setSubjectSearchTerm(event.target.value)}
                    aria-label="Search subjects"
                  />
                </div>

                {subjectSearchTerm !== "" && (
                  <button
                    className="outline-button"
                    onClick={() => setSubjectSearchTerm("")}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>

            {/* SUBJECT LIST */}
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2>Subjects List</h2>
                  <p>
                    {filteredSubjects.length}{" "}
                    subject{filteredSubjects.length !== 1 ? "s" : ""}{" "}
                    found
                  </p>
                </div>
              </div>

              <div className="table">
                <div className="table-row table-head" style={{ gridTemplateColumns: "0.6fr 2fr 1fr 0.8fr" }}>
                  <span>ID</span>
                  <span>SUBJECT</span>
                  <span>STATUS</span>
                  <span>ACTION</span>
                </div>

                {filteredSubjects.map((subject) => (
                  <div
                    className="table-row"
                    key={subject.id}
                    style={{ gridTemplateColumns: "0.6fr 2fr 1fr 0.8fr" }}
                  >
                    <span>#{subject.id}</span>
                    <div className="student">
                      <div className="student-avatar purple-bg">
                        {Icons.bookOpen}
                      </div>
                      <strong>{subject.name}</strong>
                    </div>
                    <span className="status-active">Active</span>
                    <div className="student-actions">
                      <button
                        className="delete-btn"
                        title="Delete Subject"
                        onClick={() => handleDeleteSubject(subject.id)}
                        aria-label={`Delete ${subject.name}`}
                      >
                        {Icons.trash}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredSubjects.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">{Icons.bookOpen}</div>
                  <h3>No subjects found</h3>
                  <p>Add your first academic subject to get started.</p>
                </div>
              )}
            </div>

          </section>
        )}

        {/* ================= GRADES ================= */}

        {activePage === "grades" && (
          <section>
            <header className="header">
              <div>
                <span className="page-label">ACADEMIC MANAGEMENT</span>
                <h1>Grades</h1>
                <p>Track and manage student academic performance</p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  setShowGradeForm(true);
                  setGradeError("");
                  setGradeSuccess("");
                }}
                disabled={students.length === 0 || subjects.length === 0}
                title={
                  students.length === 0 && subjects.length === 0
                    ? "Add at least one student and one subject first"
                    : students.length === 0
                    ? "Add at least one student first"
                    : subjects.length === 0
                    ? "Add at least one subject first"
                    : "Add Grade"
                }
              >
                {Icons.plus} Add Grade
              </button>
            </header>

            <div className="student-stats">
              <div className="student-stat-card">
                <div className="stat-card-icon">{Icons.barChart}</div>
                <div>
                  <small>Average Grade</small>
                  <strong>{averageGradeScore !== null ? `${averageGradeScore}%` : "N/A"}</strong>
                </div>
              </div>
              <div className="student-stat-card">
                <div className="stat-card-icon green">{Icons.trendingUp}</div>
                <div>
                  <small>Highest Grade</small>
                  <strong>{grades.length > 0 ? `${Math.max(...grades.map(g => g.score))}%` : "N/A"}</strong>
                </div>
              </div>
              <div className="student-stat-card">
                <div className="stat-card-icon purple">{Icons.target}</div>
                <div>
                  <small>Total Grades</small>
                  <strong>{grades.length}</strong>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="student-toolbar">
                <select
                  value={gradeStudentFilter}
                  onChange={(event) => setGradeStudentFilter(event.target.value)}
                  aria-label="Filter by student"
                >
                  <option value="all">All Students</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>

                <select
                  value={gradeSubjectFilter}
                  onChange={(event) => setGradeSubjectFilter(event.target.value)}
                  aria-label="Filter by subject"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>

                <select
                  value={gradeSemesterFilter}
                  onChange={(event) => setGradeSemesterFilter(event.target.value)}
                  aria-label="Filter by semester"
                >
                  <option value="all">All Semesters</option>
                  {gradeSemesters.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>

                {(gradeStudentFilter !== "all" ||
                  gradeSubjectFilter !== "all" ||
                  gradeSemesterFilter !== "all") && (
                  <button
                    className="outline-button"
                    onClick={() => {
                      setGradeStudentFilter("all");
                      setGradeSubjectFilter("all");
                      setGradeSemesterFilter("all");
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2>Grades List</h2>
                  <p>
                    {filteredGrades.length} grade
                    {filteredGrades.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>

              <div className="table">
                <div
                  className="table-row table-head"
                  style={{ gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 0.7fr 0.8fr" }}
                >
                  <span>STUDENT</span>
                  <span>SUBJECT</span>
                  <span>SCORE</span>
                  <span>SEMESTER</span>
                  <span>GRADE</span>
                  <span>ACTIONS</span>
                </div>

                {filteredGrades.map((grade) => (
                  <div
                    className="table-row"
                    key={grade.id}
                    style={{ gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 0.7fr 0.8fr" }}
                  >
                    <strong>{getStudentName(grade.student_id)}</strong>
                    <span>{getSubjectName(grade.subject_id)}</span>
                    <span>{grade.score}/100</span>
                    <span>{grade.semester}</span>
                    <span className={`grade-letter ${getGradeLetterClass(grade.score)}`}>
                      {getGradeLetter(grade.score)}
                    </span>
                    <div className="student-actions">
                      <button
                        className="delete-btn"
                        title="Delete Grade"
                        onClick={() => handleDeleteGrade(grade.id)}
                        aria-label="Delete grade"
                      >
                        {Icons.trash}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredGrades.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">{Icons.barChart}</div>
                  <h3>No grades found</h3>
                  <p>Add a grade after creating at least one student and one subject.</p>
                </div>
              )}
            </div>

          </section>
        )}

        {/* ================= ATTENDANCE ================= */}

        {activePage === "attendance" && (
          <section>
            <header className="header">
              <div>
                <span className="page-label">ACADEMIC MANAGEMENT</span>
                <h1>Attendance</h1>
                <p>Track and manage student attendance</p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  setShowAttendanceForm(true);
                  setAttendanceError("");
                  setAttendanceSuccess("");
                }}
                disabled={students.length === 0}
                title={students.length === 0 ? "Add at least one student first" : "Mark Attendance"}
              >
                {Icons.plus} Mark Attendance
              </button>
            </header>

            <div className="student-stats">
              <div className="student-stat-card">
                <div className="stat-card-icon">{Icons.calendar}</div>
                <div>
                  <small>Total Records</small>
                  <strong>{attendances.length}</strong>
                </div>
              </div>
              <div className="student-stat-card">
                <div className="stat-card-icon green">{Icons.checkCircle}</div>
                <div>
                  <small>Present Rate</small>
                  <strong>{attendancePercentage}%</strong>
                </div>
              </div>
              <div className="student-stat-card">
                <div className="stat-card-icon danger">{Icons.xCircle}</div>
                <div>
                  <small>Absent</small>
                  <strong>
                    {attendances.filter((a) => a.status === "Absent").length}
                  </strong>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="student-toolbar">
                <select
                  value={attendanceStudentFilter}
                  onChange={(event) => setAttendanceStudentFilter(event.target.value)}
                  aria-label="Filter by student"
                >
                  <option value="all">All Students</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>

                <select
                  value={attendanceStatusFilter}
                  onChange={(event) => setAttendanceStatusFilter(event.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="all">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Excused">Excused</option>
                </select>

                <input
                  type="date"
                  value={attendanceDateFilter}
                  onChange={(event) => setAttendanceDateFilter(event.target.value)}
                  aria-label="Filter by date"
                  style={{
                    height: "40px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "0 12px",
                    background: "var(--card)",
                    color: "var(--text-primary)",
                    fontSize: "var(--text-sm)",
                    outline: "none",
                  }}
                />

                {(attendanceStudentFilter !== "all" ||
                  attendanceStatusFilter !== "all" ||
                  attendanceDateFilter !== "") && (
                  <button
                    className="outline-button"
                    onClick={() => {
                      setAttendanceStudentFilter("all");
                      setAttendanceStatusFilter("all");
                      setAttendanceDateFilter("");
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2>Attendance Records</h2>
                  <p>
                    {filteredAttendance.length} record
                    {filteredAttendance.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>

              <div className="table">
                <div className="table-row table-head attendance-table">
                  <span>STUDENT</span>
                  <span>DATE</span>
                  <span>STATUS</span>
                  <span>ACTIONS</span>
                </div>

                {filteredAttendance.map((record) => (
                  <div className="table-row attendance-table" key={record.id}>
                    <div className="student">
                      <div className="student-avatar">
                        {getStudentName(record.student_id).charAt(0).toUpperCase()}
                      </div>
                      <strong>{getStudentName(record.student_id)}</strong>
                    </div>
                    <span>{record.date}</span>
                    <span>
                      <span className={`badge badge-${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </span>
                    <div className="student-actions">
                      <select
                        className="status-toggle-btn"
                        value={record.status}
                        onChange={(e) =>
                          handleUpdateAttendanceStatus(record.id, e.target.value)
                        }
                        aria-label="Change attendance status"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                        <option value="Excused">Excused</option>
                      </select>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteAttendance(record.id)}
                        title="Delete record"
                        aria-label="Delete attendance record"
                      >
                        {Icons.trash}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAttendance.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">{Icons.calendar}</div>
                  <h3>No attendance records found</h3>
                  <p>Mark attendance for a student to see the records here.</p>
                </div>
              )}
            </div>

          </section>
        )}

        {/* ================= ASSIGNMENTS ================= */}

        {activePage === "assignments" && (
          <section>
            <header className="header">
              <div>
                <span className="page-label">ACADEMIC MANAGEMENT</span>
                <h1>Assignments</h1>
                <p>Manage academic assignments and deadlines</p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  setShowAssignmentForm(true);
                  setAssignmentError("");
                  setAssignmentSuccess("");
                }}
                disabled={subjects.length === 0}
                title={subjects.length === 0 ? "Add at least one subject first" : "Add Assignment"}
              >
                {Icons.plus} Add Assignment
              </button>
            </header>

            <div className="student-stats">
              <div className="student-stat-card">
                <div className="stat-card-icon">{Icons.fileText}</div>
                <div>
                  <small>Total Assignments</small>
                  <strong>{assignments.length}</strong>
                </div>
              </div>
              <div className="student-stat-card">
                <div className="stat-card-icon orange">{Icons.clock}</div>
                <div>
                  <small>Pending</small>
                  <strong>
                    {assignments.filter((a) => a.status === "Pending").length}
                  </strong>
                </div>
              </div>
              <div className="student-stat-card">
                <div className="stat-card-icon green">{Icons.checkCircle}</div>
                <div>
                  <small>Completed</small>
                  <strong>
                    {assignments.filter((a) => a.status === "Completed").length}
                  </strong>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="student-toolbar">
                <div className="search-box">
                  {Icons.search}
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    value={assignmentSearchTerm}
                    onChange={(event) => setAssignmentSearchTerm(event.target.value)}
                    aria-label="Search assignments"
                  />
                </div>

                <select
                  value={assignmentSubjectFilter}
                  onChange={(event) => setAssignmentSubjectFilter(event.target.value)}
                  aria-label="Filter by subject"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>

                <select
                  value={assignmentStatusFilter}
                  onChange={(event) => setAssignmentStatusFilter(event.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                {(assignmentSearchTerm !== "" ||
                  assignmentSubjectFilter !== "all" ||
                  assignmentStatusFilter !== "all") && (
                  <button
                    className="outline-button"
                    onClick={() => {
                      setAssignmentSearchTerm("");
                      setAssignmentSubjectFilter("all");
                      setAssignmentStatusFilter("all");
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2>Assignments List</h2>
                  <p>
                    {filteredAssignments.length} assignment
                    {filteredAssignments.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>

              <div className="table">
                <div className="table-row table-head assignment-table">
                  <span>TITLE</span>
                  <span>SUBJECT</span>
                  <span>DESCRIPTION</span>
                  <span>DUE DATE</span>
                  <span>STATUS</span>
                  <span>ACTIONS</span>
                </div>

                {filteredAssignments.map((item) => (
                  <div className="table-row assignment-table" key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{getSubjectName(item.subject_id)}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                      {item.description || "—"}
                    </span>
                    <span>{item.due_date}</span>
                    <span>
                      <span
                        className={`badge badge-${item.status === "In Progress" ? "inprogress" : item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </span>
                    <div className="student-actions">
                      <select
                        className="status-toggle-btn"
                        value={item.status}
                        onChange={(e) =>
                          handleUpdateAssignmentStatus(item.id, e.target.value)
                        }
                        aria-label="Change assignment status"
                        title="Select assignment status"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button
                        className="edit-btn"
                        onClick={() => setEditingAssignment({ ...item })}
                        title="Edit assignment"
                        aria-label="Edit assignment"
                      >
                        {Icons.edit}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteAssignment(item.id)}
                        title="Delete assignment"
                        aria-label="Delete assignment"
                      >
                        {Icons.trash}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAssignments.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">{Icons.fileText}</div>
                  <h3>No assignments found</h3>
                  <p>Create an assignment after adding at least one subject.</p>
                </div>
              )}
            </div>

          </section>
        )}

        {/* ================= SETTINGS ================= */}

        {activePage === "settings" && (
          <section>
            <header className="header">
              <div>
                <span className="page-label">SYSTEM CONFIGURATION</span>
                <h1>Settings</h1>
                <p>System status, database details, and administration</p>
              </div>
            </header>

            <div className="settings-container">
              <div className="settings-card">
                <h3>Administrator Profile</h3>
                <p>Current authenticated session and role details</p>
                <div className="settings-grid">
                  <div className="settings-field">
                    <label>Username</label>
                    <div className="value">admin</div>
                  </div>
                  <div className="settings-field">
                    <label>Role</label>
                    <div className="value">Administrator</div>
                  </div>
                  <div className="settings-field">
                    <label>Session Type</label>
                    <div className="value">JWT Bearer Auth</div>
                  </div>
                  <div className="settings-field">
                    <label>Access Level</label>
                    <div className="value">Full Read &amp; Write</div>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <h3>Backend &amp; Database Architecture</h3>
                <p>Live infrastructure and migration state</p>
                <div className="settings-grid">
                  <div className="settings-field">
                    <label>API Service Status</label>
                    <div className="value">
                      <span className="status-dot"></span> Online (Port 8000)
                    </div>
                  </div>
                  <div className="settings-field">
                    <label>Database Engine</label>
                    <div className="value">SQLite 3 (school_portal.db)</div>
                  </div>
                  <div className="settings-field">
                    <label>Alembic Revision</label>
                    <div className="value">31dad7f8e4a2 (Head)</div>
                  </div>
                  <div className="settings-field">
                    <label>ORM &amp; Validation</label>
                    <div className="value">SQLAlchemy 2.0 + Pydantic v2</div>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <h3>System Preferences</h3>
                <p>Default parameters for academic tracking</p>
                <div className="settings-grid">
                  <div className="settings-field">
                    <label>Grading Scale</label>
                    <div className="value">0 - 100 Marks</div>
                  </div>
                  <div className="settings-field">
                    <label>Default Attendance</label>
                    <div className="value">Present</div>
                  </div>
                  <div className="settings-field">
                    <label>Active Semester</label>
                    <div className="value">2026-S1</div>
                  </div>
                  <div className="settings-field">
                    <label>Frontend Framework</label>
                    <div className="value">React + Vite</div>
                  </div>
                </div>
              </div>

              <div className="settings-card danger-zone">
                <h3>Session Management</h3>
                <p>Log out of the current administrative session</p>
                <div className="settings-actions">
                  <button
                    className="danger-button"
                    onClick={handleLogout}
                  >
                    Log Out of AcadFlow
                  </button>
                  <button
                    className="outline-button"
                    onClick={() => {
                      fetchStudents();
                      fetchSubjects();
                      fetchGrades();
                      fetchAttendance();
                      fetchAssignments();
                      addToast("Application data refreshed");
                    }}
                  >
                    {Icons.refresh} Refresh Data
                  </button>
                </div>
              </div>
            </div>

          </section>
        )}
            </>
          )}

      {/* ================= ADD STUDENT MODAL ================= */}

      {showStudentForm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <span className="page-label">STUDENT MANAGEMENT</span>
                <h2>Add New Student</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowStudentForm(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddStudent}>
              <div className="form-field">
                <label htmlFor="student-name">Student Name</label>
                <input
                  id="student-name"
                  type="text"
                  placeholder="Enter student name"
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="grade-level">Grade Level</label>
                <input
                  id="grade-level"
                  type="text"
                  placeholder="Example: 10"
                  value={gradeLevel}
                  onChange={(event) => setGradeLevel(event.target.value)}
                  required
                />
              </div>

              {studentError && <div className="form-error">{studentError}</div>}
              {studentSuccess && <div className="form-success">{studentSuccess}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowStudentForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingStudent}
                >
                  {savingStudent ? "Saving..." : "Save Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD SUBJECT MODAL ================= */}

      {showSubjectForm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <span className="page-label">SUBJECT MANAGEMENT</span>
                <h2>Add New Subject</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowSubjectForm(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddSubject}>
              <div className="form-field">
                <label htmlFor="subject-name">Subject Name</label>
                <input
                  id="subject-name"
                  type="text"
                  placeholder="Example: Mathematics"
                  value={subjectName}
                  onChange={(event) => setSubjectName(event.target.value)}
                  required
                />
              </div>

              {subjectError && <div className="form-error">{subjectError}</div>}
              {subjectSuccess && <div className="form-success">{subjectSuccess}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowSubjectForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingSubject}
                >
                  {savingSubject ? "Saving..." : "Save Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD GRADE MODAL ================= */}

      {showGradeForm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <span className="page-label">GRADE MANAGEMENT</span>
                <h2>Add New Grade</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowGradeForm(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddGrade}>
              <div className="form-field">
                <label htmlFor="grade-student">Student</label>
                <select
                  id="grade-student"
                  value={gradeStudentId}
                  onChange={(event) => setGradeStudentId(event.target.value)}
                  required
                >
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} — Grade {student.grade_level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="grade-subject">Subject</label>
                <select
                  id="grade-subject"
                  value={gradeSubjectId}
                  onChange={(event) => setGradeSubjectId(event.target.value)}
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="grade-score">Score</label>
                <input
                  id="grade-score"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="Enter score (0-100)"
                  value={gradeScore}
                  onChange={(event) => setGradeScore(event.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="grade-semester">Semester</label>
                <input
                  id="grade-semester"
                  type="text"
                  placeholder="Example: 2026-S1"
                  value={gradeSemester}
                  onChange={(event) => setGradeSemester(event.target.value)}
                  required
                />
              </div>

              {gradeError && <div className="form-error">{gradeError}</div>}
              {gradeSuccess && <div className="form-success">{gradeSuccess}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowGradeForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingGrade}
                >
                  {savingGrade ? "Saving..." : "Save Grade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD ATTENDANCE MODAL ================= */}

      {showAttendanceForm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <span className="page-label">ATTENDANCE MANAGEMENT</span>
                <h2>Record Attendance</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowAttendanceForm(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddAttendance}>
              <div className="form-field">
                <label htmlFor="att-student">Student</label>
                <select
                  id="att-student"
                  value={attendanceStudentId}
                  onChange={(event) => setAttendanceStudentId(event.target.value)}
                  required
                >
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} — Grade {student.grade_level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="att-date">Date</label>
                <input
                  id="att-date"
                  type="date"
                  value={attendanceDate}
                  onChange={(event) => setAttendanceDate(event.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="att-status">Status</label>
                <select
                  id="att-status"
                  value={attendanceStatus}
                  onChange={(event) => setAttendanceStatus(event.target.value)}
                  required
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Excused">Excused</option>
                </select>
              </div>

              {attendanceError && <div className="form-error">{attendanceError}</div>}
              {attendanceSuccess && <div className="form-success">{attendanceSuccess}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowAttendanceForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingAttendance}
                >
                  {savingAttendance ? "Saving..." : "Save Attendance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD ASSIGNMENT MODAL ================= */}

      {showAssignmentForm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <span className="page-label">ASSIGNMENT MANAGEMENT</span>
                <h2>Create Assignment</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowAssignmentForm(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddAssignment}>
              <div className="form-field">
                <label htmlFor="assign-title">Title</label>
                <input
                  id="assign-title"
                  type="text"
                  placeholder="e.g. Chapter 4 Calculus Quiz"
                  value={assignmentTitle}
                  onChange={(event) => setAssignmentTitle(event.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="assign-subject">Subject</label>
                <select
                  id="assign-subject"
                  value={assignmentSubjectId}
                  onChange={(event) => setAssignmentSubjectId(event.target.value)}
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="assign-desc">Description (Optional)</label>
                <input
                  id="assign-desc"
                  type="text"
                  placeholder="e.g. Solve questions 1 to 15 from textbook"
                  value={assignmentDescription}
                  onChange={(event) => setAssignmentDescription(event.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="assign-due">Due Date</label>
                <input
                  id="assign-due"
                  type="date"
                  value={assignmentDueDate}
                  onChange={(event) => setAssignmentDueDate(event.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="assign-status">Initial Status</label>
                <select
                  id="assign-status"
                  value={assignmentStatus}
                  onChange={(event) => setAssignmentStatus(event.target.value)}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {assignmentError && <div className="form-error">{assignmentError}</div>}
              {assignmentSuccess && <div className="form-success">{assignmentSuccess}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowAssignmentForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingAssignment}
                >
                  {savingAssignment ? "Saving..." : "Save Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW STUDENT ================= */}

      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <span className="page-label">STUDENT PROFILE</span>
                <h2>Student Details</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setSelectedStudent(null)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="student-profile-large">
              <div className="large-avatar">
                {selectedStudent.name.charAt(0).toUpperCase()}
              </div>
              <h2>{selectedStudent.name}</h2>
              <span>Student ID #{selectedStudent.id}</span>
            </div>

            <div className="detail-grid">
              <div>
                <small>Student ID</small>
                <strong>#{selectedStudent.id}</strong>
              </div>
              <div>
                <small>Name</small>
                <strong>{selectedStudent.name}</strong>
              </div>
              <div>
                <small>Grade Level</small>
                <strong>{selectedStudent.grade_level}</strong>
              </div>
              <div>
                <small>Status</small>
                <strong className="grade-a">Active</strong>
              </div>
            </div>

            <div className="profile-section">
              <div className="profile-section-title">Academic Performance</div>
              {loadingSummary ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  Loading academic summary...
                </div>
              ) : studentSummary?.subjects && studentSummary.subjects.length > 0 ? (
                <div>
                  <div className="profile-stat-box" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                    <span>Overall Average</span>
                    <strong style={{ color: "#1d4ed8" }}>
                      {(
                        studentSummary.subjects.reduce((acc, s) => acc + s.average_score, 0) /
                        studentSummary.subjects.length
                      ).toFixed(1)}
                      % ({getGradeLetter(
                        studentSummary.subjects.reduce((acc, s) => acc + s.average_score, 0) /
                        studentSummary.subjects.length
                      )})
                    </strong>
                  </div>
                  {studentSummary.subjects.map((sub) => (
                    <div className="profile-stat-box" key={sub.subject_id}>
                      <span>{sub.subject_name} ({sub.grade_count} grade{sub.grade_count !== 1 ? "s" : ""})</span>
                      <strong>{sub.average_score}% ({getGradeLetter(sub.average_score)})</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "var(--text-secondary)", fontSize: "13px", padding: "6px 0" }}>
                  No grades recorded for this student yet.
                </div>
              )}
            </div>

            <div className="profile-section">
              <div className="profile-section-title">Attendance Summary</div>
              {(() => {
                const studentAttendances = attendances.filter((a) => a.student_id === selectedStudent.id);
                const pCount = studentAttendances.filter((a) => a.status === "Present").length;
                const rate = studentAttendances.length > 0
                  ? ((pCount / studentAttendances.length) * 100).toFixed(0)
                  : "N/A";
                return (
                  <div>
                    <div className="profile-stat-box" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                      <span>Attendance Rate</span>
                      <strong style={{ color: "#15803d" }}>
                        {rate === "N/A" ? "No records" : `${rate}% (${pCount}/${studentAttendances.length} days)`}
                      </strong>
                    </div>
                    {studentAttendances.slice(0, 3).map((record) => (
                      <div className="profile-stat-box" key={record.id}>
                        <span>{record.date}</span>
                        <span className={`badge badge-${record.status.toLowerCase()}`}>
                          {record.status}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <button
              className="primary-button full-width"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= EDIT STUDENT ================= */}

      {editingStudent && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <span className="page-label">STUDENT MANAGEMENT</span>
                <h2>Edit Student</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setEditingStudent(null)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateStudent}>
              <div className="form-field">
                <label htmlFor="edit-student-name">Student Name</label>
                <input
                  id="edit-student-name"
                  type="text"
                  value={editingStudent.name}
                  onChange={(event) =>
                    setEditingStudent({
                      ...editingStudent,
                      name: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-grade-level">Grade Level</label>
                <input
                  id="edit-grade-level"
                  type="text"
                  value={editingStudent.grade_level}
                  onChange={(event) =>
                    setEditingStudent({
                      ...editingStudent,
                      grade_level: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditingStudent(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT ASSIGNMENT ================= */}

      {editingAssignment && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <span className="page-label">ASSIGNMENT MANAGEMENT</span>
                <h2>Edit Assignment</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setEditingAssignment(null)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateAssignment}>
              <div className="form-field">
                <label htmlFor="edit-assign-title">Title</label>
                <input
                  id="edit-assign-title"
                  type="text"
                  value={editingAssignment.title}
                  onChange={(event) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      title: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-assign-subject">Subject</label>
                <select
                  id="edit-assign-subject"
                  value={editingAssignment.subject_id}
                  onChange={(event) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      subject_id: event.target.value,
                    })
                  }
                  required
                >
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="edit-assign-desc">Description (Optional)</label>
                <input
                  id="edit-assign-desc"
                  type="text"
                  value={editingAssignment.description || ""}
                  onChange={(event) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      description: event.target.value,
                    })
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-assign-due">Due Date</label>
                <input
                  id="edit-assign-due"
                  type="date"
                  value={editingAssignment.due_date}
                  onChange={(event) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      due_date: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-assign-status">Status</label>
                <select
                  id="edit-assign-status"
                  value={editingAssignment.status}
                  onChange={(event) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      status: event.target.value,
                    })
                  }
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditingAssignment(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Update Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        </div>

      </main>

    </div>
  );
}

export default App;