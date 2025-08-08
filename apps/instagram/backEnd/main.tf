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
  description = "Vercel API Token"
}

provider "vercel" {
  api_token = var.VERCEL_TOKEN
  #team = "team_KEsgJYvEcKmXZA6t8H4EyvFY"
}

resource "vercel_project" "instagram_be_prod" {
  name             = "instagram-be-prod"
  build_command    = "nx build --skip-nx-cache instagram-be"
  install_command  = "npm install"
  output_directory = "" # backend бол хоосон байж болно
  framework        = "nextjs"
   #team_id = "team_KEsgJYvEcKmXZA6t8H4EyvFY"
}

resource "vercel_project" "instagram_be_testing" {
  name             = "instagram-be-testing"
  build_command    = "nx build --skip-nx-cache instagram-be"
  install_command  = "npm install"
  output_directory = ""
   framework       = "nextjs"
  #team_id        = "team_KEsgJYvEcKmXZA6t8H4EyvFY"
}
resource "vercel_project" "pinecone-intern-example-backend-dev" {
  name             = "instagram-be-dev"
  build_command    = "nx build --skip-nx-cache instagram-be"
  install_command  = "npm install"
  output_directory = ""
   framework       = "nextjs"
  #team_id        = "team_KEsgJYvEcKmXZA6t8H4EyvFY"
}
