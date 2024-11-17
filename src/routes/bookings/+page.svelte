<script>
  let bookings = [
    {
      id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
      boatId: 'e89b9f5a-1c7a-4e3b-b0c2-8d4a7c47f175',
      boatName: 'Sea Explorer',
      startTime: '2024-03-20T09:00:00',
      endTime: '2024-03-20T15:00:00',
      status: 'confirmed',
      price: 900,
      participants: 8,
      location: 'Great Barrier Reef',
      notes: 'Bring your own diving gear'
    },
    {
      id: 'b2c3d4e5-f6a7-5b2c-9d3e-4f5a6b7c8d9e',
      boatId: 'f67d2c1b-3a8e-4d9f-9e5b-6c2a1b3d4e5f',
      boatName: 'Reef Diver',
      startTime: '2024-03-22T10:00:00',
      endTime: '2024-03-22T16:00:00',
      status: 'pending',
      price: 720,
      participants: 6,
      location: 'Coral Bay',
      notes: 'Equipment rental available'
    }
  ];

  function getStatusColor(status) {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case 'confirmed':
        return `<svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>`;
      case 'pending':
        return `<svg class="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`;
      case 'cancelled':
        return `<svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>`;
      default:
        return '';
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  }

  function formatDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = (end - start) / (1000 * 60 * 60);
    return `${hours} hours`;
  }
</script>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between mb-8">
      <div class="flex-1 min-w-0">
        <h2 class="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
          Your Bookings
        </h2>
        <p class="mt-1 text-lg text-gray-500">
          Manage your diving adventures
        </p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <a
          href="/boats"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg
            class="-ml-1 mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          New Booking
        </a>
      </div>
    </div>

    <!-- Booking Cards -->
    <div class="space-y-6">
      {#each bookings as booking}
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                {@html getStatusIcon(booking.status)}
                <h3 class="ml-2 text-lg leading-6 font-medium text-gray-900">
                  {booking.boatName}
                </h3>
                <span
                  class="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(
                    booking.status
                  )}"
                >
                  {booking.status}
                </span>
              </div>
              <div class="flex items-center space-x-3">
                <button
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Edit
                </button>
                <button
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Date & Time</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {formatDate(booking.startTime)}
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Duration</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {formatDuration(booking.startTime, booking.endTime)}
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Location</dt>
                <dd class="mt-1 text-sm text-gray-900">{booking.location}</dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Price</dt>
                <dd class="mt-1 text-sm font-medium text-primary-600">
                  ${booking.price}
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Participants</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {booking.participants} divers
                </dd>
              </div>
              {#if booking.notes}
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Notes</dt>
                  <dd class="mt-1 text-sm text-gray-900">{booking.notes}</dd>
                </div>
              {/if}
            </dl>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="flex justify-end space-x-3 text-sm">
              <button
                class="inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                <svg
                  class="h-5 w-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Add to Calendar
              </button>
              <button
                class="inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                <svg
                  class="h-5 w-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Details
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
