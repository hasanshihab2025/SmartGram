/* =========================================
   SMARTGRAM - APPLICATION DATA
========================================= */

/* =========================================
   SMARTGRAM - DYNAMIC DASHBOARD STATISTICS
========================================= */

function getDashboardStats() {

    // Get all saved reports
    const issues = getSavedIssues();

    // Calculate report statistics
    const totalIssues = issues.length;

    const resolvedIssues = issues.filter(
        issue => issue.status === "Resolved"
    ).length;

    const inProgressIssues = issues.filter(
        issue => issue.status === "In Progress"
    ).length;

    const pendingIssues = issues.filter(
        issue => issue.status === "Pending"
    ).length;

    const underReviewIssues = issues.filter(
        issue => issue.status === "Under Review"
    ).length;


    // Return calculated statistics
    return [
        {
            title: "Total Issues",
            value: totalIssues
        },
        {
            title: "Resolved Issues",
            value: resolvedIssues
        },
        {
            title: "In Progress",
            value: inProgressIssues
        },
        {
            title: "Pending Issues",
            value: pendingIssues
        },
        {
            title: "Under Review",
            value: underReviewIssues
        }
    ];

}



// Village services
const villageServices = [
    {
        icon: "🏥",
        title: "Healthcare",
        description: "Find healthcare information and nearby medical services."
    },
    {
        icon: "🎓",
        title: "Education",
        description: "Explore local schools and educational facilities."
    },
    {
        icon: "💧",
        title: "Water Supply",
        description: "Access information about village water services."
    },
    {
        icon: "⚡",
        title: "Electricity",
        description: "View electricity-related services and report problems."
    },
    {
        icon: "🛣️",
        title: "Road & Transport",
        description: "Explore local roads and transportation information."
    },
    {
        icon: "🗑️",
        title: "Waste Management",
        description: "Learn about local waste collection and cleanliness."
    }
];


/* =========================================
   RENDER DASHBOARD STATISTICS
========================================= */


function renderDashboardStats() {

    const statsContainer = document.getElementById(
        "dashboard-stats"
    );

    if (!statsContainer) return;

    // Get dynamically calculated statistics
    const dashboardStats = getDashboardStats();

    // Render statistics cards
    statsContainer.innerHTML = dashboardStats.map(stat => `
        <div class="stat-card">
            <h3>${stat.title}</h3>
            <p class="stat-value">${stat.value}</p>
        </div>
    `).join("");

}



/* =========================================
   RENDER VILLAGE SERVICES
========================================= */

function renderVillageServices() {

    const servicesContainer = document.getElementById(
        "services-container"
    );

    if (!servicesContainer) return;

    servicesContainer.innerHTML = villageServices.map(service => `
        <article class="service-card">

            <div class="service-icon">
                ${service.icon}
            </div>

            <h3>${service.title}</h3>

            <p>${service.description}</p>

        </article>
    `).join("");

}


/* =========================================
   INITIALIZE APPLICATION
========================================= */

function initializeSmartGram() {

    renderDashboardStats();

    renderCategoryAnalytics();

    renderStatusAnalytics();

    renderVillageServices();

    renderIssueForm();

    renderReportHistory();

    setupMapInteractions();

    setupRoleSwitching();

    setupReportIssueButton();

    console.log("SmartGram initialized successfully!");

}


// Start application
document.addEventListener(
    "DOMContentLoaded",
    initializeSmartGram
);

/* =========================================
   SMARTGRAM - ISSUE REPORTING FORM
========================================= */

