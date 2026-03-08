(function () {
  function extractJobData() {
    const data = {
      title: null,
      postedAt: null,
      location: null,
      summary: null,
      hoursPerWeek: null,
      contractType: null,
      duration: null,
      experienceLevel: null,
      budgetMin: null,
      budgetMax: null,
      budgetType: null,
      projectType: null,
      skills: [],
      activity: {},
      bidRange: null,
      url: window.location.href,
    };

    // Title
    const titleEl =
      document.querySelector("h4 span.flex-1") || document.querySelector("h4");
    if (titleEl) {
      data.title = titleEl.textContent.trim();
    }

    // Posted + location
    const postedBlock = document.querySelector(".posted-on-line");
    if (postedBlock) {
      const text = postedBlock.textContent.replace(/\s+/g, " ").trim();

      const postedMatch = text.match(
        /Posted\s+(.*?)(Worldwide|United States|Canada|Europe|$)/i
      );
      if (postedMatch) {
        data.postedAt = postedMatch[1].trim();
      }

      const locationEl = postedBlock.querySelector("p");
      if (locationEl) {
        data.location = locationEl.textContent.trim();
      }
    }

    // Summary
    const summaryEl = document.querySelector('div[data-test="Description"] p');
    if (summaryEl) {
      data.summary = summaryEl.textContent.trim();
    }

    // Features block
    const featureItems = document.querySelectorAll("ul.features li");
    if (featureItems.length >= 4) {
      data.hoursPerWeek =
        featureItems[0]?.querySelector("strong")?.textContent.trim() || null;
      data.contractType =
        featureItems[0]?.querySelector(".description")?.textContent.trim() ||
        null;

      data.duration =
        featureItems[1]?.querySelector("strong")?.textContent.trim() || null;

      data.experienceLevel =
        featureItems[2]?.querySelector("strong")?.textContent.trim() || null;

      const rateStrongEls = featureItems[3]?.querySelectorAll("strong") || [];
      if (rateStrongEls.length >= 1) {
        data.budgetMin = rateStrongEls[0].textContent.trim();
      }
      if (rateStrongEls.length >= 2) {
        data.budgetMax = rateStrongEls[1].textContent.trim();
      }
      data.budgetType =
        featureItems[3]?.querySelector(".description")?.textContent.trim() ||
        null;
    }

    // Project Type
    const projectTypeStrong = Array.from(document.querySelectorAll("strong")).find(
      (el) => el.textContent.trim() === "Project Type:"
    );
    if (projectTypeStrong) {
      const span = projectTypeStrong.parentElement.querySelector("span");
      if (span) {
        data.projectType = span.textContent.trim();
      }
    }

    // Skills
    const skillsSectionHeader = Array.from(document.querySelectorAll("h5")).find(
      (el) => el.textContent.trim() === "Skills and Expertise"
    );
    if (skillsSectionHeader) {
      const section = skillsSectionHeader.closest("section");
      if (section) {
        const skillLinks = section.querySelectorAll("a.air3-badge, a.badge");
        data.skills = Array.from(skillLinks)
          .map((el) => el.textContent.trim())
          .filter(Boolean);
      }
    }

    // Activity on this job
    const activityHeader = Array.from(document.querySelectorAll("h5")).find(
      (el) => el.textContent.trim() === "Activity on this job"
    );
    if (activityHeader) {
      const section = activityHeader.closest("section");
      if (section) {
        const items = section.querySelectorAll("li.ca-item");
        items.forEach((item) => {
          const key = item
            .querySelector(".title")
            ?.textContent.replace(":", "")
            .trim();
          const value = item.querySelector(".value")?.textContent.trim();
          if (key && value) {
            data.activity[key] = value;
          }
        });
      }
    }

    // Bid range
    const bidRangeEl = Array.from(document.querySelectorAll("strong")).find(
      (el) => el.textContent.trim().startsWith("Bid range -")
    );
    if (bidRangeEl) {
      data.bidRange = bidRangeEl.textContent.trim();
    }

    return data;
  }

  function extractClientData() {
    const client = {
      paymentVerified: false,
      ratingText: null,
      country: null,
      city: null,
      localTime: null,
      jobsPosted: null,
      hireRate: null,
      openJobs: null,
      totalSpent: null,
      hires: null,
      activeHires: null,
      avgHourlyRatePaid: null,
      hoursBilled: null,
      companySize: null,
      memberSince: null,
    };

    // Payment verified
    const paymentVerifiedEl = Array.from(document.querySelectorAll("strong")).find(
      (el) => el.textContent.trim() === "Payment method verified"
    );
    client.paymentVerified = !!paymentVerifiedEl;

    // Rating text
    const ratingWrap = document.querySelector('[data-testid="buyer-rating"]');
    if (ratingWrap) {
      const nowrap = ratingWrap.querySelector(".nowrap");
      if (nowrap) {
        client.ratingText = nowrap.textContent.trim();
      }
    }

    // Location
    const locationLi = document.querySelector('[data-qa="client-location"]');
    if (locationLi) {
      const strong = locationLi.querySelector("strong");
      const spans = locationLi.querySelectorAll("span.nowrap");

      client.country = strong?.textContent.trim() || null;
      client.city = spans[0]?.textContent.trim() || null;
      client.localTime = spans[1]?.textContent.trim() || null;
    }

    // Jobs posted / hire rate / open jobs
    const jobsPostedLi = document.querySelector(
      '[data-qa="client-job-posting-stats"]'
    );
    if (jobsPostedLi) {
      const strong = jobsPostedLi.querySelector("strong");
      const div = jobsPostedLi.querySelector("div");

      client.jobsPosted = strong?.textContent.trim() || null;

      const statsText = div?.textContent.trim() || "";
      const hireRateMatch = statsText.match(/(\d+% hire rate)/i);
      const openJobsMatch = statsText.match(/(\d+\s+open job[s]?)/i);

      client.hireRate = hireRateMatch ? hireRateMatch[1] : null;
      client.openJobs = openJobsMatch ? openJobsMatch[1] : null;
    }

    // Spend / hires
    const spendStrong = document.querySelector('[data-qa="client-spend"]');
    if (spendStrong) {
      client.totalSpent = spendStrong.textContent.trim();
    }

    const hiresDiv = document.querySelector('[data-qa="client-hires"]');
    if (hiresDiv) {
      const text = hiresDiv.textContent.trim();
      const hiresMatch = text.match(/(\d+\s+hires)/i);
      const activeMatch = text.match(/(\d+\s+active)/i);

      client.hires = hiresMatch ? hiresMatch[1] : null;
      client.activeHires = activeMatch ? activeMatch[1] : null;
    }

    // Avg hourly / billed hours
    const hourlyStrong = document.querySelector('[data-qa="client-hourly-rate"]');
    if (hourlyStrong) {
      client.avgHourlyRatePaid = hourlyStrong.textContent.trim();
    }

    const hoursDiv = document.querySelector('[data-qa="client-hours"]');
    if (hoursDiv) {
      client.hoursBilled = hoursDiv.textContent.trim();
    }

    // Company size
    const companySizeDiv = document.querySelector(
      '[data-qa="client-company-profile-size"]'
    );
    if (companySizeDiv) {
      client.companySize = companySizeDiv.textContent.trim();
    }

    // Member since
    const contractDateLi = document.querySelector('[data-qa="client-contract-date"]');
    if (contractDateLi) {
      client.memberSince = contractDateLi.textContent
        .replace("Member since", "")
        .trim();
    }

    return client;
  }

  function extractProposalMeta() {
    const proposal = {
      canApplyNow: !!document.querySelector("#submit-proposal-button"),
      connectsRequired: null,
      availableConnects: null,
      jobLink: null,
    };

    const applyButton = document.querySelector("#submit-proposal-button");

    if (applyButton) {
      const proposalSection = applyButton.closest("section");
      if (proposalSection) {
        const infoBlock = Array.from(proposalSection.querySelectorAll("div")).find(
          (el) => el.textContent.includes("Send a proposal for:")
        );

        if (infoBlock) {
          const rows = infoBlock.querySelectorAll(":scope > div");

          if (rows.length > 0) {
            rows.forEach((row) => {
              const text = row.textContent.trim();

              if (text.includes("Send a proposal for:")) {
                const strong = row.querySelector("strong");
                proposal.connectsRequired = strong?.textContent.trim() || null;
              }

              if (text.includes("Available Connects:")) {
                const strong = row.querySelector("strong");
                proposal.availableConnects = strong?.textContent.trim() || null;
              }
            });
          } else {
            const text = infoBlock.textContent.replace(/\s+/g, " ").trim();
            const requiredMatch = text.match(
              /Send a proposal for:\s*([0-9]+(?:\s*Connects?)?)/i
            );
            const availableMatch = text.match(
              /Available Connects:\s*([0-9]+)/i
            );

            proposal.connectsRequired = requiredMatch
              ? requiredMatch[1].trim()
              : proposal.connectsRequired;
            proposal.availableConnects = availableMatch
              ? availableMatch[1].trim()
              : proposal.availableConnects;
          }
        }

        if (!proposal.connectsRequired || !proposal.availableConnects) {
          const sectionText = proposalSection.textContent.replace(/\s+/g, " ").trim();
          const requiredMatch = sectionText.match(
            /Send a proposal for:\s*([0-9]+(?:\s*Connects?)?)/i
          );
          const availableMatch = sectionText.match(
            /Available Connects:\s*([0-9]+)/i
          );

          if (requiredMatch && !proposal.connectsRequired) {
            proposal.connectsRequired = requiredMatch[1].trim();
          }
          if (availableMatch && !proposal.availableConnects) {
            proposal.availableConnects = availableMatch[1].trim();
          }
        }
      }
    }

    const jobLinkInput = document.querySelector('input[aria-label="Job link"]');
    if (jobLinkInput) {
      proposal.jobLink = jobLinkInput.value.trim();
    }

    return proposal;
  }

  console.log("UpScout content script loaded");

  const isJobPage = window.location.href.includes("/jobs/~");
  if (!isJobPage) return;

  console.log("UpScout detected an Upwork job page");

  const BUTTON_ID = "upscout-analyze-btn";

  function createAnalyzeButton() {
    if (document.getElementById(BUTTON_ID)) return;

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.textContent = "🔍 Analyze with UpScout";

    button.addEventListener("click", () => {
      const extracted = {
        job: extractJobData(),
        client: extractClientData(),
        proposal: extractProposalMeta(),
      };
      console.log("UpScout extracted data:", extracted);
      alert("Check console for extracted data");
    });

    return button;
  }

  function injectButton() {
    if (document.getElementById(BUTTON_ID)) return;

    const jobHeader =
      document.querySelector("header") ||
      document.querySelector('[data-test="job-details"]') ||
      document.querySelector("main");

    if (!jobHeader) {
      console.log("UpScout: no suitable container found yet");
      return;
    }

    const button = createAnalyzeButton();
    if (!button) return;

    const wrapper = document.createElement("div");
    wrapper.id = "upscout-button-wrapper";
    wrapper.appendChild(button);

    jobHeader.prepend(wrapper);

    console.log("UpScout button injected");
  }

  injectButton();

  const observer = new MutationObserver(() => {
    if (!document.getElementById(BUTTON_ID)) {
      injectButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
