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
                ${escapeHtml(job.title)}
            </div>

            <div class="company">
                🏢 ${escapeHtml(job.company)}
            </div>

            <div class="location">
                📍 ${escapeHtml(job.location)}
            </div>

            <div class="job-date">
                Added: ${escapeHtml(job.date)}
            </div>

            <a 
                href="${escapeHtml(job.url)}"
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


function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


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
