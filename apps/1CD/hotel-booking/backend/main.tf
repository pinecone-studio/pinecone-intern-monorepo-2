terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

resource "vercel_project" "hotel-booking-backend" {
  name             = "hotel-booking-backend"
  build_command    = "nx build --skip-nx-cache hotel-booking-backend"
  output_directory = "./dist/apps/1CD/hotel-booking/backend/.next"
  framework        = "nextjs"
  team_id          = "team_0ASDilhqwPl5fll9OnzqDM30"
}
resource "vercel_project" "hotel-booking-backend" {
  name             = "hotel-booking-backend"
  build_command    = "nx build --skip-nx-cache hotel-booking-backend"
  output_directory = "./dist/apps/1CD/hotel-booking/backend/.next"
  framework        = "nextjs"
  team_id          = "team_0ASDilhqwPl5fll9OnzqDM30"
}
resource "vercel_project" "hotel-booking-backend" {
  name             = "hotel-booking-backend"
  build_command    = "nx build --skip-nx-cache hotel-booking-backend"
  output_directory = "./dist/apps/1CD/hotel-booking/backend/.next"
  framework        = "nextjs"
  team_id          = "team_0ASDilhqwPl5fll9OnzqDM30"
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
  team = "team_0ASDilhqwPl5fll9OnzqDM30"
}