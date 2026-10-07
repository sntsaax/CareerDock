const trackButton = document.getElementById("trackJob");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchJobs");
const statusFilter = document.getElementById("statusFilter");


// Load saved jobs
loadJobs();


// Search jobs
if (searchInput) {
    searchInput.addEventListener("input", () => {
        loadJobs(searchInput.value, statusFilter.value);
    });
}


// Filter jobs by status
if (statusFilter) {
    statusFilter.addEventListener("change", () => {
        loadJobs(searchInput.value, statusFilter.value);
    });
}


// Track a new job
trackButton.addEventListener("click", async () => {

    trackButton.disabled = true;
    trackButton.textContent = "⏳ Checking page...";


    try {

        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });


        const pageData = await chrome.tabs.sendMessage(
            tab.id,
            {
                type: "GET_PAGE_DATA"
            }
        );


        // Check if this is a job posting
        const checkResponse = await fetch(
            "http://127.0.0.1:8000/check-job",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pageData)
            }
        );


        if (!checkResponse.ok) {
            throw new Error("Job check failed");
        }


        const checkResult = await checkResponse.json();


        if (!checkResult.is_job_posting) {

            alert("This doesn't look like a job posting.");

            return;
        }


        // Extract job information
        trackButton.textContent = "⏳ Extracting job...";


        const response = await fetch(
            "http://127.0.0.1:8000/extract-job",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pageData)
            }
        );


        if (!response.ok) {
            throw new Error("Backend request failed");
        }


        const extractedJob = await response.json();


        const newJob = {
            title: extractedJob.title,
            company: extractedJob.company,
            location: extractedJob.location,
            employment_type: extractedJob.employment_type,
            url: extractedJob.url,
            status: "Saved",
            date: new Date().toISOString(),
            application_date: "",
            notes: ""
        };


        const result = await chrome.storage.local.get("jobs");

        const jobs = result.jobs || [];


        // Check for duplicates
        const alreadyTracked = jobs.some(
            job => job.url === newJob.url
        );


        if (alreadyTracked) {

            alert("This job is already tracked.");

            return;
        }


        jobs.push(newJob);


        await chrome.storage.local.set({
            jobs: jobs
        });


        loadJobs(searchInput.value, statusFilter.value);


        alert("Job saved successfully! 🎉");


    } catch (error) {

        console.error(error);

        alert(
            "Could not track this job. Make sure the backend is running and reload the job page."
        );


    } finally {

        trackButton.disabled = false;
        trackButton.textContent = "Track this job";

    }

});


