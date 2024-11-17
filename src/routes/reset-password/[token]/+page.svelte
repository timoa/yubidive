<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let password = '';
  let confirmPassword = '';
  let error = '';
  let success = false;
  let loading = false;

  // Form validation
  let touched = {
    password: false,
    confirmPassword: false
  };

  $: passwordError = touched.password && !password ? 'Password is required' :
    touched.password && password.length < 8 ? 'Password must be at least 8 characters' : '';

  $: confirmPasswordError = touched.confirmPassword && !confirmPassword ? 'Please confirm your password' :
    touched.confirmPassword && password !== confirmPassword ? 'Passwords do not match' : '';

  $: isValid = password && confirmPassword && !passwordError && !confirmPasswordError;

  function handleBlur(field: keyof typeof touched) {
    touched[field] = true;
  }

  async function handleSubmit() {
    if (!isValid) return;

    loading = true;
    error = '';

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: $page.params.token,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        success = true;
      } else {
        error = data.error;
      }
    } catch (err) {
      error = 'An error occurred. Please try again.';
    }

    loading = false;
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Reset your password
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Enter your new password below.
    </p>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {#if success}
        <div class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-green-400"
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
              <h3 class="text-sm font-medium text-green-800">
                Password reset successful
              </h3>
              <div class="mt-2 text-sm text-green-700">
                <p>
                  Your password has been reset. You can now sign in with your new password.
                </p>
              </div>
              <div class="mt-4">
                <a
                  href="/signin"
                  class="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  Sign in
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
          {#if error}
            <div class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          {/if}

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              New password
            </label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                bind:value={password}
                on:blur={() => handleBlur('password')}
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm
                  {passwordError ? 'border-red-300' : ''}"
              />
              {#if passwordError}
                <p class="mt-2 text-sm text-red-600">{passwordError}</p>
              {/if}
            </div>
          </div>

          <div>
            <label
              for="confirm-password"
              class="block text-sm font-medium text-gray-700"
            >
              Confirm new password
            </label>
            <div class="mt-1">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                bind:value={confirmPassword}
                on:blur={() => handleBlur('confirmPassword')}
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm
                  {confirmPasswordError ? 'border-red-300' : ''}"
              />
              {#if confirmPasswordError}
                <p class="mt-2 text-sm text-red-600">{confirmPasswordError}</p>
              {/if}
            </div>
          </div>

          <div>
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
                Resetting password...
              {:else}
                Reset password
              {/if}
            </button>
          </div>
        </form>
      {/if}
    </div>
  </div>
</div>
