import { EndpointDoc, GuideDoc } from "../types";

export const webhooksGuideDoc: GuideDoc = {
  type: "guide",
  id: "webhooks-overview",
  slug: "webhooks",
  title: "Webhooks Overview & Quickstart",
  description:
    "Terima pesan masuk dan status pesan WhatsApp secara real-time ke server backend aplikasi Anda melalui HTTP Webhook.",
  category: "Webhooks",
  categorySlug: "webhooks",
  bannerNotice: {
    type: "info",
    title: "Event-Driven Real-Time Delivery",
    content:
      "Wahide Webhook Engine secara otomatis meneruskan seluruh obrolan pesan masuk 1-on-1 dari WhatsApp ke URL endpoint backend Anda dalam format JSON berkecepatan tinggi.",
  },
  sections: [
    {
      id: "architecture",
      title: "1. Bagaimana Cara Kerja Webhook Wahide?",
      content:
        "Ketika pelanggan mengirimkan pesan WhatsApp ke nomor bisnis Anda yang terhubung di Wahide, sistem melakukan serangkaian proses berikut secara instan:\n\n1. **Zero-Heap Filtering**: Memfilter pesan sampah (grup, story, newsletter) agar tidak membebani server Anda.\n2. **JSON Payload Construction**: Memformat detail pesan, pengirim, nomor telepon, dan timestamp ke dalam schema standar.\n3. **Asynchronous HTTP POST**: Mengirimkan request HTTP POST ke URL Webhook yang Anda daftarkan di dashboard.\n4. **Instant Acknowledgment**: Server Anda cukup mengembalikan HTTP status `200 OK` dalam batas waktu maksimal 8 detik.",
      callout: {
        type: "tip",
        title: "Endpoint Publik Diperlukan",
        content:
          "URL Webhook harus dapat diakses secara publik lewat protokol HTTPS yang valid. Untuk pengujian lokal di komputer development Anda, gunakan tool tunneling seperti Ngrok atau Cloudflare Tunnels.",
      },
    },
    {
      id: "security",
      title: "2. Keamanan & Verifikasi Header",
      content:
        "Untuk memastikan setiap request yang masuk ke endpoint Anda benar-benar berasal dari server resmi Wahide dan bukan dari pihak luar, Wahide menyertakan header otentikasi standar `Authorization` dengan format `Bearer <secret>` pada setiap HTTP POST request:",
      code: {
        language: "http",
        title: "HTTP Request Headers dari Wahide",
        content: `POST /api/webhook/whatsapp HTTP/1.1
Host: api.bisnis-anda.com
Content-Type: application/json
User-Agent: Wahide-WhatsApp-Webhook-Engine/2.0
Authorization: Bearer wh_sec_9f8e7d6c5b4a3210fedcba9876543210`,
      },
      callout: {
        type: "warning",
        title: "Validasi Wajib di Server Anda",
        content:
          "Pastikan server Anda selalu memverifikasi bahwa nilai token pada header `Authorization` (format `Bearer <secret>`) cocok dengan Secret Key yang tercantum di Dashboard Wahide Anda sebelum memproses payload.",
      },
    },
    {
      id: "retry-policy",
      title: "3. Kebijakan Retry Otomatis & Dead Letter Queue (DLQ)",
      content:
        "Jika server endpoint Anda sedang down, mengalami error 5xx, atau mengalami timeout (> 8 detik), Wahide Webhook Engine menerapkan sistem ketahanan tingkat tinggi:\n\n- **Jittered Exponential Backoff**: Percobaan pengiriman ulang dilakukan hingga **5 kali** dengan jeda waktu yang meningkat secara bertahap (3s, 6s, 12s, 24s, 48s ditambah random jitter).\n- **Dead Letter Queue (DLQ)**: Jika setelah 5x pengiriman masih gagal, event disimpan di DLQ memori agar data tidak hilang dan dapat Anda inspeksi atau kirim ulang (replay) dari dashboard.",
    },
    {
      id: "code-examples",
      title: "4. Contoh Implementasi Server Penerima (Code Examples)",
      content:
        "Pilih bahasa pemrograman backend Anda untuk melihat template boilerplate receiver webhook siap pakai yang sudah dilengkapi dengan verifikasi header keamanan `Authorization: Bearer <secret>` dan respons cepat HTTP 200 OK. Anda juga dapat menggunakan tab cURL untuk mensimulasikan payload pengujian event ke endpoint lokal Anda secara instan.",
      codeTabsTitle: "Boilerplate Receiver & Simulasi Webhook",
      codeTabs: {
        curl: `curl -X POST "http://localhost:3000/api/webhook/whatsapp" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer wh_sec_9f8e7d6c5b4a3210fedcba9876543210" \\
  -d '{
    "event": "message.received",
    "device_id": "c1f76e5d-8b22-4211-9a11-87265143a123",
    "timestamp": 1711200000,
    "data": {
      "message_id": "3EB0ABC123456789DEF0",
      "sender": "6281234567890@s.whatsapp.net",
      "push_name": "Budi Santoso",
      "text": "Halo admin, mau tanya stok produk apakah ready?"
    }
  }'`,
        nodejs: `const express = require('express');
const app = express();
app.use(express.json());

const WAHIDE_SECRET = process.env.WAHIDE_WEBHOOK_SECRET || "wh_sec_your_secret_here";

app.post('/api/webhook/whatsapp', (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  const incomingSecret = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  
  // 1. Verifikasi Keamanan Header Authorization
  if (incomingSecret !== WAHIDE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Authorization Header' });
  }

  const { event, device_id, data } = req.body;

  // 2. Tangani Event Pesan Masuk
  if (event === 'message.received') {
    console.log(\`[Pesan Masuk] Dari: \${data.sender} (\${data.push_name}): \${data.text}\`);
    // TODO: Jalankan logika bisnis Anda (Auto-Reply, Simpan ke CRM, Notifikasi CS)
  }

  // 3. Wajib Kembalikan HTTP 200 OK dengan cepat (< 8 detik)
  return res.status(200).json({ status: 'success', received: true });
});

app.listen(3000, () => console.log('Webhook server siap di port 3000'));`,
        php: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Log;

class WhatsAppWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $secret = config('services.wahide.webhook_secret');
        $authHeader = $request->header('Authorization', '');
        $incomingSecret = str_replace('Bearer ', '', $authHeader);

        // 1. Verifikasi Secret Key via Authorization Header
        if ($incomingSecret !== $secret) {
            return response()->json(['error' => 'Unauthorized: Invalid Authorization Header'], 401);
        }

        $event = $request->input('event');
        $data = $request->input('data');

        if ($event === 'message.received') {
            Log::info("Pesan masuk dari {$data['sender']}: {$data['text']}");
            // TODO: Dispatch Job atau proses database CRM
        }

        // 2. Wajib Kembalikan 200 OK dengan cepat (< 8 detik)
        return response()->json(['status' => 'success']);
    }
}`,
        python: `from fastapi import FastAPI, Header, HTTPException, status
from pydantic import BaseModel
import os

app = FastAPI()
WAHIDE_SECRET = os.getenv("WAHIDE_WEBHOOK_SECRET", "wh_sec_your_secret_here")

class WebhookPayload(BaseModel):
    event: str
    device_id: str
    timestamp: int
    data: dict

@app.post("/api/webhook/whatsapp")
async def receive_whatsapp_webhook(
    payload: WebhookPayload,
    authorization: str = Header(None)
):
    token = authorization.replace("Bearer ", "").strip() if authorization else ""

    # 1. Verifikasi Keamanan Authorization Header
    if token != WAHIDE_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization Header"
        )

    # 2. Proses Event
    if payload.event == "message.received":
        sender = payload.data.get("sender")
        text = payload.data.get("text")
        print(f"Pesan dari {sender}: {text}")

    # 3. Respon Sukses 200 OK
    return {"status": "success"}`,
        go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
)

type WebhookPayload struct {
	Event    string         \`json:"event"\`
	DeviceID string         \`json:"device_id"\`
	Time     int64          \`json:"timestamp"\`
	Data     map[string]any \`json:"data"\`
}

func webhookHandler(w http.ResponseWriter, r *http.Request) {
	expectedSecret := os.Getenv("WAHIDE_WEBHOOK_SECRET")
	authHeader := r.Header.Get("Authorization")
	incomingSecret := strings.TrimPrefix(authHeader, "Bearer ")

	if expectedSecret != "" && incomingSecret != expectedSecret {
		http.Error(w, "Unauthorized: Invalid Authorization Header", http.StatusUnauthorized)
		return
	}

	var payload WebhookPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	if payload.Event == "message.received" {
		fmt.Printf("Pesan WhatsApp masuk dari %v: %v\\n", payload.Data["sender"], payload.Data["text"])
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

func main() {
	http.HandleFunc("/api/webhook/whatsapp", webhookHandler)
	fmt.Println("Webhook receiver running on port 8080")
	_ = http.ListenAndServe(":8080", nil)
}`,
      },
    },
  ],
};

