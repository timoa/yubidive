<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { format } from 'date-fns';

    export let data: PageData;

    $: schedules = data.schedules;
    $: boats = data.boats;

    let selectedBoat = '';
    let selectedDate = '';

    function resetForm() {
        selectedBoat = '';
        selectedDate = '';
    }
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Boat Schedules</h1>

    <!-- Create Schedule Form -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Create New Schedule</h2>
        <form method="POST" action="?/create" use:enhance={() => {
            return async ({ result }) => {
                if (result.type === 'success') {
                    resetForm();
                }
            };
        }} class="space-y-4">
            <div>
                <label for="boat" class="block text-sm font-medium text-gray-700">Select Boat</label>
                <select
                    id="boat"
                    name="boatId"
                    bind:value={selectedBoat}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                >
                    <option value="">Select a boat...</option>
                    {#each boats as boat}
                        <option value={boat.id}>{boat.name}</option>
                    {/each}
                </select>
            </div>

            <div>
                <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    bind:value={selectedDate}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>

            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Create Schedule
            </button>
        </form>
    </div>

    <!-- Schedules List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Boat</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each schedules as schedule}
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">{schedule.boat.name}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">
                                {format(new Date(schedule.date), 'PPP')}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">
                                {schedule.bookings.length} bookings
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <form
                                method="POST"
                                action="?/delete"
                                use:enhance
                                class="inline-block"
                            >
                                <input type="hidden" name="id" value={schedule.id} />
                                <button
                                    type="submit"
                                    class="text-red-600 hover:text-red-900"
                                    disabled={schedule.bookings.length > 0}
                                >
                                    Delete
                                </button>
                            </form>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
