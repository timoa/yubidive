<script lang="ts">
    import type { PageData } from './$types';
    import { format } from 'date-fns';
    import { enhance } from '$app/forms';

    export let data: PageData;

    $: schedule = data.schedule;
    $: user = data.user;

    function getAvailableSpots() {
        const totalSpots = schedule.boat.capacity;
        const bookedSpots = schedule.bookings.length;
        return totalSpots - bookedSpots;
    }
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Book a Dive</h1>

    <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-6">
                <h2 class="text-xl font-semibold mb-4">{schedule.boat.name}</h2>
                <p class="text-gray-600 mb-6">{schedule.boat.description}</p>

                <div class="space-y-4">
                    <div>
                        <h3 class="text-sm font-medium text-gray-500">Date</h3>
                        <p class="mt-1 text-lg">{format(new Date(schedule.date), 'PPP')}</p>
                    </div>

                    <div>
                        <h3 class="text-sm font-medium text-gray-500">Time</h3>
                        <p class="mt-1 text-lg">
                            {format(new Date(schedule.startTime), 'HH:mm')} - {format(new Date(schedule.endTime), 'HH:mm')}
                        </p>
                    </div>

                    <div>
                        <h3 class="text-sm font-medium text-gray-500">Available Spots</h3>
                        <p class="mt-1 text-lg">{getAvailableSpots()} of {schedule.boat.capacity}</p>
                    </div>

                    <div>
                        <h3 class="text-sm font-medium text-gray-500">Booking For</h3>
                        <p class="mt-1 text-lg">{user.name}</p>
                        <p class="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div class="mt-8">
                    <form
                        method="POST"
                        use:enhance={() => {
                            return async ({ update }) => {
                                await update();
                            };
                        }}
                        class="space-y-4"
                    >
                        <input type="hidden" name="scheduleId" value={schedule.id} />

                        <div class="flex justify-end space-x-4">
                            <a
                                href="/members/boats"
                                class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Cancel
                            </a>
                            <button
                                type="submit"
                                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                disabled={getAvailableSpots() === 0}
                            >
                                {getAvailableSpots() === 0 ? 'No Spots Available' : 'Confirm Booking'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
