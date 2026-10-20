<script lang="ts">
  import { Card, Button, Label, Input, Checkbox } from "flowbite-svelte";
</script>

<div class="login-form">
  <Card class="mx-auto p-4 sm:p-6 md:p-8">
    <form class="flex flex-col space-y-6" method="POST">
      <h3 class="login-form-title text-xl font-medium text-gray-900 dark:text-white">
        Create your Euresis account
      </h3>

      <Label class="space-y-2">
        <span>Username</span>
        <Input type="text" name="username" placeholder="yourname" required />
      </Label>

      <Label class="space-y-2">
        <span>Email</span>
        <Input type="email" name="email" placeholder="name@company.com" required />
      </Label>

      <Label class="space-y-2">
        <span>Password</span>
        <Input type="password" name="password" placeholder="••••••••" required />
      </Label>

      <Label class="space-y-2">
        <span>Confirm password</span>
        <Input type="password" name="confirmPassword" placeholder="••••••••" required />
      </Label>

      <div class="flex items-start">
        <Checkbox name="terms" required>
          I agree to the
          <a href="/" class="text-primary-700 dark:text-primary-500 hover:underline">
            terms and conditions
          </a>
        </Checkbox>
      </div>

      <Button type="submit" class="w-full">Create account</Button>

      <div class="text-sm font-medium text-gray-500 dark:text-gray-300" style="text-align: center;">
        Already have an account?
        <a href="/signin" class="text-primary-700 dark:text-primary-500 hover:underline">
          Sign in
        </a>
      </div>
    </form>
  </Card>
</div>