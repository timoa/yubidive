<script lang="ts">
  import { signUp } from '$lib/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { validatePassword } from '$lib/validation';
  import PasswordStrengthIndicator from '$lib/components/PasswordStrengthIndicator.svelte';
  import { _ } from 'svelte-i18n';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let name = '';
  let error = '';
  let loading = false;

  // Form validation
  let touched = {
    email: false,
    password: false,
    confirmPassword: false,
    name: false
  };

  $: emailError =
    touched.email && !email
      ? 'Email is required'
      : touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? 'Invalid email format'
        : '';

  $: passwordValidation = validatePassword(password);
  $: passwordError =
    touched.password && !password
      ? 'Password is required'
      : touched.password && !passwordValidation.isValid
        ? passwordValidation.errors[0]
        : '';

  $: confirmPasswordError =
    touched.confirmPassword && !confirmPassword
      ? 'Please confirm your password'
      : touched.confirmPassword && password !== confirmPassword
        ? 'Passwords do not match'
        : '';

  $: nameError = touched.name && !name ? 'Name is required' : '';

  $: isValid =
    email &&
    password &&
    confirmPassword &&
    name &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    !nameError &&
    passwordValidation.isValid;

  function handleBlur(field: keyof typeof touched) {
    touched[field] = true;
  }

  async function handleSubmit() {
    if (!isValid) return;

    loading = true;
    error = '';

    const result = await signUp(email, password, name);

    if (result.success) {
      const redirectTo = $page.url.searchParams.get('redirectTo') || '/boats';
      goto(redirectTo);
    } else {
      error = result.error?.message || 'An error occurred';
    }

    loading = false;
  }
</script>

<div class="w-full flex justify-center">
  <div class="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
    <!-- Left Column - Sign Up Form -->
    <div class="w-full max-w-md">
      <div class="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg shadow-xl">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Create your account</h1>
          <p class="mt-2 text-sm text-gray-600">
            Already have an account?
            <a href="/auth/signin" class="font-medium text-primary-600 hover:text-primary-500">
              Sign in here
            </a>
          </p>
        </div>

        <div class="mt-6">
          <form class="space-y-4" on:submit|preventDefault={handleSubmit}>
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
              <label for="name" class="block text-sm font-medium text-gray-700"> Full Name </label>
              <div class="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
                  bind:value={name}
                  on:blur={() => handleBlur('name')}
                />
              </div>
              {#if nameError}
                <p class="mt-2 text-sm text-red-600">{nameError}</p>
              {/if}
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"> Email </label>
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
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
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
              {#if password}
                <div class="mt-2">
                  <PasswordStrengthIndicator {password} />
                </div>
              {/if}
              {#if passwordError}
                <p class="mt-2 text-sm text-red-600">{passwordError}</p>
              {/if}
            </div>

            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div class="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
                  bind:value={confirmPassword}
                  on:blur={() => handleBlur('confirmPassword')}
                />
              </div>
              {#if confirmPasswordError}
                <p class="mt-2 text-sm text-red-600">{confirmPasswordError}</p>
              {/if}
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
                {/if}
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Right Column - Text content -->
    <div class="w-full max-w-md text-center lg:text-left">
      <div class="relative">
        <div class="absolute -left-4 top-0 w-1 h-12 bg-primary-500 rounded-r lg:block hidden"></div>
        <h2 class="text-4xl font-bold text-white leading-tight">Welcome to YubiDive</h2>
      </div>
      <p class="text-lg text-white/90 leading-relaxed mt-6">
        Join our community of divers. Track your dives, share experiences, and connect with fellow
        diving enthusiasts.
      </p>
    </div>
  </div>
</div>
