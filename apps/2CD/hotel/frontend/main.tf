terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

resource "vercel_project" "hotel-frontend-prod" {
  name             = "hotel-frontend-prod"
  build_command    = "nx build --skip-nx-cache hotel-frontend"
  output_directory = "./dist/apps/2CD/hotel/frontend/.next"
  framework        = "nextjs"
  team_id          = "team_itOWBF7o0k0pUnW6N52B1l0d"
}
resource "vercel_project" "hotel-frontend-testing" {
  name             = "hotel-frontend-testing"
  build_command    = "nx build --skip-nx-cache hotel-frontend"
  output_directory = "./dist/apps/2CD/hotel/frontend/.next"
  framework        = "nextjs"
  team_id          = "team_itOWBF7o0k0pUnW6N52B1l0d"
}



provider "vercel" {
  # Or omit this for the api_token to be read
  # from the VERCEL_API_TOKEN environment variable
  api_token ="ph38eHU5EmADngqftlB1YfBr"

  # Optional default team for all resources
  team = "team_itOWBF7o0k0pUnW6N52B1l0d"
}