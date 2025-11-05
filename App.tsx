import React, { useState } from ‘react’;
import { Upload, FileText, TrendingUp, AlertCircle, CheckCircle, Download, BarChart3 } from ‘lucide-react’;

const EVMAnalyzerApp = () => {
const [projectData, setProjectData] = useState(null);
const [analysis, setAnalysis] = useState(null);
const [activeTab, setActiveTab] = useState(‘upload’);
const [showExportMenu, setShowExportMenu] = useState(false);
const [showApiModal, setShowApiModal] = useState(false);
const [apiConfig, setApiConfig] = useState({
platform: ‘’,
apiKey: ‘’,
projectId: ‘’,
boardId: ‘’,
workspace: ‘’
});
const [isConnecting, setIsConnecting] = useState(false);

const sampleProject = {
name: “Website Redesign Project”,
budget: 100000,
duration: 12,
currentWeek: 6,
tasks: [
{ id: 1, name: “Requirements Gathering”, planned: 10000, actual: 9500, complete: 100 },
{ id: 2, name: “Design Mockups”, planned: 15000, actual: 16000, complete: 100 },
{ id: 3, name: “Frontend Development”, planned: 25000, actual: 18000, complete: 60 },
{ id: 4, name: “Backend Development”, planned: 20000, actual: 12000, complete: 50 },
{ id: 5, name: “Testing”, planned: 15000, actual: 0, complete: 0 },
{ id: 6, name: “Deployment”, planned: 15000, actual: 0, complete: 0 }
]
};

const calculateEVM = (project) => {
const totalBudget = project.budget;
const totalDuration = project.duration;
const currentPeriod = project.currentWeek;

```
// Calculate Planned Value (PV)
const PV = (totalBudget * currentPeriod) / totalDuration;

// Calculate Earned Value (EV)
let EV = 0;
project.tasks.forEach(task => {
  EV += (task.planned * task.complete) / 100;
});

// Calculate Actual Cost (AC)
let AC = 0;
project.tasks.forEach(task => {
  AC += task.actual;
});

// Calculate variances
const CV = EV - AC; // Cost Variance
const SV = EV - PV; // Schedule Variance

// Calculate indices
const CPI = AC > 0 ? EV / AC : 0; // Cost Performance Index
const SPI = PV > 0 ? EV / PV : 0; // Schedule Performance Index

// Calculate forecasts
const EAC = CPI > 0 ? totalBudget / CPI : totalBudget; // Estimate at Completion
const ETC = EAC - AC; // Estimate to Complete
const VAC = totalBudget - EAC; // Variance at Completion
const TCPI = (totalBudget - EV) / (totalBudget - AC); // To Complete Performance Index

return {
  PV: Math.round(PV),
  EV: Math.round(EV),
  AC: Math.round(AC),
  CV: Math.round(CV),
  SV: Math.round(SV),
  CPI: CPI.toFixed(2),
  SPI: SPI.toFixed(2),
  EAC: Math.round(EAC),
  ETC: Math.round(ETC),
  VAC: Math.round(VAC),
  TCPI: TCPI.toFixed(2),
  percentComplete: Math.round((EV / totalBudget) * 100),
  percentSchedule: Math.round((currentPeriod / totalDuration) * 100)
};
```

};

const generateAIInsights = (metrics, project) => {
const insights = [];

```
// Cost performance insights
if (metrics.CPI < 0.9) {
  insights.push({
    type: 'critical',
    category: 'Cost',
    message: `Project is significantly over budget. For every dollar spent, only $${metrics.CPI} of value is earned.`,
    recommendation: 'Immediate action required: Review resource allocation, reduce scope, or increase budget.'
  });
} else if (metrics.CPI < 1.0) {
  insights.push({
    type: 'warning',
    category: 'Cost',
    message: `Project is trending over budget with a CPI of ${metrics.CPI}.`,
    recommendation: 'Monitor costs closely and optimize resource utilization.'
  });
} else {
  insights.push({
    type: 'success',
    category: 'Cost',
    message: `Project is under budget with excellent cost performance (CPI: ${metrics.CPI}).`,
    recommendation: 'Maintain current cost management practices.'
  });
}

// Schedule performance insights
if (metrics.SPI < 0.9) {
  insights.push({
    type: 'critical',
    category: 'Schedule',
    message: `Project is significantly behind schedule (SPI: ${metrics.SPI}).`,
    recommendation: 'Consider adding resources, reducing scope, or extending timeline.'
  });
} else if (metrics.SPI < 1.0) {
  insights.push({
    type: 'warning',
    category: 'Schedule',
    message: `Project is behind schedule with an SPI of ${metrics.SPI}.`,
    recommendation: 'Expedite critical path activities and remove blockers.'
  });
} else {
  insights.push({
    type: 'success',
    category: 'Schedule',
    message: `Project is ahead of schedule (SPI: ${metrics.SPI}).`,
    recommendation: 'Continue monitoring to maintain pace.'
  });
}

// Budget forecast insights
if (metrics.VAC < -10000) {
  insights.push({
    type: 'critical',
    category: 'Forecast',
    message: `Project forecasted to exceed budget by $${Math.abs(metrics.VAC).toLocaleString()}.`,
    recommendation: 'Implement cost reduction measures immediately or request additional funding.'
  });
} else if (metrics.VAC < 0) {
  insights.push({
    type: 'warning',
    category: 'Forecast',
    message: `Minor budget overrun expected: $${Math.abs(metrics.VAC).toLocaleString()}.`,
    recommendation: 'Monitor remaining work and control discretionary spending.'
  });
}

// TCPI insights
if (metrics.TCPI > 1.1) {
  insights.push({
    type: 'critical',
    category: 'Performance',
    message: `Remaining work requires ${(metrics.TCPI * 100).toFixed(0)}% efficiency to stay on budget.`,
    recommendation: 'This may be unrealistic. Consider budget revision or scope reduction.'
  });
}

// Task-specific insights
const behindTasks = project.tasks.filter(t => {
  const expectedComplete = (project.currentWeek / project.duration) * 100;
  return t.complete < expectedComplete - 10;
});

if (behindTasks.length > 0) {
  insights.push({
    type: 'warning',
    category: 'Tasks',
    message: `${behindTasks.length} task(s) significantly behind schedule: ${behindTasks.map(t => t.name).join(', ')}.`,
    recommendation: 'Focus resources on critical path items to recover schedule.'
  });
}

return insights;
```

};

const handleLoadSample = () => {
setProjectData(sampleProject);
const metrics = calculateEVM(sampleProject);
const insights = generateAIInsights(metrics, sampleProject);
setAnalysis({ metrics, insights });
setActiveTab(‘dashboard’);
};

const handleFileUpload = (event) => {
const file = event.target.files[0];
if (file) {
alert(‘In a production environment, this would parse CSV/Excel files. For now, use the sample data.’);
handleLoadSample();
}
};

const handleApiConnect = async () => {
setIsConnecting(true);

```
// Simulate API connection
setTimeout(() => {
  // In production, this would make actual API calls
  alert(`API Connection Simulated:\n\nPlatform: ${apiConfig.platform}\nProject/Board ID: ${apiConfig.projectId || apiConfig.boardId}\n\nIn production, this would:\n1. Authenticate with ${apiConfig.platform}\n2. Fetch real-time project data\n3. Auto-sync task updates\n4. Pull cost and progress data\n\nFor now, loading sample data...`);
 
  handleLoadSample();
  setShowApiModal(false);
  setIsConnecting(false);
 
  // Reset form
  setApiConfig({
    platform: '',
    apiKey: '',
    projectId: '',
    boardId: '',
    workspace: ''
  });
}, 1500);
```

};

const getApiInstructions = (platform) => {
const instructions = {
‘monday’: {
name: ‘Monday.com’,
steps: [
‘Go to your Monday.com profile’,
‘Click on “Developers” → “My Access Tokens”’,
‘Generate a new API token’,
‘Copy the token and your board ID’
],
fields: [‘API Key’, ‘Board ID’, ‘Workspace ID’]
},
‘trello’: {
name: ‘Trello’,
steps: [
‘Visit https://trello.com/app-key’,
‘Copy your API Key’,
‘Generate a token with read permissions’,
‘Get your board ID from the board URL’
],
fields: [‘API Key’, ‘Board ID’]
},
‘asana’: {
name: ‘Asana’,
steps: [
‘Go to Asana Settings → Apps → Developer Apps’,
‘Create a Personal Access Token’,
‘Copy the token’,
‘Get your project ID from project settings’
],
fields: [‘API Token’, ‘Project ID’, ‘Workspace’]
},
‘jira’: {
name: ‘Jira’,
steps: [
‘Go to Atlassian Account Settings’,
‘Create an API token’,
‘Use your email + API token for auth’,
‘Get project key from project settings’
],
fields: [‘API Token’, ‘Project Key’, ‘Domain’]
},
‘smartsheet’: {
name: ‘Smartsheet’,
steps: [
‘Go to Account → Apps & Integrations’,
‘Generate a new API Access Token’,
‘Copy the token’,
‘Get your sheet ID from the sheet URL’
],
fields: [‘API Token’, ‘Sheet ID’]
}
};

```
return instructions[platform] || { name: 'Platform', steps: [], fields: [] };
```

};

const exportReport = (format = ‘txt’) => {
if (!analysis) return;

```
const timestamp = new Date().toLocaleDateString();
const filename = `EVM_Report_${projectData.name.replace(/\s/g, '_')}_${Date.now()}`;

if (format === 'txt') {
  const report = `
```

EVM ANALYSIS REPORT
Project: ${projectData.name}
Generated: ${timestamp}

=== KEY METRICS ===
Planned Value (PV): $${analysis.metrics.PV.toLocaleString()}
Earned Value (EV): $${analysis.metrics.EV.toLocaleString()}
Actual Cost (AC): $${analysis.metrics.AC.toLocaleString()}

Cost Variance (CV): $${analysis.metrics.CV.toLocaleString()}
Schedule Variance (SV): $${analysis.metrics.SV.toLocaleString()}

Cost Performance Index (CPI): ${analysis.metrics.CPI}
Schedule Performance Index (SPI): ${analysis.metrics.SPI}

=== FORECASTS ===
Estimate at Completion (EAC): $${analysis.metrics.EAC.toLocaleString()}
Estimate to Complete (ETC): $${analysis.metrics.ETC.toLocaleString()}
Variance at Completion (VAC): $${analysis.metrics.VAC.toLocaleString()}
To Complete Performance Index (TCPI): ${analysis.metrics.TCPI}

=== AI INSIGHTS ===
${analysis.insights.map((insight, i) => `${i + 1}. [${insight.category}] ${insight.message} Recommendation: ${insight.recommendation}`).join(’\n’)}

=== TASK BREAKDOWN ===
${projectData.tasks.map(task => `${task.name} Planned: $${task.planned.toLocaleString()} Actual: $${task.actual.toLocaleString()} Complete: ${task.complete}% Variance: $${(task.actual - task.planned).toLocaleString()}`).join(’\n’)}
`;

```
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
} else if (format === 'csv') {
  const csvContent = [
    ['EVM Analysis Report'],
    ['Project', projectData.name],
    ['Generated', timestamp],
    [''],
    ['Key Metrics'],
    ['Metric', 'Value'],
    ['Planned Value (PV)', `$${analysis.metrics.PV.toLocaleString()}`],
    ['Earned Value (EV)', `$${analysis.metrics.EV.toLocaleString()}`],
    ['Actual Cost (AC)', `$${analysis.metrics.AC.toLocaleString()}`],
    ['Cost Variance (CV)', `$${analysis.metrics.CV.toLocaleString()}`],
    ['Schedule Variance (SV)', `$${analysis.metrics.SV.toLocaleString()}`],
    ['Cost Performance Index (CPI)', analysis.metrics.CPI],
    ['Schedule Performance Index (SPI)', analysis.metrics.SPI],
    [''],
    ['Forecasts'],
    ['Estimate at Completion (EAC)', `$${analysis.metrics.EAC.toLocaleString()}`],
    ['Estimate to Complete (ETC)', `$${analysis.metrics.ETC.toLocaleString()}`],
    ['Variance at Completion (VAC)', `$${analysis.metrics.VAC.toLocaleString()}`],
    ['To Complete Performance Index (TCPI)', analysis.metrics.TCPI],
    [''],
    ['Task Breakdown'],
    ['Task Name', 'Planned Cost', 'Actual Cost', 'Complete %', 'Variance'],
    ...projectData.tasks.map(task => [
      task.name,
      task.planned,
      task.actual,
      task.complete,
      task.actual - task.planned
    ])
  ].map(row => row.join(',')).join('\n');
 
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
} else if (format === 'json') {
  const jsonData = {
    project: {
      name: projectData.name,
      budget: projectData.budget,
      duration: projectData.duration,
      currentWeek: projectData.currentWeek
    },
    generatedDate: timestamp,
    metrics: analysis.metrics,
    insights: analysis.insights,
    tasks: projectData.tasks
  };
 
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

};

return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
<div className="max-w-7xl mx-auto">
<header className="mb-8">
<h1 className="text-4xl font-bold text-gray-800 mb-2">AI Project EVM Analyzer</h1>
<p className="text-gray-600">Earned Value Management Analysis powered by AI</p>
</header>

```
    <div className="mb-6 flex gap-2">
      <button
        onClick={() => setActiveTab('upload')}
        className={`px-6 py-3 rounded-lg font-medium transition ${
          activeTab === 'upload'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Upload className="inline w-5 h-5 mr-2" />
        Upload
      </button>
      <button
        onClick={() => setActiveTab('dashboard')}
        disabled={!analysis}
        className={`px-6 py-3 rounded-lg font-medium transition ${
          activeTab === 'dashboard'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        <BarChart3 className="inline w-5 h-5 mr-2" />
        Dashboard
      </button>
      <button
        onClick={() => setActiveTab('insights')}
        disabled={!analysis}
        className={`px-6 py-3 rounded-lg font-medium transition ${
          activeTab === 'insights'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        <TrendingUp className="inline w-5 h-5 mr-2" />
        AI Insights
      </button>
      <button
        onClick={() => setActiveTab('report')}
        disabled={!analysis}
        className={`px-6 py-3 rounded-lg font-medium transition ${
          activeTab === 'report'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        <FileText className="inline w-5 h-5 mr-2" />
        Report
      </button>
    </div>

    {activeTab === 'upload' && (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Project Data</h2>
       
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* File Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Upload Project File</h3>
            <p className="text-sm text-gray-600 mb-4">Drag and drop or click to browse</p>
            <input
              type="file"
              accept=".mpp,.xml,.xer,.xlsx,.xls,.csv,.json"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 inline-block text-sm"
            >
              Choose File
            </label>
          </div>

          {/* API Integration Section */}
          <div className="border-2 border-gray-300 rounded-lg p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">API</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Connect via API</h3>
                <p className="text-xs text-gray-600">Real-time sync</p>
              </div>
            </div>
            <button
              onClick={() => setShowApiModal(true)}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              Configure API Integration
            </button>
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Supported Project Management Platforms
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'MS Project', format: '.mpp, .xml', color: 'bg-green-50 border-green-200', icon: '📊' },
              { name: 'Primavera P6', format: '.xer, .xml', color: 'bg-orange-50 border-orange-200', icon: '🏗️' },
              { name: 'Monday.com', format: 'API, .xlsx', color: 'bg-pink-50 border-pink-200', icon: '📅' },
              { name: 'Trello', format: 'API, .json', color: 'bg-blue-50 border-blue-200', icon: '📋' },
              { name: 'Asana', format: 'API, .csv', color: 'bg-red-50 border-red-200', icon: '✓' },
              { name: 'Jira', format: 'API, .csv', color: 'bg-blue-50 border-blue-200', icon: '🎯' },
              { name: 'Smartsheet', format: '.xlsx, API', color: 'bg-teal-50 border-teal-200', icon: '📈' },
              { name: 'Excel/CSV', format: '.xlsx, .csv', color: 'bg-green-50 border-green-200', icon: '📑' }
            ].map((platform, index) => (
              <div key={index} className={`${platform.color} border-2 rounded-lg p-4 text-center`}>
                <div className="text-3xl mb-2">{platform.icon}</div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">{platform.name}</h4>
                <p className="text-xs text-gray-600">{platform.format}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Format Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              File Format Support
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>MS Project:</strong> .mpp (native), .xml (export)</li>
              <li><strong>Primavera P6:</strong> .xer (export), .xml</li>
              <li><strong>Excel:</strong> .xlsx, .xls with standard templates</li>
              <li><strong>CSV:</strong> Comma-separated values</li>
              <li><strong>JSON:</strong> Trello, API exports</li>
            </ul>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              API Integration Support
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>Monday.com:</strong> Real-time board sync</li>
              <li><strong>Trello:</strong> Card & list data import</li>
              <li><strong>Asana:</strong> Project & task synchronization</li>
              <li><strong>Jira:</strong> Sprint & epic data</li>
              <li><strong>Smartsheet:</strong> Sheet-level integration</li>
            </ul>
          </div>
        </div>

        {/* Required Data Fields */}
        <div className="p-6 bg-amber-50 rounded-lg border-2 border-amber-200 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">📋 Required Data Fields</h3>
          <p className="text-sm text-gray-700 mb-3">
            The system will automatically extract and map the following fields from your project file:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Project Level:</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• Project Name/Title</li>
                <li>• Total Budget/Planned Cost</li>
                <li>• Start & End Dates</li>
                <li>• Current Status Date</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Task Level:</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• Task Name/Description</li>
                <li>• Planned/Baseline Cost</li>
                <li>• Actual Cost Incurred</li>
                <li>• % Complete/Progress</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">New to EVM analysis? Try our sample project</p>
          <button
            onClick={handleLoadSample}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-lg"
          >
            Load Sample Project Data
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">💡 How to Export from Your Tool:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-1">MS Project:</p>
              <p>File → Save As → XML Format or Export to Excel</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Primavera P6:</p>
              <p>File → Export → XER format or XML</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Monday.com:</p>
              <p>Board menu → Export to Excel or use API connection</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Trello:</p>
              <p>Board menu → More → Print & Export → Export JSON</p>
            </div>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'dashboard' && analysis && (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{projectData.name}</h2>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                  <button
                    onClick={() => {
                      exportReport('txt');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-t-lg flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Export as Text (.txt)</span>
                  </button>
                  <button
                    onClick={() => {
                      exportReport('csv');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Export as CSV (.csv)</span>
                  </button>
                  <button
                    onClick={() => {
                      exportReport('json');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-b-lg flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Export as JSON (.json)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Progress</p>
              <p className="text-2xl font-bold text-blue-600">{analysis.metrics.percentComplete}%</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Time Elapsed</p>
              <p className="text-2xl font-bold text-purple-600">{analysis.metrics.percentSchedule}%</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Budget</p>
              <p className="text-2xl font-bold text-green-600">${projectData.budget.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Actual Cost</p>
              <p className="text-2xl font-bold text-orange-600">${analysis.metrics.AC.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border-2 border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-4">Core Metrics</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Planned Value (PV)</p>
                  <p className="text-xl font-bold text-gray-800">${analysis.metrics.PV.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Earned Value (EV)</p>
                  <p className="text-xl font-bold text-gray-800">${analysis.metrics.EV.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Actual Cost (AC)</p>
                  <p className="text-xl font-bold text-gray-800">${analysis.metrics.AC.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-2 border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-4">Variances</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Cost Variance (CV)</p>
                  <p className={`text-xl font-bold ${analysis.metrics.CV >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${analysis.metrics.CV.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Schedule Variance (SV)</p>
                  <p className={`text-xl font-bold ${analysis.metrics.SV >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${analysis.metrics.SV.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-2 border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-4">Performance Indices</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">CPI (Cost)</p>
                  <p className={`text-xl font-bold ${analysis.metrics.CPI >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                    {analysis.metrics.CPI}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">SPI (Schedule)</p>
                  <p className={`text-xl font-bold ${analysis.metrics.SPI >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                    {analysis.metrics.SPI}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">TCPI (To Complete)</p>
                  <p className="text-xl font-bold text-gray-800">{analysis.metrics.TCPI}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Estimate at Completion</p>
              <p className="text-xl font-bold text-gray-800">${analysis.metrics.EAC.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Estimate to Complete</p>
              <p className="text-xl font-bold text-gray-800">${analysis.metrics.ETC.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Variance at Completion</p>
              <p className={`text-xl font-bold ${analysis.metrics.VAC >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${analysis.metrics.VAC.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Task Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4">Task</th>
                  <th className="text-right py-3 px-4">Planned</th>
                  <th className="text-right py-3 px-4">Actual</th>
                  <th className="text-right py-3 px-4">Complete</th>
                  <th className="text-right py-3 px-4">Variance</th>
                </tr>
              </thead>
              <tbody>
                {projectData.tasks.map(task => (
                  <tr key={task.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{task.name}</td>
                    <td className="text-right py-3 px-4">${task.planned.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">${task.actual.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{task.complete}%</td>
                    <td className={`text-right py-3 px-4 font-semibold ${
                      task.actual - task.planned <= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${(task.actual - task.planned).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'insights' && analysis && (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">AI-Powered Insights</h2>
        <div className="space-y-4">
          {analysis.insights.map((insight, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border-l-4 ${
                insight.type === 'critical'
                  ? 'bg-red-50 border-red-500'
                  : insight.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-500'
                  : 'bg-green-50 border-green-500'
              }`}
            >
              <div className="flex items-start gap-3">
                {insight.type === 'critical' && <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />}
                {insight.type === 'warning' && <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />}
                {insight.type === 'success' && <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      insight.type === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : insight.type === 'warning'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {insight.category}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800 mb-2">{insight.message}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Recommendation:</span> {insight.recommendation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {activeTab === 'report' && analysis && (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Executive Report</h2>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                <button
                  onClick={() => {
                    exportReport('txt');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-t-lg flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Export as Text (.txt)</span>
                </button>
                <button
                  onClick={() => {
                    exportReport('csv');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Export as CSV (.csv)</span>
                </button>
                <button
                  onClick={() => {
                    exportReport('json');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-b-lg flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Export as JSON (.json)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Project Overview</h3>
          <p className="text-gray-700 mb-4">
            <strong>Project Name:</strong> {projectData.name}<br />
            <strong>Total Budget:</strong> ${projectData.budget.toLocaleString()}<br />
            <strong>Duration:</strong> {projectData.duration} weeks<br />
            <strong>Current Period:</strong> Week {projectData.currentWeek}<br />
            <strong>Report Date:</strong> {new Date().toLocaleDateString()}
          </p>

          <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8">Performance Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700">
              The project is currently <strong>{analysis.metrics.percentComplete}%</strong> complete with{' '}
              <strong>{analysis.metrics.percentSchedule}%</strong> of the timeline elapsed. The Cost Performance Index (CPI)
              of <strong>{analysis.metrics.CPI}</strong> indicates the project is {parseFloat(analysis.metrics.CPI) >= 1 ? 'under' : 'over'} budget,
              while the Schedule Performance Index (SPI) of <strong>{analysis.metrics.SPI}</strong> shows the project
              is {parseFloat(analysis.metrics.SPI) >= 1 ? 'ahead of' : 'behind'} schedule.
            </p>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8">Key Findings</h3>
          <ul className="space-y-2 text-gray-700">
            {analysis.insights.map((insight, index) => (
              <li key={index}>
                <strong>[{insight.category}]</strong> {insight.message}
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8">Recommendations</h3>
          <ol className="space-y-2 text-gray-700">
            {analysis.insights.map((insight, index) => (
              <li key={index}>{insight.recommendation}</li>
            ))}
          </ol>
        </div>
      </div>
    )}
  </div>

  {/* API Configuration Modal */}
  {showApiModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">API Integration Setup</h2>
            <button
              onClick={() => setShowApiModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Platform Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Platform
            </label>
            <select
              value={apiConfig.platform}
              onChange={(e) => setApiConfig({...apiConfig, platform: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Choose a platform...</option>
              <option value="monday">Monday.com</option>
              <option value="trello">Trello</option>
              <option value="asana">Asana</option>
              <option value="jira">Jira</option>
              <option value="smartsheet">Smartsheet</option>
            </select>
          </div>

          {apiConfig.platform && (
            <>
              {/* Instructions */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2">
                  📘 How to get your {getApiInstructions(apiConfig.platform).name} API credentials:
                </h3>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  {getApiInstructions(apiConfig.platform).steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* API Key/Token */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  API Key / Token *
                </label>
                <input
                  type="password"
                  value={apiConfig.apiKey}
                  onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
                  placeholder="Enter your API key or token"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Platform-specific fields */}
              {(apiConfig.platform === 'monday' || apiConfig.platform === 'trello') && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Board ID *
                  </label>
                  <input
                    type="text"
                    value={apiConfig.boardId}
                    onChange={(e) => setApiConfig({...apiConfig, boardId: e.target.value})}
                    placeholder="Enter your board ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              {(apiConfig.platform === 'asana' || apiConfig.platform === 'jira' || apiConfig.platform === 'smartsheet') && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project / Sheet ID *
                  </label>
                  <input
                    type="text"
                    value={apiConfig.projectId}
                    onChange={(e) => setApiConfig({...apiConfig, projectId: e.target.value})}
                    placeholder="Enter your project or sheet ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              {(apiConfig.platform === 'monday' || apiConfig.platform === 'asana') && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Workspace ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={apiConfig.workspace}
                    onChange={(e) => setApiConfig({...apiConfig, workspace: e.target.value})}
                    placeholder="Enter workspace ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Connection Info */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-800 mb-2">✓ What happens next:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Secure connection to {getApiInstructions(apiConfig.platform).name}</li>
                  <li>• Automatic import of project data</li>
                  <li>• Real-time sync of task updates</li>
                  <li>• Automatic EVM calculations</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApiModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApiConnect}
                  disabled={!apiConfig.apiKey || (!apiConfig.projectId && !apiConfig.boardId) || isConnecting}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connecting...
                    </>
                  ) : (
                    <>Connect & Import</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )}
</div>
```

);
};

export default EVMAnalyzerApp;
