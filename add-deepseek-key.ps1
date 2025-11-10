# Script PowerShell per aggiungere la chiave DeepSeek a .env.local
# Esegui: .\add-deepseek-key.ps1

Write-Host "🤖 Configurazione DeepSeek AI per lucacorrao.com" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"
$deepseekKey = "DEEPSEEK_API_KEY=sk-3724bca4d5be4fc5b826d59cf9b73719"
$deepseekUrl = "DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions"

# Controlla se .env.local esiste
if (Test-Path $envFile) {
    Write-Host "✅ File .env.local trovato" -ForegroundColor Green
    
    # Leggi il contenuto attuale
    $content = Get-Content $envFile -Raw
    
    # Controlla se la chiave esiste già
    if ($content -match "DEEPSEEK_API_KEY") {
        Write-Host "⚠️  DEEPSEEK_API_KEY già presente in .env.local" -ForegroundColor Yellow
        Write-Host ""
        $overwrite = Read-Host "Vuoi sovrascriverla? (s/n)"
        
        if ($overwrite -eq "s" -or $overwrite -eq "S") {
            # Rimuovi vecchia chiave
            $content = $content -replace "DEEPSEEK_API_KEY=.*", $deepseekKey
            $content = $content -replace "DEEPSEEK_API_URL=.*", $deepseekUrl
            Set-Content -Path $envFile -Value $content
            Write-Host "✅ Chiave DeepSeek aggiornata!" -ForegroundColor Green
        } else {
            Write-Host "❌ Operazione annullata" -ForegroundColor Red
            exit
        }
    } else {
        # Aggiungi le chiavi
        Add-Content -Path $envFile -Value "`n# DeepSeek AI"
        Add-Content -Path $envFile -Value $deepseekKey
        Add-Content -Path $envFile -Value $deepseekUrl
        Write-Host "✅ Chiave DeepSeek aggiunta a .env.local!" -ForegroundColor Green
    }
} else {
    # Crea nuovo file .env.local
    Write-Host "⚠️  File .env.local non trovato. Creazione in corso..." -ForegroundColor Yellow
    
    $newContent = @"
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://txszcieimfzqthkdzceb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4c3pjaWVpbWZ6cXRoa2R6Y2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NzA0MDksImV4cCI6MjA1MTE0NjQwOX0.LqrqDOoGmXYEgPlvt3SQ6uFsv3VuRXN0xYZl-SkFMlg

# DeepSeek AI
$deepseekKey
$deepseekUrl
"@
    
    Set-Content -Path $envFile -Value $newContent
    Write-Host "✅ File .env.local creato con successo!" -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 Configurazione completata!" -ForegroundColor Green
Write-Host ""
Write-Host "Prossimi passi:" -ForegroundColor Yellow
Write-Host "1. Riavvia il dev server: npm run dev" -ForegroundColor White
Write-Host "2. Testa la barra AI su http://localhost:3000" -ForegroundColor White
Write-Host "3. Aggiungi la chiave anche su Vercel (vedi DEEPSEEK_SETUP.md)" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

