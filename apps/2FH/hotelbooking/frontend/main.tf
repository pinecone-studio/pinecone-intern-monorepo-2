terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

resource "vercel_project" "hotelbooking-2fh-frontend-prod" {
  name             = "hotelbooking-2fh-frontend-prod"
  build_command    = "nx build --skip-nx-cache hotelbooking-2FH-frontend"
  output_directory = "./dist/apps/2FH/hotelbooking/frontend/.next"
  framework        = "nextjs"
  team_id          = "team_2TjV6297LA267czkNg94ORef"
}
resource "vercel_project" "hotelbooking-2fh-frontend-testing" {
  name             = "hotelbooking-2fh-frontend-testing"
  build_command    = "nx build --skip-nx-cache hotelbooking-2FH-frontend"
  output_directory = "./dist/apps/2FH/hotelbooking/frontend/.next"
  framework        = "nextjs"
  team_id          = "team_2TjV6297LA267czkNg94ORef"
}
resource "vercel_project" "hotelbooking-2fh-frontend-development" {
  name             = "hotelbooking-2fh-frontend-development"
  build_command    = "nx build --skip-nx-cache hotelbooking-2FH-frontend"
  output_directory = "./dist/apps/2FH/hotelbooking/frontend/.next"
  framework        = "nextjs"
  team_id          = "team_2TjV6297LA267czkNg94ORef"
}

variable "VERCEL_TOKEN" {
  type        = string
  description = "Optionally say something about this variable"
}

provider "vercel" {
  # Or omit this for the api_token to be read
  # from the VERCEL_API_TOKEN environment variable
  api_token = var.VERCEL_TOKEN

  # Optional default team for all resources
  team = "team_2TjV6297LA267czkNg94ORef"
}