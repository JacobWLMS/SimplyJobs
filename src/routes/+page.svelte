<script lang="ts">
    import JobSearchGenerator from '$lib/components/JobSearchGenerator.svelte';
    import Welcome from '$lib/components/Welcome.svelte';
</script>

<Welcome />
<main class="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
    <JobSearchGenerator />
</main>