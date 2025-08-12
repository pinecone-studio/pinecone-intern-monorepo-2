terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

resource "vercel_project" "fh2-Tinder-Frontend-development" {
  name             = "fh2-tinder-frontend-development"
  build_command    = "nx build --skip-nx-cache 2FH-tinder-frontend"
  output_directory = "./dist/apps/2FH/tinder/frontend/.next"
  framework        = "nextjs"
  team_id          = "team_lBZB5j8sdaFCwB99JPeeSTzr"
}
resource "vercel_project" "fh2-Tinder-Frontend-prod" {
  name             = "fh2-tinder-frontend-prod"
  build_command    = "nx build --skip-nx-cache 2FH-tinder-frontend"
  output_directory = "./dist/apps/2FH/tinder/frontend/.next"
  framework        = "nextjs"
  team_id          = "team_lBZB5j8sdaFCwB99JPeeSTzr"
}
resource "vercel_project" "fh2-Tinder-Frontend-testing" {
  name             = "fh2-tinder-frontend-testing"
  build_command    = "nx build --skip-nx-cache 2FH-tinder-frontend"
  output_directory = "./dist/apps/2FH/tinder/frontend/.next"
  framework        = "nextjs"
  team_id          = "team_lBZB5j8sdaFCwB99JPeeSTzr"
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
  team = "team_lBZB5j8sdaFCwB99JPeeSTzr"
}