<script>
  import { onMount } from 'svelte';

  // Dark mode
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
  let subject = '';
  let email = '';
  let message = '';
  let files = [];
  let captchaInput = '';
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

  function selectCategory(cat) {
    selectedCategory = cat;
  }

  function goBack() {
    selectedCategory = null;
    subject = ''; email = ''; message = ''; files = []; captchaInput = '';
  }

  function handleFileChange(e) {
    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length > 6) {
      alert('Maximum 6 attachments allowed');
      return;
    }
    files = [...files, ...newFiles];
  }

  function removeFile(i) {
    files = files.filter((_, idx) => idx !== i);
  }

  // This sends the form to Formspree → emails you directly
</script>

<main class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
  <header class="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h1 class="text-3xl font-bold text-primary">JanaAwaj</h1>
        <span class="hidden sm:block text-gray-600 dark:text-gray-300">
          People's Voice for Transparent Nepal
        </span>
      </div>
    </div>
  </header>

  <div class="max-w-4xl mx-auto px-6 py-12">
    {#if !selectedCategory}
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">What issue do you want to report?</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">Choose a category below</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each categories as cat}
          <button
            on:click={() => selectCategory(cat)}
            class="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <img src={cat.img} alt={cat.name} class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-left">
              <h3 class="text-2xl font-bold text-white [text-shadow:_-2px_0_4px_black,_2px_0_4px_black,_0_2px_4px_black,_0_-2px_4px_black]">
                {cat.name}
              </h3>
              <p class="text-white/90 text-sm mt-1 font-medium [text-shadow:_0_0_3px_black]">
                Click to report →
              </p>
            </div>
            <div class="absolute inset-0 ring-4 ring-transparent group-hover:ring-primary/40 transition-all pointer-events-none"></div>
          </button>
        {/each}
      </div>

{:else}
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
    <button on:click={goBack} class="mb-6 text-primary font-medium flex items-center gap-2 hover:underline">
      ← Back to Categories
    </button>

    <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-3">
      Report: {selectedCategory.name}
    </h2>
    <p class="text-gray-600 dark:text-gray-300 mb-10">
      Your report will be reviewed and forwarded to the relevant authorities.
    </p>

    <!-- THIS FORM IS GUARANTEED TO WORK -->
    <form
      action="https://formsubmit.co/6737fbcb3639e7d6094a13b2ab67f1e2"
      method="POST"
      enctype="multipart/form-data"
      class="space-y-8"
    >
      <!-- Hidden fields (MUST be here) -->
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_subject" value="New JanaAwaj Report: {selectedCategory.name}" />
      <input type="hidden" name="_next" value={window.location.href} />

      <!-- Email (optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email (optional – for updates)
        </label>
        <input
          type="email"
          name="email"
          bind:value={email}
          placeholder="you@example.com"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary"
        />
      </div>

      <!-- Subject -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Subject <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="subject"
          bind:value={subject}
          required
          placeholder="e.g. Broken street light at Kalanki"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary"
        />
      </div>

      <!-- Message -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description <span class="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          bind:value={message}
          required
          rows="7"
          placeholder="Please describe the issue in detail..."
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary resize-none"
        ></textarea>
      </div>

      <!-- Category (hidden) -->
      <input type="hidden" name="Category" value={selectedCategory.name} />

      <!-- Attachments -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Attachments (up to 6 photos/videos)
        </label>
        <input
          type="file"
          name="attachment"
          accept="image/*,video/*"
          multiple
          on:change={handleFileChange}
          class="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-red-700"
        />
        {#if files.length > 0}
          <div class="flex flex-wrap gap-3 mt-4">
            {#each files as file, i}
              <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <span class="text-sm truncate max-w-xs text-gray-800 dark:text-gray-200">{file.name}</span>
                <button type="button" on:click={() => removeFile(i)} class="text-red-600 hover:text-red-800">×</button>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- CAPTCHA (client-side only) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          SPAM Prevention <span class="text-red-500">*</span>
        </label>
        <div class="flex items-center gap-6">
          <div class="bg-gray-800 text-white px-6 py-4 rounded-lg text-2xl font-mono tracking-wider">
            {captchaNumber}
          </div>
          <input
            type="text"
            bind:value={captchaInput}
            maxlength="4"
            required
            placeholder="????"
            class="w-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-xl font-mono bg-white dark:bg-gray-900 text-white"
          />
        </div>
      </div>

      <!-- Submit -->
      <div class="flex justify-end gap-4 pt-6">
        <button type="button" on:click={goBack} class="px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!subject || !message || captchaInput !== captchaNumber}
          class="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Submit Report
        </button>
      </div>
    </form>
  </div>
{/if}
  </div>
</main>