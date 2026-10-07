const trackButton = document.getElementById("trackJob");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchJobs");


// Load saved jobs
loadJobs();


// Search jobs
if (searchInput) {
    searchInput.addEventListener("input", () => {
        loadJobs(searchInput.value);
    });
}


// Track a new job
trackButton.addEventListener("click", async () => {

    try {

        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        console.log("Current tab:", tab.url);


        const pageData = await chrome.tabs.sendMessage(
            tab.id,
            {
                type: "GET_PAGE_DATA"
            }
        );

        console.log("Page data:", pageData);


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
            throw new Error(`FastAPI returned ${response.status}`);
        }


        const extractedJob = await response.json();

        console.log("FastAPI response:", extractedJob);


        const newJob = {
            title: extractedJob.title,
            company: extractedJob.company,
            location: extractedJob.location,
            employment_type: extractedJob.employment_type,
            url: extractedJob.url,
            status: "Saved",
            date: new Date().toISOString(),
            notes: ""
        };

        const result = await chrome.storage.local.get("jobs");

        const jobs = result.jobs || [];

            jobs.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            jobList.innerHTML = "";

        const alreadyTracked = jobs.some(job => job.url === newJob.url);

        if (alreadyTracked) {
            alert("This job is already tracked.");
            return;
        }

        jobs.push(newJob);

        await chrome.storage.local.set({
            jobs: jobs
        });

        loadJobs();

        alert("Job saved successfully! 🎉");

    } catch (error) {

        console.error("JobTracker error:", error);

        alert(
            `Something went wrong:\n\n${error.message}`
        );
    }

});

async function loadJobs(searchTerm = "") {

    const result = await chrome.storage.local.get("jobs");

    const jobs = result.jobs || [];

    jobs.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    const filteredJobs = jobs.filter(job => {

        const search = searchTerm.toLowerCase();

        return (
            (job.title || "").toLowerCase().includes(search) ||
            (job.company || "").toLowerCase().includes(search)
        );

    });

    jobList.innerHTML = "";


    filteredJobs.forEach((job, index) => {

        const jobElement = document.createElement("div");

        jobElement.className = "job";


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

            <div class="job-date">
                Added: ${job.date ? new Date(job.date).toLocaleDateString() : ""}
            </div>

            <select class="status" data-index="${index}">
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

            <textarea
                class="notes"
                data-index="${index}"
                placeholder="Add notes..."
            >${escapeHtml(job.notes || "")}</textarea>

            <button class="delete" data-index="${index}">
                Delete
            </button>
        `;

        jobList.appendChild(jobElement);
    });


    // Handle status changes
    document.querySelectorAll(".status").forEach(select => {

        select.addEventListener("change", async () => {

            const index = Number(select.dataset.index);

            jobs[index].status = select.value;

            await chrome.storage.local.set({
                jobs: jobs
            });

            loadJobs(searchTerm);
        });

    });


    // Handle notes
    document.querySelectorAll(".notes").forEach(textarea => {

        textarea.addEventListener("change", async () => {

            const index = Number(textarea.dataset.index);

            jobs[index].notes = textarea.value;

            await chrome.storage.local.set({
                jobs: jobs
            });

        });

    });


    // Handle delete buttons
    document.querySelectorAll(".delete").forEach(button => {

        button.addEventListener("click", async () => {

            const index = Number(button.dataset.index);

            jobs.splice(index, 1);

            await chrome.storage.local.set({
                jobs: jobs
            });

            loadJobs(searchTerm);
        });

    });

}

    // Handle status changes
    document.querySelectorAll(".status").forEach(select => {

        select.addEventListener("change", async () => {

            const index = Number(select.dataset.index);

            jobs[index].status = select.value;

            await chrome.storage.local.set({
                jobs: jobs
            });

            loadJobs();
        });

    });


    // Handle delete buttons
    document.querySelectorAll(".delete").forEach(button => {

        button.addEventListener("click", async () => {

            const index = Number(button.dataset.index);

            jobs.splice(index, 1);

            await chrome.storage.local.set({
                jobs: jobs
            });

            loadJobs();
        });

    });


// Prevent webpage HTML from being inserted into our extension
function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}