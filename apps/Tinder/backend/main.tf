terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

resource "vercel_project" "tinder_2025_2FH_development" {
name = "2025-2fh-tinder-development"
  build_command    = "nx build --skip-nx-cache 2025-2FH-Tinder"
  output_directory = "./dist/apps/Tinder/frontend/.next"
  framework        = "nextjs"
  team_id          = "team_qW7CWHt1mKoH5ti6SFJsQhC7"
}
resource "vercel_project" "tinder_2025_2FH_prod" {
name = "2025-hf-tinder-prod"
  build_command    = "nx build --skip-nx-cache 2025-HF-Tinder"
  output_directory = "./dist/apps/Tinder/backend/.next"
  framework        = "nextjs"
  team_id          = "team_qW7CWHt1mKoH5ti6SFJsQhC7"
}
resource "vercel_project" "tinder_2025_2FH_testing" {
name = "2025-hf-tinder-testing"
  build_command    = "nx build --skip-nx-cache 2025-HF-Tinder"
  output_directory = "./dist/apps/Tinder/backend/.next"
  framework        = "nextjs"
  team_id          = "team_qW7CWHt1mKoH5ti6SFJsQhC7"
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
  team = "team_qW7CWHt1mKoH5ti6SFJsQhC7"
}