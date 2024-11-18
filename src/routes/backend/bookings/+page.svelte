<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { format } from 'date-fns';
    import { invalidateAll } from '$app/navigation';
    import ConfirmModal from '$lib/components/ConfirmModal.svelte';

    export let data: PageData;

    $: bookings = data.bookings;
    let deleteBooking: any = null;

    function handleDeleteConfirm() {
        const formData = new FormData();
        formData.append('id', deleteBooking.id);
        
        fetch('?/delete', {
            method: 'POST',
            body: formData
        }).then(async (response) => {
            if (response.ok) {
                await invalidateAll();
                deleteBooking = null;
            }
        });
    }

    function handleDeleteCancel() {
        deleteBooking = null;
    }
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Bookings Management</h1>

    <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Boat</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked At</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each bookings as booking}
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">{booking.user.name}</div>
                            <div class="text-sm text-gray-500">{booking.user.email}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{booking.boatSchedule.boat.name}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">
                                {format(new Date(booking.boatSchedule.date), 'PPP')}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">
                                {format(new Date(booking.boatSchedule.startTime), 'HH:mm')} - {format(new Date(booking.boatSchedule.endTime), 'HH:mm')}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">
                                {format(new Date(booking.createdAt), 'PPP HH:mm')}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                type="button"
                                class="inline-flex items-center p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full"
                                on:click={() => deleteBooking = booking}
                                title="Delete booking"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<ConfirmModal
    isOpen={!!deleteBooking}
    title="Delete Booking"
    message={deleteBooking ? `Are you sure you want to delete the booking for ${deleteBooking.user.name} on ${format(new Date(deleteBooking.boatSchedule.date), 'PPP')}? This action cannot be undone.` : ''}
    onConfirm={handleDeleteConfirm}
    onCancel={handleDeleteCancel}
/>