// Load and display jobs
async function loadJobs(searchTerm = "", selectedStatus = "All") {

    const result = await chrome.storage.local.get("jobs");

    const jobs = result.jobs || [];


    // Sort newest first
    jobs.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });


    // Update statistics
    updateStats(jobs);


    const search = searchTerm.toLowerCase();


    // Filter jobs
    const filteredJobs = jobs.filter(job => {

        const matchesSearch =
            (job.title || "").toLowerCase().includes(search) ||
            (job.company || "").toLowerCase().includes(search);


        const matchesStatus =
            selectedStatus === "All" ||
            job.status === selectedStatus;


        return matchesSearch && matchesStatus;

    });


    jobList.innerHTML = "";


    // Empty state
    if (filteredJobs.length === 0) {

        const emptyMessage = document.createElement("div");

        emptyMessage.className = "empty-message";


        let message = "No jobs found.";


        if (selectedStatus === "Saved") {
            message = "You haven't saved any jobs yet.";
        }

        if (selectedStatus === "Applied") {
            message = "You haven't applied to any jobs yet.";
        }

        if (selectedStatus === "Interview") {
            message = "You don't have any interviews yet.";
        }

        if (selectedStatus === "Offer") {
            message = "You haven't received any offers yet.";
        }

        if (selectedStatus === "Rejected") {
            message = "You don't have any rejected applications yet.";
        }

        if (selectedStatus === "Withdrawn") {
            message = "You don't have any withdrawn applications yet.";
        }


        emptyMessage.textContent = message;

        jobList.appendChild(emptyMessage);

        return;
    }


    // Display jobs
    filteredJobs.forEach(job => {

        const jobElement = document.createElement("div");

        jobElement.className = "job";


        const statusClass = getStatusClass(job.status);


        jobElement.innerHTML = `
            <div class="job-title">
                ${escapeHtml(job.title || "Unknown job")}
            </div>

            <div class="company">
                🏢 ${escapeHtml(job.company || "Unknown company")}
            </div>

            <div class="location">
                📍 ${escapeHtml(job.location || "Unknown location")}
            </div>

            <div class="job-meta">

                <span>
                    Added ${job.date
                        ? new Date(job.date).toLocaleDateString()
                        : ""}
                </span>

                ${
                    job.employment_type &&
                    job.employment_type !== "Unknown"
                        ? `<span>•</span>
                           <span>${escapeHtml(job.employment_type)}</span>`
                        : ""
                }

            </div>


            <div class="job-actions">

                <select
                    class="status ${statusClass}"
                    data-url="${escapeHtml(job.url || "")}"
                >
                    <option value="Saved" ${job.status === "Saved" ? "selected" : ""}>
                        📝 Saved
                    </option>

                    <option value="Applied" ${job.status === "Applied" ? "selected" : ""}>
                        🟡 Applied
                    </option>

                    <option value="Interview" ${job.status === "Interview" ? "selected" : ""}>
                        🔵 Interview
                    </option>

                    <option value="Offer" ${job.status === "Offer" ? "selected" : ""}>
                        🟢 Offer
                    </option>

                    <option value="Rejected" ${job.status === "Rejected" ? "selected" : ""}>
                        🔴 Rejected
                    </option>

                    <option value="Withdrawn" ${job.status === "Withdrawn" ? "selected" : ""}>
                        ⚫ Withdrawn
                    </option>

                </select>


                <a
                    href="${escapeHtml(job.url || "#")}"
                    target="_blank"
                    class="open-job"
                >
                    Open job
                </a>

            </div>


            <div class="more-details">

                <button
                    class="details-toggle"
                    data-url="${escapeHtml(job.url || "")}"
                >
                    ＋ More details
                </button>


                <div class="details-content">

                    <div class="application-date">

                        <span>Applied:</span>

                        <input
                            type="date"
                            class="application-date-input"
                            data-url="${escapeHtml(job.url || "")}"
                            value="${escapeHtml(job.application_date || "")}"
                        >

                    </div>


                    <textarea
                        class="notes"
                        data-url="${escapeHtml(job.url || "")}"
                        placeholder="Add notes..."
                    >${escapeHtml(job.notes || "")}</textarea>


                    <button
                        class="delete"
                        data-url="${escapeHtml(job.url || "")}"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;


        jobList.appendChild(jobElement);

    });


    // Handle status changes
    document.querySelectorAll(".status").forEach(select => {

        select.addEventListener("change", async () => {

            const url = select.dataset.url;

            const job = jobs.find(job => job.url === url);


            if (!job) {
                return;
            }


            job.status = select.value;


            // Automatically set application date
            // when the user marks a job as Applied.
            if (
                select.value === "Applied" &&
                !job.application_date
            ) {

                job.application_date =
                    new Date().toISOString().split("T")[0];

            }


            await chrome.storage.local.set({
                jobs: jobs
            });


            loadJobs(searchInput.value, statusFilter.value);

        });

    });


    // Handle details toggles
    document.querySelectorAll(".details-toggle").forEach(button => {

        button.addEventListener("click", () => {

            const details = button.nextElementSibling;

            if (!details) {
                return;
            }


            const isOpen =
                details.classList.contains("open");


            if (isOpen) {

                details.classList.remove("open");

                button.textContent = "＋ More details";

            } else {

                details.classList.add("open");

                button.textContent = "− Hide details";

            }

        });

    });


    // Handle application dates
    document.querySelectorAll(".application-date-input").forEach(input => {

        input.addEventListener("change", async () => {

            const url = input.dataset.url;

            const job = jobs.find(job => job.url === url);


            if (!job) {
                return;
            }


            job.application_date = input.value;


            await chrome.storage.local.set({
                jobs: jobs
            });

        });

    });


    // Handle notes
    document.querySelectorAll(".notes").forEach(textarea => {

        textarea.addEventListener("change", async () => {

            const url = textarea.dataset.url;

            const job = jobs.find(job => job.url === url);


            if (!job) {
                return;
            }


            job.notes = textarea.value;


            await chrome.storage.local.set({
                jobs: jobs
            });

        });

    });


    // Handle delete buttons
    document.querySelectorAll(".delete").forEach(button => {

        button.addEventListener("click", async () => {

            const url = button.dataset.url;


            const updatedJobs = jobs.filter(
                job => job.url !== url
            );


            await chrome.storage.local.set({
                jobs: updatedJobs
            });


            loadJobs(searchInput.value, statusFilter.value);

        });

    });

}


// Get status CSS class
function getStatusClass(status) {

    switch (status) {

        case "Applied":
            return "status-applied";

        case "Interview":
            return "status-interview";

        case "Offer":
            return "status-offer";

        case "Rejected":
            return "status-rejected";

        case "Withdrawn":
            return "status-withdrawn";

        default:
            return "status-saved";

    }

}


// Update statistics
function updateStats(jobs) {

    const totalCount = document.getElementById("totalCount");
    const appliedCount = document.getElementById("appliedCount");
    const interviewCount = document.getElementById("interviewCount");
    const offerCount = document.getElementById("offerCount");


    if (totalCount) {
        totalCount.textContent = jobs.length;
    }


    if (appliedCount) {
        appliedCount.textContent =
            jobs.filter(job => job.status === "Applied").length;
    }


    if (interviewCount) {
        interviewCount.textContent =
            jobs.filter(job => job.status === "Interview").length;
    }


    if (offerCount) {
        offerCount.textContent =
            jobs.filter(job => job.status === "Offer").length;
    }

}


// Escape HTML
function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}