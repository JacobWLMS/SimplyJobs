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
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-xl">
        <div class="space-y-4">
            <h2 class="text-2xl font-bold dark:text-white">Welcome to Job Search Generator!</h2>
            
            <div class="prose dark:prose-invert">
                <p class="text-gray-600 dark:text-gray-300">
                    This tool helps you create powerful Google search strings to find job postings across multiple Applicant Tracking Systems (ATS).
                </p>

                <h3 class="text-lg font-semibold mt-4 dark:text-white">How to Use:</h3>
                
                <ol class="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>
                        <strong>Select ATS Platforms:</strong> Choose which job board platforms you want to search through.
                    </li>
                    <li>
                        <strong>Add Custom URLs:</strong> Include any specific company career pages you want to search.
                    </li>
                    <li>
                        <strong>Enter Keywords:</strong> Add job titles or skills (separate multiple with commas).
                    </li>
                    <li>
                        <strong>Specify Location:</strong> Add your preferred work location.
                    </li>
                    <li>
                        <strong>Must-Include Terms:</strong> Add terms that MUST appear in the job posting.
                    </li>
                </ol>

                <h3 class="text-lg font-semibold mt-4 dark:text-white">Features:</h3>
                <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>✨ Search across multiple job boards simultaneously</li>
                    <li>🔍 Generate Google-optimized search strings</li>
                    <li>📋 One-click copy to clipboard</li>
                    <li>🌐 Direct Google search integration</li>
                    <li>🎨 Dark mode support</li>
                </ul>
            </div>

            <div class="mt-6 flex justify-end">
                <button
                    on:click={dismissTutorial}
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Get Started
                </button>
            </div>
        </div>
    </div>
</div>
{/if}