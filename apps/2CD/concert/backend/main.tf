terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

variable "VERCEL_TOKEN" {
  type        = string
  description = "Vercel API token for authentication"
}

provider "vercel" {
  api_token = "wo6r3mEUqYSKN7pT5CGE4ucJ"
  team      = "team_dW0Tpe7DOfLR9xLRD2tSqkVp"
}

resource "vercel_project" "concert_2025_2cd_prod" {
  name                     = "concert-2025-2cd-prod"
  build_command            = "nx build --skip-nx-cache concert-2025-2cd"
  output_directory         = "./dist/apps/2cd/concert/backend/.next"
  framework                = "nextjs"
  team_id                  = "team_dW0Tpe7DOfLR9xLRD2tSqkVp"
  serverless_function_region = "sfo1"
}

resource "vercel_project" "concert_2025_2cd_testing" {
  name                     = "concert-2025-2cd-testing"
  build_command            = "nx build --skip-nx-cache concert-2025-2cd"
  output_directory         = "./dist/apps/2cd/concert/backend/.next"
  framework                = "nextjs"
  team_id                  = "team_dW0Tpe7DOfLR9xLRD2tSqkVp"
  serverless_function_region = "sfo1"
}

resource "vercel_project" "concert_2025_2cd_preview" {
  name                     = "concert-2025-2cd-preview"
  build_command            = "nx build --skip-nx-cache concert-2025-2cd"
  output_directory         = "./dist/apps/2cd/concert/backend/.next"
  framework                = "nextjs"
  team_id                  = "team_dW0Tpe7DOfLR9xLRD2tSqkVp"
  serverless_function_region = "sfo1"
}
