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

    const job = {
        title: tab.title,
        company: "Unknown",
        url: tab.url,
        date: new Date().toLocaleDateString()
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
                ${job.title}
            </div>

            <div class="company">
                ${job.company}
            </div>

            <small>
                ${job.date}
            </small>

            <button class="delete" data-index="${index}">
                Delete
            </button>
        `;

        jobList.appendChild(jobElement);
    });


    // Delete buttons
    document.querySelectorAll(".delete").forEach(button => {

        button.addEventListener("click", async () => {

            const index = button.dataset.index;

            jobs.splice(index, 1);

            await chrome.storage.local.set({
                jobs: jobs
            });

            loadJobs();
        });

    });
}