# Guardrails Setup Guide

## Overview

The Guardrails page provides comprehensive compliance monitoring across security frameworks (CIS, NIST, PCI) with the ability to drill into failing controls, trigger remediation actions, view evidence, and get AI-powered recommendations.

## Features Implemented

### ✅ Core Functionality
- **Framework Selection**: Switch between CIS, NIST, and PCI compliance frameworks
- **Compliance Dashboard**: Score visualization with pass/fail/warn statistics
- **Control Management**: Grouped view of controls by status (FAIL/WARN/PASS)
- **Resource Details**: Drill-down view of individual resources per control
- **Remediation Actions**: Trigger remediation for individual resources or entire controls
- **Evidence Viewer**: Modal display of compliance evidence and findings
- **AI Assistant Integration**: Context-aware chat with JohnnyCloud for recommendations

### ✅ UI Components
- **Responsive Design**: Works on desktop and mobile devices
- **Status Indicators**: Color-coded compliance status throughout the interface
- **Interactive Controls**: Clickable control cards with selection states
- **Loading States**: Proper loading indicators and error handling
- **Modal Dialogs**: Evidence viewer with structured data display

## Environment Configuration

### Required Environment Variables

Add these to your `.env.local` file:

```bash
# Guardrails API Configuration
VITE_GUARDRAILS_API=https://<your-api>/guardrails

# Timeline API Configuration (optional)
VITE_TIMELINE_API=https://<your-api>/timeline
```

### Mock Data Mode

If `VITE_GUARDRAILS_API` is not set or the API is unavailable, the page will automatically use mock data with realistic compliance scenarios:

- **CIS Framework**: 74% compliance score with 6 failed controls
- **NIST Framework**: 68% compliance score with 8 failed controls  
- **PCI Framework**: 82% compliance score with 3 failed controls

## API Endpoints

### Guardrails API (`VITE_GUARDRAILS_API`)

#### GET `/summary?framework={CIS|NIST|PCI}`
Returns compliance summary for the specified framework.

**Response Format:**
```json
{
  "framework": "CIS",
  "score": 74,
  "totals": { "pass": 18, "fail": 6, "warn": 3 },
  "controls": [
    {
      "id": "CIS-1.1",
      "title": "S3 Block Public Access",
      "status": "FAIL",
      "pass": 0,
      "fail": 3,
      "warn": 0,
      "resources": [
        {
          "arn": "arn:aws:s3:::demo-bucket",
          "service": "s3",
          "region": "us-east-1",
          "findingId": "arn:aws:securityhub:...",
          "note": "Public ACL"
        }
      ]
    }
  ]
}
```

#### POST `/remediate`
Triggers remediation for a control or specific resource.

**Request Body:**
```json
{
  "controlId": "CIS-1.1",
  "resourceArn": "arn:aws:s3:::demo-bucket", // optional
  "dryRun": true
}
```

**Response Format:**
```json
{
  "actionId": "uuid",
  "status": "QUEUED",
  "message": "Remediation action queued successfully"
}
```

#### GET `/evidence?control={controlId}`
Retrieves evidence and findings for a specific control.

**Response Format:**
```json
{
  "controlId": "CIS-1.1",
  "generatedAt": "2024-01-01T00:00:00Z",
  "items": [
    {
      "type": "scan_result",
      "timestamp": "2024-01-01T00:00:00Z",
      "details": "Compliance scan completed",
      "findings": ["Finding 1", "Finding 2"],
      "recommendations": ["Recommendation 1"]
    }
  ]
}
```

## Usage Guide

### 1. Accessing the Guardrails Page
- Navigate to `/guardrails` or click "Guardrails" in the top navigation
- The page loads with CIS framework by default

### 2. Framework Selection
- Use the framework dropdown to switch between CIS, NIST, and PCI
- The page automatically refreshes data when framework changes
- First failing control is auto-selected for immediate attention

### 3. Compliance Overview
- **Score Card**: Shows overall compliance percentage with color coding
- **Summary Stats**: Displays pass/fail/warn counts
- **Status Breakdown**: Visual indicators for each control category

### 4. Control Management
- **Failed Controls**: Red-highlighted section with immediate attention items
- **Warnings**: Amber-highlighted section with potential issues
- **Passed Controls**: Green-highlighted section with compliant items
- Click any control to view detailed resource information