// Render issue reporting form
function renderIssueForm() {

    const formContainer = document.getElementById(
        "issue-form-container"
    );

    if (!formContainer) return;

    formContainer.innerHTML = `
        <form id="issue-report-form">

            <div class="form-group">
                <label for="issue-title">
                    Issue Title
                </label>

                <input
                    type="text"
                    id="issue-title"
                    placeholder="Example: Damaged village road"
                    required
                >
            </div>


            <div class="form-group">
                <label for="issue-category">
                    Issue Category
                </label>

                <select id="issue-category" required>
                    <option value="">Select a category</option>
                    <option value="Road & Transport">
                        Road & Transport
                    </option>
                    <option value="Water Supply">
                        Water Supply
                    </option>
                    <option value="Electricity">
                        Electricity
                    </option>
                    <option value="Healthcare">
                        Healthcare
                    </option>
                    <option value="Waste Management">
                        Waste Management
                    </option>
                    <option value="Other">
                        Other
                    </option>
                </select>
            </div>


            <div class="form-group">
                <label for="issue-description">
                    Issue Description
                </label>

                <textarea
                    id="issue-description"
                    rows="5"
                    placeholder="Describe the problem..."
                    required
                ></textarea>
            </div>


            <div class="form-group">
                <label for="issue-location">
                    Village Location
                </label>

                <input
                    type="text"
                    id="issue-location"
                    placeholder="Example: Kakara, Chakaria"
                    required
                >
            </div>


            <button type="submit" id="submit-issue-btn">
                Submit Report
            </button>

            <p id="form-message" role="status"></p>

        </form>
    `;


    // Handle form submission
    const issueForm = document.getElementById(
        "issue-report-form"
    );

    issueForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const newIssue = {
            id: Date.now(),

            title: document.getElementById(
                "issue-title"
            ).value.trim(),

            category: document.getElementById(
                "issue-category"
            ).value,

            description: document.getElementById(
                "issue-description"
            ).value.trim(),

            location: document.getElementById(
                "issue-location"
            ).value.trim(),

            status: "Pending",

            createdAt: new Date().toISOString()
        };


        // Load existing reports
        const existingIssues = JSON.parse(
            localStorage.getItem("smartgramIssues") || "[]"
        );


        // Add new report
        existingIssues.push(newIssue);


        // Save reports in browser
        localStorage.setItem(
            "smartgramIssues",
            JSON.stringify(existingIssues)
        );

        renderCategoryAnalytics();


        // Show confirmation
        document.getElementById(
            "form-message"
        ).textContent =
            "Your issue has been submitted successfully!";


        // Reset form
        issueForm.reset();

        console.log("New issue submitted:", newIssue);

    });

}

/* =========================================
   SMARTGRAM - CITIZEN REPORT HISTORY
========================================= */

// Get saved reports from LocalStorage
function getSavedIssues() {

    try {
        return JSON.parse(
            localStorage.getItem("smartgramIssues") || "[]"
        );
    } catch (error) {
        console.error("Could not read saved issues:", error);
        return [];
    }

}


// Format report date
function formatReportDate(dateString) {

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


// Render citizen report history
function renderReportHistory() {

    const historyContainer = document.getElementById(
        "report-history-container"
    );

    if (!historyContainer) return;

    const issues = getSavedIssues();

    // Empty state
    if (issues.length === 0) {

        historyContainer.innerHTML = `
            <div class="empty-history">
                <h3>No Reports Yet</h3>
                <p>You have not submitted any village issues.</p>
            </div>
        `;

        return;
    }


    // Display reports
    historyContainer.innerHTML = issues
        .slice()
        .reverse()
        .map(issue => `

            <article class="history-card">

                <div class="history-card-content">

                    <div>
                        <span class="history-category">
                            ${escapeHTML(issue.category)}
                        </span>

                        <h3>${escapeHTML(issue.title)}</h3>

                        <p>
                            ${escapeHTML(issue.description)}
                        </p>

                        <div class="history-location">
                            📍 ${escapeHTML(issue.location)}
                        </div>

                        <small>
                            Submitted:
                            ${formatReportDate(issue.createdAt)}
                        </small>
                    </div>

                    <span class="status-badge status-pending">
                        ${escapeHTML(issue.status || "Pending")}
                    </span>

                </div>

            </article>

        `).join("");

}


// Escape user-provided text before inserting HTML
function escapeHTML(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,
        character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]
    );

}

/* =========================================
   SMARTGRAM - ADMIN DASHBOARD
========================================= */

