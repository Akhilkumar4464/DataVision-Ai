# Quick Push Commands

## After creating your GitHub repository, run these commands:

```powershell
# Navigate to project directory (if not already there)
cd "C:\Users\nites\OneDrive\Desktop\analysis sheets with ai"

# Step 6: Add GitHub remote (REPLACE YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Step 7: Verify remote was added
git remote -v

# Step 8: Ensure branch is named 'main'
git branch -M main

# Step 9: Push to GitHub
git push -u origin main
```

## Example:
If your GitHub username is `johndoe` and repository name is `datavision`:
```powershell
git remote add origin https://github.com/johndoe/datavision.git
git push -u origin main
```
