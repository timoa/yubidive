<script lang="ts">
  import { page } from '$app/stores';
  import EquipmentIcon from '$lib/components/icons/EquipmentIcon.svelte';
  import CrewIcon from '$lib/components/icons/CrewIcon.svelte';
  import ScheduleIcon from '$lib/components/icons/ScheduleIcon.svelte';

  const user = $page.data.user;

  const features = [
    {
      name: 'Professional Equipment',
      description: 'All our boats are equipped with the latest safety and diving equipment.',
      icon: EquipmentIcon
    },
    {
      name: 'Experienced Crew',
      description: 'Our crew members are certified professionals with years of experience.',
      icon: CrewIcon
    },
    {
      name: 'Flexible Scheduling',
      description: 'Choose from various time slots that fit your schedule perfectly.',
      icon: ScheduleIcon
    }
  ];

  function getHref(path: string): string {
    return user ? path : '/auth/signin';
  }
</script>

<div class="relative my-8 sm:my-16 lg:my-24">
  <!-- Hero section -->
  <div class="relative">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
        <div class="absolute inset-0">
          <img
            class="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1580019542155-247062e19ce4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2378&q=80"
            alt="Diving boat in crystal clear water"
          />
          <div
            class="absolute inset-0 bg-gradient-to-r from-primary-800 to-primary-700 mix-blend-multiply"
          ></div>
        </div>
        <div class="relative px-4 py-32 sm:px-6 sm:py-40 lg:py-48 lg:px-8">
          <h1 class="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span class="block text-white">Experience the Best</span>
            <span class="block text-primary-200">Scuba Diving Adventures</span>
          </h1>
          <p class="mt-6 max-w-lg mx-auto text-center text-xl text-primary-100 sm:max-w-3xl">
            Discover the underwater world with our fleet of professional diving boats. Book your
            next diving expedition today.
          </p>
          <div class="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div class="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <a
                href={getHref('/members/boats')}
                class="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-primary-50 sm:px-8"
              >
                View Boats
              </a>
              <a
                href={getHref('/members/bookings')}
                class="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Feature section -->
  <div class="relative bg-white py-16 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 class="text-base font-semibold uppercase tracking-wider text-primary-600">
        Why Choose Us
      </h2>
      <p class="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
        Everything you need for the perfect dive
      </p>
      <p class="mt-5 max-w-prose mx-auto text-xl text-gray-500">
        We provide top-notch diving experiences with professional equipment and experienced crew members.
      </p>
      <div class="mt-12">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {#each features as feature}
            <div class="pt-6">
              <div class="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div class="-mt-6">
                  <div>
                    <span
                      class="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg"
                    >
                      <svelte:component this={feature.icon} />
                    </span>
                  </div>
                  <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    {feature.name}
                  </h3>
                  <p class="mt-5 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- CTA section -->
  <div class="bg-primary-700">
    <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
        <span class="block">Ready for your next adventure?</span>
        <span class="block">Start booking today.</span>
      </h2>
      <p class="mt-4 text-lg leading-6 text-primary-200">
        Join us for an unforgettable diving experience in the most beautiful locations.
      </p>
      <a
        href="/boats"
        class="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
      >
        View Available Boats
      </a>
    </div>
  </div>
</div>
