/**
 * JobFlow Extractor API — Node.js / Express
 * ==========================================
 * Fully domain-agnostic job discovery.
 * Supports ANY field: Marketing, Finance, Design, HR, Sales, Data Science, etc.
 */

const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');
const { v4: uuidv4 } = require('uuid');

const app  = express();
const PORT = 8001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

// ── File paths ───────────────────────────────────────────────────────────────
const DATA_FILE   = path.join(__dirname, 'discovered_jobs.json');
const CONFIG_FILE = path.join(__dirname, 'extractor_config.json');

// ── Helpers ──────────────────────────────────────────────────────────────────
const loadJSON = (file, fallback) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
};
const saveJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// ── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  keywords: ['React Developer', 'Frontend Engineer'],
  location: 'India',
  target_skills: ['react', 'javascript', 'typescript'],
  max_jobs: 25,
  domain: 'Technology',
};

// ── Domain Presets ────────────────────────────────────────────────────────────
const DOMAIN_PRESETS = {
  'Technology': {
    keywords: ['React Developer', 'Frontend Engineer', 'Full Stack Developer', 'Backend Engineer', 'DevOps Engineer'],
    skills: ['react', 'javascript', 'typescript', 'python', 'node', 'sql', 'aws', 'docker'],
  },
  'Data Science & AI': {
    keywords: ['Data Scientist', 'Machine Learning Engineer', 'AI Engineer', 'Data Analyst', 'NLP Engineer'],
    skills: ['python', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'sql', 'pandas', 'nlp', 'computer vision'],
  },
  'Marketing': {
    keywords: ['Digital Marketing Manager', 'SEO Specialist', 'Content Marketing Manager', 'Growth Hacker', 'Performance Marketing'],
    skills: ['seo', 'google ads', 'meta ads', 'content strategy', 'analytics', 'hubspot', 'email marketing', 'social media'],
  },
  'Design': {
    keywords: ['UI/UX Designer', 'Product Designer', 'Graphic Designer', 'Visual Designer', 'UX Researcher'],
    skills: ['figma', 'sketch', 'adobe xd', 'illustrator', 'photoshop', 'user research', 'prototyping', 'design systems'],
  },
  'Finance & Accounting': {
    keywords: ['Financial Analyst', 'CA / Chartered Accountant', 'Investment Analyst', 'Business Analyst', 'Finance Manager'],
    skills: ['financial modeling', 'excel', 'tableau', 'sql', 'accounting', 'tally', 'erp', 'valuation', 'cfa'],
  },
  'Sales & Business Development': {
    keywords: ['Sales Manager', 'Business Development Executive', 'Account Executive', 'Inside Sales', 'Enterprise Sales'],
    skills: ['crm', 'salesforce', 'b2b sales', 'lead generation', 'negotiation', 'hubspot', 'prospecting'],
  },
  'Human Resources': {
    keywords: ['HR Manager', 'Talent Acquisition Specialist', 'HR Business Partner', 'Recruiter', 'L&D Manager'],
    skills: ['talent acquisition', 'hris', 'workday', 'onboarding', 'performance management', 'employee engagement', 'succession planning'],
  },
  'Product Management': {
    keywords: ['Product Manager', 'Senior Product Manager', 'Associate Product Manager', 'Product Owner', 'Technical PM'],
    skills: ['product strategy', 'roadmap', 'agile', 'jira', 'user stories', 'a/b testing', 'stakeholder management', 'okrs'],
  },
  'Operations & Supply Chain': {
    keywords: ['Operations Manager', 'Supply Chain Analyst', 'Logistics Manager', 'Procurement Manager', 'Business Operations'],
    skills: ['supply chain', 'logistics', 'erp', 'sap', 'lean', 'six sigma', 'vendor management', 'inventory'],
  },
  'Content & Writing': {
    keywords: ['Content Writer', 'Technical Writer', 'Copywriter', 'Content Strategist', 'Editor'],
    skills: ['content writing', 'copywriting', 'seo writing', 'wordpress', 'cms', 'editorial', 'storytelling', 'proofreading'],
  },
  'Customer Success': {
    keywords: ['Customer Success Manager', 'Account Manager', 'Customer Support Lead', 'Client Relationship Manager'],
    skills: ['customer success', 'crm', 'onboarding', 'churn reduction', 'nps', 'zendesk', 'intercom', 'upselling'],
  },
  'Legal & Compliance': {
    keywords: ['Legal Counsel', 'Compliance Manager', 'Corporate Lawyer', 'Contract Manager', 'Risk & Compliance'],
    skills: ['contract law', 'corporate law', 'compliance', 'gdpr', 'due diligence', 'risk management', 'legal research'],
  },
};

