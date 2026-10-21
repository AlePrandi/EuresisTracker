<script lang="ts">
  import { Button, Badge } from "flowbite-svelte";
  import {
    HeartSolid,
    ArrowUpRightFromSquareOutline,
    ChevronLeftOutline,
  } from "flowbite-svelte-icons";

  /*
   * Expected shape of `data` (returned by +page.server.ts):
   *
   * data.product = {
   *   id, name, image, price, url,      // url = link to the shop page
   *   favorites?, store?                // optional
   * }
   * data.priceHistory = [{ date: string, price: number }, ...]  // oldest -> newest
   */
  let { data } = $props();

  const product = $derived(data.product);
  const history = $derived(
    (data.priceHistory ?? []) as { date: string; price: number }[],
  );

  const eur = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  });
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // ---- chart geometry (pure presentation) ----
  const W = 640;
  const H = 260;
  const pad = { l: 56, r: 16, t: 16, b: 32 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const prices = $derived(history.map((h) => h.price));
  const lowest = $derived(prices.length ? Math.min(...prices) : 0);
  const highest = $derived(prices.length ? Math.max(...prices) : 0);
  const change = $derived(
    history.length > 1 ? prices[prices.length - 1] - prices[0] : 0,
  );

  const yBounds = $derived.by(() => {
    if (!prices.length) return { min: 0, max: 1 };
    const spread = highest - lowest || Math.max(highest * 0.1, 1);
    return { min: lowest - spread * 0.15, max: highest + spread * 0.15 };
  });

  const points = $derived.by(() => {
    if (!history.length) return [];
    const times = history.map((h) => new Date(h.date).getTime());
    const t0 = Math.min(...times);
    const t1 = Math.max(...times);
    return history.map((h, i) => {
      const x =
        t1 === t0
          ? pad.l + innerW / 2
          : pad.l + ((times[i] - t0) / (t1 - t0)) * innerW;
      const y =
        pad.t +
        innerH -
        ((h.price - yBounds.min) / (yBounds.max - yBounds.min)) * innerH;
      return { x, y, ...h };
    });
  });

  const linePath = $derived(
    points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" "),
  );
  const areaPath = $derived(
    points.length > 1
      ? `${linePath} L${points[points.length - 1].x},${pad.t + innerH} L${points[0].x},${pad.t + innerH} Z`
      : "",
  );

  const yTicks = $derived(
    [0, 1, 2, 3].map((i) => {
      const value = yBounds.min + ((yBounds.max - yBounds.min) * i) / 3;
      const y = pad.t + innerH - (innerH * i) / 3;
      return { value, y };
    }),
  );

  const xLabels = $derived(
    points.length
      ? [points[0], points[points.length - 1]].filter(
          (p, i, a) => a.indexOf(p) === i,
        )
      : [],
  );

  // ---- hover ----
  let active = $state<number | null>(null);

  function onMove(e: PointerEvent) {
    if (!points.length) return;
    const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestDist = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - x);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    active = best;
  }
</script>

<svelte:head>
  <title
    >{product?.name ? `${product.name} · Euresis` : "Product · Euresis"}</title
  >
</svelte:head>

