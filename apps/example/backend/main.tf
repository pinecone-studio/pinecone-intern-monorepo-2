terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

resource "vercel_project" "pinecone-intern-example-backend-prod" {
  name             = "pinecone-intern-example-backend-prod"
  build_command    = "nx build --skip-nx-cache example-backend"
  output_directory = "./dist/apps/example/backend/.next"
  framework        = "nextjs"
  team_id          = "team_0ASDilhqwPl5fll9OnzqDM30"
}
resource "vercel_project" "pinecone-intern-example-backend-testing" {
  name             = "pinecone-intern-example-backend-testing"
  build_command    = "nx build --skip-nx-cache example-backend"
  output_directory = "./dist/apps/example/backend/.next"
  framework        = "nextjs"
  team_id          = "team_0ASDilhqwPl5fll9OnzqDM30"
}
resource "vercel_project" "pinecone-intern-example-backend-dev" {
  name             = "pinecone-intern-example-backend-dev"
  build_command    = "nx build --skip-nx-cache example-backend"
  output_directory = "./dist/apps/example/backend/.next"
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