// ── Comprehensive Job Dataset (domain-aware) ───────────────────────────────────
const JOB_DATABASE = {
  'Technology': [
    { title: 'Senior React Developer',              company: 'Flipkart',       skills: ['react','javascript','typescript'] },
    { title: 'Full Stack Engineer (Node + React)',   company: 'Razorpay',       skills: ['node','react','javascript'] },
    { title: 'Frontend Developer',                  company: 'Swiggy',         skills: ['react','typescript'] },
    { title: 'Python Backend Engineer',             company: 'PhonePe',        skills: ['python','sql'] },
    { title: 'DevOps Engineer',                     company: 'Zomato',         skills: ['aws','docker','kubernetes'] },
    { title: 'Software Engineer — Frontend',        company: 'CRED',           skills: ['react','typescript','javascript'] },
    { title: 'TypeScript / Node.js Engineer',       company: 'BrowserStack',   skills: ['typescript','node','javascript'] },
    { title: 'Backend Developer (Python/FastAPI)',   company: 'Meesho',         skills: ['python','sql','javascript'] },
    { title: 'SDE II — Full Stack',                 company: 'Paytm',          skills: ['react','javascript','node'] },
    { title: 'React Native Developer',              company: 'Groww',          skills: ['react','javascript'] },
    { title: 'Cloud Engineer (AWS)',                company: 'Infosys',        skills: ['aws','docker','python'] },
    { title: 'Java Backend Developer',              company: 'TCS',            skills: ['java','sql','spring boot'] },
  ],
  'Data Science & AI': [
    { title: 'Data Scientist — NLP',               company: 'Jio',             skills: ['python','nlp','machine learning'] },
    { title: 'Machine Learning Engineer',          company: 'Flipkart',        skills: ['python','tensorflow','machine learning'] },
    { title: 'AI Research Engineer',               company: 'Microsoft India', skills: ['python','deep learning','pytorch'] },
    { title: 'Data Analyst',                       company: 'OYO',             skills: ['sql','python','tableau'] },
    { title: 'Business Intelligence Analyst',      company: 'Myntra',          skills: ['sql','tableau','excel'] },
    { title: 'Computer Vision Engineer',           company: 'Ola',             skills: ['python','computer vision','deep learning'] },
    { title: 'Senior Data Scientist',              company: 'Amazon India',    skills: ['python','machine learning','sql','pandas'] },
    { title: 'MLOps Engineer',                     company: 'Google India',    skills: ['python','aws','docker','machine learning'] },
    { title: 'Data Engineer',                      company: 'Uber India',      skills: ['python','sql','spark','airflow'] },
    { title: 'Quantitative Analyst',               company: 'Goldman Sachs',   skills: ['python','sql','machine learning','statistics'] },
  ],
  'Marketing': [
    { title: 'Digital Marketing Manager',          company: 'Nykaa',           skills: ['seo','google ads','analytics'] },
    { title: 'Growth Hacker',                      company: 'CRED',            skills: ['growth hacking','analytics','email marketing'] },
    { title: 'SEO Specialist',                     company: 'Byju\'s',         skills: ['seo','content strategy','google analytics'] },
    { title: 'Performance Marketing Manager',      company: 'Meesho',          skills: ['meta ads','google ads','analytics'] },
    { title: 'Content Marketing Manager',          company: 'Razorpay',        skills: ['content strategy','seo writing','hubspot'] },
    { title: 'Social Media Manager',               company: 'Swiggy',          skills: ['social media','content strategy','analytics'] },
    { title: 'Brand Manager',                      company: 'HUL',             skills: ['brand management','analytics','marketing strategy'] },
    { title: 'Email Marketing Specialist',         company: 'MakeMyTrip',      skills: ['email marketing','hubspot','analytics'] },
    { title: 'Product Marketing Manager',          company: 'Zoho',            skills: ['product marketing','go-to-market','content strategy'] },
    { title: 'Influencer Marketing Manager',       company: 'Mamaearth',       skills: ['influencer marketing','social media','analytics'] },
  ],
  'Design': [
    { title: 'Senior Product Designer',            company: 'Razorpay',        skills: ['figma','design systems','user research'] },
    { title: 'UI/UX Designer',                     company: 'Swiggy',          skills: ['figma','prototyping','user research'] },
    { title: 'Visual Designer',                    company: 'CRED',            skills: ['figma','illustrator','photoshop'] },
    { title: 'UX Researcher',                      company: 'Flipkart',        skills: ['user research','usability testing','figma'] },
    { title: 'Graphic Designer',                   company: 'Nykaa',           skills: ['illustrator','photoshop','adobe xd'] },
    { title: 'Motion Designer',                    company: 'Hotstar',         skills: ['after effects','illustrator','motion design'] },
    { title: 'Design Lead',                        company: 'Groww',           skills: ['figma','design systems','user research','prototyping'] },
    { title: 'Brand Designer',                     company: 'Zepto',           skills: ['figma','illustrator','brand identity'] },
    { title: 'Interaction Designer',               company: 'Zomato',          skills: ['figma','prototyping','design systems'] },
  ],
  'Finance & Accounting': [
    { title: 'Financial Analyst',                  company: 'Goldman Sachs',   skills: ['financial modeling','excel','valuation'] },
    { title: 'CA — Accounts & Finance',            company: 'Deloitte',        skills: ['accounting','tally','excel','taxation'] },
    { title: 'Investment Banking Analyst',         company: 'Morgan Stanley',  skills: ['financial modeling','valuation','excel','cfa'] },
    { title: 'FP&A Analyst',                       company: 'Amazon India',    skills: ['financial modeling','excel','sql','tableau'] },
    { title: 'Finance Manager',                    company: 'Zomato',          skills: ['accounting','financial modeling','erp','excel'] },
    { title: 'Credit Analyst',                     company: 'HDFC Bank',       skills: ['credit analysis','excel','financial modeling'] },
    { title: 'Equity Research Analyst',            company: 'Motilal Oswal',   skills: ['valuation','financial modeling','excel','cfa'] },
    { title: 'Risk Manager',                       company: 'JPMorgan India',  skills: ['risk management','excel','sql','compliance'] },
    { title: 'Business Analyst — Finance',         company: 'Razorpay',        skills: ['sql','tableau','financial modeling','excel'] },
  ],
  'Sales & Business Development': [
    { title: 'Enterprise Sales Manager',           company: 'Zoho',            skills: ['b2b sales','salesforce','crm','negotiation'] },
    { title: 'Business Development Manager',       company: 'Swiggy',          skills: ['b2b sales','lead generation','crm'] },
    { title: 'Account Executive',                  company: 'Freshworks',      skills: ['salesforce','crm','b2b sales','prospecting'] },
    { title: 'Inside Sales Representative',        company: 'OYO',             skills: ['crm','lead generation','hubspot'] },
    { title: 'Sales Development Representative',   company: 'BrowserStack',    skills: ['prospecting','crm','salesforce','lead generation'] },
    { title: 'Key Account Manager',                company: 'Meesho',          skills: ['account management','crm','b2b sales','negotiation'] },
    { title: 'Regional Sales Manager',             company: 'Byju\'s',         skills: ['b2b sales','team management','crm','negotiation'] },
    { title: 'Partnerships Manager',               company: 'Razorpay',        skills: ['b2b sales','partnerships','crm','negotiation'] },
  ],
  'Human Resources': [
    { title: 'HR Business Partner',               company: 'Flipkart',         skills: ['employee engagement','performance management','hris'] },
    { title: 'Talent Acquisition Specialist',     company: 'Zomato',           skills: ['talent acquisition','ats','sourcing'] },
    { title: 'L&D Manager',                       company: 'Infosys',          skills: ['learning & development','lms','succession planning'] },
    { title: 'Senior Recruiter — Tech',           company: 'Google India',     skills: ['technical recruiting','talent acquisition','sourcing'] },
    { title: 'HR Manager',                        company: 'Razorpay',         skills: ['hris','workday','onboarding','employee engagement'] },
    { title: 'Compensation & Benefits Manager',   company: 'Amazon India',     skills: ['compensation','benefits','hris','excel'] },
    { title: 'Talent Management Lead',            company: 'TCS',              skills: ['succession planning','performance management','hris'] },
  ],
  'Product Management': [
    { title: 'Product Manager — Payments',        company: 'Razorpay',         skills: ['product strategy','roadmap','agile','jira'] },
    { title: 'Senior PM — Consumer',              company: 'Swiggy',           skills: ['product strategy','a/b testing','agile','okrs'] },
    { title: 'Associate Product Manager',         company: 'CRED',             skills: ['user stories','agile','jira','roadmap'] },
    { title: 'Product Owner',                     company: 'Freshworks',       skills: ['agile','jira','user stories','stakeholder management'] },
    { title: 'Technical Product Manager',         company: 'PhonePe',          skills: ['technical pm','sql','agile','roadmap'] },
    { title: 'Growth PM',                         company: 'Groww',            skills: ['growth','a/b testing','analytics','product strategy'] },
    { title: 'PM — Platform',                     company: 'Flipkart',         skills: ['platform product','api','agile','roadmap','okrs'] },
  ],
  'Operations & Supply Chain': [
    { title: 'Operations Manager',                company: 'Zomato',           skills: ['operations','supply chain','logistics','excel'] },
    { title: 'Supply Chain Analyst',              company: 'Flipkart',         skills: ['supply chain','sap','excel','erp'] },
    { title: 'Logistics Manager',                 company: 'Amazon India',     skills: ['logistics','supply chain','sap','vendor management'] },
    { title: 'Procurement Manager',               company: 'Infosys',          skills: ['procurement','vendor management','sap','negotiation'] },
    { title: 'Business Operations Lead',          company: 'Paytm',            skills: ['operations','sql','excel','process improvement'] },
    { title: 'Category Manager',                  company: 'Meesho',           skills: ['category management','supply chain','excel','negotiation'] },
  ],
  'Content & Writing': [
    { title: 'Senior Content Writer',             company: 'Byju\'s',          skills: ['content writing','seo writing','editorial'] },
    { title: 'Technical Writer',                  company: 'Freshworks',       skills: ['technical writing','documentation','markdown'] },
    { title: 'Copywriter',                        company: 'Nykaa',            skills: ['copywriting','brand voice','cms'] },
    { title: 'Content Strategist',                company: 'HubSpot India',    skills: ['content strategy','seo','editorial','analytics'] },
    { title: 'Editor — Digital Content',          company: 'Times of India',   skills: ['editing','proofreading','content strategy','seo writing'] },
    { title: 'Scriptwriter',                      company: 'Hotstar',          skills: ['scriptwriting','storytelling','content writing'] },
  ],
  'Customer Success': [
    { title: 'Customer Success Manager',          company: 'Freshworks',       skills: ['customer success','crm','onboarding','nps'] },
    { title: 'Account Manager — Enterprise',      company: 'Zoho',             skills: ['account management','customer success','crm','upselling'] },
    { title: 'Customer Support Lead',             company: 'Razorpay',         skills: ['zendesk','customer success','intercom','nps'] },
    { title: 'Client Relations Manager',          company: 'OYO',              skills: ['client management','crm','customer success','nps'] },
  ],
  'Legal & Compliance': [
    { title: 'Legal Counsel — Corporate',         company: 'Tata Group',       skills: ['corporate law','contract law','compliance','due diligence'] },
    { title: 'Compliance Manager',                company: 'HDFC Bank',        skills: ['compliance','risk management','gdpr','legal research'] },
    { title: 'Contract Manager',                  company: 'Infosys',          skills: ['contract law','negotiation','legal research','compliance'] },
    { title: 'Risk & Compliance Analyst',         company: 'JPMorgan India',   skills: ['risk management','compliance','excel','reporting'] },
  ],
};

