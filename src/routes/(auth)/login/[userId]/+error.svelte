<script>
	import { page } from "$app/stores";
</script>
<h1 class="h1 text-error-500">
    Error
</h1>
<p class="p">
    {$page.error.message}
</p>