export const webhooksEventsDoc: EndpointDoc = {
  type: "endpoint",
  id: "webhooks-events",
  slug: "webhooks/events",
  title: "Webhook Event: message.received",
  description:
    "Struktur payload JSON yang dikirimkan oleh Wahide ke server Anda setiap kali pesan WhatsApp masuk diterima oleh perangkat Anda.",
  category: "Webhooks",
  categorySlug: "webhooks",
  method: "POST",
  path: "/your-configured-webhook-url",
  badge: "Real-Time Event",
  bannerNotice: {
    type: "info",
    title: "Incoming Direct Chat Event",
    content:
      "Event ini hanya dipicu oleh pesan direct chat 1-on-1 dari pengguna WhatsApp resmi. Pesan grup, story, saluran, dan panggilan suara otomatis di-drop untuk melindungi efisiensi server Anda.",
  },
  headers: [
    {
      key: "Content-Type",
      value: "application/json",
      required: true,
      description: "Format payload dalam bentuk JSON terenkripsi UTF-8.",
    },
    {
      key: "Authorization",
      value: "Bearer wh_sec_...",
      required: true,
      description: "Token rahasia penandatanganan webhook dengan format 'Bearer <secret>' untuk verifikasi keamanan.",
    },
    {
      key: "User-Agent",
      value: "Wahide-WhatsApp-Webhook-Engine/2.0",
      required: true,
      description: "Identitas User-Agent resmi engine webhook Wahide.",
    },
  ],
  parameters: [
    {
      name: "event",
      type: "string",
      required: true,
      description: "Nama event yang terjadi. Untuk pesan masuk, nilainya adalah 'message.received'.",
      example: "message.received",
    },
    {
      name: "device_id",
      type: "string",
      required: true,
      description: "ID perangkat WhatsApp penerima di Wahide.",
      example: "dev_01HV2A4F...",
    },
    {
      name: "timestamp",
      type: "integer",
      required: true,
      description: "Waktu pengiriman event oleh engine dalam format Unix epoch seconds.",
      example: "1725845000",
    },
    {
      name: "data",
      type: "object",
      required: true,
      description: "Objek detail data pesan WhatsApp yang diterima.",
    },
    {
      name: "data.message_id",
      type: "string",
      required: true,
      description: "ID pesan unik dari WhatsApp (WhatsApp Message ID).",
      example: "3EB0A1B2C3D4E5F6",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.sender",
      type: "string",
      required: true,
      description: "Nomor telepon pengirim dalam format E.164 murni tanpa karakter spesial.",
      example: "6281234567890",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.sender_jid",
      type: "string",
      required: true,
      description: "JID resmi WhatsApp pengirim (Jabber ID).",
      example: "6281234567890@s.whatsapp.net",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.push_name",
      type: "string",
      required: false,
      description: "Nama tampilan profil WhatsApp pengirim.",
      example: "Budi Santoso",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.text",
      type: "string",
      required: true,
      description: "Isi teks percakapan pesan WhatsApp yang dikirimkan pelanggan.",
      example: "Halo min, saya ingin menanyakan paket langganan Wahide",
      depth: 1,
      parent: "data",
    },
    {
      name: "data.timestamp",
      type: "integer",
      required: true,
      description: "Waktu pengiriman pesan oleh pengguna WhatsApp (Unix epoch).",
      example: "1725844998",
      depth: 1,
      parent: "data",
    },
  ],
  snippets: {
    curl: `curl -X POST https://api.bisnis-anda.com/webhook \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer wh_sec_9f8e7d6c5b4a3210fedcba9876543210" \\
  -H "User-Agent: Wahide-WhatsApp-Webhook-Engine/2.0" \\
  -d '{
    "event": "message.received",
    "device_id": "dev_01HV2A4F...",
    "timestamp": 1725845000,
    "data": {
      "message_id": "3EB0A1B2C3D4E5F6",
      "sender": "6281234567890",
      "sender_jid": "6281234567890@s.whatsapp.net",
      "push_name": "Budi Santoso",
      "text": "Halo min, saya ingin menanyakan paket langganan Wahide",
      "timestamp": 1725844998
    }
  }'`,
    nodejs: `// Contoh Payload Event yang diterima di Express handler
app.post('/webhook', (req, res) => {
  const { event, device_id, data } = req.body;
  console.log("Menerima event:", event);
  console.log("Pengirim:", data.sender, "Pesan:", data.text);
  res.status(200).json({ received: true });
});`,
    php: `// Contoh Payload Event yang diterima di PHP
$payload = json_decode(file_get_contents('php://input'), true);
if ($payload['event'] === 'message.received') {
    $sender = $payload['data']['sender'];
    $text = $payload['data']['text'];
}
http_response_code(200);
echo json_encode(['status' => 'success']);`,
    python: `// Contoh Payload Event yang diterima di FastAPI
@app.post("/webhook")
async def webhook(payload: dict):
    if payload.get("event") == "message.received":
        data = payload.get("data", {})
        print("Pesan diterima:", data.get("text"))
    return {"status": "success"}`,
    go: `// Contoh Payload Event yang diterima di Go Net/HTTP
func handler(w http.ResponseWriter, r *http.Request) {
    var payload map[string]any
    _ = json.NewDecoder(r.Body).Decode(&payload)
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(\`{"status":"success"}\`))
}`,
  },
  responses: [
    {
      status: 200,
      statusText: "OK",
      description:
        "Respon yang wajib dikembalikan oleh server Anda untuk mengonfirmasi bahwa event berhasil diterima.",
      json: `{
  "status": "success",
  "received": true
}`,
      attributes: [
        {
          name: "status",
          type: "string",
          description: "Status konfirmasi penerimaan payload.",
        },
      ],
    },
  ],
};
