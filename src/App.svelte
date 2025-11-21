<script>
let lang = 'en';  // default English
const translations = {
  en: {
    title: "JanaAwaj",
    tagline: "People's Voice for Transparent Nepal",
    prompt: "What issue do you want to report?",
    choose: "Choose a category below",
    report: "Report:",
    email: "Email (optional – for updates)",
    subject: "Subject",
    description: "Description",
    attachments: "Attachments (up to 6 photos/videos)",
    spam: "SPAM Prevention",
    cancel: "Cancel",
    submit: "Submit Report",
    viewReports: "View All Reports",
    liveTracker: "Live Report Tracker",
    noReports: "No reports yet. Be the first to raise your voice!"
  },
  ne: {
    title: "जनआवाज",
    tagline: "पारदर्शी नेपालको लागि जनताको आवाज",
    prompt: "तपाईं कुन समस्या रिपोर्ट गर्न चाहनुहुन्छ?",
    choose: "तलको श्रेणी छान्नुहोस्",
    report: "रिपोर्ट:",
    email: "इमेल (ऐच्छिक – अपडेटको लागि)",
    subject: "शीर्षक",
    description: "विवरण",
    attachments: "संलग्न फाइलहरू (अधिकतम ६ फोटो/भिडियो)",
    spam: "स्प्याम रोकथाम",
    cancel: "रद्द गर्नुहोस्",
    submit: "रिपोर्ट पेश गर्नुहोस्",
    viewReports: "सबै रिपोर्टहरू हेर्नुहोस्",
    liveTracker: "लाइभ रिपोर्ट ट्र्याकर",
    noReports: "अहिलेसम्म कुनै रिपोर्ट छैन। पहिलो आवाज उठाउनुहोस्!"
  }
};

