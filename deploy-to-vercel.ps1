# EOMC Deployment Script - Add Environment Variables and Deploy

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EOMC Vercel Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Supabase credentials
$SUPABASE_URL = "https://yteiumctafklsjfhbijf.supabase.co"
$SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWl1bWN0YWZrbHNqZmhiaWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTQxMTcsImV4cCI6MjA4NjA3MDExN30.Sqoq8RPI8guW0fp2KYncZnyHCqBis5qVxOWCGMccSlA"

Write-Host "Step 1: Adding VITE_SUPABASE_URL to Production..." -ForegroundColor Yellow
$SUPABASE_URL | npx vercel env add VITE_SUPABASE_URL production

Write-Host ""
Write-Host "Step 2: Adding VITE_SUPABASE_ANON_KEY to Production..." -ForegroundColor Yellow
$SUPABASE_KEY | npx vercel env add VITE_SUPABASE_ANON_KEY production

Write-Host ""
Write-Host "Step 3: Adding VITE_SUPABASE_URL to Preview..." -ForegroundColor Yellow
$SUPABASE_URL | npx vercel env add VITE_SUPABASE_URL preview

Write-Host ""
Write-Host "Step 4: Adding VITE_SUPABASE_ANON_KEY to Preview..." -ForegroundColor Yellow
$SUPABASE_KEY | npx vercel env add VITE_SUPABASE_ANON_KEY preview

Write-Host ""
Write-Host "Step 5: Adding VITE_SUPABASE_URL to Development..." -ForegroundColor Yellow
$SUPABASE_URL | npx vercel env add VITE_SUPABASE_URL development

Write-Host ""
Write-Host "Step 6: Adding VITE_SUPABASE_ANON_KEY to Development..." -ForegroundColor Yellow
$SUPABASE_KEY | npx vercel env add VITE_SUPABASE_ANON_KEY development

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Environment variables added successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Step 7: Deploying to Production..." -ForegroundColor Yellow
npx vercel --prod

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your site is now live at: https://eomc.shop" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Visit https://eomc.shop/admin/setup to create your admin account" -ForegroundColor White
Write-Host "2. Login at https://eomc.shop/login" -ForegroundColor White
Write-Host "3. Start adding products and content!" -ForegroundColor White
Write-Host ""
