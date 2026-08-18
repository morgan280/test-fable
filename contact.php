<?php
// Quote-request handler — emails submissions to the RMS inbox.
// Lives on the Hostinger deployment; static mirrors (GitHub Pages, previews)
// have no PHP, so the front-end falls back to a mailto: draft there.

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'method']);
  exit;
}

function field(string $key, int $max): string {
  $v = trim((string)($_POST[$key] ?? ''));
  $v = preg_replace('/[\r\n]+/', ' ', $v);   // header-injection guard
  return mb_substr($v, 0, $max);
}

$name    = field('name', 120);
$company = field('company', 160);
$email   = field('email', 200);
$phone   = field('phone', 60);
$details = trim(mb_substr((string)($_POST['details'] ?? ''), 0, 6000));
$trap    = trim((string)($_POST['website'] ?? ''));   // honeypot — humans never see this field

if ($trap !== '') {           // bot filled the hidden field: swallow silently
  echo json_encode(['ok' => true]);
  exit;
}

if ($name === '' || $details === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'validation']);
  exit;
}

$to      = 'M.Fetter@ReticleMS.com';
$subject = 'Quote request — ' . $name . ($company !== '' ? ' · ' . $company : '');
$subject = mb_encode_mimeheader($subject, 'UTF-8', 'B');

$body = "Name: {$name}\n"
      . 'Company: ' . ($company !== '' ? $company : '—') . "\n"
      . "Email: {$email}\n"
      . 'Phone: ' . ($phone !== '' ? $phone : '—') . "\n\n"
      . "Project details:\n{$details}\n\n"
      . "—\nSent from the reticlems.com quote form\n"
      . 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

$headers = implode("\r\n", [
  'From: RMS Website <no-reply@reticlems.com>',
  "Reply-To: {$name} <{$email}>",
  'Content-Type: text/plain; charset=utf-8',
  'X-Mailer: reticlems-quote-form',
]);

$sent = @mail($to, $subject, $body, $headers, '-f no-reply@reticlems.com');
if (!$sent) {
  $sent = @mail($to, $subject, $body, $headers);   // retry without envelope override
}

http_response_code($sent ? 200 : 500);
echo json_encode(['ok' => (bool)$sent]);
