terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

resource "vercel_project" "instagram-prod" {
  name             = "instagram-prod"
  build_command    = "nx build --skip-nx-cache instagram"
  output_directory = "./dist/apps/instagram/frontEnd/.next"
  framework        = "nextjs"
  team_id          = "team_KEsgJYvEcKmXZA6t8H4EyvFY"
}
resource "vercel_project" "instagram-testing" {
  name             = "instagram-testing"
  build_command    = "nx build --skip-nx-cache instagram"
  output_directory = "./dist/apps/instagram/frontEnd/.next"
  framework        = "nextjs"
  team_id          = "team_KEsgJYvEcKmXZA6t8H4EyvFY"
}
resource "vercel_project" "instagram-dev" {
  name             = "instagram-dev"
  build_command    = "nx build --skip-nx-cache instagram"
  output_directory = "./dist/apps/instagram/frontEnd/.next"
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