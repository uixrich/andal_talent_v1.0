

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
    List, 
    Cube, 
    UsersThree, 
    Briefcase, 
    UserCircleCheck, 
    FileMagnifyingGlass, 
    Gear, 
    MagnifyingGlass, 
    GridFour, 
    Funnel, 
    Plus, 
    ShareNetwork, 
    Trash,
    CaretDown,
    CalendarBlank,
    X,
    LinkedinLogo,
    Link,
    CaretLeft,
    CaretRight
} from "@phosphor-icons/react";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const initialJobs = [
    { id: 'JP0001', job: 'Sales Admin', period: '13 Des 2024 - 15 Jan 2025', totalApplicants: 53, selectedTalent: 23, status: 'Active' },
    { id: 'JP0067', job: 'Marketing Manager', period: '02 Mar 2024 - 11 Apr 2024', totalApplicants: 21, selectedTalent: 12, status: 'Inactive' },
    { id: 'JP0097', job: 'Product Owner', period: '23 Nov 2023 - 15 Oct 2023', totalApplicants: 38, selectedTalent: 3, status: 'Inactive' },
];

const SuccessNotification = ({ message, onClose }) => {
    useEffect(() => {
        // FIX: Explicitly use `window.setTimeout` and `window.clearTimeout` to avoid type conflicts with Node.js `Timeout` object.
        const timer = window.setTimeout(onClose, 3000);
        return () => window.clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="success-toast">
            <span>{message}</span>
            <X size={16} weight="bold" onClick={onClose} />
        </div>
    );
};

const ShareModal = ({ job, onClose }) => {
    const jobSlug = job.job.toLowerCase().replace(/\s+/g, '-');
    const links = {
        linkedin: `bit.ly/${jobSlug}-andal-linkedin`,
        jobstreet: `bit.ly/${jobSlug}-andal-jobstreet`,
        indeed: `bit.ly/${jobSlug}-andal-indeed`,
        others: `bit.ly/${jobSlug}-andal-andal`,
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Share your Job Posting</h3>
                <p>Please copy link related that media you need</p>
                <div className="share-links">
                    <div className="share-link-item">
                        <LinkedinLogo size={24} color="#0A66C2" />
                        <span>Linkedin</span>
                        <input type="text" readOnly value={links.linkedin} />
                        <button onClick={() => navigator.clipboard.writeText(links.linkedin)}>Copy</button>
                    </div>
                    <div className="share-link-item">
                        <Briefcase size={24} />
                        <span>JobStreet</span>
                        <input type="text" readOnly value={links.jobstreet} />
                        <button onClick={() => navigator.clipboard.writeText(links.jobstreet)}>Copy</button>
                    </div>
                     <div className="share-link-item">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Indeed_logo.svg/2560px-Indeed_logo.svg.png" alt="Indeed" className="indeed-logo"/>
                        <span>Indeed</span>
                        <input type="text" readOnly value={links.indeed} />
                        <button onClick={() => navigator.clipboard.writeText(links.indeed)}>Copy</button>
                    </div>
                    <div className="share-link-item">
                        <Link size={24} />
                        <span>Others</span>
                        <input type="text" readOnly value={links.others} />
                        <button onClick={() => navigator.clipboard.writeText(links.others)}>Copy</button>
                    </div>
                </div>
                <button className="close-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};


const JobPostingList = ({ jobs, onAddClick, onShare, onDelete }) => (
    <div className="content-card">
        <div className="card-controls">
            <div className="keyword-search">
                <MagnifyingGlass size={20} />
                <input type="text" placeholder="Search keyword...." />
            </div>
            <button className="filter-btn"><Funnel size={18} /> Filter</button>
            <button className="add-btn" onClick={onAddClick}><Plus size={18} /> Add Job Posting</button>
        </div>
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Reference No.</th>
                        <th>Job</th>
                        <th>Posting Period</th>
                        <th>Total Applicant</th>
                        <th>Selected Talent</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map(job => (
                        <tr key={job.id}>
                            <td>{job.id}</td>
                            <td><a href="#">{job.job}</a></td>
                            <td>{job.period}</td>
                            <td>{job.totalApplicants}</td>
                            <td>{job.selectedTalent}</td>
                            <td><span className={`status ${job.status.toLowerCase()}`}>{job.status}</span></td>
                            <td className="action-icons">
                                <ShareNetwork size={20} onClick={() => onShare(job)} />
                                <Trash size={20} onClick={() => onDelete(job.id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const DateRangePicker = ({ onApply, onCancel }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const handleDayClick = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (date < startDate) {
            setStartDate(date);
        } else {
            setEndDate(date);
        }
    };

    const handleApply = () => {
        if (startDate && endDate) {
            onApply(startDate, endDate);
        }
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-start-${i}`} className="drp-day other-month"></div>);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(year, month, i);
            let className = "drp-day";
            if (startDate && endDate && dayDate > startDate && dayDate < endDate) className += " in-range";
            if (startDate && dayDate.getTime() === startDate.getTime()) className += " start-date";
            if (endDate && dayDate.getTime() === endDate.getTime()) className += " end-date";
            days.push(<div key={i} className={className} onClick={() => handleDayClick(i)}>{i}</div>);
        }
        
        return days;
    };

    return (
        <div className="date-range-picker">
            <div className="drp-header">
                <button onClick={handlePrevMonth}><CaretLeft /></button>
                <div className="drp-month-year">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
                <button onClick={handleNextMonth}><CaretRight /></button>
            </div>
            <div className="drp-calendar">
                {dayNames.map(day => <div key={day} className="drp-day-name">{day}</div>)}
                {renderCalendar()}
            </div>
            <div className="drp-footer">
                <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                <button className="save-btn" onClick={handleApply} disabled={!startDate || !endDate}>Apply</button>
            </div>
        </div>
    );
};


const NewJobPostingForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        referenceNumber: 'JP0136',
        job: '',
        workLocation: '',
        workType: '',
        postingPeriod: '',
        description: '',
        salary: '',
        hideSalary: false,
        negotiable: false,
        document: false,
        documentTitle: '',
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleDateApply = (start, end) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const format = (date) => date.toLocaleDateString('id-ID', options).replace(/\./g, '');
        const formattedPeriod = `${format(start)} - ${format(end)}`;
        setFormData(prev => ({ ...prev, postingPeriod: formattedPeriod }));
        setShowDatePicker(false);
    };

    const handleGenerateSuggestion = async () => {
        if (!formData.job) {
            alert("Please select a job title first.");
            return;
        }
        setIsGenerating(true);
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Write a detailed job description and requirements for a "${formData.job}" position. Format it as plain text suitable for a job posting. Include Responsibilities and Requirements sections.`
            });
            setFormData(prev => ({...prev, description: response.text}));
        } catch (error) {
            console.error("Error generating suggestion:", error);
            alert("Failed to generate suggestion. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newJob = {
            id: formData.referenceNumber,
            job: formData.job,
            period: formData.postingPeriod || '17 Nov 2024 - 15 Jan 2025', // Example data
            totalApplicants: 21,
            selectedTalent: 12,
            status: 'Active'
        };
        onSave(newJob);
    };

    return (
        <form className="content-card form-container" onSubmit={handleSubmit}>
            <div className="form-grid">
                <div className="form-group">
                    <label>Reference Number *</label>
                    <div className="custom-select">
                        <select name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange}>
                            <option value="JP0136">JP0136</option>
                        </select>
                        <CaretDown />
                    </div>
                </div>
                <div className="form-group">
                    <label>Job *</label>
                    <div className="custom-select">
                         <select name="job" value={formData.job} onChange={handleInputChange} required>
                            <option value="" disabled>Select Job</option>
                            <option value="Office Boy">Office Boy</option>
                            <option value="Sales Admin">Sales Admin</option>
                            <option value="Marketing Manager">Marketing Manager</option>
                            <option value="Product Owner">Product Owner</option>
                        </select>
                        <CaretDown />
                    </div>
                </div>
                <div className="form-group">
                    <label>Posting Period *</label>
                     <div className="custom-input-with-icon" onClick={() => setShowDatePicker(true)}>
                        <input type="text" name="postingPeriod" placeholder="Select posting period" value={formData.postingPeriod} readOnly required />
                        <CalendarBlank />
                    </div>
                    {showDatePicker && <DateRangePicker onApply={handleDateApply} onCancel={() => setShowDatePicker(false)} />}
                </div>
                <div className="form-group">
                    <label>Work Location *</label>
                    <div className="custom-select">
                        <select name="workLocation" value={formData.workLocation} onChange={handleInputChange} required>
                            <option value="" disabled>Select work location</option>
                            <option value="Bandung">Bandung</option>
                            <option value="Jakarta">Jakarta</option>
                            <option value="Surabaya">Surabaya</option>
                        </select>
                        <CaretDown />
                    </div>
                </div>
                 <div className="form-group">
                    <label>Work Type *</label>
                    <div className="custom-select">
                         <select name="workType" value={formData.workType} onChange={handleInputChange} required>
                            <option value="" disabled>Select work type</option>
                            <option value="On-site">On-site</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                        <CaretDown />
                    </div>
                </div>
            </div>
            
            <div className="form-group-full">
                <label>Job Description & Requirements</label>
                <div className="textarea-header">
                    <button type="button" className="generate-btn" onClick={handleGenerateSuggestion} disabled={isGenerating}>
                        {isGenerating ? 'Generating...' : 'Generate Suggestion'}
                    </button>
                </div>
                <textarea 
                    name="description" 
                    placeholder="Input job description & requirements" 
                    // FIX: The `rows` attribute for a textarea in React expects a number, not a string.
                    // This corrects a "Type 'string' is not assignable to type 'number'" error.
                    rows={10} 
                    value={formData.description}
                    onChange={handleInputChange}
                ></textarea>
            </div>

            <h2 className="form-section-title">Additional Information</h2>
            <div className="form-grid">
                <div className="form-group">
                    <label>Estimated Salary (Rp)</label>
                    <input type="text" name="salary" placeholder="Input estimated salary" value={formData.salary} onChange={handleInputChange} />
                </div>
                 <div className="form-group">
                    <label>Additional Document</label>
                    <div className="custom-checkbox-input">
                        <input type="checkbox" id="document" name="document" checked={formData.document} onChange={handleInputChange}/>
                        <input type="text" name="documentTitle" placeholder="Input document title" value={formData.documentTitle} onChange={handleInputChange} disabled={!formData.document}/>
                    </div>
                </div>
            </div>
            <div className="form-checkbox-group">
                <label className="custom-checkbox"><input type="checkbox" name="hideSalary" checked={formData.hideSalary} onChange={handleInputChange}/> Hide salary</label>
                <label className="custom-checkbox"><input type="checkbox" name="negotiable" checked={formData.negotiable} onChange={handleInputChange}/> Negotiable</label>
            </div>

            <div className="form-footer">
                <p>* Please fill in all mandatory fields</p>
                <div className="form-actions">
                    <button type="submit" className="save-btn">Save</button>
                    <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </form>
    );
};

const App = () => {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [jobs, setJobs] = useState(initialJobs);
  const [showNotification, setShowNotification] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleSaveJob = (newJob) => {
      setJobs(prev => [newJob, ...prev.filter(j => j.id !== newJob.id)]);
      setView('list');
      setShowNotification(true);
  };
  
  const handleDeleteJob = (jobId) => {
      setJobs(prev => prev.filter(job => job.id !== jobId));
  };
  
  const handleShareJob = (job) => {
      setSelectedJob(job);
      setShowShareModal(true);
  };

  return (
    <div className="app-container">
        {showNotification && <SuccessNotification message="Your data has been created" onClose={() => setShowNotification(false)} />}
        {showShareModal && <ShareModal job={selectedJob} onClose={() => setShowShareModal(false)} />}
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <span>andal</span><span className="logo-bold">talent</span>
                </div>
                <List size={24} />
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li><a href="#"><Cube size={24} weight="regular" /><span>Dashboard</span></a></li>
                    <li><a href="#"><UsersThree size={24} weight="regular" /><span>Man Power Planning</span></a></li>
                    <li className="active"><a href="#"><Briefcase size={24} weight="fill" /><span>Job Posting</span></a></li>
                    <li><a href="#"><UserCircleCheck size={24} weight="regular" /><span>Talent Pool</span></a></li>
                    <li><a href="#"><FileMagnifyingGlass size={24} weight="regular" /><span>Applicant Tracking System</span></a></li>
                    <li><a href="#"><Gear size={24} weight="regular" /><span>Settings</span></a></li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                <div className="logo">
                    <span>andal</span><span className="logo-bold">kharisma</span>
                </div>
            </div>
        </aside>
        <div className="main-wrapper">
            <header className="app-header">
                <div className="search-bar">
                    <MagnifyingGlass size={20} />
                    <input type="text" placeholder="Search by name, email, job etc...." />
                </div>
                <div className="user-profile">
                    <GridFour size={24} />
                    <span>Andrie Joni</span>
                    <div className="avatar"></div>
                </div>
            </header>
            <main className="main-content">
                <h1>{view === 'list' ? 'Job Posting' : 'New Job Posting'}</h1>
                {view === 'list' ? (
                    <JobPostingList jobs={jobs} onAddClick={() => setView('form')} onShare={handleShareJob} onDelete={handleDeleteJob} />
                ) : (
                    <NewJobPostingForm onSave={handleSaveJob} onCancel={() => setView('list')} />
                )}
            </main>
        </div>
    </div>
  );
};

const style = `
  :root {
    --sidebar-bg: #1E293B;
    --main-bg: #F8FAFC;
    --card-bg: #FFFFFF;
    --primary-accent: #6366F1;
    --primary-accent-hover: #4F46E5;
    --text-light: #F8FAFC;
    --text-dark: #1E293B;
    --text-muted: #64748B;
    --text-nav: #CBD5E1;
    --border-color: #E2E8F0;
    --status-active-bg: #DCFCE7;
    --status-active-text: #16A34A;
    --status-inactive-bg: #F1F5F9;
    --status-inactive-text: #64748B;
    --font-family: 'Noto Sans', sans-serif;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    font-family: var(--font-family);
    background-color: var(--main-bg);
    color: var(--text-dark);
    font-size: 14px;
  }

  #root, .app-container {
    display: flex;
    height: 100vh;
    width: 100%;
  }

  /* --- Sidebar --- */
  .sidebar {
    width: 280px;
    background-color: var(--sidebar-bg);
    color: var(--text-light);
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    flex-shrink: 0;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 500;
  }

  .logo-bold {
    font-weight: 700;
  }

  .sidebar-header svg {
    cursor: pointer;
  }

  .sidebar-nav ul {
    list-style: none;
  }

  .sidebar-nav li {
    margin-bottom: 0.5rem;
  }

  .sidebar-nav a {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    color: var(--text-nav);
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .sidebar-nav a:hover {
    background-color: #334155;
    color: var(--text-light);
  }

  .sidebar-nav li.active a {
    background-color: var(--primary-accent);
    color: var(--text-light);
  }

  .sidebar-footer {
    margin-top: auto;
  }

  /* --- Main Wrapper --- */
  .main-wrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    position: relative;
  }

  /* --- Header --- */
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--main-bg);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    width: 350px;
  }
  
  .search-bar svg {
    color: var(--text-muted);
  }

  .search-bar input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-family: var(--font-family);
    font-size: 14px;
  }
  
  .user-profile {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .user-profile > svg {
    color: var(--text-dark);
    cursor: pointer;
  }

  .user-profile span {
    font-weight: 500;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #FFC107; /* Placeholder color */
  }

  /* --- Main Content --- */
  .main-content {
    padding: 2rem;
  }

  .main-content h1 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }
  
  .content-card {
    background-color: var(--card-bg);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  .card-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .keyword-search {
    position: relative;
    flex-grow: 1;
  }

  .keyword-search input {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    font-family: var(--font-family);
    font-size: 14px;
  }

  .keyword-search > svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
  }

  button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 8px;
    font-family: var(--font-family);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s ease;
  }

  .filter-btn {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    color: var(--text-dark);
  }
  .filter-btn:hover {
    background-color: #f1f5f9;
  }

  .add-btn {
    background-color: var(--primary-accent);
    color: var(--text-light);
  }
  .add-btn:hover {
    background-color: var(--primary-accent-hover);
  }

  /* --- Table --- */
  .table-container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    white-space: nowrap;
  }

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }

  th {
    color: var(--text-muted);
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }

  td a {
    color: var(--primary-accent);
    text-decoration: none;
    font-weight: 500;
  }
  
  td a:hover {
    text-decoration: underline;
  }
  
  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-weight: 500;
    font-size: 12px;
  }

  .status.active {
    background-color: var(--status-active-bg);
    color: var(--status-active-text);
  }
  
  .status.inactive {
    background-color: var(--status-inactive-bg);
    color: var(--status-inactive-text);
  }

  .action-icons {
    display: flex;
    gap: 1.5rem;
  }
  
  .action-icons svg {
    cursor: pointer;
    color: var(--text-muted);
  }
  
  .action-icons svg:hover {
    color: var(--text-dark);
  }

  /* --- Form Styles --- */
  .form-container {
    padding: 2rem;
  }
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
  }
  .form-group label, .form-group-full label {
    font-weight: 500;
    color: var(--text-dark);
  }
  .form-group input, .form-group select {
    width: 100%;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    font-family: var(--font-family);
    font-size: 14px;
    background-color: white;
  }
  .custom-select {
    position: relative;
  }
  .custom-select select {
    -webkit-appearance: none;
    appearance: none;
  }
  .custom-select svg {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
  .custom-input-with-icon {
    position: relative;
    cursor: pointer;
  }
  .custom-input-with-icon input {
    padding-right: 2.5rem;
    cursor: pointer;
  }
  .custom-input-with-icon svg {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }
  .form-group-full {
    margin-bottom: 1.5rem;
  }
  .textarea-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
  }
  .generate-btn {
    background: none;
    border: none;
    color: var(--primary-accent);
    font-weight: 600;
    cursor: pointer;
  }
  .generate-btn:disabled {
    color: var(--text-muted);
    cursor: not-allowed;
  }
  textarea {
    width: 100%;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    font-family: var(--font-family);
    font-size: 14px;
    resize: vertical;
  }
  .form-section-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    margin-top: 1rem;
    border-top: 1px solid var(--border-color);
    padding-top: 1.5rem;
  }
  .custom-checkbox-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding-right: 1rem;
  }
  .custom-checkbox-input input[type="checkbox"]{
    margin-left: 1rem;
  }
  .custom-checkbox-input input[type="text"]{
    border: none;
    flex-grow: 1;
  }
  .form-checkbox-group {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
  }
  .custom-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .form-footer {
    border-top: 1px solid var(--border-color);
    padding-top: 1.5rem;
    margin-top: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .form-footer p {
    color: var(--text-muted);
    font-style: italic;
  }
  .form-actions {
    display: flex;
    gap: 1rem;
  }
  .save-btn {
    background-color: var(--primary-accent);
    color: var(--text-light);
  }
  .save-btn:hover {
    background-color: var(--primary-accent-hover);
  }
  .cancel-btn {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    color: var(--text-dark);
  }
  .cancel-btn:hover {
    background-color: #f1f5f9;
  }

  /* --- Date Range Picker --- */
  .date-range-picker {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 1rem;
    margin-top: 0.5rem;
    width: 300px;
  }
  .drp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .drp-header button {
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
  }
  .drp-month-year {
    font-weight: 600;
  }
  .drp-calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }
  .drp-day-name, .drp-day {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    text-align: center;
    font-size: 12px;
  }
  .drp-day-name {
    color: var(--text-muted);
    font-weight: 600;
  }
  .drp-day {
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }
  .drp-day:hover {
    background-color: #f1f5f9;
  }
  .drp-day.other-month {
    color: #cbd5e1;
    cursor: default;
  }
  .drp-day.other-month:hover {
    background: none;
  }
  .drp-day.start-date, .drp-day.end-date {
    background-color: var(--primary-accent);
    color: white;
  }
  .drp-day.in-range {
    background-color: #e0e7ff;
    border-radius: 0;
  }
  .drp-day.start-date.in-range {
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
  }
  .drp-day.end-date.in-range {
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
  }
  .drp-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
    border-top: 1px solid var(--border-color);
    padding-top: 1rem;
  }
  .drp-footer button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* --- Success Notification --- */
  .success-toast {
    position: absolute;
    top: 20px;
    right: 50%;
    transform: translateX(50%);
    background-color: #DCFCE7;
    color: #16A34A;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    z-index: 1000;
    border: 1px solid #A7F3D0;
    animation: fadeInOut 3s forwards;
  }
  .success-toast svg {
    cursor: pointer;
  }
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translate(50%, -20px); }
    10% { opacity: 1; transform: translate(50%, 0); }
    90% { opacity: 1; transform: translate(50%, 0); }
    100% { opacity: 0; transform: translate(50%, -20px); }
  }

  /* --- Share Modal --- */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .modal-content h3 {
    font-size: 1.25rem;
    font-weight: 600;
  }
  .modal-content p {
    color: var(--text-muted);
  }
  .share-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
  .share-link-item {
    display: grid;
    grid-template-columns: auto 1fr 2fr auto;
    align-items: center;
    gap: 1rem;
  }
  .share-link-item input {
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: var(--main-bg);
  }
  .share-link-item button {
    padding: 0.5rem 1rem;
    background: none;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;
  }
  .share-link-item .indeed-logo {
    height: 20px;
    width: auto;
  }
  .close-btn {
    align-self: flex-end;
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    color: var(--text-dark);
  }
  .close-btn:hover {
    background-color: #f1f5f9;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = style;
document.head.appendChild(styleSheet);

const container = document.getElementById('root');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
