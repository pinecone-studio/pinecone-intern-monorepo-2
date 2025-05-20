terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

resource "vercel_project" "Concert-2025-2CD-prod" {
  name             = "Concert-2025-2CD-prod"
  build_command    = "nx build --skip-nx-cache Concert-2025-2CD"
  output_directory = "./dist/apps/2CD/concert/backend/.next"
  framework        = "nextjs"
  team_id          = "team_0ASDilhqwPl5fll9OnzqDM30"
}
resource "vercel_project" "Concert-2025-2CD-testing" {
  name             = "Concert-2025-2CD-testing"
  build_command    = "nx build --skip-nx-cache Concert-2025-2CD"
  output_directory = "./dist/apps/2CD/concert/backend/.next"
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