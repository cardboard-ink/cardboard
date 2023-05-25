<script>
	import { page } from "$app/stores";
</script>
<h1 class="text-error-500">
    Error
</h1>
<p>
    {$page.error.message}
</p>