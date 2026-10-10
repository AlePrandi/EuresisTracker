<script lang="ts">
  import "../app.css";
  import favicon from "#lib/assets/favicon.svg";
  import type { LayoutProps } from "./$types";
  import {
    Footer,
    FooterCopyright,
    FooterLinkGroup,
    FooterBrand,
    FooterLink,
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
    Button,
  } from "flowbite-svelte";
  import { SearchOutline } from "flowbite-svelte-icons";
  import { fade } from "svelte/transition";

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Navbar>
  <NavBrand href="/">
    <img src={favicon} class="me-3 h-6 sm:h-9" alt="Appe Logo" />
    <span
      class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
      >Euresis</span
    >
  </NavBrand>
  <div class="flex md:order-2">
    <NavUl>
      <NavLi href="/explore">Explore</NavLi>
      <NavLi href="/signin">Sign In</NavLi>
    </NavUl>
    <Button href="/signup" size="sm">Sign Up</Button>
    <NavHamburger />
  </div>
</Navbar>

{@render children()}

<Footer>
  <FooterCopyright href="/" by="Euresis" year={2026} />
  <FooterLinkGroup
    class="mt-3 flex flex-wrap items-center text-sm text-gray-500 sm:mt-0 dark:text-gray-400"
  >
    <FooterLink href="/">About</FooterLink>
    <FooterLink href="/">Privacy Policy</FooterLink>
    <FooterLink href="/">Licensing</FooterLink>
    <FooterLink href="/">Contact</FooterLink>
  </FooterLinkGroup>
</Footer>
