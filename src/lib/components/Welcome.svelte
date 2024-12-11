<script lang="ts">
    import { onMount } from 'svelte';
    let showTutorial = true;

    function dismissTutorial() {
        showTutorial = false;
        localStorage.setItem('tutorialSeen', 'true');
    }

    onMount(() => {
        const seen = localStorage.getItem('tutorialSeen');
        if (seen) {
            showTutorial = false;
        }
    });
</script>

{#if showTutorial}
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg mx-auto my-4 shadow-xl">
        <div class="p-4 sm:p-6 space-y-4">
            <div class="flex justify-between items-start">
                <h2 class="text-xl sm:text-2xl font-bold dark:text-white">Welcome to Job Search Generator!</h2>
                <button 
                    on:click={dismissTutorial}
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div class="prose dark:prose-invert max-w-none">
                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Generate powerful search strings to find job postings across multiple Applicant Tracking Systems (ATS).
                </p>

                <h3 class="text-base sm:text-lg font-semibold mt-4 mb-2 dark:text-white">How to Use:</h3>
                
                <ol class="space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 list-decimal pl-4">
                    <li class="pl-1">
                        <strong>Select ATS Platforms:</strong> Choose which job board platforms to search through
                    </li>
                    <li class="pl-1">
                        <strong>Add Custom URLs:</strong> Include specific company career pages
                    </li>
                    <li class="pl-1">
                        <strong>Enter Keywords:</strong> Add job titles or skills (comma-separated)
                    </li>
                    <li class="pl-1">
                        <strong>Specify Location:</strong> Add your preferred work location
                    </li>
                    <li class="pl-1">
                        <strong>Must-Include Terms:</strong> Add terms that MUST appear in the posting
                    </li>
                </ol>

                <div class="mt-4">
                    <h3 class="text-base sm:text-lg font-semibold mb-2 dark:text-white">Quick Features:</h3>
                    <div class="grid grid-cols-2 gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        <div class="flex items-center space-x-2">
                            <span>✨</span>
                            <span>Multi-board search</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span>🔍</span>
                            <span>Google-optimized</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span>📋</span>
                            <span>One-click copy</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span>🌐</span>
                            <span>Direct search</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-4 flex justify-end">
                <button
                    on:click={dismissTutorial}
                    class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    Get Started
                </button>
            </div>
        </div>
    </div>
</div>
{/if}