<script lang="ts">
  import "../app.css";
  import favicon from "#lib/assets/favicon.svg";
  import user from "#lib/assets/user.png";
  import type { LayoutProps } from "./$types";
  import {
    Footer,
    FooterCopyright,
    FooterLinkGroup,
    FooterBrand,
    FooterLink,
  } from "flowbite-svelte";
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownHeader,
    DropdownGroup,
  } from "flowbite-svelte";
  import {
    Sidebar,
    SidebarGroup,
    SidebarItem,
    SidebarButton,
    uiHelpers,
  } from "flowbite-svelte";
  import {
    ChartOutline,
    GridSolid,
    MailBoxSolid,
    UserSolid,
  } from "flowbite-svelte-icons";
  import { page } from "$app/state";
  let activeUrl = $state(page.url.pathname);
  const spanClass = "flex-1 ms-3 whitespace-nowrap";
  const activeClass =
    "flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700";
  const nonActiveClass =
    "flex items-center p-2 text-base font-normal rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700";
  const demoSidebarUi = uiHelpers();
  let isDemoOpen = $state(false);
  const closeDemoSidebar = demoSidebarUi.close;
  $effect(() => {
    isDemoOpen = demoSidebarUi.isOpen;
    activeUrl = page.url.pathname;
  });
  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Navbar>
  <NavBrand href="/">
    <span
      class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
      >Euresis</span
    >
  </NavBrand>
  <div class="flex items-center md:order-2">
    <Avatar id="avatar-menu" src={user} />
    <NavHamburger />
  </div>
  <Dropdown placement="bottom" triggeredBy="#avatar-menu">
    <DropdownHeader>
      <span class="block text-sm">User name</span>
      <span class="block truncate text-sm font-medium">email@example.com</span>
    </DropdownHeader>
    <DropdownGroup>
      <DropdownItem>Settings</DropdownItem>
    </DropdownGroup>
    <DropdownHeader>Sign out</DropdownHeader>
  </Dropdown>
  <NavUl>
    <NavLi href="/">Home</NavLi>
    <NavLi href="/about">About</NavLi>
    <NavLi href="/pricing">Pricing</NavLi>
    <NavLi href="/contact">Contact</NavLi>
  </NavUl>
</Navbar>

<SidebarButton onclick={demoSidebarUi.toggle} class="mb-2" />
<div class="relative">
  <Sidebar
    {activeUrl}
    backdrop={false}
    isOpen={isDemoOpen}
    closeSidebar={closeDemoSidebar}
    params={{ x: -50, duration: 50 }}
    position="absolute"
    classes={{ nonactive: nonActiveClass, active: activeClass }}
    class="z-50 h-full"
  >
    <SidebarGroup>
      <SidebarItem label="Dashboard" href="/Dashboard" active={activeUrl === "/Dashboard"}>
        {#snippet icon()}
          <ChartOutline
            class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
          />
        {/snippet}
      </SidebarItem>
      <SidebarItem label="Kanban" {spanClass} active={false}>
        {#snippet icon()}
          <GridSolid
            class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
          />
        {/snippet}
        {#snippet subtext()}
          <span
            class="ms-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            >Pro</span
          >
        {/snippet}
      </SidebarItem>
      <SidebarItem label="Inbox" {spanClass} active={false}>
        {#snippet icon()}
          <MailBoxSolid
            class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
          />
        {/snippet}
        {#snippet subtext()}
          <span
            class="bg-primary-200 text-primary-600 dark:bg-primary-900 dark:text-primary-200 ms-3 inline-flex h-3 w-3 items-center justify-center rounded-full p-3 text-sm font-medium"
            >3</span
          >
        {/snippet}
      </SidebarItem>
    </SidebarGroup>
  </Sidebar>
  <div class="h-96 overflow-auto px-4 md:ml-64">
    {@render children()}
  </div>
</div>

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
