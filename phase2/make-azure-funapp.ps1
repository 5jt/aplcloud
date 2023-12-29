# Usage: make-azure-funapp.ps1 -folder [aplwin|dyalog]
param ([string]$folder = "aplwin" )

$appname="rev$folder"

# Create Azure Function App, Storage Account and Resource Group
$randomIdentifier = (New-Guid).ToString().Substring(0,8)

$RESOURCEGROUP="rg_$appname$randomIdentifier"
$STORAGEACCT="sa$appname$randomIdentifier"
$FUNCTIONAPP="$appname"

$location="uksouth"

az group create --location $location --name "$RESOURCEGROUP"

az storage account create `
  --resource-group "$RESOURCEGROUP" `
  --name "$STORAGEACCT" `
  --kind StorageV2 `
  --location $location

az functionapp create `
  --resource-group "$RESOURCEGROUP" `
  --name "$FUNCTIONAPP" `
  --storage-account "$STORAGEACCT" `
  --runtime node `
  --runtime-version 18 `
  --consumption-plan-location $location `
  --functions-version 4

# Define Azure Function locally

mkdir $FUNCTIONAPP 
cd $FUNCTIONAPP 
func init --javascript

# declare HTTP Trigger from template
func new --name MyHttpTrigger --template "HTTP trigger" --authlevel "anonymous"

# Bring code here
cp "..\source\$folder\*.exe" .
cp "..\source\$folder\reverser.*" .
cp "..\source\$folder\MyHttpTrigger.js" -Destination ".\src\functions\MyHttpTrigger.js" .

# Publisher script
echo "func azure functionapp publish $FUNCTIONAPP" > publish.ps1

# Continue on foot...

# func start            # test function locally
# .\publish.ps1         # publish to Azure