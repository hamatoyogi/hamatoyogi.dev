import { component$, useSignal } from '@builder.io/qwik';

export const Counter = component$(() => {
  const counter = useSignal(0);

  return (
    <>
      <button
        class="border border-purple-500 p-4"
        onClick$={() => counter.value++}
      >
        Click to add +1
      </button>
      <div>Counter value: {counter.value}</div>
    </>
  );
});
