<script lang="ts">
    import { showTutorial } from '$lib/stores/tutorial';
    import type { ATSSite, SelectedSites } from '$lib/types';

    type TimeFrame = {
        label: string;
        days: number;
        value: string;
        operator: string;
    };

    // Helper function to get date in yyyy/mm/dd format
    function formatDate(daysAgo: number): string {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    const timeFrames: TimeFrame[] = [
        { label: 'All time', days: 0, value: '', operator: '' },
        { label: 'Last 24 hours', days: 1, value: formatDate(1), operator: 'after' },
        { label: 'Last 3 days', days: 3, value: formatDate(3), operator: 'after' },
        { label: 'Last 7 days', days: 7, value: formatDate(7), operator: 'after' },
        { label: 'Last 14 days', days: 14, value: formatDate(14), operator: 'after' },
        { label: 'Last 30 days', days: 30, value: formatDate(30), operator: 'after' }
    ];

    let selectedTimeFrameIndex = 0;
    $: selectedTimeFrame = timeFrames[selectedTimeFrameIndex];

    const atsSites: Record<string, ATSSite> = {
        greenhouse: { name: 'Greenhouse', domain: 'boards.greenhouse.io' },
        lever: { name: 'Lever', domain: 'jobs.lever.co' },
        workday: { name: 'Workday', domain: 'myworkdayjobs.com' },
        jobvite: { name: 'Jobvite', domain: 'jobs.jobvite.com' },
        icims: { name: 'iCIMS', domain: 'careers-page.icims.com' },
        smartrecruiters: { name: 'SmartRecruiters', domain: 'jobs.smartrecruiters.com' },
        bamboohr: { name: 'BambooHR', domain: 'bamboohr.com/jobs' },
        ashby: { name: 'Ashby', domain: 'jobs.ashbyhq.com' },
        trac: { name: 'Trac', domain: 'apps.trac.jobs' }
    };

    let keywords = '';
    let location = '';
    let mustInclude = '';
    let customATS = '';
    let selectedSites: SelectedSites = {
        greenhouse: true,
        lever: false,
        workday: false,
        jobvite: false,
        icims: false,
        smartrecruiters: false,
        bamboohr: false,
        ashby: false,
        trac: false
    };

    $: searchString = generateSearchString(selectedSites, keywords, location, mustInclude, customATS, selectedTimeFrame);

    function generateSearchString(sites: SelectedSites, keys: string, loc: string, must: string, custom: string, timeFrame: TimeFrame): string {
        const searchParts: string[] = [];

        // Add site restrictions
        const selectedDomains = Object.entries(sites)
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => atsSites[key].domain);

        // Add custom ATS domain if provided
        if (custom.trim()) {
            selectedDomains.push(...custom.split(',').map(url => url.trim()));
        }

        if (selectedDomains.length > 0) {
            const siteConditions = selectedDomains.map(site => `site:${site}`).join(' OR ');
            searchParts.push(`(${siteConditions})`);
        }

        // Add "apply" intext search
        searchParts.push('intext:"apply"');

        // Add keywords
        if (keys) {
            keys.split(',').forEach(keyword => {
                if (keyword.trim()) {
                    searchParts.push(`intext:"${keyword.trim()}"`);
                }
            });
        }

        // Add location
        if (loc) {
            searchParts.push(`intext:"${loc.trim()}"`);
        }

        // Add must-include terms
        if (must) {
            const terms = must.split(',').map(term => term.trim()).filter(Boolean);
            if (terms.length > 0) {
                const andConditions = terms.map(term => `intext:"${term}"`).join(' AND ');
                searchParts.push(`(${andConditions})`);
            }
        }

        if (timeFrame.value) {
            searchParts.push(`${timeFrame.operator}:${timeFrame.value}`);
        }

        return searchParts.join(' ');
    }

    let copySuccess = false;
    async function copyToClipboard(): Promise<void> {
        try {
            await navigator.clipboard.writeText(searchString);
            copySuccess = true;
            setTimeout(() => {
                copySuccess = false;
            }, 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    }

    function openGoogleSearch(): void {
        const encodedSearch = encodeURIComponent(searchString);
        window.open(`https://www.google.com/search?q=${encodedSearch}`, '_blank');
    }
</script>

<div class="w-full max-w-3xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div class="p-4 sm:p-6">
            <div class="flex justify-between items-center mb-4 sm:mb-6">
                <h2 class="text-xl sm:text-2xl font-bold dark:text-white">ATS Scout</h2>
                <button
                    on:click={() => $showTutorial = true}
                    class="p-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Show tutorial"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
            
            <div class="space-y-4 sm:space-y-6">
                <div>
                    <h3 class="text-base sm:text-lg font-medium mb-2 sm:mb-3 dark:text-gray-200">Select ATS Platforms</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                        {#each Object.entries(atsSites) as [key, site]}
                            <label class="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                                <input
                                    type="checkbox"
                                    bind:checked={selectedSites[key]}
                                    class="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700"
                                />
                                <span class="text-sm dark:text-gray-300">{site.name}</span>
                            </label>
                        {/each}
                    </div>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1.5 dark:text-gray-200" for="customATS">
                            Custom ATS URLs (comma-separated)
                        </label>
                        <input
                            id="customATS"
                            type="text"
                            bind:value={customATS}
                            placeholder="e.g. careers.company.com"
                            class="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1.5 dark:text-gray-200" for="keywords">
                            Keywords (comma-separated)
                        </label>
                        <input
                            id="keywords"
                            type="text"
                            bind:value={keywords}
                            placeholder="e.g. developer, engineer"
                            class="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1.5 dark:text-gray-200" for="location">
                            Location
                        </label>
                        <input
                            id="location"
                            type="text"
                            bind:value={location}
                            placeholder="e.g. London, UK"
                            class="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1.5 dark:text-gray-200" for="mustInclude">
                            Must Include Terms (comma-separated)
                        </label>
                        <input
                            id="mustInclude"
                            type="text"
                            bind:value={mustInclude}
                            placeholder="e.g. Azure, AWS"
                            class="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1.5 dark:text-gray-200" for="timeFrame">
                            Time Range
                        </label>
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <input
                                    id="timeFrame"
                                    type="range"
                                    min="0"
                                    max={timeFrames.length - 1}
                                    bind:value={selectedTimeFrameIndex}
                                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                            </div>
                            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span class="font-medium {selectedTimeFrame.value ? 'text-blue-600 dark:text-blue-400' : ''}">
                                    {selectedTimeFrame.label}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
                        <h3 class="text-base sm:text-lg font-medium dark:text-gray-200">Generated Search String:</h3>
                        <div class="flex gap-2">
                            <button
                                on:click={copyToClipboard}
                                class="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 {copySuccess ? 'bg-green-50 dark:bg-green-900 border-green-500' : ''}"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {#if copySuccess}
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    {:else}
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    {/if}
                                </svg>
                                {copySuccess ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                                on:click={openGoogleSearch}
                                class="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search
                            </button>
                        </div>
                    </div>
                    <pre class="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 text-sm whitespace-pre-wrap dark:text-gray-200 overflow-x-auto">
                        {searchString}
                    </pre>
                </div>
            </div>
        </div>
    </div>
</div>