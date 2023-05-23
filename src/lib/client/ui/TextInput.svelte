<script lang="ts">
  export let name: string;
  export let placeholder: string;
  export let type: "text" | "password" = "text";
  export let required: boolean = false;
  export let disabled: boolean = false;
</script>

<div>
  <label class="label snap-center" for={name}>{name}</label>
  <input class="input" id={name} name={name} type={type} required={required} placeholder={placeholder} disabled={disabled} />
</div>