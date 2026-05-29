<?php
/**
 * Contact Form Backend
 * - Server-side validation
 * - Rate limiting (3 submissions per hour via session)
 * - CSRF token validation
 * - Email sending via mail()
 */

session_start();
header('Content-Type: application/json; charset=utf-8');

// CORS headers for same-origin
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metodo no permitido.']);
    exit;
}

// Handle CSRF token setting
if (isset($_POST['action']) && $_POST['action'] === 'set_csrf') {
    $token = $_POST['csrf_token'] ?? '';
    if (preg_match('/^[a-f0-9]{64}$/', $token)) {
        $_SESSION['csrf_token'] = $token;
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Token invalido.']);
    }
    exit;
}

// Rate limiting: max 3 submissions per hour
if (!isset($_SESSION['contact_timestamps'])) {
    $_SESSION['contact_timestamps'] = [];
}

$now = time();
$_SESSION['contact_timestamps'] = array_filter(
    $_SESSION['contact_timestamps'],
    function ($ts) use ($now) { return ($now - $ts) < 3600; }
);

if (count($_SESSION['contact_timestamps']) >= 3) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Has enviado demasiados mensajes. Intenta de nuevo en una hora o escribeme por WhatsApp.'
    ]);
    exit;
}

// CSRF validation
$csrf = $_POST['csrf_token'] ?? '';
$sessionCsrf = $_SESSION['csrf_token'] ?? '';

if (empty($csrf) || empty($sessionCsrf) || !hash_equals($sessionCsrf, $csrf)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Token de seguridad invalido. Recarga la pagina e intenta de nuevo.']);
    exit;
}

// Sanitize and validate input
$name = trim(htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8'));
$email = trim(filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL));
$whatsapp = trim(preg_replace('/[^\d\+\s\-\(\)]/', '', $_POST['whatsapp'] ?? ''));
$projectType = trim(htmlspecialchars($_POST['project_type'] ?? '', ENT_QUOTES, 'UTF-8'));
$budget = trim(htmlspecialchars($_POST['budget'] ?? '', ENT_QUOTES, 'UTF-8'));
$message = trim(htmlspecialchars($_POST['message'] ?? '', ENT_QUOTES, 'UTF-8'));

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2 || strlen($name) > 100) {
    $errors[] = 'Nombre invalido.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email invalido.';
}

$validProjects = ['sitio-web', 'ecommerce', 'app-movil', 'software', 'ciberseguridad', 'otro'];
if (empty($projectType) || !in_array($projectType, $validProjects)) {
    $errors[] = 'Tipo de proyecto invalido.';
}

if (empty($message) || strlen($message) < 10 || strlen($message) > 2000) {
    $errors[] = 'El mensaje debe tener entre 10 y 2000 caracteres.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// Build email
$to = 'neracosu@gmail.com';
$subject = "Nuevo contacto web: {$name} - {$projectType}";

$body = "=== NUEVO CONTACTO DESDE NERACOSU.COM ===\n\n";
$body .= "Nombre: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "WhatsApp: " . ($whatsapp ?: 'No proporcionado') . "\n";
$body .= "Tipo de Proyecto: {$projectType}\n";
$body .= "Presupuesto: " . ($budget ?: 'No especificado') . "\n\n";
$body .= "Mensaje:\n{$message}\n\n";
$body .= "---\n";
$body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'N/A') . "\n";
$body .= "Fecha: " . date('Y-m-d H:i:s') . "\n";
$body .= "User-Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'N/A') . "\n";

$headers = "From: noreply@neracosu.com\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
    // Record timestamp for rate limiting
    $_SESSION['contact_timestamps'][] = $now;
    // Invalidate CSRF token
    unset($_SESSION['csrf_token']);

    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado correctamente. Te contactare pronto!'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al enviar el mensaje. Intenta por WhatsApp: +584222707095'
    ]);
}
