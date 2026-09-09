import { GuideDoc } from "../types";

export const n8nDoc: GuideDoc = {
  type: "guide",
  id: "webhooks-n8n",
  slug: "webhooks/n8n",
  title: "Integrasi n8n & AI Bot (Zero-Timeout)",
  description:
    "Panduan arsitektur terbaik untuk menghubungkan Webhook WhatsApp Wahide dengan n8n dan AI Agent (OpenAI, Claude, Gemini) tanpa risiko HTTP timeout atau eksekusi pesan ganda.",
  category: "Webhooks",
  categorySlug: "webhooks",
  bannerNotice: {
    type: "info",
    title: "Pola Asinkron Decoupled Berstandar Enterprise",
    content:
      "Webhook adalah notifikasi event satu arah. Dengan menyetel Webhook n8n ke mode 'Immediately (200 OK)', server Wahide menerima konfirmasi tanda terima seketika (< 50ms), sementara node AI bebas berpikir di latar belakang tanpa batas waktu.",
  },
  sections: [
    {
      id: "architecture-overview",
      title: "1. Mengapa Perlu Pola Asinkron (Decoupled Pattern)?",
      content:
        "Saat menghubungkan WhatsApp dengan AI (Large Language Models), proses inferensi model seperti OpenAI GPT-4o, Anthropic Claude, atau Google Gemini sering kali membutuhkan waktu antara **10 hingga 30 detik** untuk menyusun jawaban lengkap.\n\nJika Webhook n8n disetel ke mode sinkron (*Respond: When Last Node Finishes*):\n1. n8n menahan respon HTTP selama 15–30 detik menunggu AI selesai.\n2. Klien HTTP Wahide memiliki batas tunggu maksimal 15 detik. Karena belum menerima respon, Wahide menganggap pengiriman gagal (*Context Deadline Exceeded*).\n3. Sistem *Exponential Backoff* Wahide mengirim ulang webhook hingga 5 kali, memicu loop eksekusi AI ganda yang boros kuota token AI dan mengirim pesan berulang ke pelanggan.\n\n### Solusi: Pola Asinkron Decoupled\nWahide **tidak pernah membaca teks balasan dari badan respon HTTP webhook**. Wahide hanya membutuhkan tanda terima status `200 OK`. Jawaban dari AI harus dikirimkan melalui panggilan terpisah ke API Kirim Pesan Wahide (`POST /messages/send`).",
    },
    {
      id: "sync-vs-async-table",
      title: "2. Perbandingan Pola Sinkron vs Asinkron",
      content:
        "Tabel berikut mengilustrasikan perbedaan performa dan keandalan sistem antara kedua pola integrasi di n8n:\n\n| Aspek Teknis | ❌ Pola Sinkron (When Last Node Finishes) | ✅ Pola Asinkron Decoupled (Immediately 200 OK) |\n|---|---|---|\n| **Waktu Respon Webhook** | 15–30 detik (menunggu AI) | **< 50 milidetik** (instan) |\n| **Risiko Timeout Wahide** | **Tinggi** (terputus di detik ke-15) | **Zero (0%)** (sukses sebelum 0.1 detik) |\n| **Risiko Pesan Ganda / Retry** | **Tinggi** (Wahide retry hingga 5x) | **Zero (0%)** (tidak ada retry palsu) |\n| **Batas Waktu Berpikir AI** | Terbatas ketat (< 15 detik) | **Bebas tanpa batas** (bisa 30s, 60s, dsb.) |\n| **Pemakaian Token AI** | Boros (tereksekusi berulang kali) | **Efisien & Terkendali** (1 chat = 1 eksekusi) |",
      callout: {
        type: "tip",
        title: "Kaidah Wajib Konfigurasi n8n",
        content:
          "Pada node Webhook di n8n, selalu pilih opsi: 'Respond: Immediately' dengan Response Code 200. Jangan pernah menggunakan opsi 'When Last Node Finishes' untuk workflow AI.",
      },
    },
    {
      id: "step-by-step-guide",
      title: "3. Panduan Konfigurasi Alur n8n Langkah demi Langkah",
      content:
        `Berikut adalah langkah-langkah merangkai 3 node utama di n8n untuk membuat WhatsApp AI Bot otomatis:

### Node 1: Webhook Inbound (Wahide)
- **HTTP Method**: \`POST\`
- **Path**: \`wahide-inbound\` (bebas)
- **Authentication**: \`Header Auth\`
  - Header Name: \`X-Wahide-Secret\`
  - Header Value: Masukkan Webhook Secret dari Dashboard Wahide (\`whsec_live_...\`)
- **Response Mode**: \`Immediately\` (Response Code: \`200\`)
- **Response Data**: \`{"status": "success", "received": true}\`

### Node 2: AI Agent (OpenAI / Claude / Gemini)
- Sambungkan output dari Webhook Node ke AI Agent.
- Ambil pesan pelanggan dengan ekspresi: \`{{ $json.body.data.text }}\`.
- Ambil nama pelanggan dengan ekspresi: \`{{ $json.body.data.push_name }}\`.
- Buat System Prompt yang ramah, misalnya: *'Anda adalah asisten customer service resmi yang ramah dan solutif.'*

### Node 3: HTTP Request Outbound (Wahide API)
- Sambungkan output AI ke node **HTTP Request** untuk mengirim balasan ke WhatsApp pelanggan:
- **Method**: \`POST\`
- **URL**: \`https://api.wahide.com/api/v1/messages/send\`
- **Headers**:
  - \`Authorization\`: \`Bearer YOUR_WAHIDE_API_KEY\`
  - \`Content-Type\`: \`application/json\`
- **Body (JSON)**:
\`\`\`json
{
  "device_id": "{{ $('Wahide Webhook Inbound').item.json.body.device_id }}",
  "phone": "{{ $('Wahide Webhook Inbound').item.json.body.data.sender }}",
  "message": "{{ $json.output }}"
}
\`\`\``,
    },
    {
      id: "ready-to-import-json",
      title: "4. Template Workflow JSON Siap Import (1-Click Copy)",
      content:
        "Anda dapat menyalin seluruh kode JSON di bawah ini dan langsung menempelkannya (*Ctrl+V* / *Cmd+V*) ke dalam kanvas kerja n8n Anda:",
      code: {
        language: "json",
        title: "Template n8n: WhatsApp AI Customer Service Bot (Zero-Timeout)",
        content: `{
  "name": "Wahide WhatsApp AI Customer Support Bot (Zero-Timeout)",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "wahide-inbound",
        "responseMode": "onReceived",
        "responseData": "{\\"status\\":\\"success\\",\\"received\\":true}",
        "options": {}
      },
      "id": "wahide-webhook-node",
      "name": "Wahide Webhook Inbound",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [240, 300]
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "=Pelanggan: {{ $json.body.data.push_name }} ({{ $json.body.data.sender }})\\nPesan: {{ $json.body.data.text }}",
        "options": {
          "systemMessage": "Anda adalah asisten virtual WhatsApp resmi yang ramah, santun, dan responsif. Jawab pertanyaan pelanggan dengan ringkas dan membantu."
        }
      },
      "id": "ai-agent-node",
      "name": "AI Assistant (OpenAI / Claude)",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [540, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.wahide.com/api/v1/messages/send",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer hide_live_your_api_key_here"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\\n  \\"device_id\\": \\"{{ $('Wahide Webhook Inbound').item.json.body.device_id }}\\",\\n  \\"phone\\": \\"{{ $('Wahide Webhook Inbound').item.json.body.data.sender }}\\",\\n  \\"message\\": \\"{{ $json.output }}\\"\\n}",
        "options": {}
      },
      "id": "wahide-outbound-api",
      "name": "Kirim Balasan via Wahide API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [840, 300]
    }
  ],
  "connections": {
    "Wahide Webhook Inbound": {
      "main": [
        [
          {
            "node": "AI Assistant (OpenAI / Claude)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Assistant (OpenAI / Claude)": {
      "main": [
        [
          {
            "node": "Kirim Balasan via Wahide API",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`,
      },
    },
    {
      id: "troubleshooting-n8n",
      title: "5. Troubleshooting & Tips Pengujian Lokal",
      content:
        "### A. Menguji n8n di Komputer Lokal (Localhost)\nJika instance n8n Anda berjalan di laptop (`http://localhost:5678`), Wahide tidak dapat mengirim webhook ke alamat `localhost` tersebut secara langsung. Gunakan salah satu solusi tunnel publik gratis berikut:\n- **Cloudflare Tunnel (`cloudflared`)**: `cloudflared tunnel --url http://localhost:5678`\n- **Ngrok**: `ngrok http 5678`\nSalin URL HTTPS publik yang dihasilkan (contoh: `https://xyz.ngrok-free.app/webhook/wahide-inbound`) ke pengaturan webhook Wahide.\n\n### B. Verifikasi Idempotency (Mencegah Duplikasi)\nWahide secara otomatis menyertakan header `X-Wahide-Delivery-ID` pada setiap paket data. Jika Anda mengaktifkan node cache/Redis di n8n, Anda dapat menyimpan ID ini selama 5 menit untuk memastikan tidak ada pesan duplikat yang diproses dua kali.",
      callout: {
        type: "info",
        title: "Perlindungan Media Cloudflare R2",
        content:
          "Jika pelanggan mengirim foto atau dokumen PDF, Wahide otomatis mengunggah file tersebut ke Cloudflare R2 dan menyertakan URL publik ringan di `data.media.url`. n8n tidak akan kehabisan memori (*Out of Memory*) karena tidak perlu mengolah file biner mentah secara langsung.",
      },
    },
  ],
};
