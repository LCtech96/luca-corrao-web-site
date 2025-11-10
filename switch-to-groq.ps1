# Script PowerShell per passare da DeepSeek a Groq
# Esegui: .\switch-to-groq.ps1

Write-Host "⚡ Switching to Groq AI (GRATIS e VELOCISSIMO!)" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"
$groqKey = "GROQ_API_KEY=gsk_YOUR_GROQ_API_KEY_HERE"
$groqUrl = "GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions"

# Controlla se .env.local esiste
if (Test-Path $envFile) {
    Write-Host "✅ File .env.local trovato" -ForegroundColor Green
    
    # Leggi il contenuto attuale
    $content = Get-Content $envFile -Raw
    
    # Commenta le righe DeepSeek se esistono
    if ($content -match "DEEPSEEK_API_KEY") {
        Write-Host "📝 Disabilitazione DeepSeek..." -ForegroundColor Yellow
        $content = $content -replace "^DEEPSEEK_API_KEY=", "# DEEPSEEK_API_KEY="
        $content = $content -replace "^DEEPSEEK_API_URL=", "# DEEPSEEK_API_URL="
    }
    
    # Controlla se Groq esiste già
    if ($content -match "GROQ_API_KEY") {
        Write-Host "⚠️  GROQ_API_KEY già presente in .env.local" -ForegroundColor Yellow
        Write-Host ""
        $overwrite = Read-Host "Vuoi sovrascriverla? (s/n)"
        
        if ($overwrite -eq "s" -or $overwrite -eq "S") {
            # Rimuovi vecchia chiave
            $content = $content -replace "GROQ_API_KEY=.*", $groqKey
            $content = $content -replace "GROQ_API_URL=.*", $groqUrl
            Set-Content -Path $envFile -Value $content
            Write-Host "✅ Chiave Groq aggiornata!" -ForegroundColor Green
        } else {
            Write-Host "❌ Operazione annullata" -ForegroundColor Red
            exit
        }
    } else {
        # Aggiungi le chiavi Groq
        Add-Content -Path $envFile -Value "`n# Groq AI (GRATIS e VELOCISSIMO!)"
        Add-Content -Path $envFile -Value $groqKey
        Add-Content -Path $envFile -Value $groqUrl
        
        # Se esistono chiavi DeepSeek, aggiorna il file per commentarle
        $content = Get-Content $envFile -Raw
        $content = $content -replace "(?m)^(DEEPSEEK_API_KEY=)", "# `$1"
        $content = $content -replace "(?m)^(DEEPSEEK_API_URL=)", "# `$1"
        Set-Content -Path $envFile -Value $content
        
        Write-Host "✅ Chiave Groq aggiunta a .env.local!" -ForegroundColor Green
    }
} else {
    # Crea nuovo file .env.local
    Write-Host "⚠️  File .env.local non trovato. Creazione in corso..." -ForegroundColor Yellow
    
    $newContent = @"
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://txszcieimfzqthkdzceb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4c3pjaWVpbWZ6cXRoa2R6Y2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NzA0MDksImV4cCI6MjA1MTE0NjQwOX0.LqrqDOoGmXYEgPlvt3SQ6uFsv3VuRXN0xYZl-SkFMlg

# Groq AI (GRATIS e VELOCISSIMO!)
$groqKey
$groqUrl

# DeepSeek AI (disabilitato - insufficient balance)
# DEEPSEEK_API_KEY=sk-3724bca4d5be4fc5b826d59cf9b73719
# DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
"@
    
    Set-Content -Path $envFile -Value $newContent
    Write-Host "✅ File .env.local creato con successo!" -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 Switch a Groq completato!" -ForegroundColor Green
Write-Host ""
Write-Host "✨ VANTAGGI DI GROQ:" -ForegroundColor Yellow
Write-Host "   ✅ GRATIS (nessun costo)" -ForegroundColor White
Write-Host "   ✅ VELOCISSIMO (0.5-2 secondi di risposta)" -ForegroundColor White
Write-Host "   ✅ Llama 3.3 70B (modello potentissimo)" -ForegroundColor White
Write-Host "   ✅ Rate limits generosi (10 req/10min, 200 req/giorno)" -ForegroundColor White
Write-Host ""
Write-Host "Prossimi passi:" -ForegroundColor Yellow
Write-Host "1. Riavvia il dev server: Ctrl+C poi npm run dev" -ForegroundColor White
Write-Host "2. Testa la barra AI su http://localhost:3000" -ForegroundColor White
Write-Host "3. Nota la velocità INCREDIBILE! ⚡" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