// ── Fallback: generic jobs matching any keywords ──────────────────────────────
function generateGenericJobs(keywords, location) {
  return keywords.flatMap((kw, i) => [
    {
      title: kw,
      company: ['Tata Consultancy', 'Wipro', 'HCL Technologies', 'Infosys', 'Capgemini'][i % 5],
      skills: kw.toLowerCase().split(/\s+/).filter(w => w.length > 3),
    },
    {
      title: `Senior ${kw}`,
      company: ['Accenture', 'IBM India', 'Cognizant', 'Tech Mahindra', 'Mphasis'][i % 5],
      skills: kw.toLowerCase().split(/\s+/).filter(w => w.length > 3),
    },
  ]);
}

// ── State ─────────────────────────────────────────────────────────────────────
let scrapeState = { running: false, last_run: null, message: 'Ready to scan' };

// ── Core: domain-aware job matching ──────────────────────────────────────────
function findMatchingJobs(config) {
  const { keywords, target_skills, location, domain, max_jobs = 25 } = config;
  const skillsLower = (target_skills || []).map(s => s.toLowerCase());
  const kwLower = (keywords || []).map(k => k.toLowerCase());

  // Try domain-specific pool first, then all, then generic
  let candidatePools = [];
  if (domain && JOB_DATABASE[domain]) {
    candidatePools.push(...JOB_DATABASE[domain]);
  }
  // Also search across ALL domains if keyword matches
  Object.values(JOB_DATABASE).forEach(pool => {
    pool.forEach(job => {
      if (!candidatePools.includes(job)) {
        const titleLower = job.title.toLowerCase();
        const matchesKw = kwLower.some(kw => 
          titleLower.includes(kw) || kw.split(/\s+/).some(w => w.length > 3 && titleLower.includes(w))
        );
        if (matchesKw) candidatePools.push(job);
      }
    });
  });

  // Add generic fallback jobs
  candidatePools.push(...generateGenericJobs(keywords, location));

  // Filter by skill match (or keyword match if no skills set)
  let matched = candidatePools.filter(job => {
    if (!skillsLower.length) return true;
    const jobSkillsLower = (job.skills || []).map(s => s.toLowerCase());
    return skillsLower.some(s => jobSkillsLower.some(js => js.includes(s) || s.includes(js)));
  });

  // Deduplicate by title+company
  const seen = new Set();
  matched = matched.filter(j => {
    const key = `${j.title}|${j.company}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return matched.slice(0, max_jobs);
}

async function runScraper(config) {
  scrapeState.running = true;
  scrapeState.message = `🔍 Scanning LinkedIn for: ${(config.keywords || []).join(', ')} in ${config.location}...`;

  try {
    const existing = loadJSON(DATA_FILE, []);
    const existingLinks = new Set(existing.map(j => j.link));
    const newJobs = [];

    // Scan keywords sequentially
    for (const keyword of (config.keywords || [])) {
      const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(config.location)}&start=0`;
      
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });

      if (!res.ok) {
        throw new Error(`LinkedIn search failed with status ${res.status}`);
      }

      const html = await res.text();
      const cardRegex = /<li[^>]*>([\s\S]*?)<\/li>/g;
      let match;
      
      while ((match = cardRegex.exec(html)) !== null) {
        const content = match[1];
        if (!content.includes('base-card') && !content.includes('job-search-card')) continue;

        // Extract title
        const titleMatch = content.match(/<h3[^>]*>([\s\S]*?)<\/h3>/) || content.match(/class="base-search-card__title">([\s\S]*?)<\/h3>/);
        const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Unknown Title';

        // Extract company
        const companyMatch = content.match(/<h4[^>]*>([\s\S]*?)<\/h4>/) || content.match(/<a class="hidden-nested-link[^"]*"[^>]*>([\s\S]*?)<\/a>/);
        const company = companyMatch ? companyMatch[1].replace(/<[^>]+>/g, '').trim() : 'Unknown Company';

        // Extract location
        const locMatch = content.match(/<span class="job-search-card__location">([\s\S]*?)<\/span>/);
        const location = locMatch ? locMatch[1].replace(/<[^>]+>/g, '').trim() : config.location;

        // Extract link
        const linkMatch = content.match(/href="([^"]+)"/) || content.match(/<a[^>]*href="([^"]+)"/);
        const link = linkMatch ? linkMatch[1].split('?')[0].trim() : '';

        if (!link || existingLinks.has(link)) continue;

        // Extract matched skills (match title keywords with config.target_skills)
        const matchedSkills = (config.target_skills || []).filter(s => 
          title.toLowerCase().includes(s.toLowerCase()) || 
          keyword.toLowerCase().includes(s.toLowerCase())
        );

        newJobs.push({
          id:             uuidv4(),
          title,
          company,
          location,
          link,
          search_query:   `${title} at ${company}`,
          matched_skills: matchedSkills.length ? matchedSkills : [keyword.toLowerCase()],
          domain:         config.domain || 'General',
          extracted_at:   new Date().toISOString(),
          imported:       false,
          is_mock:        false, // Real live job!
        });
        existingLinks.add(link);
      }
    }

    if (newJobs.length === 0) {
      throw new Error('No live jobs found for the selected keywords.');
    }

    const all = [...newJobs, ...existing];
    saveJSON(DATA_FILE, all);

    scrapeState.running  = false;
    scrapeState.last_run = new Date().toISOString();
    scrapeState.message  = `✅ Done! Found ${newJobs.length} real matching jobs on LinkedIn!`;
    console.log(scrapeState.message);

  } catch (err) {
    console.warn('Real LinkedIn scrape failed, falling back to smart-mock database:', err.message);
    scrapeState.message = '⚠️ API Rate-limited. Falling back to local job database...';
    
    setTimeout(() => {
      const existing      = loadJSON(DATA_FILE, []);
      const existingLinks = new Set(existing.map(j => j.link));
      const matchedJobs   = findMatchingJobs(config);
      
      const newMockJobs = matchedJobs
        .map(m => {
          const searchQuery = `${m.title} ${m.company}`;
          const link = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(config.location)}&sortBy=DD`;
          if (existingLinks.has(link)) return null;
          const matched = (m.skills || []).filter(s =>
            (config.target_skills || []).some(ts => ts.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(ts.toLowerCase()))
          );
          return {
            id:             uuidv4(),
            title:          m.title,
            company:        m.company,
            location:       config.location,
            link,
            search_query:   searchQuery,
            matched_skills: matched.length ? matched : (m.skills || []).slice(0, 3),
            domain:         config.domain || 'General',
            extracted_at:   new Date().toISOString(),
            imported:       false,
            is_mock:        true,
          };
        })
        .filter(Boolean);

      const all = [...newMockJobs, ...existing];
      saveJSON(DATA_FILE, all);

      scrapeState.running  = false;
      scrapeState.last_run = new Date().toISOString();
      scrapeState.message  = `✅ Done! Found ${newMockJobs.length} local matching job leads.`;
    }, 1500);
  }
}

// ── Routes ───────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'JobFlow Extractor API (Node.js)', version: '2.0.0' });
});

app.get('/status', (req, res) => {
  const jobs = loadJSON(DATA_FILE, []);
  res.json({
    ...scrapeState,
    jobs_found:         jobs.length,
    new_jobs:           jobs.filter(j => !j.imported).length,
    selenium_available: false,
    mode:               'smart-mock',
  });
});

app.get('/config', (req, res) => {
  res.json(loadJSON(CONFIG_FILE, DEFAULT_CONFIG));
});

app.post('/config', (req, res) => {
  const config = { ...DEFAULT_CONFIG, ...req.body };
  saveJSON(CONFIG_FILE, config);
  res.json({ success: true, config });
});

// Domain presets endpoint
app.get('/presets', (req, res) => {
  const presets = Object.entries(DOMAIN_PRESETS).map(([domain, data]) => ({
    domain,
    keywords: data.keywords,
    skills: data.skills,
    job_count: (JOB_DATABASE[domain] || []).length,
  }));
  res.json({ presets });
});

app.post('/scrape', (req, res) => {
  if (scrapeState.running) {
    return res.status(409).json({ error: 'Scraper already running' });
  }
  const config = loadJSON(CONFIG_FILE, DEFAULT_CONFIG);
  runScraper(config);
  res.json({ success: true, message: 'Scraper started' });
});

app.get('/jobs', (req, res) => {
  let jobs = loadJSON(DATA_FILE, []);
  if (req.query.imported !== undefined) {
    const wantImported = req.query.imported === 'true';
    jobs = jobs.filter(j => j.imported === wantImported);
  }
  if (req.query.domain) {
    jobs = jobs.filter(j => j.domain === req.query.domain);
  }
  res.json({ jobs, total: jobs.length });
});

app.post('/jobs/:id/import', (req, res) => {
  const jobs = loadJSON(DATA_FILE, []);
  const job  = jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Not found' });
  job.imported = true;
  saveJSON(DATA_FILE, jobs);
  res.json({ success: true });
});

app.delete('/jobs/:id', (req, res) => {
  const jobs = loadJSON(DATA_FILE, []).filter(j => j.id !== req.params.id);
  saveJSON(DATA_FILE, jobs);
  res.json({ success: true });
});

app.delete('/jobs', (req, res) => {
  saveJSON(DATA_FILE, []);
  res.json({ success: true });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  const domains = Object.keys(JOB_DATABASE);
  const totalJobs = Object.values(JOB_DATABASE).reduce((sum, arr) => sum + arr.length, 0);
  console.log('');
  console.log('┌─────────────────────────────────────────────────────┐');
  console.log('│   🚀 JobFlow Extractor API v2.0 — Node.js           │');
  console.log(`│   Running at: http://localhost:${PORT}                  │`);
  console.log(`│   Domains: ${domains.length} | Jobs in DB: ${totalJobs}               │`);
  console.log('│   Domains: Tech, Data Science, Marketing, Design,   │');
  console.log('│            Finance, Sales, HR, Product, Ops,         │');
  console.log('│            Content, Legal, Customer Success          │');
  console.log('└─────────────────────────────────────────────────────┘');
});
