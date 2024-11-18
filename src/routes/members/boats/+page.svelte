<script lang="ts">
    import type { PageData } from './$types';
    import { format } from 'date-fns';

    export let data: PageData;

    $: boats = data.boats;

    // Default image if none is provided
    const defaultBoatImage = '/images/default-boat.jpg';

    function handleImageError(event: Event) {
        const img = event.target as HTMLImageElement;
        img.src = defaultBoatImage;
    }
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Available Boats</h1>

    {#if boats.length === 0}
        <div class="text-center py-12">
            <h3 class="text-lg font-medium text-gray-900 mb-2">No boats available</h3>
            <p class="text-gray-500">Check back later for available boats and schedules.</p>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each boats as boat}
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <div class="aspect-w-16 aspect-h-9">
                        <img
                            src={boat.imageUrl || defaultBoatImage}
                            alt={boat.name}
                            class="w-full h-48 object-cover"
                            on:error={handleImageError}
                        />
                    </div>
                    <div class="p-6">
                        <h2 class="text-xl font-semibold mb-2">{boat.name}</h2>
                        <p class="text-gray-600 mb-4">{boat.description || 'No description available.'}</p>
                        <div class="text-sm text-gray-500">
                            <p>Capacity: {boat.capacity} divers</p>
                        </div>
                    </div>

                    {#if boat.schedules.length > 0}
                        <div class="border-t border-gray-200">
                            <div class="p-4">
                                <h3 class="text-lg font-medium mb-2">Upcoming Schedules</h3>
                                <div class="space-y-2">
                                    {#each boat.schedules as schedule}
                                        <div class="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                                            <div>
                                                <div class="font-medium">
                                                    {format(new Date(schedule.date), 'PPP')}
                                                </div>
                                                <div class="text-sm text-gray-500">
                                                    {format(new Date(schedule.startTime), 'HH:mm')} - {format(new Date(schedule.endTime), 'HH:mm')}
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <div class="text-sm font-medium">
                                                    {schedule.availableSpots} spots left
                                                </div>
                                                <a
                                                    href="/members/bookings/new?scheduleId={schedule.id}"
                                                    class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-primary-600 hover:bg-primary-700"
                                                    class:opacity-50={schedule.availableSpots === 0}
                                                    class:cursor-not-allowed={schedule.availableSpots === 0}
                                                    class:pointer-events-none={schedule.availableSpots === 0}
                                                >
                                                    {schedule.availableSpots > 0 ? 'Book Now' : 'Fully Booked'}
                                                </a>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {:else}
                        <div class="border-t border-gray-200 p-4">
                            <p class="text-gray-500 text-center">No upcoming schedules</p>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    /* Add aspect ratio support */
    .aspect-w-16 {
        position: relative;
        padding-bottom: 56.25%;
    }

    .aspect-w-16 > img {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
</style>
