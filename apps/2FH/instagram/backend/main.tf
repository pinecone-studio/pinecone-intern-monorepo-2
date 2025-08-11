terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

resource "vercel_project" "backend-prod" {
  name             = "backend-prod"
  build_command    = "nx build --skip-nx-cache backend"
  output_directory = "./dist/apps/2FH/instagram/backend/.next"
  framework        = "nextjs"
  team_id          = "team_KEsgJYvEcKmXZA6t8H4EyvFY"
}
resource "vercel_project" "backend-dev" {
  name             = "backend-dev"
  build_command    = "nx build --skip-nx-cache backend"
  output_directory = "./dist/apps/2FH/instagram/backend/.next"
  framework        = "nextjs"
  team_id          = "team_KEsgJYvEcKmXZA6t8H4EyvFY"
}
resource "vercel_project" "backend-testing" {
  name             = "backend-testing"
  build_command    = "nx build --skip-nx-cache backend"
  output_directory = "./dist/apps/2FH/instagram/backend/.next"
  framework        = "nextjs"
  team_id          = "team_KEsgJYvEcKmXZA6t8H4EyvFY"
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
  team = "team_KEsgJYvEcKmXZA6t8H4EyvFY"
}