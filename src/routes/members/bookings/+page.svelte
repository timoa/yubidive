<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { format } from 'date-fns';
    import { invalidateAll } from '$app/navigation';
    import ConfirmModal from '$lib/components/ConfirmModal.svelte';

    export let data: PageData;

    $: bookings = data.bookings;
    let cancelBooking: any = null;

    function handleCancelConfirm() {
        const formData = new FormData();
        formData.append('id', cancelBooking.id);
        
        fetch('?/cancel', {
            method: 'POST',
            body: formData
        }).then(async (response) => {
            if (response.ok) {
                await invalidateAll();
                cancelBooking = null;
            }
        });
    }

    function handleCancelCancel() {
        cancelBooking = null;
    }

    function isPastBooking(date: string) {
        return new Date(date) <= new Date();
    }
</script>

<div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">My Bookings</h1>
        <a
            href="/members/boats"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
            Book New Dive
        </a>
    </div>

    {#if bookings.length === 0}
        <div class="text-center py-12">
            <h3 class="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p class="text-gray-500">Start by booking a dive from our available schedules.</p>
        </div>
    {:else}
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul class="divide-y divide-gray-200">
                {#each bookings as booking}
                    {@const isPast = isPastBooking(booking.boatSchedule.date)}
                    <li>
                        <div class="px-4 py-4 sm:px-6">
                            <div class="flex items-center justify-between">
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-lg font-medium text-gray-900 truncate">
                                        {booking.boatSchedule.boat.name}
                                    </h3>
                                    <div class="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                                        <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                                            </svg>
                                            {format(new Date(booking.boatSchedule.date), 'PPP')}
                                        </div>
                                        <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                                            </svg>
                                            {format(new Date(booking.boatSchedule.startTime), 'HH:mm')} - {format(new Date(booking.boatSchedule.endTime), 'HH:mm')}
                                        </div>
                                        <div class="mt-2 flex items-center text-sm sm:mt-0">
                                            <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isPast ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                                                {isPast ? 'Past' : 'Upcoming'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {#if !isPast}
                                    <div class="ml-5 flex-shrink-0">
                                        <button
                                            type="button"
                                            class="inline-flex items-center p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full"
                                            on:click={() => cancelBooking = booking}
                                            title="Cancel booking"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>

<ConfirmModal
    isOpen={!!cancelBooking}
    title="Cancel Booking"
    message={cancelBooking ? `Are you sure you want to cancel your booking for ${cancelBooking.boatSchedule.boat.name} on ${format(new Date(cancelBooking.boatSchedule.date), 'PPP')}? This action cannot be undone.` : ''}
    onConfirm={handleCancelConfirm}
    onCancel={handleCancelCancel}
/>
