# Unused Files Analysis

## 🗑️ **Definitely Unused Files (Safe to Delete)**

### **Pages Not in Routes**
- `src/pages/FreeDataDashboard.tsx` - Not imported anywhere, not in App.tsx routes
- `src/pages/CostAnalytics.tsx` - Not imported anywhere, not in App.tsx routes  
- `src/pages/Security.tsx` - Not imported anywhere, not in App.tsx routes

### **Components Not Imported**
- `src/components/animation/CostSpikes.tsx` - Not imported anywhere
- `src/components/chat/MicButton.tsx` - Not imported anywhere
- `src/components/AnomalyImpactSummary.tsx` - Only imported by AnomaliesList but AnomaliesList itself may not be used

### **Hooks Not Used**
- `src/hooks/useSummaryData.ts` - Not imported anywhere

### **Library Files Not Used**
- `src/lib/testApi.ts` - Not imported anywhere
- `src/lib/contact.ts` - Not imported anywhere
- `src/lib/lexUtterance.ts` - Not imported anywhere

## ⚠️ **Potentially Unused Files (Check Before Deleting)**

### **Components That Might Be Used**
- `src/components/BulkRemediationPreview.tsx` - Used in Guardrails.tsx
- `src/components/ComplianceChecklist.tsx` - Used in Guardrails.tsx
- `src/components/animation/HoloRadar.tsx` - Used in FAQ.tsx
- `src/components/settings/MotionSettings.tsx` - Used in Header.tsx

### **Files That Might Be Used Indirectly**
- `src/lib/motionStore.ts` - Might be used by MotionSettings
- `src/lib/severityUtils.ts` - Used in Guardrails.tsx
- `src/lib/guardrails.ts` - Used in Guardrails.tsx

## 📊 **Root Directory Files**

### **Documentation Files (Keep)**
- All `.md` files are documentation and should be kept
- `env.example` - Template file, keep
- `test-endpoints.py` - Testing script, keep

### **Build/Deploy Files (Keep)**
- `deploy-lambda.bat` / `deploy-lambda.sh` - Deployment scripts, keep
- `setup-*.bat` / `setup-*.sh` - Setup scripts, keep
- `lambda-deployment*.zip` - Deployment packages, keep

### **Config Files (Keep)**
- All config files (package.json, vite.config.ts, etc.) - Keep

## 🎯 **Recommended Actions**

### **Safe to Delete Immediately:**
```bash
# These files are definitely not used
rm src/pages/FreeDataDashboard.tsx
rm src/pages/CostAnalytics.tsx  
rm src/pages/Security.tsx
rm src/components/animation/CostSpikes.tsx
rm src/components/chat/MicButton.tsx
rm src/hooks/useSummaryData.ts
rm src/lib/testApi.ts
rm src/lib/contact.ts
rm src/lib/lexUtterance.ts
```

### **Check Before Deleting:**
- `src/components/AnomalyImpactSummary.tsx` - Check if AnomaliesList is actually used
- `src/lib/motionStore.ts` - Check if MotionSettings uses it

## 📈 **Impact of Cleanup**

### **Bundle Size Reduction:**
- Removing unused pages: ~50-100KB
- Removing unused components: ~30-50KB  
- Removing unused lib files: ~20-30KB
- **Total estimated reduction: ~100-180KB**

### **Maintenance Benefits:**
- Cleaner codebase
- Easier to navigate
- Reduced confusion
- Faster builds

## 🔍 **How to Verify Before Deleting**

1. **Search for imports:**
   ```bash
   grep -r "FreeDataDashboard" src/
   grep -r "CostAnalytics" src/
   grep -r "Security.tsx" src/
   ```

2. **Check if components are used:**
   ```bash
   grep -r "CostSpikes" src/
   grep -r "MicButton" src/
   ```

3. **Test after deletion:**
   - Run `npm run build` to ensure no build errors
   - Test all pages to ensure nothing breaks

## ✅ **Summary**

**Definitely unused (9 files):**
- 3 unused pages
- 2 unused components  
- 1 unused hook
- 3 unused lib files

**Total cleanup potential: ~100-180KB bundle reduction**

The unused files are primarily legacy components and pages that were created but never integrated into the main application flow.

