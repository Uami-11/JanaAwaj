<script>
  import { onMount } from 'svelte';

  // Language state
  let lang = localStorage.getItem('appLang') || 'en';
  const translations = {
    en: {
      title: "JanaAwaj",
      tagline: "People's Voice for Transparent Nepal",
      prompt: "What issue do you want to report?",
      choose: "Choose a category below",
      back: "Back to Categories",
      report: "Report:",
      reviewed: "Your report will be reviewed and forwarded to the relevant authorities.",
      email: "Email (optional – for updates)",
      subject: "Subject",
      description: "Description",
      attachments: "Attachments (up to 6 photos/videos)",
      spam: "SPAM Prevention",
      spamHint: "Type the number you see above",
      cancel: "Cancel",
      submit: "Submit Report",
      viewReports: "View All Reports",
      priority: "Priority Level",
      high: "High Priority",
      medium: "Medium Priority",
      low: "Low Priority",
      maxAttachments: "Maximum 6 attachments allowed",
      fileBlocked: "File type not allowed",
      fileInvalid: "Only images and videos allowed",
      fileLarge: "File too big (max 8MB per file)",
      fillAll: "Please fill all required fields correctly and solve the captcha."
    },
    ne: {
      title: "जनआवाज",
      tagline: "पारदर्शी नेपालको लागि जनताको आवाज",
      prompt: "तपाईं कुन समस्या रिपोर्ट गर्न चाहनुहुन्छ?",
      choose: "तलको विकल्प छान्नुहोस्",
      back: "श्रेणीहरूमा फर्कनुहोस्",
      report: "रिपोर्ट:",
      reviewed: "तपाईंको रिपोर्ट समीक्षा गरिने छ र सम्बन्धित निकायमा पठाइने छ।",
      email: "इमेल (ऐच्छिक – अपडेटहरूको लागि)",
      subject: "शीर्षक",
      description: "विवरण",
      attachments: "संलग्नकहरू (६ सम्म फोटो/भिडियो)",
      spam: "स्प्याम रोकथाम",
      spamHint: "माथि देखाइएको संख्या टाइप गर्नुहोस्",
      cancel: "रद्द गर्नुहोस्",
      submit: "रिपोर्ट पेश गर्नुहोस्",
      viewReports: "सबै रिपोर्टहरू हेर्नुहोस्",
      priority: "प्राथमिकता स्तर",
      high: "उच्च प्राथमिकता",
      medium: "मध्यम प्राथमिकता",
      low: "कम प्राथमिकता",
      maxAttachments: "अधिकतम ६ संलग्नकहरू अनुमति छ",
      fileBlocked: "फाइल प्रकार अनुमति छैन",
      fileInvalid: "केवल फोटो र भिडियोहरू अनुमति छ",
      fileLarge: "फाइल धेरै ठूलो छ (प्रति फाइल अधिकतम ८MB)",
      fillAll: "कृपया सबै आवश्यक फिल्डहरू सहीसँग भर्नुहोस् र क्याप्चा हल गर्नुहोस्।"
    }
  };
  $: t = translations[lang];

  // Form state
  let selectedCategory = null;
  let priority = 'medium';  // ← NEW: Priority field
  let subject = '';
  let email = '';
  let message = '';
  let files = [];
  let captchaInput = '';
  const captchaNumber = '7985';

  const categories = [
    { name: 'General Issue', name_ne: 'सामान्य समस्या', img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop' },
    { name: 'Public Property Damage', name_ne: 'सार्वजनिक सम्पत्ति क्षति', img: 'https://vodenglish.news/wp-content/uploads/2022/08/demolished-house-Dangkao-1.jpeg' },
    { name: 'Traffic & Road Issues', name_ne: 'ट्राफिक र सडक समस्या', img: 'https://media.licdn.com/dms/image/v2/D4E12AQGo2VX63Jm8bQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1686733230992?e=2147483647&v=beta&t=vNfV7LHi3x8sfk6sTjFYYFCV4M58-a4Y2DqPaUaw1u0' },
    { name: 'Corruption & Misconduct', name_ne: 'भ्रष्टाचार र दुराचार', img: 'https://media.istockphoto.com/id/928085588/photo/businesspeople-shaking-hands-and-taking-bribe-under-table.jpg?s=612x612&w=0&k=20&c=A4MrcjvpR27rdwAYyg7lywe1IzBwL1ntXCuWr_kjEt8=' },
    { name: 'Police Misbehavior', name_ne: 'प्रहरी दुरव्यवहार', img: 'https://www.rightslitigation.com/wp-content/uploads/2021/09/riot-police-twisting-man-at-rally-6DGWQQQ.jpg' },
    { name: 'Environmental Violation', name_ne: 'वातावरणीय उल्लङ्घन', img: 'https://image.vietnamnews.vn/uploadvnnews/Article/2016/11/25/moitruong23343641PM.jpg' },
    { name: 'Unsafe Public Behavior', name_ne: 'असुरक्षित सार्वजनिक व्यवहार', img: 'https://s3.eu-central-1.amazonaws.com/life4me.plus/uploads/photos/1492006537_58ee368985197.jpeg' }
  ];

  function selectCategory(cat) {
    selectedCategory = cat;
  }

  function goBack() {
    selectedCategory = null;
    subject = email = message = captchaInput = '';
    files = [];
    priority = 'medium';
  }

  function isFileAllowed(file) {
    const blocked = ['.exe','.bat','.sh','.js','.vbs','.ps1','.jar','.apk'];
    const ext = '.' + file.name.toLowerCase().split('.').pop();
    if (blocked.includes(ext)) { alert(t.fileBlocked); return false; }
    const allowed = ['image/jpeg','image/png','image/gif','image/webp','video/mp4','video/webm'];
    if (!allowed.includes(file.type)) { alert(t.fileInvalid); return false; }
    if (file.size > 8*1024*1024) { alert(t.fileLarge); return false; }
    return true;
  }

  function handleFileChange(e) {
    const newFiles = Array.from(e.target.files).filter(isFileAllowed);
    if (files.length + newFiles.length > 6) {
      alert(t.maxAttachments);
      return;
    }
    files = [...files, ...newFiles];
  }

  function removeFile(i) {
    files = files.filter((_, idx) => idx !== i);
  }

  function validateAndSubmit(e) {
    if (!subject || !message || captchaInput !== captchaNumber) {
      alert(t.fillAll);
      e.preventDefault();
      return;
    }

    const reports = JSON.parse(localStorage.getItem('janaawajReports') || '[]');
    reports.unshift({
      id: Date.now(),
      category: selectedCategory.name,
      subject,
      status: 'Submitted',
      priority,                    // ← Saved (but NOT shown in /reports)
      timestamp: new Date().toLocaleString(),
      filesCount: files.length
    });
    localStorage.setItem('janaawajReports', JSON.stringify(reports.slice(0, 50)));
    alert(lang === 'ne' ? 'रिपोर्ट सफलतापूर्वक पेश भयो!' : 'Report submitted successfully!');
    goBack();
  }

  // Dark mode
  onMount(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }

    // Load Nepalify
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/nepalify@1.1.0/dist/nepalify.min.js';
    script.async = true;
    script.onload = () => {
      if (lang === 'ne') enableNepaliTyping();
    };
    document.head.appendChild(script);
  });

  function toggleLang() {
    lang = lang === 'en' ? 'ne' : 'en';
    localStorage.setItem('appLang', lang);
    if (lang === 'ne') enableNepaliTyping();
    else disableNepaliTyping();
  }

  function enableNepaliTyping() {
    if (typeof Nepalify !== 'undefined') {
      Nepalify.romanize();
      document.querySelectorAll('input[type="text"], input[type="email"], textarea, select').forEach(el => Nepalify.add(el));
    }
  }

  function disableNepaliTyping() {
    if (typeof Nepalify !== 'undefined') {
      document.querySelectorAll('input[type="text"], input[type="email"], textarea, select').forEach(el => Nepalify.remove(el));
    }
  }
