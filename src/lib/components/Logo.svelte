<script>
  export let class_ = '';
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class={`${class_}`}>
  <span class="font-montserrat text-2xl tracking-tight"
    >Yubi<span class="text-primary-400">Dive</span></span
  >
</div>

<style>
  :global(.font-montserrat) {
    font-family: 'Montserrat', sans-serif;
  }
</style>
