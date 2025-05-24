terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}
resource "vercel_project" "hotel-backend-prod" {
  name             = "hotel-backend-prod"
  build_command    = "nx build --skip-nx-cache hotel-backend"
  output_directory = "./dist/apps/2CD/hotel/backend/.next"
  framework        = "nextjs"
  team_id          = "team_itOWBF7o0k0pUnW6N52B1l0d"
  serverless_function_region = "sfo1"
}
resource "vercel_project" "hotel-backend-testing" {
  name             = "hotel-backend-testing"
  build_command    = "nx build --skip-nx-cache hotel-backend"
  output_directory = "./dist/apps/2CD/hotel/backend/.next"
  framework        = "nextjs"
  team_id          = "team_itOWBF7o0k0pUnW6N52B1l0d"
  serverless_function_region = "sfo1"
}
variable "VERCEL_TOKEN" {
  type        = string
  description = "Optionally say something about this variable"
}
provider "vercel" {
  # Or omit this for the api_token to be read
  # from the VERCEL_API_TOKEN environment variable
  api_token ="ph38eHU5EmADngqftlB1YfBr"

  # Optional default team for all resources
  team = "team_itOWBF7o0k0pUnW6N52B1l0d"
}