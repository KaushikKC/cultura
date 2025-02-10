function Loader() {
  return (
    <div class="flex flex-row gap-2">
      <div class="w-4 h-4 rounded-full bg-[#808000] animate-bounce" />
      <div class="w-4 h-4 rounded-full bg-[#808000] animate-bounce [animation-delay:-.3s]" />
      <div class="w-4 h-4 rounded-full bg-[#808000] animate-bounce [animation-delay:-.5s]" />
    </div>
  );
}

export default Loader;
