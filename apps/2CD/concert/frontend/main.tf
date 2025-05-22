terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

resource "vercel_project" "concert-client-2025-2cd-prod" {
  name             = "concert-client-2025-2cd-prod"
  build_command    = "nx build --skip-nx-cache concert-client-2025-2cd"
  output_directory = "./dist/apps/2CD/concert/frontend/.next"
  framework        = "nextjs"
  team_id          = "team_dW0Tpe7DOfLR9xLRD2tSqkVp"
}
resource "vercel_project" "concert-client-2025-2cd-testing" {
  name             = "concert-client-2025-2cd-testing"
  build_command    = "nx build --skip-nx-cache concert-client-2025-2cd"
  output_directory = "./dist/apps/2CD/concert/frontend/.next"
  framework        = "nextjs"
  team_id          = "team_dW0Tpe7DOfLR9xLRD2tSqkVp"
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
  team = "team_dW0Tpe7DOfLR9xLRD2tSqkVp"
}