<script>
  import Logo from '$lib/components/Logo.svelte';
  import LanguageSelector from '$lib/components/LanguageSelector.svelte';
  const currentYear = new Date().getFullYear();
</script>

<div class="auth-layout fixed inset-0 min-h-screen">
  <div
    class="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style="background-image: url('https://images.unsplash.com/photo-1544551763-46a013bb70d5');"
  >
    <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />
  </div>

  <div class="relative min-h-screen flex flex-col">
    <!-- Header with centered logo and language selector -->
    <div class="flex-none p-6 relative">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex-1" />
        <!-- Spacer -->
        <div class="flex items-center justify-center flex-1">
          <a href="/" class="flex items-center">
            <Logo class_="h-8 w-auto text-white" />
          </a>
        </div>
        <div class="flex-1 flex justify-end">
          <LanguageSelector />
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-6xl">
        <slot></slot>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex-none p-6 text-center">
      <p class="text-xs text-white/60">
        {currentYear} YubiDive. All rights reserved.
      </p>
    </div>
  </div>
</div>

<style>
  .auth-layout {
    height: 100%;
    overflow: hidden;
  }
  .bg-overlay {
    @apply bg-primary-600/70;
  }
</style>