### 5. Resource Remediation
- **Individual Remediation**: Click "Remediate" on specific resources
- **Bulk Remediation**: Use "Remediate All Resources" for entire controls
- **Dry Run Mode**: All remediation actions are currently in dry-run mode
- **Status Tracking**: Loading indicators during remediation processes

### 6. Evidence Review
- Click "Evidence" button to view compliance evidence
- Modal displays structured findings and recommendations
- Includes timestamps and detailed analysis data

### 7. AI Assistant Integration
- Click "Ask JohnnyCloud" for AI-powered recommendations
- Sends current compliance context to the chat API
- Receives prioritized remediation suggestions and improvement plans
- Voice synthesis available for responses

## Technical Implementation

### File Structure
```
src/
├── lib/
│   └── guardrails.ts          # API functions and types
├── pages/
│   └── Guardrails.tsx         # Main page component
└── components/
    └── layout/
        └── Header.tsx         # Updated with Guardrails nav link
```

### Key Components

#### `src/lib/guardrails.ts`
- **Types**: Framework, ControlStatus, GuardrailsSummary, etc.
- **API Functions**: getSummary(), remediate(), getEvidence()
- **Mock Data**: Comprehensive fallback data for all frameworks
- **Error Handling**: Graceful fallback to mock data on API errors

#### `src/pages/Guardrails.tsx`
- **State Management**: Framework selection, loading states, error handling
- **UI Components**: Status cards, control lists, resource tables
- **Interactive Features**: Selection, remediation, evidence viewing
- **AI Integration**: Context-aware chat with compliance data

### Styling
- Uses existing Tailwind CSS classes and design system
- Consistent with JohnnyCloud branding and color scheme
- Responsive design with mobile-first approach
- Status-based color coding throughout the interface

## Testing

### Manual Testing Checklist

1. **Page Loading**
   - [ ] Page loads without errors
   - [ ] Mock data displays correctly
   - [ ] Framework selector works

2. **Framework Switching**
   - [ ] CIS framework loads with correct data
   - [ ] NIST framework loads with correct data
   - [ ] PCI framework loads with correct data
   - [ ] Selection resets when switching frameworks

3. **Control Interaction**
   - [ ] Controls are grouped by status correctly
   - [ ] Clicking controls shows resource details
   - [ ] Selection state is visually indicated
   - [ ] Auto-selection of first failing control works

4. **Remediation Actions**
   - [ ] Individual resource remediation works
   - [ ] Bulk remediation works
   - [ ] Loading states display correctly
   - [ ] Success messages show appropriate information

5. **Evidence Viewer**
   - [ ] Modal opens when clicking Evidence
   - [ ] Data loads and displays correctly
   - [ ] Modal closes properly
   - [ ] Error states handle gracefully

6. **AI Integration**
   - [ ] Ask JohnnyCloud button works
   - [ ] Context is sent correctly
   - [ ] Response is displayed appropriately
   - [ ] Error handling works

### API Testing
- Set `VITE_GUARDRAILS_API` to test with real API
- Verify all endpoints return expected data formats
- Test error scenarios (network failures, invalid responses)
- Confirm fallback to mock data works correctly

## Deployment Notes

1. **Environment Variables**: Ensure `VITE_GUARDRAILS_API` is set in production
2. **API Endpoints**: Verify all guardrails API endpoints are deployed and accessible
3. **CORS Configuration**: Ensure API allows requests from your frontend domain
4. **Authentication**: Add authentication headers if required by your API
5. **Error Monitoring**: Monitor for API failures and implement appropriate alerting

## Future Enhancements

### Potential Improvements
- **Real-time Updates**: WebSocket integration for live compliance status
- **Bulk Operations**: Multi-control remediation actions
- **Export Functionality**: Download compliance reports
- **Historical Data**: Compliance trend analysis over time
- **Custom Frameworks**: Support for organization-specific compliance frameworks
- **Integration**: Connect with existing security tools and SIEM systems

### API Enhancements
- **Streaming Responses**: Real-time remediation status updates
- **Batch Operations**: Multiple control remediation in single request
- **Advanced Filtering**: Search and filter controls by various criteria
- **Audit Logging**: Track all remediation actions and evidence access