$: t = translations[lang];
  import { onMount } from 'svelte';

  // Dark mode (unchanged)
  let darkMode = false;
  onMount(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      darkMode = true;
      document.documentElement.classList.add('dark');
    }
  });
  function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }

  let selectedCategory = null;
  let subject = ''; let email = ''; let message = ''; let files = []; let captchaInput = '';
  const captchaNumber = '7985';

  const categories = [
    { name: 'General Issue', img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop' },
    { name: 'Public Property Damage', img: 'https://vodenglish.news/wp-content/uploads/2022/08/demolished-house-Dangkao-1.jpeg' },
    { name: 'Traffic & Road Issues', img: 'https://media.licdn.com/dms/image/v2/D4E12AQGo2VX63Jm8bQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1686733230992?e=2147483647&v=beta&t=vNfV7LHi3x8sfk6sTjFYYFCV4M58-a4Y2DqPaUaw1u0' },
    { name: 'Corruption & Misconduct', img: 'https://media.istockphoto.com/id/928085588/photo/businesspeople-shaking-hands-and-taking-bribe-under-table.jpg?s=612x612&w=0&k=20&c=A4MrcjvpR27rdwAYyg7lywe1IzBwL1ntXCuWr_kjEt8=' },
    { name: 'Police Misbehavior', img: 'https://www.rightslitigation.com/wp-content/uploads/2021/09/riot-police-twisting-man-at-rally-6DGWQQQ.jpg' },
    { name: 'Environmental Violation', img: 'https://image.vietnamnews.vn/uploadvnnews/Article/2016/11/25/moitruong23343641PM.jpg' },
    { name: 'Unsafe Public Behavior', img: 'https://s3.eu-central-1.amazonaws.com/life4me.plus/uploads/photos/1492006537_58ee368985197.jpeg' }
  ];

  function selectCategory(cat) { selectedCategory = cat; }
  function goBack() {
    selectedCategory = null;
    subject = email = message = '';
    files = [];
    captchaInput = '';
  }

  // File validation (unchanged)
  function isFileAllowed(file) {
    const blocked = ['.exe','.bat','.sh','.js','.vbs','.ps1','.jar','.apk'];
    const ext = '.' + file.name.toLowerCase().split('.').pop();
    if (blocked.includes(ext)) { alert('Blocked file type'); return false; }
    const allowed = ['image/jpeg','image/png','image/gif','image/webp','video/mp4','video/webm'];
    if (!allowed.includes(file.type)) { alert('Only images & videos allowed'); return false; }
    if (file.size > 8*1024*1024) { alert('File too big (max 8MB)'); return false; }
    return true;
  }

  function handleFileChange(e) {
    const newFiles = Array.from(e.target.files).filter(isFileAllowed);
    if (files.length + newFiles.length > 6) {
      alert('Maximum 6 files allowed');
      return;
    }
    files = [...files, ...newFiles];
  }

  function removeFile(i) {
    files = files.filter((_, idx) => idx !== i);
  }

  // Save report to localStorage on submit
  function saveReport() {
    const reports = JSON.parse(localStorage.getItem('janaawajReports') || '[]');
    reports.unshift({
      id: Date.now(),
      category: selectedCategory.name,
      subject: subject,
      status: 'Submitted',
      timestamp: new Date().toLocaleString(),
      filesCount: files.length
    });
    localStorage.setItem('janaawajReports', JSON.stringify(reports.slice(0, 50)));  // Keep last 50
    alert('Report submitted! Check the dashboard at /reports');
  }

  function validateAndSubmit(e) {
    if (!subject || !message || captchaInput !== captchaNumber) {
      alert('Please fill all required fields and solve the captcha.');
      e.preventDefault();
      return;
    }
    saveReport();  // Save to localStorage
    // Form still submits to Formsubmit for email
  }
</script>

<!-- Your main HTML (header, categories, form) stays exactly the same as before -->
<!-- Just ensure labels use text-gray-600 dark:text-gray-300 for better readability -->

<!-- Rest of your form unchanged -->

<main class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
  <header class="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
  
    <div class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h1 class="text-3xl font-bold text-primary">JanaAwaj</h1>
        <span class="hidden sm:block text-gray-600 dark:text-gray-300">
          People's Voice for Transparent Nepal
        </span>
      </div>
<a href="/reports" class="text-primary font-medium hover:underline">
  View All Reports
</a>
    </div>
  </header>

  <div class="max-w-4xl mx-auto px-6 py-12">
    {#if !selectedCategory}
      <!-- Category Grid -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">What issue do you want to report?</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">Choose a category below</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each categories as cat}
           <button on:click={() => selectCategory(cat)} class="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <img src={cat.img} alt={cat.name} class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-left">
              <h3 class="text-2xl font-bold text-white [text-shadow:0_0_10px_black]">{cat.name}</h3>
              <p class="text-white/90 text-sm mt-1 font-medium">Click to report</p>
            </div>
          </button>
        {/each}
      </div>

    {:else}
      <!-- Report Form -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <button on:click={goBack} class="mb-6 text-primary font-medium flex items-center gap-2 hover:underline">
          Back to Categories
        </button>

        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-3">
          Report: {selectedCategory.name}
        </h2>

        <form
          action="https://formsubmit.co/6737fbcb3639e7d6094a13b2ab67f1e2"
          method="POST"
          enctype="multipart/form-data"
          class="space-y-8"
          on:submit={validateAndSubmit}
        >
          <!-- Hidden fields -->
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_subject" value="New Report: {selectedCategory.name}" />
          <input type="hidden" name="_next" value={window.location.origin} />
          <input type="hidden" name="_tally" value="https://tally.so/submit/VLLAZg" />
          <input type="hidden" name="Category" value={selectedCategory.name} />

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium mb-2">Email (optional)</label>
            <input type="email" name="email" bind:value={email} placeholder="you@example.com"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary" />
          </div>

          <!-- Subject -->
          <div>
            <label class="block text-sm font-medium mb-2">Subject <span class="text-red-500">*</span></label>
            <input type="text" name="subject" bind:value={subject} required placeholder="e.g. Broken road in Baneshwor"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary" />
          </div>

          <!-- Message -->
          <div>
            <label class="block text-sm font-medium mb-2">Description <span class="text-red-500">*</span></label>
            <textarea name="message" bind:value={message} required rows="7" placeholder="Describe the issue..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary resize-none"></textarea>
          </div>

          <!-- Attachments -->
          <div>
            <label class="block text-sm font-medium mb-2">Attachments (max 6, 8MB each)</label>
            <input type="file" name="attachment" multiple accept="image/*,video/*" on:change={handleFileChange}
              class="block w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-red-700" />
            {#if files.length > 0}
              <div class="flex flex-wrap gap-3 mt-4">
                {#each files as file, i}
                  <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                    <span class="text-sm truncate max-w-xs">{file.name}</span>
                    <button type="button" on:click={() => removeFile(i)} class="text-red-600">×</button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>

          <!-- CAPTCHA -->
          <div>
            <label class="block text-sm font-medium mb-3">SPAM Prevention <span class="text-red-500">*</span></label>
            <div class="flex items-center gap-6">
              <div class="bg-gray-800 text-white px-6 py-4 rounded-lg text-2xl font-mono tracking-wider">
                {captchaNumber}
              </div>
              <input bind:value={captchaInput} maxlength="4" required placeholder="????"
                class="w-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-xl font-mono bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
          </div>

          <div class="flex justify-end gap-4 pt-6">
            <button type="button" on:click={goBack} class="px-8 py-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit"
              class="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
              disabled={!subject || !message || captchaInput !== captchaNumber}>
              Submit Report
            </button>
          </div>
        </form>
      </div>
    {/if}
  </div>
</main>