import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  Shield, 
  Send, 
  Plus, 
  Trash2, 
  Share2, 
  MessageSquare, 
  Lock, 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Menu, 
  X, 
  ChevronRight, 
  CheckCircle,
  FileText,
  LogOut,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Seed Initial Data Helper
const seedInitialData = () => {
  // Seed Students
  if (!localStorage.getItem('jma_students')) {
    const initialStudents = [
      { id: '1', username: 'student1', password: 'password1', createdAt: '2026-05-18T10:00:00Z' },
      { id: '2', username: 'rahul99', password: 'mathisfun', createdAt: '2026-05-19T14:30:00Z' },
      { id: '3', username: 'ananya_das', password: 'algebra101', createdAt: '2026-05-20T09:15:00Z' }
    ];
    localStorage.setItem('jma_students', JSON.stringify(initialStudents));
  }

  // Seed Notices
  if (!localStorage.getItem('jma_notices')) {
    const initialNotices = [
      {
        id: 'n1',
        sender: 'Prof. Amit Jana',
        senderRole: 'Professor at Adamas University',
        content: 'Welcome students to the Jana Math Academy Portal! All study materials, exam schedules, and homework notices will be shared in this live feed. Check here daily.',
        timestamp: 'May 19, 2026 at 09:00 AM',
        type: 'announcement'
      },
      {
        id: 'n2',
        sender: 'Prof. Amit Jana',
        senderRole: 'Professor at Adamas University',
        content: 'Homework Assignment 4: Solve the calculus sheet on Integration by Parts (problems 1 to 15). Upload your solutions or submit in the next class on Friday.',
        timestamp: 'May 20, 2026 at 11:30 AM',
        type: 'homework'
      },
      {
        id: 'n3',
        sender: 'Prof. Amit Jana',
        senderRole: 'Professor at Adamas University',
        content: 'The Vector Algebra Mock Test is scheduled for next Monday (May 25th) at 4:00 PM. High-yield topics include Dot Products, Cross Products, and Scalar Triple Products. Prepare well!',
        timestamp: 'May 21, 2026 at 02:15 PM',
        type: 'exam'
      }
    ];
    localStorage.setItem('jma_notices', JSON.stringify(initialNotices));
  }
};

