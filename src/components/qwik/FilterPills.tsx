import { component$, useSignal, $ } from '@builder.io/qwik';

interface FilterOption {
  label: string;
  value: string;
}

interface Props {
  options: FilterOption[];
  targetAttr?: string; // data attribute to filter on, default 'data-category'
}

type Filterable = HTMLElement & {
  _filterHideTimer?: number;
  _filterToken?: number;
};

export const FilterPills = component$<Props>(({ options, targetAttr = 'data-category' }) => {
  const active = useSignal('all');

  const handleFilter = $((value: string) => {
    active.value = value;
    const items = document.querySelectorAll<Filterable>('[data-filterable]');
    items.forEach((htmlEl) => {
      const cat = htmlEl.getAttribute(targetAttr) || '';
      const isVisible = value === 'all' || cat === value;
      const token = (htmlEl._filterToken ?? 0) + 1;
      htmlEl._filterToken = token;

      if (htmlEl._filterHideTimer !== undefined) {
        clearTimeout(htmlEl._filterHideTimer);
        htmlEl._filterHideTimer = undefined;
      }

      if (isVisible) {
        htmlEl.style.display = '';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (htmlEl._filterToken !== token) return;
            htmlEl.style.opacity = '1';
            htmlEl.style.transform = 'translateY(0) scale(1)';
          });
        });
      } else {
        htmlEl.style.opacity = '0';
        htmlEl.style.transform = 'translateY(4px) scale(0.98)';
        htmlEl._filterHideTimer = window.setTimeout(() => {
          htmlEl._filterHideTimer = undefined;
          if (htmlEl._filterToken !== token) return;
          htmlEl.style.display = 'none';
        }, 350);
      }
    });
  });

  return (
    <div class="flex flex-wrap gap-2">
      <button
        onClick$={() => handleFilter('all')}
        class={[
          'cursor-pointer rounded-[var(--radius-sm)] border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors',
          active.value === 'all'
            ? 'border-ink bg-ink text-paper dark:border-[#F0ECE4] dark:bg-[#F0ECE4] dark:text-[#0F1117]'
            : 'border-border bg-surface text-muted hover:border-ink hover:text-ink dark:border-[#2A2D3E] dark:bg-[#1A1D2E] dark:text-[#9A95A8]',
        ].join(' ')}
      >
        All
      </button>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick$={() => handleFilter(opt.value)}
          class={[
            'cursor-pointer rounded-[var(--radius-sm)] border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors',
            active.value === opt.value
              ? 'border-ink bg-ink text-paper dark:border-[#F0ECE4] dark:bg-[#F0ECE4] dark:text-[#0F1117]'
              : 'border-border bg-surface text-muted hover:border-ink hover:text-ink dark:border-[#2A2D3E] dark:bg-[#1A1D2E] dark:text-[#9A95A8]',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
});