// Render reports in Admin Dashboard
function renderAdminDashboard() {

    const adminContainer = document.getElementById(
        "admin-content"
    );

    if (!adminContainer) return;

    const issues = getSavedIssues();

    if (issues.length === 0) {

        adminContainer.innerHTML = `
            <div class="empty-history">
                <h3>No Reports Available</h3>
                <p>There are currently no submitted village issues.</p>
            </div>
        `;

        return;
    }

    adminContainer.innerHTML = `
        <div class="admin-summary">
            <h3>Submitted Village Issues</h3>
            <p>Total Reports: ${issues.length}</p>
        </div>

        <div class="admin-issues-list">

            ${issues.slice().reverse().map(issue => `

                <article class="admin-issue-card">

                    <div class="admin-issue-info">

                        <span class="history-category">
                            ${escapeHTML(issue.category)}
                        </span>

                        <h3>${escapeHTML(issue.title)}</h3>

                        <p>${escapeHTML(issue.description)}</p>

                        <small>
                            📍 ${escapeHTML(issue.location)}
                        </small>

                        <small>
                            Submitted:
                            ${formatReportDate(issue.createdAt)}
                        </small>

                    </div>

                    <div class="admin-status-control">

                        <label for="status-${issue.id}">
                            Update Status
                        </label>

                        <select
                            id="status-${issue.id}"
                            class="admin-status-select"
                            data-issue-id="${issue.id}"
                        >

                            ${[
                                "Pending",
                                "Under Review",
                                "In Progress",
                                "Resolved"
                            ].map(status => `
                                <option
                                    value="${status}"
                                    ${issue.status === status ? "selected" : ""}
                                >
                                    ${status}
                                </option>
                            `).join("")}

                        </select>

                    </div>

                </article>

            `).join("")}

        </div>
    `;


    // Handle status updates
    adminContainer.querySelectorAll(
        ".admin-status-select"
    ).forEach(select => {

        select.addEventListener("change", function() {

            updateIssueStatus(
                this.dataset.issueId,
                this.value
            );

        });

    });

}


// Update a report's status in LocalStorage
function updateIssueStatus(issueId, newStatus) {

    const allowedStatuses = [
        "Pending",
        "Under Review",
        "In Progress",
        "Resolved"
    ];

    if (!allowedStatuses.includes(newStatus)) {
        return;
    }

    const issues = getSavedIssues();

    const updatedIssues = issues.map(issue => {

        if (String(issue.id) === String(issueId)) {

            return {
                ...issue,
                status: newStatus
            };

        }

        return issue;

    });

    localStorage.setItem(
        "smartgramIssues",
        JSON.stringify(updatedIssues)
    );

    // Refresh both dashboards
    renderAdminDashboard();
    renderReportHistory();
    renderDashboardStats();

    console.log(
        "Issue status updated:",
        issueId,
        newStatus
    );

}

/* =========================================
   SMARTGRAM - ROLE SWITCHING
========================================= */

