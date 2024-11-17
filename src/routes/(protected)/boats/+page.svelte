<script>
  let boats = [
    {
      id: 'e89b9f5a-1c7a-4e3b-b0c2-8d4a7c47f175',
      name: 'Sea Explorer',
      capacity: 12,
      description: 'Perfect for group dives, equipped with modern diving facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80',
      features: ['GPS Navigation', 'First Aid Equipment', 'Diving Gear Storage', 'Sun Deck'],
      pricePerHour: 150
    },
    {
      id: 'f67d2c1b-3a8e-4d9f-9e5b-6c2a1b3d4e5f',
      name: 'Reef Diver',
      capacity: 8,
      description: 'Ideal for smaller groups and specialized diving experiences.',
      imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80',
      features: ['Underwater Cameras', 'Sonar System', 'Fresh Water Shower', 'Shade Canopy'],
      pricePerHour: 120
    }
  ];

  let selectedBoat = null;
  let isModalOpen = false;

  function openModal(boat) {
    selectedBoat = boat;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    selectedBoat = null;
  }
</script>

<div class="bg-gray-50 min-h-screen">
  <!-- Header -->
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
          Our Diving Boats
        </h2>
        <p class="mt-1 text-lg text-gray-500">
          Choose from our fleet of well-maintained diving boats
        </p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <button
          type="button"
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter Boats
        </button>
      </div>
    </div>
  </div>

  <!-- Boat Grid -->
  <div class="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each boats as boat}
        <div
          class="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="flex-shrink-0 aspect-w-16 aspect-h-9">
            <img
              class="w-full h-full object-cover"
              src={boat.imageUrl}
              alt={boat.name}
            />
          </div>
          <div class="flex-1 p-6 flex flex-col justify-between">
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-gray-900">
                  {boat.name}
                </h3>
                <p class="text-sm font-medium text-primary-600">
                  ${boat.pricePerHour}/hour
                </p>
              </div>
              <p class="mt-3 text-base text-gray-500">
                {boat.description}
              </p>
              <div class="mt-4">
                <div class="flex items-center">
                  <svg
                    class="flex-shrink-0 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span class="ml-2 text-sm text-gray-500">
                    Capacity: {boat.capacity} divers
                  </span>
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                  {#each boat.features as feature}
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {feature}
                    </span>
                  {/each}
                </div>
              </div>
            </div>
            <div class="mt-6 flex items-center justify-between space-x-4">
              <button
                on:click={() => openModal(boat)}
                class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View Details
              </button>
              <a
                href="/boats/{boat.id}/book"
                class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- Boat Details Modal -->
{#if isModalOpen && selectedBoat}
  <div
    class="fixed z-10 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        on:click={closeModal}
      />

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
        &#8203;
      </span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div class="aspect-w-16 aspect-h-9 mb-6">
                <img
                  src={selectedBoat.imageUrl}
                  alt={selectedBoat.name}
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                {selectedBoat.name}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {selectedBoat.description}
                </p>
                <div class="mt-4">
                  <h4 class="text-sm font-medium text-gray-900">Features:</h4>
                  <ul class="mt-2 list-disc list-inside text-sm text-gray-500">
                    {#each selectedBoat.features as feature}
                      <li>{feature}</li>
                    {/each}
                  </ul>
                </div>
                <div class="mt-4">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-900">
                      Price per hour:
                    </span>
                    <span class="text-lg font-semibold text-primary-600">
                      ${selectedBoat.pricePerHour}
                    </span>
                  </div>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-sm font-medium text-gray-900">
                      Maximum capacity:
                    </span>
                    <span class="text-lg font-semibold text-gray-900">
                      {selectedBoat.capacity} divers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <a
            href="/boats/{selectedBoat.id}/book"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Book Now
          </a>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            on:click={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
