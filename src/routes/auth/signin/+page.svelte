<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { _ } from 'svelte-i18n';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;
  let emailError = '';
  let passwordError = '';

  $: isValid = email && password && !emailError && !passwordError;

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function handleBlur(field: string) {
    if (field === 'email') {
      emailError = email
        ? validateEmail(email)
          ? ''
          : $_('auth.signIn.invalidEmail')
        : $_('auth.signIn.emailRequired');
    } else if (field === 'password') {
      passwordError = password ? '' : $_('auth.signIn.passwordRequired');
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!isValid) return;

    loading = true;
    error = '';

    try {
      const response = await fetch('/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        goto($page.url.searchParams.get('redirectTo') || '/');
      } else {
        error = data.message || $_('auth.signIn.genericError');
      }
    } catch (e) {
      error = $_('auth.signi-In.genericError');
    } finally {
      loading = false;
    }
  }
</script>

<div class="w-full flex justify-center">
  <div class="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
    <!-- Left Column - Sign In Form -->
    <div class="w-full max-w-md">
      <div class="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg shadow-xl">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {$_('auth.signIn.title')}
          </h1>
          <p class="mt-2 text-sm text-gray-600">
            {$_('auth.signIn.noAccount')}
            <a href="/auth/signup" class="font-medium text-primary-600 hover:text-primary-500">
              {$_('auth.signIn.signUpLink')}
            </a>
          </p>
        </div>

        <div class="mt-6">
          <form class="space-y-4" on:submit|preventDefault={handleSubmit}>
            {#if error}
              <div class="rounded-md bg-red-50 p-4" transition:fade>
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
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
                  placeholder="m@example.com"
                  bind:value={email}
                  on:blur={() => handleBlur('email')}
                />
              </div>
              {#if emailError}
                <p class="mt-2 text-sm text-red-600">{emailError}</p>
              {/if}
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
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
                  bind:value={password}
                  on:blur={() => handleBlur('password')}
                />
              </div>
              {#if passwordError}
                <p class="mt-2 text-sm text-red-600">{passwordError}</p>
              {/if}
            </div>

            <div class="flex items-center justify-between">
              <div class="text-sm">
                <a
                  href="/auth/forgot-password"
                  class="font-medium text-primary-600 hover:text-primary-500"
                >
                  {$_('auth.signIn.forgotPasswordLink')}
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
              {$_('auth.signIn.submitButton')}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Right Column - Text content -->
    <div class="w-full max-w-md text-center lg:text-left">
      <div class="relative">
        <div class="absolute -left-4 top-0 w-1 h-12 bg-primary-500 rounded-r lg:block hidden"></div>
        <h2 class="text-4xl font-bold text-white leading-tight">{$_('auth.signIn.welcomeBack')}</h2>
      </div>
      <p class="text-lg text-white/90 leading-relaxed mt-6">
        {$_('auth.signIn.welcomeText')}
      </p>
    </div>
  </div>
</div>
