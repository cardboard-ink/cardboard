<script>
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
</script>

<h1 class="h1 inter font-bold">Cardboard FAQ</h1>

<div class="flex mt-[3rem] w-[20rem] md:w-[50rem] flex-col gap-8">
  <div class="block">
    <Accordion>
      <AccordionItem open>
        <svelte:fragment slot="summary">What is Cardboard?</svelte:fragment>
        <svelte:fragment slot="content">Cardboard is an access manager, it currently supports Guilded. You can use it to link your
			Guilded account to Guilded Bots and other services.</svelte:fragment>
      </AccordionItem>
      <AccordionItem>
        <svelte:fragment slot="summary">Why Cardboard?</svelte:fragment>
        <svelte:fragment slot="content">Cardboard is an access manager for platforms that don't have a way to link accounts. Currently
			platforms like Guilded lack one, so Cardboard is here to fill that gap. Cardboard is also
			<a
			class="anchor"
				href="https://github.com/cardboard-ink/cardboard"
				target="_blank"
				rel="noopener noreferrer"
			>
				open source
			</a>,
			 so you can see exactly what it does with your data.</svelte:fragment>
      </AccordionItem>
	  <AccordionItem>
        <svelte:fragment slot="summary">What can Cardboard see?</svelte:fragment>
        <svelte:fragment slot="content">Cardboard can only see information on your account that can be seen by anyone on Guilded. This
			includes your username, profile picture, and bio.</svelte:fragment>
	  </AccordionItem>
	  <AccordionItem>
		<svelte:fragment slot="summary">I have more questions</svelte:fragment>
		  <svelte:fragment slot="content">Sure! You can join our <a class="anchor" href="https://www.guilded.gg/CardBoard">Guilded Server</a> and ask
		  in the
		  <a
		  class="anchor"
			  href="https://www.guilded.gg/CardBoard/groups/3y446Rmz/channels/4539a4f9-fb51-4a23-b014-0fcaeaf062d3/docs/374610"
			  >Cardboard Docs</a
		  > channel.</svelte:fragment>
	  </AccordionItem>
    </Accordion>
  </div>
</div>