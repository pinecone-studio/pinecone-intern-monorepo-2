terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

resource "vercel_project" "tinder-frontend-prod" {
  name             = "tinder-frontend-prod"
  build_command    = "nx build --skip-nx-cache tinder-frontend"
  output_directory = "./dist/apps/2CD/tinder/frontend/.next"
  framework        = "nextjs"
  team_id          = "team_1b5tGWrRixp4WvAsEStkE8rv"
}
resource "vercel_project" "tinder-frontend-testing" {
  name             = "tinder-frontend-testing"
  build_command    = "nx build --skip-nx-cache tinder-frontend"
  output_directory = "./dist/apps/2CD/tinder/frontend/.next"
  framework        = "nextjs"
  team_id          = "team_1b5tGWrRixp4WvAsEStkE8rv"
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
  team = "team_1b5tGWrRixp4WvAsEStkE8rv"
}