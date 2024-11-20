<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { signOut, user as authUser, isLoading } from '$lib/auth';
  import { goto, invalidateAll } from '$app/navigation';
  import { afterNavigate } from '$app/navigation';
  import { _ } from 'svelte-i18n';
  import '../lib/i18n/i18n';
  import LanguageSelector from '$lib/components/LanguageSelector.svelte';
  import Logo from '$lib/components/Logo.svelte';

  let isMenuOpen = false;
  let isProfileMenuOpen = false;

  $: user = $page.data.user;
  $: userRole = user?.role?.toUpperCase() || null;
  $: isAdmin = userRole === 'ADMIN';
  $: isMember = userRole === 'MEMBER';

  // Subscribe to auth store changes
  $: if ($authUser) {
    user = $authUser;
    userRole = $authUser.role.toUpperCase();
    isAdmin = userRole === 'ADMIN';
    isMember = userRole === 'MEMBER';
  }

  afterNavigate(() => {
    isProfileMenuOpen = false;
    isMenuOpen = false;
  });

  $: navigation = [
    {
      name: $_('navbar.dashboard'),
      href: '/backend/dashboard',
      requireAuth: true,
      requireAdmin: true
    },
    {
      name: $_('navbar.dashboard'),
      href: '/members/dashboard',
      requireAuth: true,
      requireMember: true,
      hideWhenAdmin: true
    },
    {
      name: $_('navbar.boats'),
      href: '/members/boats',
      requireAuth: true,
      requireMember: true,
      hideWhenAdmin: true
    },
    {
      name: $_('navbar.myBookings'),
      href: '/members/bookings',
      requireAuth: true,
      requireMember: true,
      hideWhenAdmin: true
    },
    {
      name: $_('navbar.boats'),
      href: '/backend/boats',
      requireAuth: true,
      requireAdmin: true
    },
    {
      name: $_('navbar.schedules'),
      href: '/backend/schedules',
      requireAuth: true,
      requireAdmin: true
    },
    {
      name: $_('navbar.bookings'),
      href: '/backend/bookings',
      requireAuth: true,
      requireAdmin: true
    },
    {
      name: $_('navbar.users'),
      href: '/backend/users',
      requireAuth: true,
      requireAdmin: true
    }
  ];

  async function handleSignOut() {
    await signOut();
    await invalidateAll();
    isProfileMenuOpen = false;
    await goto('/');
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const menuButton = document.getElementById('user-menu-button');
    const menu = document.getElementById('user-menu-dropdown');

    if (menuButton && menu && !menuButton.contains(target) && !menu.contains(target)) {
      isProfileMenuOpen = false;
    }
  }

  $: console.log('Page Data:', $page.data);
  $: console.log('User:', user);
  $: console.log('User Role:', userRole);
  $: console.log('Is Admin:', isAdmin);
  $: console.log('Is Member:', isMember);
</script>

<svelte:window on:click={handleClickOutside} />

<div class="min-h-screen bg-gray-50">
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="hover:opacity-80 transition-opacity">
              <Logo />
            </a>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            {#each navigation as item}
              {#if (!item.requireAuth || user) && (!item.requireAdmin || isAdmin) && (!item.requireMember || isMember || isAdmin) && (!item.hideWhenAdmin || !isAdmin)}
                <a
                  href={item.href}
                  class="inline-flex items-center px-1 pt-1 border-b-2 {$page.url.pathname.startsWith(
                    item.href
                  )
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                >
                  {item.name}
                </a>
              {/if}
            {/each}
          </div>
        </div>

        <div class="flex items-center">
          <LanguageSelector />

          {#if user}
            <div class="hidden sm:ml-3 sm:flex sm:items-center">
              <div class="ml-3 relative">
                <div>
                  <button
                    type="button"
                    class="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    on:click={() => (isProfileMenuOpen = !isProfileMenuOpen)}
                  >
                    <span class="sr-only">Open user menu</span>
                    <div
                      class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600"
                    >
                      {user.name[0].toUpperCase()}
                    </div>
                  </button>
                </div>

                {#if isProfileMenuOpen}
                  <div
                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabindex="-1"
                    id="user-menu-dropdown"
                  >
                    <div class="px-4 py-2">
                      <div class="text-base font-medium text-gray-800">{user.name}</div>
                      <div class="text-sm font-medium text-gray-500">{user.email}</div>
                      <div class="mt-2">
                        <span
                          class="px-2 py-1 text-xs rounded-full {user.role === 'ADMIN'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'}"
                        >
                          {$_(`users.roles.${user.role?.toLowerCase() || 'member'}`)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabindex="-1"
                      on:click={handleSignOut}
                    >
                      {$_('common.signOut')}
                    </button>
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <div class="hidden sm:flex sm:items-center sm:ml-6 sm:space-x-4">
              <a
                href="/auth/signin"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {$_('common.signIn')}
              </a>
              <a
                href="/auth/signup"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {$_('common.signUp')}
              </a>
            </div>
          {/if}

          <div class="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
              on:click={() => (isMenuOpen = !isMenuOpen)}
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {#if isMenuOpen}
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                {:else}
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                {/if}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    {#if isMenuOpen}
      <div class="sm:hidden" id="mobile-menu">
        <div class="pt-2 pb-3 space-y-1">
          {#each navigation as item}
            {#if (!item.requireAuth || user) && (!item.requireAdmin || isAdmin) && (!item.requireMember || isMember || isAdmin) && (!item.hideWhenAdmin || !isAdmin)}
              <a
                href={item.href}
                class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {$page.url.pathname.startsWith(
                  item.href
                )
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}"
              >
                {item.name}
              </a>
            {/if}
          {/each}
        </div>
        {#if user}
          <div class="pt-4 pb-3 border-t border-gray-200">
            <div class="flex items-center px-4">
              <div class="flex-shrink-0">
                <div
                  class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-lg"
                >
                  {user.name[0].toUpperCase()}
                </div>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-gray-800">{user.name}</div>
                <div class="text-sm font-medium text-gray-500 flex items-center gap-2">
                  {user.email}
                  <span
                    class="px-2 py-1 text-xs rounded-full {user.role === 'ADMIN'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'}"
                  >
                    {$_(`users.roles.${user.role?.toLowerCase() || 'member'}`)}
                  </span>
                </div>
              </div>
            </div>
            <div class="mt-3 space-y-1">
              <button
                type="button"
                class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                on:click={handleSignOut}
              >
                {$_('common.signOut')}
              </button>
            </div>
          </div>
        {:else}
          <div class="pt-4 pb-3 border-t border-gray-200">
            <div class="space-y-1">
              <a
                href="/auth/signin"
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                {$_('common.signIn')}
              </a>
              <a
                href="/auth/signup"
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                {$_('common.signUp')}
              </a>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </nav>

  <main>
    <slot />
  </main>

  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
        <div class="flex space-x-6 md:order-2">
          <a href="https://facebook.com/yubidive" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">Facebook</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                fill-rule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
          <a href="https://instagram.com/yubidive" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">Instagram</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                fill-rule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
          <a href="https://twitter.com/yubidive" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">Twitter</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
              />
            </svg>
          </a>
        </div>
        <p class="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
          &copy; 2024 YubiDive. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</div>
