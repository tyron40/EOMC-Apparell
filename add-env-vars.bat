@echo off
echo Adding Supabase credentials to Vercel...
echo.

echo Adding VITE_SUPABASE_URL...
echo https://yteiumctafklsjfhbijf.supabase.co | npx vercel env add VITE_SUPABASE_URL production --yes

echo.
echo Adding VITE_SUPABASE_ANON_KEY...
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWl1bWN0YWZrbHNqZmhiaWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTQxMTcsImV4cCI6MjA4NjA3MDExN30.Sqoq8RPI8guW0fp2KYncZnyHCqBis5qVxOWCGMccSlA | npx vercel env add VITE_SUPABASE_ANON_KEY production --yes

echo.
echo Adding to Preview environment...
echo https://yteiumctafklsjfhbijf.supabase.co | npx vercel env add VITE_SUPABASE_URL preview --yes
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWl1bWN0YWZrbHNqZmhiaWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTQxMTcsImV4cCI6MjA4NjA3MDExN30.Sqoq8RPI8guW0fp2KYncZnyHCqBis5qVxOWCGMccSlA | npx vercel env add VITE_SUPABASE_ANON_KEY preview --yes

echo.
echo Adding to Development environment...
echo https://yteiumctafklsjfhbijf.supabase.co | npx vercel env add VITE_SUPABASE_URL development --yes
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWl1bWN0YWZrbHNqZmhiaWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTQxMTcsImV4cCI6MjA4NjA3MDExN30.Sqoq8RPI8guW0fp2KYncZnyHCqBis5qVxOWCGMccSlA | npx vercel env add VITE_SUPABASE_ANON_KEY development --yes

echo.
echo Environment variables added successfully!
echo.
echo Now deploying to production...
npx vercel --prod

echo.
echo Deployment complete!
pause
