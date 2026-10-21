<script lang="ts">
  import { Search, Button, Card } from "flowbite-svelte";
  import { HeartSolid } from "flowbite-svelte-icons";

  import type { PageProps } from "./$types";
 
  let { data }: PageProps = $props();
</script>

<div class="search-bar-home">
  <div class="home-text">
    <h2>Welcome to Euresis Tracker</h2>
    <p>use the search bar to start exploring</p>
  </div>
  <Search>
    <Button class="me-1">Search</Button>
  </Search>
</div>

<section class="mx-auto mb-12 max-w-7xl px-4">
  <div class="home-title mb-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
      Most popular products
    </h1>
  </div>

  {#if data.products?.length}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {#each data.products as product (product.id)}
        <Card class="flex flex-col p-0">
          <a href="/product/{product.id}">
            <img
              class="h-56 w-full rounded-t-lg object-contain p-6"
              src={product.image}
              alt={product.name}
              loading="lazy"
            />
          </a>
          <div class="flex flex-1 flex-col px-5 pb-5">
            <a href="/product/{product.id}">
              <h5
                class="line-clamp-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white"
              >
                {product.name}
              </h5>
            </a>

            <div class="mt-2.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <HeartSolid class="h-4 w-4 text-primary-600" />
              <span>{product.favorites}</span>
            </div>

            <div class="mt-auto flex items-center justify-between pt-5">
              <span class="text-2xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat("en-IE", {
                  style: "currency",
                  currency: "EUR",
                }).format(product.price)}
              </span>
              <Button href="/product/{product.id}" size="sm">View</Button>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {:else}
    <p class="text-center text-gray-500 dark:text-gray-400">
      No products to show yet.
    </p>
  {/if}
</section>