function setupRoleSwitching() {

    const roleButton = document.getElementById(
        "role-toggle"
    );

    if (!roleButton) return;

    const citizenSections = [
        "home",
        "citizen-dashboard",
        "services",
        "village-map",
        "issue-reporting",
        "report-history"
    ];

    let currentView = "citizen";

    roleButton.addEventListener("click", function() {

        const adminSection = document.getElementById(
            "admin-dashboard"
        );

        if (!adminSection) return;

        if (currentView === "citizen") {

            // Hide Citizen sections
            citizenSections.forEach(sectionId => {

                const section = document.getElementById(
                    sectionId
                );

                if (section) {
                    section.hidden = true;
                }

            });

            // Show Admin Dashboard
            adminSection.hidden = false;

            // Render saved reports
            renderAdminDashboard();

            roleButton.textContent = "Citizen View";

            currentView = "admin";

        } else {

            // Hide Admin Dashboard
            adminSection.hidden = true;

            // Restore Citizen sections
            citizenSections.forEach(sectionId => {

                const section = document.getElementById(
                    sectionId
                );

                if (section) {
                    section.hidden = false;
                }

            });

            roleButton.textContent = "Admin Panel";

            currentView = "citizen";

        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================
   SMARTGRAM - INTERACTIVE MAP MARKERS
========================================= */

function setupMapInteractions() {

    const markers = document.querySelectorAll(
        ".map-marker"
    );

    const detailsContainer = document.getElementById(
        "map-location-details"
    );

    if (!detailsContainer) return;

    // Village location information
    const locations = {

        health: {
            name: "Healthcare Center",
            description: "Healthcare services and medical information for village residents.",
            icon: "🏥"
        },

        school: {
            name: "Village School",
            description: "Local educational facilities and school information.",
            icon: "🎓"
        },

        water: {
            name: "Water Supply",
            description: "Village water supply services and related information.",
            icon: "💧"
        },

        community: {
            name: "Community Center",
            description: "Community activities and local public information.",
            icon: "🏛️"
        }

    };


    // Add click event to every marker
    markers.forEach(marker => {

        marker.addEventListener("click", function() {

            const locationId = this.dataset.location;

            const location = locations[locationId];

            if (!location) return;


            // Display selected location information
            detailsContainer.innerHTML = `

                <div class="map-details-card">

                    <span>${location.icon}</span>

                    <div>
                        <h3>${location.name}</h3>

                        <p>${location.description}</p>
                    </div>

                </div>

            `;

            detailsContainer.hidden = false;

        });

    });

}

/* =========================================
   SMARTGRAM - CATEGORY ANALYTICS
========================================= */

function getCategoryStats() {

    const issues = getSavedIssues();

    const categoryCounts = {};

    issues.forEach(issue => {

        const category = issue.category || "Uncategorized";

        categoryCounts[category] =
            (categoryCounts[category] || 0) + 1;

    });

    return Object.entries(categoryCounts).map(
        ([category, count]) => ({
            category: category,
            count: count
        })
    );

}

function getStatusStats() {
    const issues = getSavedIssues();

    const statuses = [
        "Pending",
        "Under Review",
        "In Progress",
        "Resolved"
    ];

    return statuses.map(status => ({
        status: status,
        count: issues.filter(issue => issue.status === status).length
    }));
}

function renderStatusAnalytics() {
    const container = document.getElementById(
        "status-analytics-container"
    );

    if (!container) return;

    const statusStats = getStatusStats();

    container.innerHTML = statusStats.map(item => `
        <div class="category-stat-card">
            <div class="category-stat-header">
                <h3>${escapeHTML(item.status)}</h3>
                <span>${item.count} Reports</span>
            </div>
        </div>
    `).join("");
}

/* =========================================
   SMARTGRAM - CATEGORY ANALYTICS RENDERING
========================================= */

function renderCategoryAnalytics() {

    const analyticsContainer = document.getElementById(
        "category-analytics-container"
    );

    if (!analyticsContainer) return;

    // Get category-wise report statistics
    const categoryStats = getCategoryStats();

    // Show empty state
    if (categoryStats.length === 0) {

        analyticsContainer.innerHTML = `
            <div class="empty-history">
                <h3>No Analytics Available</h3>
                <p>No village issues have been reported yet.</p>
            </div>
        `;

        return;
    }

    // Calculate maximum report count
    const maxCount = Math.max(
        ...categoryStats.map(item => item.count)
    );

    // Render category statistics
    analyticsContainer.innerHTML = categoryStats.map(item => {

        const percentage = (item.count / maxCount) * 100;

        return `

            <div class="category-stat-card">

                <div class="category-stat-header">

                    <h3>${escapeHTML(item.category)}</h3>

                    <span>${item.count} Reports</span>

                </div>

                <div class="category-progress-track">

                    <div
                        class="category-progress-fill"
                        style="width: ${percentage}%"
                    ></div>

                </div>

            </div>

        `;

    }).join("");

}

function setupReportIssueButton() {
    const reportButton = document.getElementById("report-issue-btn");
    const reportSection = document.getElementById("issue-reporting");

    if (!reportButton || !reportSection) return;

    reportButton.addEventListener("click", function () {
        reportSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}