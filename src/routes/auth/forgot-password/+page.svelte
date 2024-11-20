<script lang="ts">
  import { _ } from 'svelte-i18n';

  let email = '';
  let success = '';
  let error = '';
  let touched = { email: false };
  let loading = false;

  $: emailError = touched.email
    ? !email
      ? $_('auth.forgotPassword.errors.emailRequired')
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? $_('auth.forgotPassword.errors.invalidEmail')
        : ''
    : '';

  async function handleSubmit(event) {
    event.preventDefault();
    success = '';
    error = '';
    loading = true;

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        success = $_('auth.forgotPassword.success');
      } else {
        const data = await response.json();
        if (data.error === 'TOO_MANY_REQUESTS') {
          error = $_('auth.forgotPassword.errors.tooManyRequests');
        } else if (data.error === 'USER_NOT_FOUND') {
          error = $_('auth.forgotPassword.errors.userNotFound');
        } else {
          error = data.error;
        }
      }
    } catch {
      error = 'An unexpected error occurred. Please try again.';
    } finally {
      loading = false;
    }
  }

  function handleBlur(field) {
    touched[field] = true;
  }
</script>

<div class="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="w-full max-w-md">
    <div class="bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
      <div>
        <h1 class="mt-2 text-3xl font-extrabold text-gray-900">
          {$_('auth.forgotPassword.title')}
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          {$_('auth.forgotPassword.description')}
        </p>
        <p class="mt-2 text-sm text-gray-600">
          Remember your password?
          <a href="/auth/signin" class="font-medium text-primary-600 hover:text-primary-500">
            Sign in here
          </a>
        </p>
      </div>

      <div class="mt-8">
        {#if success}
          <div class="rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        {:else}
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
                {$_('auth.forgotPassword.emailLabel')}
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
                  bind:value={email}
                  on:blur={() => handleBlur('email')}
                />
              </div>
              {#if emailError}
                <p class="mt-2 text-sm text-red-600">{emailError}</p>
              {/if}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
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
                {$_('auth.forgotPassword.submit')}
              </button>
            </div>
          </form>
        {/if}
      </div>
    </div>
  </div>
</div>
