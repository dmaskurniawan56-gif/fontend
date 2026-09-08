import { EndpointDoc } from "../types";

export const otpEndpoints: EndpointDoc[] = [
  {
    type: "endpoint",
    id: "otp-send",
    slug: "otp/send",
    title: "Send WhatsApp OTP Code",
    description:
      "Dispatches an instant, cryptographically secure OTP code to a recipient WhatsApp number. Features Redis in-memory storage (5-minute TTL), 60-second cooldown protection against flooding, automatic 6-digit code generation, and VIP express stream priority.",
    category: "OTP & Verification",
    categorySlug: "otp",
    method: "POST",
    path: "/api/v1/otp/send",
    badge: "Instant VIP",
    bannerNotice: {
      type: "success",
      title: "In-Memory Fast Path & Anti-Bombing Cooldown",
      content:
        "OTP verification state is stored purely in Redis with an automated 5-minute TTL, avoiding disk write overhead to MySQL. Protection includes a 60-second resend cooldown and a daily limit of 10 requests per destination number.",
    },
    headers: [
      {
        key: "Authorization",
        value: "Bearer hide_<your_api_key>",
        required: true,
        description:
          "Your secret Wahide API Key prefixed with Bearer.",
      },
      {
        key: "Content-Type",
        value: "application/json",
        required: true,
        description: "Must be set to application/json.",
      },
    ],
    parameters: [
      {
        name: "phone",
        type: "string",
        required: true,
        description:
          "Target recipient phone number in international E.164 format without spaces, dashes, or leading plus. Example: 628123456789.",
        example: "628123456789",
      },
      {
        name: "otp",
        type: "string",
        required: false,
        defaultValue: "Auto 6-digit",
        description:
          "Custom OTP code (4-8 digits). If omitted or empty, the engine automatically generates a cryptographically random 6-digit numeric code.",
        example: "884920",
      },
      {
        name: "template",
        type: "string",
        required: false,
        defaultValue: `"Kode verifikasi Anda adalah *{{otp}}*. Rahasiakan kode ini. Berlaku 5 menit."`,
        description:
          "Custom message template body. Must include the '{{otp}}' placeholder which will be replaced by the generated OTP code.",
        example: "Kode verifikasi login Anda adalah *{{otp}}*. Jangan bagikan ke siapapun.",
      },
      {
        name: "device_id",
        type: "string",
        required: false,
        defaultValue: `"auto"`,
        description:
          "Specific WhatsApp Device ID slot to dispatch the OTP from. If omitted or set to 'auto', intelligent round-robin across healthy connected devices is used.",
        example: "auto",
      },
      {
        name: "expires_in",
        type: "integer",
        required: false,
        defaultValue: "300",
        description:
          "OTP code validity lifetime in seconds. Default is 300 seconds (5 minutes). Maximum allowed is 900 seconds (15 minutes).",
        example: "300",
      },
      {
        name: "priority",
        type: "boolean",
        required: false,
        defaultValue: "true",
        description:
          "When true, routes the dispatch into the VIP Express stream to bypass bulk marketing campaign queues and deliver within sub-seconds.",
        example: "true",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/otp/send" \\
  -H "Authorization: Bearer hide_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "template": "Kode verifikasi akun Anda adalah *{{otp}}*. Berlaku 5 menit.",
    "device_id": "auto",
    "expires_in": 300,
    "priority": true
  }'`,
      nodejs: `import axios from "axios";

const response = await axios.post(
  "https://api.wahide.com/api/v1/otp/send",
  {
    phone: "628123456789",
    template: "Kode verifikasi akun Anda adalah *{{otp}}*. Berlaku 5 menit.",
    device_id: "auto",
    expires_in: 300,
    priority: true,
  },
  {
    headers: {
      "Authorization": "Bearer hide_YOUR_API_KEY",
      "Content-Type": "application/json",
    },
  }
);

console.log(response.data);`,
      php: `<?php

$curl = curl_init();

$payload = [
    "phone" => "628123456789",
    "template" => "Kode verifikasi akun Anda adalah *{{otp}}*. Berlaku 5 menit.",
    "device_id" => "auto",
    "expires_in" => 300,
    "priority" => true,
];

curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.wahide.com/api/v1/otp/send",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer hide_YOUR_API_KEY",
        "Content-Type: application/json",
    ],
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      python: `import requests

url = "https://api.wahide.com/api/v1/otp/send"
headers = {
    "Authorization": "Bearer hide_YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "phone": "628123456789",
    "template": "Kode verifikasi akun Anda adalah *{{otp}}*. Berlaku 5 menit.",
    "device_id": "auto",
    "expires_in": 300,
    "priority": True,
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
      go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func main() {
	payload, _ := json.Marshal(map[string]any{
		"phone":      "628123456789",
		"template":   "Kode verifikasi akun Anda adalah *{{otp}}*. Berlaku 5 menit.",
		"device_id":  "auto",
		"expires_in": 300,
		"priority":   true,
	})

	req, _ := http.NewRequest("POST", "https://api.wahide.com/api/v1/otp/send", bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer hide_YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "OTP generated, stored in Redis cache, and queued for instant WhatsApp delivery.",
        json: `{
  "code": 200,
  "status": "success",
  "message": "OTP sent successfully",
  "data": {
    "phone": "628123456789",
    "expires_in": 300,
    "cooldown": 60
  }
}`,
        attributes: [
          {
            name: "data.phone",
            type: "string",
            description: "Target normalized phone number in E.164 format.",
          },
          {
            name: "data.expires_in",
            type: "integer",
            description: "Remaining validity period in seconds (default: 300s).",
          },
          {
            name: "data.cooldown",
            type: "integer",
            description: "Minimum interval in seconds before the next OTP request is allowed (60s).",
          },
        ],
      },
      {
        status: 429,
        statusText: "Too Many Requests",
        description: "Request rejected due to active cooldown timer or daily limit.",
        json: `{
  "code": 429,
  "status": "error",
  "error": "ERR_OTP_COOLDOWN",
  "message": "Please wait 60s before requesting another OTP for this phone number"
}`,
      },
      {
        status: 503,
        statusText: "Service Unavailable",
        description: "No WhatsApp device is connected and healthy.",
        json: `{
  "code": 503,
  "status": "error",
  "error": "ERR_NO_CONNECTED_DEVICE",
  "message": "No connected WhatsApp device available to send OTP"
}`,
      },
    ],
    errorMatrix: [
      {
        code: 429,
        error: "ERR_OTP_COOLDOWN",
        description: "Permintaan OTP baru diajukan sebelum jeda 60 detik berakhir.",
        solution: "Tampilkan hitung mundur 60 detik pada antarmuka tombol 'Kirim Ulang OTP' aplikasi Anda.",
      },
      {
        code: 429,
        error: "ERR_OTP_DAILY_LIMIT",
        description: "Batas kuota harian (10x OTP/hari) untuk nomor tujuan ini telah tercapai.",
        solution: "Arahkan pengguna untuk menunggu pergantian hari UTC atau gunakan metode verifikasi alternatif.",
      },
      {
        code: 503,
        error: "ERR_NO_CONNECTED_DEVICE",
        description: "Tenant tidak memiliki perangkat WhatsApp berstatus 'Connected'.",
        solution: "Sambungkan minimal satu perangkat WhatsApp via scan QR di dashboard Wahide.",
      },
      {
        code: 402,
        error: "ERR_QUOTA_EXCEEDED",
        description: "Kuota saldo atau batas kuota pesan langganan tenant telah habis.",
        solution: "Lakukan pengisian saldo deposit atau upgrade tier paket langganan Anda.",
      },
    ],
  },
  {
    type: "endpoint",
    id: "otp-verify",
    slug: "otp/verify",
    title: "Verify WhatsApp OTP Code",
    description:
      "Atomically validates the one-time password submitted by your user against the Redis in-memory cache. Features automatic single-use burn (preventing replay attacks), 5-attempt brute-force protection, and constant-time cryptographic comparison.",
    category: "OTP & Verification",
    categorySlug: "otp",
    method: "POST",
    path: "/api/v1/otp/verify",
    badge: "Atomic & Secure",
    bannerNotice: {
      type: "info",
      title: "Single-Use Auto-Burn & Brute-Force Lockout",
      content:
        "Once verified successfully, the OTP is instantly burned from Redis to eliminate replay attacks. If an incorrect code is entered 5 times, the OTP is permanently invalidated to prevent brute-force attacks.",
    },
    headers: [
      {
        key: "Authorization",
        value: "Bearer hide_<your_api_key>",
        required: true,
        description: "Your secret Wahide API Key prefixed with Bearer.",
      },
      {
        key: "Content-Type",
        value: "application/json",
        required: true,
        description: "Must be set to application/json.",
      },
    ],
    parameters: [
      {
        name: "phone",
        type: "string",
        required: true,
        description:
          "Target recipient phone number in international E.164 format without spaces, dashes, or leading plus. Example: 628123456789.",
        example: "628123456789",
      },
      {
        name: "otp",
        type: "string",
        required: true,
        description: "The 4-8 digit OTP code entered by the user to verify.",
        example: "884920",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/otp/verify" \\
  -H "Authorization: Bearer hide_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "otp": "884920"
  }'`,
      nodejs: `import axios from "axios";

const response = await axios.post(
  "https://api.wahide.com/api/v1/otp/verify",
  {
    phone: "628123456789",
    otp: "884920",
  },
  {
    headers: {
      "Authorization": "Bearer hide_YOUR_API_KEY",
      "Content-Type": "application/json",
    },
  }
);

console.log(response.data);`,
      php: `<?php

$curl = curl_init();

$payload = [
    "phone" => "628123456789",
    "otp" => "884920",
];

curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.wahide.com/api/v1/otp/verify",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer hide_YOUR_API_KEY",
        "Content-Type: application/json",
    ],
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      python: `import requests

url = "https://api.wahide.com/api/v1/otp/verify"
headers = {
    "Authorization": "Bearer hide_YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "phone": "628123456789",
    "otp": "884920",
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
      go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func main() {
	payload, _ := json.Marshal(map[string]any{
		"phone": "628123456789",
		"otp":   "884920",
	})

	req, _ := http.NewRequest("POST", "https://api.wahide.com/api/v1/otp/verify", bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer hide_YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "OTP code successfully validated and automatically burned from cache.",
        json: `{
  "code": 200,
  "status": "success",
  "message": "OTP verified successfully",
  "data": {
    "phone": "628123456789",
    "verified": true
  }
}`,
        attributes: [
          {
            name: "data.phone",
            type: "string",
            description: "Target normalized phone number.",
          },
          {
            name: "data.verified",
            type: "boolean",
            description: "Confirmation boolean indicating successful verification.",
          },
        ],
      },
      {
        status: 400,
        statusText: "Bad Request",
        description: "Invalid OTP code provided or code has expired.",
        json: `{
  "code": 400,
  "status": "error",
  "error": "ERR_OTP_INVALID",
  "message": "Invalid OTP code provided"
}`,
      },
      {
        status: 429,
        statusText: "Too Many Requests",
        description: "Maximum verification attempts (5/5) exceeded. OTP has been invalidated.",
        json: `{
  "code": 429,
  "status": "error",
  "error": "ERR_OTP_MAX_ATTEMPTS",
  "message": "Maximum verification attempts exceeded (5/5). OTP has been invalidated."
}`,
      },
    ],
    errorMatrix: [
      {
        code: 400,
        error: "ERR_OTP_INVALID",
        description: "Kode OTP yang dimasukkan tidak cocok dengan nilai yang tersimpan.",
        solution: "Minta pengguna memeriksa kembali pesan WhatsApp dan memasukkan kode yang benar.",
      },
      {
        code: 400,
        error: "ERR_OTP_NOT_FOUND",
        description: "Kode OTP telah kedaluwarsa (lebih dari 5 menit) atau belum pernah diminta.",
        solution: "Arahkan pengguna untuk menekan tombol 'Kirim Ulang OTP' untuk mendapatkan kode baru.",
      },
      {
        code: 429,
        error: "ERR_OTP_MAX_ATTEMPTS",
        description: "Percobaan verifikasi salah telah mencapai batas 5 kali.",
        solution: "Kode OTP otomatis dihapus demi keamanan anti brute-force. Pengguna harus meminta kode OTP baru.",
      },
    ],
  },
];
