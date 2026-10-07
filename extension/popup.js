const trackButton = document.getElementById("trackJob");
const jobList = document.getElementById("jobList");

// Load saved jobs when the extension opens
loadJobs();


// Track a new job
trackButton.addEventListener("click", async () => {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    const jobInfo = await chrome.tabs.sendMessage(
        tab.id,
        {
            type: "GET_JOB_INFO"
        }
    );

    const job = {
        title: jobInfo.title,
        company: jobInfo.company,
        location: jobInfo.location,
        url: tab.url,
        date: new Date().toLocaleDateString(),
        status: "Saved"
    };

    const result = await chrome.storage.local.get("jobs");

    const jobs = result.jobs || [];

    jobs.push(job);

    await chrome.storage.local.set({
        jobs: jobs
    });

    loadJobs();
});


// Display saved jobs
async function loadJobs() {

    const result = await chrome.storage.local.get("jobs");

    const jobs = result.jobs || [];

    jobList.innerHTML = "";

    jobs.forEach((job, index) => {

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
                Added: ${escapeHtml(job.date || "")}
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

}


// Prevent webpage HTML from being inserted into our extension
function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}