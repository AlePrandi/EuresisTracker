<script lang="ts">
  import { Card, Button, Label, Input, Checkbox } from "flowbite-svelte";
</script>

<div class="login-form">
  <Card class="mx-auto p-4 sm:p-6 md:p-8">
    <form class="flex flex-col space-y-6" method="POST">
      <h3 class="login-form-title text-xl font-medium text-gray-900 dark:text-white">
        Sign in to Euresis
      </h3>

      <Label class="space-y-2">
        <span>Email</span>
        <Input type="email" name="email" placeholder="name@company.com" required />
      </Label>

      <Label class="space-y-2">
        <span>Your password</span>
        <Input type="password" name="password" placeholder="••••••••" required />
      </Label>

      <div class="flex items-start">
        <Checkbox name="remember">Remember me</Checkbox>
        <a href="/" class="text-primary-700 dark:text-primary-500 ms-auto text-sm hover:underline">
          Lost password?
        </a>
      </div>

      <Button type="submit" class="w-full">Login to your account</Button>

      <div class="text-sm font-medium text-gray-500 dark:text-gray-300" style="text-align: center;">
        Not registered?
        <a href="/signup" class="text-primary-700 dark:text-primary-500 hover:underline">
          Create account
        </a>
      </div>
    </form>
  </Card>
</div>