</script>

<main class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
  <header class="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h1 class="text-3xl font-bold text-primary">{t.title}</h1>
        <span class="hidden sm:block text-gray-600 dark:text-gray-300">{t.tagline}</span>
      </div>
      <a href="/reports/" class="text-primary font-medium hover:underline">{t.viewReports}</a>
    </div>
  </header>

  <div class="max-w-4xl mx-auto px-6 py-12">
    {#if !selectedCategory}
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">{t.prompt}</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">{t.choose}</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each categories as cat}
          <button on:click={() => selectCategory(cat)} class="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <img src={cat.img} alt={cat.name} class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-left">
              <h3 class="text-2xl font-bold text-white [text-shadow:_-2px_0_4px_black,_2px_0_4px_black,_0_2px_4px_black,_0_-2px_4px_black]">
                {lang === 'ne' ? cat.name_ne : cat.name}
              </h3>
              <p class="text-white/90 text-sm mt-1 font-medium [text-shadow:_0_0_3px_black]">Click to report</p>
            </div>
            <div class="absolute inset-0 ring-4 ring-transparent group-hover:ring-primary/40 transition-all pointer-events-none"></div>
          </button>
        {/each}
      </div>
    {:else}
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <button on:click={goBack} class="mb-6 text-primary font-medium flex items-center gap-2 hover:underline">
          {t.back}
        </button>
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-3">
          {t.report} {lang === 'ne' ? selectedCategory.name_ne : selectedCategory.name}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-10">{t.reviewed}</p>

        <form on:submit|preventDefault={validateAndSubmit} class="space-y-8">

          <!-- PRIORITY DROPDOWN – FIRST FIELD -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.priority} <span class="text-red-500">*</span>
            </label>
            <select bind:value={priority} required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="high">{t.high}</option>
              <option value="medium">{t.medium}</option>
              <option value="low">{t.low}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.email}</label>
            <input bind:value={email} type="email" placeholder="you@example.com" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.subject} <span class="text-red-500">*</span></label>
            <input bind:value={subject} type="text" required placeholder={lang === 'ne' ? "उदाहरण: बानेश्वरमा ट्राफिक लाइट बिग्रिएको" : "e.g. Broken traffic light at Baneshwor"} class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.description} <span class="text-red-500">*</span></label>
            <textarea bind:value={message} required rows="7" placeholder={lang === 'ne' ? "समस्याको विस्तृत विवरण लेख्नुहोस्..." : "Describe the issue in detail..."} class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-none"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.attachments}</label>
            <input type="file" accept="image/*,video/*" multiple on:change={handleFileChange} class="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-red-700" />
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

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t.spam} <span class="text-red-500">*</span></label>
            <div class="flex items-center gap-6">
              <div class="bg-gray-800 text-white px-6 py-4 rounded-lg text-2xl font-mono tracking-wider">{captchaNumber}</div>
              <input bind:value={captchaInput} type="text" maxlength="4" required placeholder="????" class="w-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-xl font-mono bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">{t.spamHint}</p>
          </div>

          <div class="flex justify-end gap-4 pt-6">
            <button type="button" on:click={goBack} class="px-8 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
              {t.cancel}
            </button>
            <button type="submit" class="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-red-700 transition">
              {t.submit}
            </button>
          </div>
        </form>
      </div>
    {/if}
  </div>

  <!-- Language Toggle + Keyboard Layout -->
  <div class="fixed bottom-4 left-4 z-50 flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
    <button on:click={toggleLang} class="px-4 py-2 rounded-lg font-medium transition-colors {lang === 'en' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}">
      {lang === 'en' ? 'नेपाली' : 'English'}
    </button>
    <a href="https://applyvr.election.gov.np/Image/nepali-unicode-romanized-v1.4-main-window-outlook.jpg" target="_blank" class="flex items-center gap-2 text-primary hover:underline">
      <img src="https://applyvr.election.gov.np/Image/nepali-unicode-romanized-v1.4-main-window-outlook.jpg" alt="Nepali Keyboard" class="w-8 h-8 rounded border">
      Layout
    </a>
  </div>
</main>

<style>
  :global(body) {
    font-family: 'Inter', 'Noto Sans Nepali', system-ui, sans-serif;
  }
  :global([lang="ne"]) {
    font-family: 'Noto Sans Nepali', sans-serif;
  }
</style>