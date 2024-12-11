<script lang="ts">
    import type { ATSSite, SelectedSites } from '$lib/types';
    
    const atsSites: Record<string, ATSSite> = {
        greenhouse: { name: 'Greenhouse', domain: 'boards.greenhouse.io' },
        lever: { name: 'Lever', domain: 'jobs.lever.co' },
        workday: { name: 'Workday', domain: 'myworkdayjobs.com' },
        jobvite: { name: 'Jobvite', domain: 'jobs.jobvite.com' },
        icims: { name: 'iCIMS', domain: 'careers-page.icims.com' },
        smartrecruiters: { name: 'SmartRecruiters', domain: 'jobs.smartrecruiters.com' },
        bamboohr: { name: 'BambooHR', domain: 'bamboohr.com/jobs' },
        ashby: { name: 'Ashby', domain: 'jobs.ashbyhq.com' }
    };

    let keywords = '';
    let location = '';
    let mustInclude = '';
    let selectedSites: SelectedSites = {
        greenhouse: true,
        lever: false,
        workday: false,
        jobvite: false,
        icims: false,
        smartrecruiters: false,
        bamboohr: false,
        ashby: false
    };

    // Make the function reactive to all inputs
    $: searchString = generateSearchString(selectedSites, keywords, location, mustInclude);

    function generateSearchString(sites: SelectedSites, keys: string, loc: string, must: string): string {
        const searchParts: string[] = [];

        // Add site restrictions
        const selectedDomains = Object.entries(sites)
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => atsSites[key].domain);

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

<div class="max-w-3xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Simply Jobs</h2>
        
        <div class="space-y-6">
            <div>
                <h3 class="text-lg font-medium mb-3">Select ATS Platforms</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {#each Object.entries(atsSites) as [key, site]}
                        <label class="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                bind:checked={selectedSites[key]}
                                class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span class="text-sm">{site.name}</span>
                        </label>
                    {/each}
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium mb-2">
                    Keywords (comma-separated)
                </label>
                <input
                    type="text"
                    bind:value={keywords}
                    placeholder="e.g. developer, engineer"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label class="block text-sm font-medium mb-2">
                    Location
                </label>
                <input
                    type="text"
                    bind:value={location}
                    placeholder="e.g. London, UK"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label class="block text-sm font-medium mb-2">
                    Must Include Terms (comma-separated)
                </label>
                <input
                    type="text"
                    bind:value={mustInclude}
                    placeholder="e.g. Azure, AWS"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-lg font-medium">Generated Search String:</h3>
                    <div class="flex space-x-2">
                        <button
                            on:click={copyToClipboard}
                            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 {copySuccess ? 'bg-green-50 border-green-500' : ''}"
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
                            class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search
                        </button>
                    </div>
                </div>
                <pre class="bg-white p-3 rounded border border-gray-200 text-sm whitespace-pre-wrap">
                    {searchString}
                </pre>
            </div>
        </div>
    </div>
</div>