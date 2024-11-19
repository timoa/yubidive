<script lang="ts">
  import { signIn } from '$lib/auth';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { _ } from 'svelte-i18n';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;
  let touched = { email: false, password: false };
  let rememberMe = false;

  $: emailError = touched.email
    ? !email
      ? $_('auth.signIn.errors.emailRequired')
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? $_('auth.signIn.errors.invalidEmail')
        : ''
    : '';

  $: passwordError = touched.password && !password ? $_('auth.signIn.errors.passwordRequired') : '';

  async function handleSubmit() {
    touched.email = true;
    touched.password = true;

    if (!email || !password) return;

    loading = true;
    error = '';

    const result = await signIn(email, password);

    if (result.success) {
      await invalidateAll(); // Invalidate all page data to refresh navigation
      // Get the redirectTo parameter or use default based on user role
      const redirectTo =
        $page.url.searchParams.get('redirectTo') ||
        (result.user?.role === 'admin' ? '/backend/bookings' : '/members/boats');
      goto(redirectTo);
    } else {
      error = $_('auth.signIn.errors.invalidCredentials');
    }

    loading = false;
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      {$_('auth.signIn.title')}
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      {$_('auth.signIn.noAccount')}
      <a href="/auth/signup" class="font-medium text-primary-600 hover:text-primary-500">
        {$_('auth.signIn.createAccount')}
      </a>
    </p>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
        {#if error}
          <div class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        {/if}

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            {$_('auth.signIn.emailLabel')}
          </label>
          <div class="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              bind:value={email}
              on:blur={() => (touched.email = true)}
              class={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                emailError ? 'border-red-500' : ''
              }`}
            />
            {#if emailError}
              <p class="mt-2 text-sm text-red-600">{emailError}</p>
            {/if}
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            {$_('auth.signIn.passwordLabel')}
          </label>
          <div class="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              bind:value={password}
              on:blur={() => (touched.password = true)}
              class={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                passwordError ? 'border-red-500' : ''
              }`}
            />
            {#if passwordError}
              <p class="mt-2 text-sm text-red-600">{passwordError}</p>
            {/if}
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              bind:checked={rememberMe}
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              {$_('auth.signIn.rememberMe')}
            </label>
          </div>

          <div class="text-sm">
            <a
              href="/auth/forgot-password"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              {$_('auth.signIn.forgotPassword')}
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {#if loading}
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            {/if}
            {$_('auth.signIn.signInButton')}
          </button>
        </div>
      </form>

      <div class="mt-6">
        <div class="relative">
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">
              {$_('auth.signIn.noAccount')}
              <a href="/auth/signup" class="font-medium text-primary-600 hover:text-primary-500">
                {$_('auth.signIn.createAccount')}
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
