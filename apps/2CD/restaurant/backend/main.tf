terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

resource "vercel_project" "restaurant-backend-prod" {
  name             = "restaurant-backend-prod"
  build_command    = "nx build --skip-nx-cache restaurant-backend"
  output_directory = "./dist/apps/2CD/restaurant/backend/.next"
  framework        = "nextjs"
  team_id          = "team_HbSZDXUZ2D5X62DiPHXnFXAn"
}
resource "vercel_project" "restaurant-backend-testing" {
  name             = "restaurant-backend-testing"
  build_command    = "nx build --skip-nx-cache restaurant-backend"
  output_directory = "./dist/apps/2CD/restaurant/backend/.next"
  framework        = "nextjs"
  team_id          = "team_HbSZDXUZ2D5X62DiPHXnFXAn"
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
  team = "team_HbSZDXUZ2D5X62DiPHXnFXAn"
}