<section class="mx-auto max-w-6xl px-4 py-8">
  <a
    href="/"
    class="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-500"
  >
    <ChevronLeftOutline class="h-4 w-4" />
    Back to products
  </a>

  {#if !product}
    <div
      class="rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-600"
    >
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
        Product not found
      </h1>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        It may have been removed. Try searching for it again.
      </p>
      <Button href="/explore" class="mt-6">Explore products</Button>
    </div>
  {:else}
    <!-- Product overview -->
    <div class="grid gap-10 md:grid-cols-2 md:items-start">
      <div
        class="flex aspect-square items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800"
      >
        <img
          src={product.image}
          alt={product.name}
          class="max-h-full max-w-full object-contain"
        />
      </div>

      <div class="flex flex-col">
        {#if product.store}
          <Badge color="primary" class="mb-3 w-fit">{product.store}</Badge>
        {/if}

        <h1
          class="text-3xl leading-tight font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {product.name}
        </h1>

        {#if product.favorites !== undefined}
          <div
            class="mt-3 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
          >
            <HeartSolid class="h-4 w-4 text-primary-600" />
            <span>{product.favorites} favorites</span>
          </div>
        {/if}

        <div class="mt-8">
          <p class="text-sm text-gray-500 dark:text-gray-400">Current price</p>
          <p class="text-5xl font-extrabold text-gray-900 dark:text-white">
            {eur.format(product.price)}
          </p>
        </div>

        <div class="mt-8 flex flex-wrap gap-3">
          <Button
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            class="gap-2"
          >
            Buy now
            <ArrowUpRightFromSquareOutline class="h-4 w-4" />
          </Button>
        </div>

        {#if history.length}
          <dl
            class="mt-10 grid grid-cols-3 divide-x divide-gray-200 rounded-lg border border-gray-200 text-center dark:divide-gray-700 dark:border-gray-700"
          >
            <div class="px-3 py-4">
              <dt class="text-xs text-gray-500 dark:text-gray-400">Lowest</dt>
              <dd class="mt-1 font-semibold text-gray-900 dark:text-white">
                {eur.format(lowest)}
              </dd>
            </div>
            <div class="px-3 py-4">
              <dt class="text-xs text-gray-500 dark:text-gray-400">Highest</dt>
              <dd class="mt-1 font-semibold text-gray-900 dark:text-white">
                {eur.format(highest)}
              </dd>
            </div>
            <div class="px-3 py-4">
              <dt class="text-xs text-gray-500 dark:text-gray-400">Change</dt>
              <dd
                class="mt-1 font-semibold {change < 0
                  ? 'text-green-600 dark:text-green-500'
                  : change > 0
                    ? 'text-red-600 dark:text-red-500'
                    : 'text-gray-900 dark:text-white'}"
              >
                {change > 0 ? "+" : ""}{eur.format(change)}
              </dd>
            </div>
          </dl>
        {/if}
      </div>
    </div>

    <!-- Price history -->
    <div
      class="mt-12 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Price history
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Hover the chart to see the price on a given day.
        </p>
      </div>

      {#if points.length}
        <div class="relative">
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <svg
            viewBox="0 0 {W} {H}"
            class="h-auto w-full touch-pan-y"
            role="img"
            aria-label="Price history chart for {product.name}"
            onpointermove={onMove}
            onpointerleave={() => (active = null)}
          >
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#ef562f" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#ef562f" stop-opacity="0" />
              </linearGradient>
            </defs>

            {#each yTicks as t}
              <line
                x1={pad.l}
                x2={W - pad.r}
                y1={t.y}
                y2={t.y}
                class="stroke-gray-200 dark:stroke-gray-700"
                stroke-width="1"
              />
              <text
                x={pad.l - 8}
                y={t.y + 4}
                text-anchor="end"
                class="fill-gray-500 text-[11px] dark:fill-gray-400"
              >
                {eur.format(t.value)}
              </text>
            {/each}

            {#each xLabels as p, i}
              <text
                x={p.x}
                y={H - 8}
                text-anchor={xLabels.length === 1
                  ? "middle"
                  : i === 0
                    ? "start"
                    : "end"}
                class="fill-gray-500 text-[11px] dark:fill-gray-400"
              >
                {fmtDate(p.date)}
              </text>
            {/each}

            {#if areaPath}
              <path d={areaPath} fill="url(#priceFill)" />
            {/if}
            <path
              d={linePath}
              fill="none"
              stroke="#ef562f"
              stroke-width="2.5"
              stroke-linejoin="round"
              stroke-linecap="round"
            />

            {#if points.length <= 40}
              {#each points as p}
                <circle cx={p.x} cy={p.y} r="3" fill="#ef562f" />
              {/each}
            {/if}

            {#if active !== null}
              <line
                x1={points[active].x}
                x2={points[active].x}
                y1={pad.t}
                y2={pad.t + innerH}
                class="stroke-gray-400 dark:stroke-gray-500"
                stroke-dasharray="4 4"
              />
              <circle
                cx={points[active].x}
                cy={points[active].y}
                r="6"
                fill="#ef562f"
                stroke="white"
                stroke-width="2"
              />
            {/if}
          </svg>

          {#if active !== null}
            <div
              class="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-gray-900 px-3 py-2 text-center text-xs text-white shadow-lg dark:bg-gray-700"
              style="left: {(points[active].x / W) * 100}%; top: {(points[
                active
              ].y /
                H) *
                100 -
                3}%;"
            >
              <div class="font-semibold">
                {eur.format(points[active].price)}
              </div>
              <div class="text-gray-300">{fmtDate(points[active].date)}</div>
            </div>
          {/if}
        </div>
      {:else}
        <div
          class="flex h-48 items-center justify-center rounded-lg border border-dashed border-gray-300 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400"
        >
          No price history yet. Prices will appear here once this product has
          been tracked for a while.
        </div>
      {/if}
    </div>
  {/if}
</section>