function App() {
  // Run data seeding
  useEffect(() => {
    seedInitialData();
  }, []);

  // Navigation & User State
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'login' | 'admin' | 'student'
  const [currentUser, setCurrentUser] = useState(null); // { username, role }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Forms States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Panel States
  const [students, setStudents] = useState(() => {
    const stored = localStorage.getItem('jma_students');
    return stored ? JSON.parse(stored) : [];
  });
  const [notices, setNotices] = useState(() => {
    const stored = localStorage.getItem('jma_notices');
    return stored ? JSON.parse(stored) : [];
  });

  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [studentSuccessMsg, setStudentSuccessMsg] = useState('');
  const [studentErrorMsg, setStudentErrorMsg] = useState('');

  const [noticeText, setNoticeText] = useState('');
  const [noticeType, setNoticeType] = useState('announcement');
  const [noticeSuccessMsg, setNoticeSuccessMsg] = useState('');

  // Sync state back to localStorage
  useEffect(() => {
    localStorage.setItem('jma_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('jma_notices', JSON.stringify(notices));
  }, [notices]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsername || !loginPassword) {
      setLoginError('Please enter both username and password.');
      return;
    }

    // Check Admin Login (admin555 / lolff001)
    if (loginUsername === 'admin555' && loginPassword === 'lolff001') {
      const adminUser = { username: 'admin555', role: 'admin' };
      setCurrentUser(adminUser);
      setCurrentTab('admin');
      setLoginUsername('');
      setLoginPassword('');
      return;
    }

    // Check Student Logins
    const matchedStudent = students.find(
      (s) => s.username.toLowerCase() === loginUsername.toLowerCase() && s.password === loginPassword
    );

    if (matchedStudent) {
      const studentUser = { username: matchedStudent.username, role: 'student' };
      setCurrentUser(studentUser);
      setCurrentTab('student');
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('home');
  };

  // Create Student
  const handleCreateStudent = (e) => {
    e.preventDefault();
    setStudentSuccessMsg('');
    setStudentErrorMsg('');

    if (!newStudentUsername || !newStudentPassword) {
      setStudentErrorMsg('Fill in both username and password.');
      return;
    }

    const cleanUsername = newStudentUsername.trim().toLowerCase();
    
    if (cleanUsername === 'admin555') {
      setStudentErrorMsg('Cannot create student with reserved admin name.');
      return;
    }

    // Check if student already exists
    const exists = students.some((s) => s.username.toLowerCase() === cleanUsername);
    if (exists) {
      setStudentErrorMsg('Username already exists. Choose a unique one.');
      return;
    }

    const newStudent = {
      id: Date.now().toString(),
      username: cleanUsername,
      password: newStudentPassword.trim(),
      createdAt: new Date().toISOString()
    };

    setStudents([newStudent, ...students]);
    setNewStudentUsername('');
    setNewStudentPassword('');
    setStudentSuccessMsg(`Student "${cleanUsername}" created successfully!`);
    
    // Clear success message after 3 seconds
    setTimeout(() => setStudentSuccessMsg(''), 4000);
  };

  // Delete Student
  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student account?')) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  // Publish Notice
  const handlePublishNotice = (e) => {
    e.preventDefault();
    setNoticeSuccessMsg('');

    if (!noticeText.trim()) {
      alert('Notice content cannot be empty.');
      return;
    }

    const formatTimestamp = () => {
      const now = new Date();
      return now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' at ' + now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const newNotice = {
      id: 'notice_' + Date.now(),
      sender: 'Prof. Amit Jana',
      senderRole: 'Professor at Adamas University',
      content: noticeText,
      timestamp: formatTimestamp(),
      type: noticeType
    };

    setNotices([newNotice, ...notices]);
    setNoticeText('');
    setNoticeSuccessMsg('Notice published and sent to student panels!');
    
    setTimeout(() => setNoticeSuccessMsg(''), 4000);
  };

  // Delete Notice
  const handleDeleteNotice = (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      setNotices(notices.filter((n) => n.id !== id));
    }
  };

  // WhatsApp Share Helper
  const shareNoticeToWhatsApp = (notice) => {
    const text = `📢 *Notice from Jana Math Academy*\n\n*Type:* ${notice.type.toUpperCase()}\n*Date:* ${notice.timestamp}\n\n*Message:*\n${notice.content}\n\n_Regards,_\n_Prof. Amit Jana (Amit Jana Sir)_`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  const shareCredentialsToWhatsApp = (student) => {
    const text = `🎯 *Jana Math Academy Portal*\n\nHello, student account has been successfully created.\n\n*Your Login Credentials:*\n🔑 *Username:* ${student.username}\n🔒 *Password:* ${student.password}\n\n*Portal Login:* http://localhost:5173/\n\n_Keep your credentials secure. See you in the next mathematics session!_`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  return (
    <>
      {/* Header */}
      <header>
        <div className="container header-container">
          <a href="#" className="logo" onClick={() => setCurrentTab('home')}>
            <GraduationCap size={32} />
            <div>
              <span style={{ color: '#0f172a', fontWeight: '800' }}>JANA</span>
              <span style={{ color: '#0284c7', fontWeight: '600', marginLeft: '4px' }}>MATH ACADEMY</span>
            </div>
          </a>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle"
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: '#0f172a'
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Links */}
          <nav className={mobileMenuOpen ? 'mobile-open' : ''}>
            <a 
              href="#home" 
              className={currentTab === 'home' ? 'active' : ''} 
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
            >
              About Professor
            </a>
            <a 
              href="#achievements" 
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
            >
              Achievements
            </a>
            <a 
              href="#why-choose-us" 
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('why-choose-us')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
            >
              Why Choose Us
            </a>

            <div className="header-actions">
              {currentUser ? (
                <>
                  <span className="user-badge">
                    <User size={14} />
                    {currentUser.role === 'admin' ? 'Admin Profile' : currentUser.username}
                  </span>
                  
                  {currentUser.role === 'admin' && currentTab !== 'admin' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => setCurrentTab('admin')}>
                      Admin Panel
                    </button>
                  )}
                  {currentUser.role === 'student' && currentTab !== 'student' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => setCurrentTab('student')}>
                      Student Panel
                    </button>
                  )}
                  
                  <button className="btn btn-white btn-sm" onClick={handleLogout} title="Log Out">
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={() => { setCurrentTab('login'); setMobileMenuOpen(false); }}>
                  Student Portal Login
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>

        {/* 1. PUBLIC PORTFOLIO PAGE */}
        {currentTab === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="hero-section" id="home">
              <div className="container grid-2">
                <div className="hero-content">
                  <div className="hero-tag">
                    <Sparkles size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    Excel in Mathematics
                  </div>
                  <h1 className="hero-title">
                    Master Mathematics with <span>Prof. Amit Jana</span>
                  </h1>
                  <p className="hero-description">
                    Build rock-solid conceptual clarity and ace your examinations under the guidance of an esteemed 
                    <strong> Professor of Adamas University</strong>. Tailored courses for School Boards, High School Higher Studies, and competitive levels (JEE, Olympiads).
                  </p>
                  <div className="hero-actions">
                    <button className="btn btn-primary" onClick={() => setCurrentTab('login')}>
                      Enter Student Portal <ArrowRight size={18} />
                    </button>
                    <a href="#about" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>
                      Meet the Professor
                    </a>
                  </div>
                </div>
                
                <div className="hero-image-container">
                  <img 
                    src="/hero_math.png" 
                    alt="Mathematics classroom environment showing Prof. Jana teaching geometry on a board" 
                    className="hero-image" 
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                    padding: '2rem 1.5rem 1.5rem',
                    color: '#fff',
                    textAlign: 'left'
                  }}>
                    <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.25rem' }}>Dynamic Classroom Learning</h4>
                    <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Visual and logical breakdowns of advanced algebraic concepts.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section" id="achievements">
              <div className="container">
                <div className="stats-grid">
                  <div className="glass-panel stat-card">
                    <div className="stat-icon">
                      <Users size={28} />
                    </div>
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Students Taught</div>
                    <div className="stat-desc">Guiding board toppers, university entrants, and engineering students.</div>
                  </div>
                  
                  <div className="glass-panel stat-card">
                    <div className="stat-icon">
                      <Award size={28} />
                    </div>
                    <div className="stat-number">10+ Yrs</div>
                    <div className="stat-label">Academic Experience</div>
                    <div className="stat-desc">A decade of teaching experience in higher institutes and personal academy.</div>
                  </div>
                  
                  <div className="glass-panel stat-card">
                    <div className="stat-icon">
                      <GraduationCap size={28} />
                    </div>
                    <div className="stat-number">Adamas</div>
                    <div className="stat-label">University Professor</div>
                    <div className="stat-desc">Academic excellence and rigor driven by university teaching experience.</div>
                  </div>
                </div>
              </div>
            </section>

            {/* About Professor */}
            <section className="why-choose-us" id="about" style={{ background: 'rgba(255,255,255,0.4)', borderY: '1px solid var(--border-color)' }}>
              <div className="container grid-2">
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <span className="hero-tag">About the Professor</span>
                  <h2>Prof. Amit Jana, M.Sc. (Amit Jana Sir)</h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                    Prof. Amit Jana (Amit Jana Sir) is a highly respected educator and professor at <strong>Adamas University</strong>. With over a decade of teaching experience in tertiary mathematics and preparatory high school curriculums, Prof. Jana focuses on developing logical reasoning over plain memorization.
                  </p>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.8' }}>
                    His teaching philosophy centers around building a solid foundation. Whether preparing for competitive exams like IIT-JEE, state board finals, or Olympiads, students get custom-tailored lectures, solved modules, and interactive problem-solving guides.
                  </p>
                  
                  <div className="about-meta" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={18} style={{ color: '#22c55e' }} />
                      <span style={{ fontWeight: '600' }}>Rigorous Pedagogy</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={18} style={{ color: '#22c55e' }} />
                      <span style={{ fontWeight: '600' }}>Interactive Question Banks</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={18} style={{ color: '#22c55e' }} />
                      <span style={{ fontWeight: '600' }}>University Level Guidance</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={18} style={{ color: '#22c55e' }} />
                      <span style={{ fontWeight: '600' }}>Live Chat Notice Updates</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1rem' }}>
                  <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', borderLeft: '5px solid var(--primary)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-hover)' }}>
                      <Layers size={22} />
                      Academic Credentials
                    </h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                      <li style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                        <strong>Current Position:</strong>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-light)' }}>Professor of Mathematics, Adamas University</p>
                      </li>
                      <li style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                        <strong>Academic Background:</strong>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-light)' }}>Master of Science (M.Sc.) in Applied Mathematics, First Class</p>
                      </li>
                      <li>
                        <strong>Key Achievements:</strong>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-light)' }}>Mentored multiple students achieving 99+ percentile in competitive boards and IIT-JEE exams.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Gallery & Teaching Practices */}
            <section className="teaching-features">
              <div className="container">
                <div className="teaching-features-title">
                  <span className="hero-tag" style={{ margin: '0 auto 1rem', display: 'inline-block' }}>Teaching Excellence</span>
                  <h2 className="section-title">Our Pedagogical Framework</h2>
                  <p className="section-intro">Experience math in a structured, visual, and highly logical manner designed for maximum retention.</p>
                </div>

                <div className="feature-layout">
                  {/* Feature Row 1 */}
                  <div className="feature-row">
                    <div className="feature-media">
                      <img src="/students_study.png" alt="Close-up of mathematical calculations, graphs, and study instruments" />
                    </div>
                    <div className="feature-text">
                      <div className="feature-number">Practice & Analytics 01</div>
                      <h3>Conceptual Problem Solving</h3>
                      <p>
                        We move beyond standard formula-memorization. Every mathematical property is derived conceptually in class, helping students build logical workflows and handle unseen problems with confidence.
                      </p>
                      <ul className="feature-highlights">
                        <li><CheckCircle size={16} /> Graphical visualizations of functions & calculus</li>
                        <li><CheckCircle size={16} /> Real-world physics applications of vectors & algebra</li>
                        <li><CheckCircle size={16} /> Structured worksheets distributed weekly</li>
                      </ul>
                    </div>
                  </div>

                  {/* Feature Row 2 */}
                  <div className="feature-row">
                    <div className="feature-media" style={{ background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                      <div className="glass-panel" style={{ width: '100%', padding: '2rem', borderLeft: '4px solid var(--accent-indigo)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-indigo)', fontWeight: '700', marginBottom: '1rem' }}>
                          <MessageSquare size={24} />
                          <span>Student Portal Live Chat</span>
                        </div>
                        <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
                          "The dynamic Student Chat Notice Board enables instantly sharing test schedules and assignment materials from the Admin Panel. No missed announcements."
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-hover)', display: 'flex', alignItems: 'center', justify: 'center', fontSize: '0.8rem', fontWeight: '700' }}>AD</div>
                          <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', color: 'var(--text-dark)' }}>Ananya Das</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Grade 12 student</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="feature-text">
                      <div className="feature-number">Modern Engagement 02</div>
                      <h3>Digital Communication Board</h3>
                      <p>
                        Our specialized Student Panel keeps you connected. Prof. Amit Jana (Amit Jana Sir) posts live announcements, study links, and exam timetables directly from his Admin Panel. Students log in securely to access all communications instantly.
                      </p>
                      <ul className="feature-highlights">
                        <li><CheckCircle size={16} /> Secured personalized logins for each student</li>
                        <li><CheckCircle size={16} /> Live notification feed for instant academic updates</li>
                        <li><CheckCircle size={16} /> Option to direct share notices and credentials to WhatsApp</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-choose-us" id="why-choose-us">
              <div className="container">
                <span className="hero-tag" style={{ margin: '0 auto 1rem', display: 'inline-block' }}>Academy Pillars</span>
                <h2 className="section-title">Why Choose Jana Math Academy?</h2>
                <p className="section-intro">Choosing the right guide is the most critical decision in mastering mathematics. Here is why we stand apart.</p>
                
                <div className="why-grid">
                  <div className="glass-panel why-card">
                    <div className="why-icon-container">
                      <BookOpen size={24} />
                    </div>
                    <h3>Structured Curriculum</h3>
                    <p>Meticulously planned lecture sequences that align with school boards and competitive exam schedules.</p>
                  </div>
                  
                  <div className="glass-panel why-card">
                    <div className="why-icon-container">
                      <Shield size={24} />
                    </div>
                    <h3>Conceptual Clarity</h3>
                    <p>Focus on clarifying the core logic and geometry behind formulas so you understand math deeply, not just solve it.</p>
                  </div>
                  
                  <div className="glass-panel why-card">
                    <div className="why-icon-container">
                      <MessageSquare size={24} />
                    </div>
                    <h3>Digital Notice Panel</h3>
                    <p>A secure portal featuring dynamic notice updates, chat groups, assignment uploads, and schedule revisions.</p>
                  </div>
                  
                  <div className="glass-panel why-card">
                    <div className="why-icon-container">
                      <Users size={24} />
                    </div>
                    <h3>Limited Batch Size</h3>
                    <p>We restrict class size to ensure personal attention and dedicated weekly doubt-clearing sessions for every student.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}


        {/* 2. AUTHENTICATION / LOGIN PORTAL */}
        {currentTab === 'login' && (
          <section className="portal-section">
            <div className="glass-panel login-card">
              <div className="login-header">
                <div className="login-icon">
                  <Lock size={28} />
                </div>
                <h2>Student & Admin Portal</h2>
                <p>Log in with your credentials to access notices and dashboards.</p>
              </div>

              {loginError && (
                <div className="login-error">
                  <X size={18} />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <div className="input-wrapper">
                    <User size={18} />
                    <input 
                      type="text" 
                      id="username" 
                      className="form-control"
                      placeholder="Enter username" 
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input 
                      type="password" 
                      id="password" 
                      className="form-control"
                      placeholder="Enter password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
                  Secure Sign In
                </button>
              </form>

              {/* Login credentials removed for privacy */}
            </div>
          </section>
        )}


        {/* 3. ADMIN DASHBOARD */}
        {currentTab === 'admin' && currentUser && currentUser.role === 'admin' && (
          <section className="container dashboard-container">
            <div className="dashboard-header">
              <div className="dashboard-user-info">
                <h2>Admin Control Center</h2>
                <p>
                  <span>Logged in as: <strong>{currentUser.username}</strong></span>
                  <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Shield size={14} /> Administrator Mode
                  </span>
                </p>
              </div>
              <button className="btn btn-white" onClick={handleLogout}>
                <LogOut size={16} /> Log Out
              </button>
            </div>

            <div className="admin-grid">
              {/* Left Column: Create Student and Dashboard Controls */}
              <div className="sidebar-info" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Create Student Card */}
                <div className="glass-panel panel-card">
                  <h3 className="panel-card-title">
                    <Plus size={20} />
                    Create Student Account
                  </h3>
                  
                  {studentSuccessMsg && (
                    <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>
                      {studentSuccessMsg}
                    </div>
                  )}

                  {studentErrorMsg && (
                    <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>
                      {studentErrorMsg}
                    </div>
                  )}

                  <form onSubmit={handleCreateStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: '0' }}>
                      <label htmlFor="student-user">Student Username</label>
                      <input 
                        type="text" 
                        id="student-user"
                        className="form-control" 
                        style={{ paddingLeft: '1rem' }}
                        placeholder="e.g. rohit_das"
                        value={newStudentUsername}
                        onChange={(e) => setNewStudentUsername(e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '0' }}>
                      <label htmlFor="student-pass">Login Password</label>
                      <input 
                        type="text" 
                        id="student-pass"
                        className="form-control" 
                        style={{ paddingLeft: '1rem' }}
                        placeholder="e.g. mathpass1"
                        value={newStudentPassword}
                        onChange={(e) => setNewStudentPassword(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                      Create Account
                    </button>
                  </form>
                </div>

                {/* Quick Info Box */}
                <div className="glass-panel panel-card">
                  <h3 className="panel-card-title">
                    <BookOpen size={20} />
                    System Guidelines
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                    <div className="info-bullet" style={{ padding: '0.5rem 0 0', border: 'none', background: 'none' }}>
                      <CheckCircle size={16} style={{ color: '#0284c7' }} />
                      <div>
                        <h4>Notices as Chat Group</h4>
                        <p>Notices created here show immediately in the Student Panel as chat group notifications.</p>
                      </div>
                    </div>
                    <div className="info-bullet" style={{ padding: '0.5rem 0 0', border: 'none', background: 'none' }}>
                      <Share2 size={16} style={{ color: '#0284c7' }} />
                      <div>
                        <h4>WhatsApp Credentials Share</h4>
                        <p>Use the WhatsApp icon next to students to directly share their login details with parents/students.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Publish Notice & Student Registry */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Publish Notice Card */}
                <div className="glass-panel panel-card">
                  <h3 className="panel-card-title">
                    <Send size={20} />
                    Send New Notice / Chat Message
                  </h3>
                  
                  {noticeSuccessMsg && (
                    <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>
                      {noticeSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handlePublishNotice} className="notice-form">
                    <div className="form-group" style={{ marginBottom: '0' }}>
                      <label htmlFor="notice-type">Category</label>
                      <select 
                        id="notice-type" 
                        className="select-control"
                        value={noticeType}
                        onChange={(e) => setNoticeType(e.target.value)}
                      >
                        <option value="announcement">Announcement (General)</option>
                        <option value="homework">Homework Assignment</option>
                        <option value="material">Study Material / Notes</option>
                        <option value="exam">Exam schedule / Test alert</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '0' }}>
                      <label htmlFor="notice-content">Message Content</label>
                      <textarea 
                        id="notice-content"
                        className="textarea-control"
                        placeholder="Type notice message to students..."
                        value={noticeText}
                        onChange={(e) => setNoticeText(e.target.value)}
                      ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn btn-primary">
                        Publish Notice <Send size={16} />
                      </button>
                    </div>
                  </form>
                </div>

                {/* Manage Students Card */}
                <div className="glass-panel panel-card">
                  <h3 className="panel-card-title">
                    <Users size={20} />
                    Registered Students Registry ({students.length})
                  </h3>

                  <div className="student-list-container">
                    {students.length === 0 ? (
                      <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>No student accounts registered yet.</p>
                    ) : (
                      students.map((student) => (
                        <div key={student.id} className="student-item">
                          <div className="student-info">
                            <div className="student-avatar">
                              {student.username.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="student-details">
                              <h4>{student.username}</h4>
                              <p>Password: <code style={{ background: '#f1f5f9', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{student.password}</code></p>
                            </div>
                          </div>
                          
                          <div className="student-actions">
                            <button 
                              className="btn btn-secondary btn-sm btn-whatsapp" 
                              title="Share login details via WhatsApp"
                              onClick={() => shareCredentialsToWhatsApp(student)}
                              style={{ display: 'inline-flex', padding: '0.5rem' }}
                            >
                              <Share2 size={16} />
                            </button>
                            <button 
                              className="btn btn-white btn-sm"
                              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem' }}
                              title="Delete Student"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Sent Notices Log */}
                <div className="glass-panel panel-card">
                  <h3 className="panel-card-title">
                    <FileText size={20} />
                    Notice Board Logs ({notices.length})
                  </h3>

                  <div className="student-list-container" style={{ maxHeight: '350px' }}>
                    {notices.length === 0 ? (
                      <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>No notices published yet.</p>
                    ) : (
                      notices.map((notice) => (
                        <div key={notice.id} className="student-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <span className={`badge badge-${notice.type}`}>{notice.type}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{notice.timestamp}</span>
                          </div>
                          <p style={{ fontSize: '0.95rem', color: 'var(--text-dark)', wordBreak: 'break-word', textAlign: 'left', width: '100%' }}>{notice.content}</p>
                          
                          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                            <button 
                              className="btn btn-white btn-sm" 
                              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                              onClick={() => shareNoticeToWhatsApp(notice)}
                            >
                              <Share2 size={12} style={{ marginRight: '4px' }} /> Share notice
                            </button>
                            <button 
                              className="btn btn-white btn-sm" 
                              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.1)', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                              onClick={() => handleDeleteNotice(notice.id)}
                            >
                              <Trash2 size={12} style={{ marginRight: '4px' }} /> Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}


        {/* 4. STUDENT DASHBOARD */}
        {currentTab === 'student' && currentUser && currentUser.role === 'student' && (
          <section className="container dashboard-container">
            <div className="dashboard-header">
              <div className="dashboard-user-info">
                <h2>Student Portal Dashboard</h2>
                <p>
                  <span>Student account: <strong>{currentUser.username}</strong></span>
                  <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle size={14} /> Active Session
                  </span>
                </p>
              </div>
              <button className="btn btn-white" onClick={handleLogout}>
                <LogOut size={16} /> Log Out
              </button>
            </div>

            <div className="dashboard-grid">
              
              {/* Main chat window: Notice board feed */}
              <div className="chat-window">
                <div className="chat-header">
                  <div className="chat-header-title">
                    <MessageSquare size={22} style={{ color: 'var(--primary)' }} />
                    <div>
                      <h3>Jana Math Academy Notice Group</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0 }}>Official announcement chat for enrolled students</p>
                    </div>
                  </div>
                  <div className="chat-header-status">
                    Prof. Amit Jana is Active
                  </div>
                </div>

                <div className="chat-messages">
                  {notices.length === 0 ? (
                    <div className="empty-chat">
                      <MessageSquare size={48} />
                      <h3>No Notices Published Yet</h3>
                      <p>When Professor Jana publishes assignments or announcements, they will appear here in real-time.</p>
                    </div>
                  ) : (
                    // Show notices from oldest to newest or newest to oldest. Typically log is newest on top.
                    // For chat feel, rendering newest on top works fine, or reverse it. Let's list newest at the top but make it visually clear.
                    notices.map((notice) => (
                      <div key={notice.id} className="message-card sender-admin">
                        <div className="message-meta">
                          <span className="message-sender">{notice.sender} ({notice.senderRole})</span>
                          <span className="message-time">{notice.timestamp}</span>
                        </div>
                        
                        <div className="message-content">
                          <span className={`badge badge-${notice.type}`} style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>{notice.type}</span>
                          <p style={{ color: 'var(--text-dark)', fontWeight: '400' }}>{notice.content}</p>
                        </div>

                        <div className="message-footer">
                          <div className="message-footer-left">
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle size={12} style={{ color: '#22c55e' }} /> Notice verified
                            </span>
                          </div>
                          
                          <button 
                            className="btn btn-white btn-sm"
                            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                            onClick={() => shareNoticeToWhatsApp(notice)}
                          >
                            <Share2 size={12} style={{ marginRight: '4px' }} /> Share notice
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sidebar Info Panels */}
              <div className="sidebar-info">
                
                {/* Academic profile card */}
                <div className="glass-panel panel-card" style={{ padding: '2rem 1.5rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', margin: '0 auto 1rem' }}>
                      {currentUser.username.substring(0, 2).toUpperCase()}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{currentUser.username}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Enrolled Student</p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-light)' }}>Academy:</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Jana Math Academy</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-light)' }}>Primary Mentor:</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Prof. Amit Jana</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-light)' }}>Session Status:</span>
                      <span style={{ fontWeight: '600', color: '#22c55e' }}>Active</span>
                    </div>
                  </div>
                </div>

                {/* Helpful resources panel */}
                <div className="glass-panel panel-card">
                  <h3 className="panel-card-title">
                    <BookOpen size={18} />
                    Quick Resources
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.15rem' }}>Adamas University Portal</h4>
                      <a href="https://adamasuniversity.ac.in/" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                        Visit Website <ArrowRight size={12} style={{ display: 'inline' }} />
                      </a>
                    </div>
                    <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.15rem' }}>WhatsApp Doubts Helpline</h4>
                      <a href="https://api.whatsapp.com/send?text=Hello%20Professor%20Amit%20Jana,%20I%20have%20a%20doubt%20regarding..." target="_blank" rel="noreferrer" style={{ color: '#25d366', textDecoration: 'none', fontWeight: '600' }}>
                        Message Professor <ArrowRight size={12} style={{ display: 'inline' }} />
                      </a>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>
        )}

      </main>

      {/* Footer / Contact Details */}
      <footer>
        <div className="container footer-grid">
          <div className="footer-col">
            <a href="#" className="logo footer-logo" onClick={() => setCurrentTab('home')}>
              <GraduationCap size={28} />
              <span style={{ color: '#fff', fontWeight: '800' }}>JANA</span>
              <span style={{ color: 'var(--accent-blue)', fontWeight: '600', marginLeft: '4px' }}>MATH ACADEMY</span>
            </a>
            <p className="footer-desc">
              Dedicated coaching for high school mathematics, college boards, and engineering entrances. Guided by experience, driven by concept.
            </p>
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#home" onClick={() => setCurrentTab('home')}>Home Portfolio</a></li>
              <li><a href="#about" onClick={() => { setCurrentTab('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Meet Prof. Amit Jana</a></li>
              <li><a href="#achievements" onClick={() => { setCurrentTab('home'); setTimeout(() => document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Achievements</a></li>
              <li><a href="#login" onClick={() => setCurrentTab('login')}>Student Login Portal</a></li>
            </ul>
          </div>

          <div className="footer-col" id="contact">
            <h3>Contact Details</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <MapPin size={18} />
                <span>Adamas University Campus, Barasat - Barrackpore Road, Kolkata, West Bengal 700126</span>
              </div>
              <div className="contact-item">
                <Phone size={18} />
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <span>contact@janamathacademy.edu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>Jana Math Academy &copy; {new Date().getFullYear()}. All Rights Reserved. Managed by Prof. Amit Jana (Adamas University).</p>
        </div>
      </footer>
    </>
  );
}

export default App;
